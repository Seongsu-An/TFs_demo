<template>
  <VGrid
    :columns="columns"
    :source="rows"
    :resize="true"
    :range="true"
    :autoSizeColumn="false"
    :canMoveColumns="false"
    :exporting="true"
    @aftergridinit="onAfterGridInit"
    ref="dataGrid"
    :style="`width: ${width ? width : 400}px; height: ${height ? height : 300}px`"
  />
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { VGrid, VGridVueEditor, VGridVueTemplate, VGridVueTemplateConstructor } from '@revolist/vue3-datagrid'
import { ColumnConfig } from '@/models/grid/ColumnConfig'
import CellCheckBoxTemplate from '@/components/grid/template/CellCheckBoxTemplate.vue'
import _ from 'lodash'
import ExcelJS from 'exceljs'

const props = defineProps(['gridConfig', 'columnDefs', 'width', 'height', 'autoCount', 'useSelection'])
const emit = defineEmits(['gridReady'])

if (props.autoCount) {
  if (!_.some(props.columnDefs, (col) => col.prop == 'rowIndex')) {
    props.columnDefs.unshift(new ColumnConfig({ name: 'No', prop: 'rowIndex', size: 50, readonly: true }))
  }
}
if (props.useSelection) {
  if (!_.some(props.columnDefs, (col) => col.prop == 'rowSelected')) {
    props.columnDefs.unshift(
      new ColumnConfig({
        name: '',
        prop: 'rowSelected',
        cellTemplate: CellCheckBoxTemplate,
        columnTemplate: (createElement) => {
          return createElement('input', { type: 'checkbox', class: 'grid-all-checkbox' })
        },
        readonly: true,
        size: 50,
        sortable: false
      })
    )
  }
}

const dataGrid = ref({})
const columns = ref(props.columnDefs)
const rows = ref([])

const setData = (data) => {
  if (!Array.isArray(data)) {
    rows.value = []
    return
  }

  rows.value = _.map(data, (item, i) => {
    item.rowIndex = i + 1
    item.rowSelected = false
    return item
  })
}

const getData = () => rows.value

const getSelectedRows = async () => await _.filter(rows.value, (row) => row.rowSelected)

const onClickAllCheck = async (e) => {
  rows.value.forEach((row) => {
    row.rowSelected = e.target.checked
  })
}

const setColumnDesign = async () => {
  const gridRef = document.querySelector('revo-grid')
  const columnPlugin = (await gridRef.getPlugins())[0].providers.column

  const groupColumns = columnPlugin.collection.columnGrouping.rgCol
  const groupedIds = _.uniq(groupColumns.map((col) => col.ids).flat())
  const baseColumns = (await gridRef.getColumns()).map((col, index) => {
    col.columnIndex = index
    return col
  })
  const [groupedColumns, singleColumns] = _.partition(baseColumns, (col) => groupedIds.includes(col.prop))

  if (groupColumns.length == 0) return

  const exportPlugin = _.filter(await gridRef.getPlugins(), (list) => list.exportFile)[0]
  const getHeaders = (await exportPlugin.getColPerSource()).headers
  const columnGroupDepth = getHeaders.length

  setTimeout(() => {
    const baseElList = gridRef.querySelectorAll('.header-rgRow>.rgHeaderCell')
    const groupedCol = _.map(groupedColumns, (col) => {
      col.level = _.maxBy(groupColumns, (group) => {
        if (group.ids.includes(col.prop)) return group.level
        else return -1
      }).level
      return col
    })

    groupedCol.forEach((col) => {
      baseElList[col.columnIndex].style.height = `${(2 - col.level) * 30}px`
      baseElList[col.columnIndex].style.top = `-${(1 - col.level) * 30}px`
      baseElList[col.columnIndex].style.alignItems = 'center'
      baseElList[col.columnIndex].style.backgroundColor = '#e9e9e9'
    })

    singleColumns.forEach((col) => {
      baseElList[col.columnIndex].style.height = `${columnGroupDepth * 30}px`
      baseElList[col.columnIndex].style.top = `-${(columnGroupDepth - 1) * 30}px`
      baseElList[col.columnIndex].style.alignItems = 'center'
      baseElList[col.columnIndex].style.backgroundColor = '#e9e9e9'
    })

    const allCheckRef = gridRef.querySelector('.grid-all-checkbox')
    allCheckRef.addEventListener('change', onClickAllCheck)
  }, 50)
}

const getColumnCode = (index) => {
  return index / 26 <= 1
    ? String.fromCharCode(64 + index)
    : `${String.fromCharCode(64 + index / 26)}${String.fromCharCode(64 + (index % 26))}`
}

const exportData = async (option = { sheetName: 'sheet1', fileName: 'dataGrid_to_excel.xlsx' }) => {
  const gridRef = document.querySelector('revo-grid')
  const columnPlugin = (await gridRef.getPlugins())[0].providers.column

  const groupColumns = columnPlugin.collection.columnGrouping.rgCol
  const groupedIds = _.uniq(groupColumns.map((col) => col.ids).flat())
  const columns = await gridRef.getColumns()
  const bannedColumnIndex = columns.findIndex((item) => item.prop == 'rowSelected')
  const baseColumns = _.filter(columns, (item) => item.prop != 'rowSelected').map((col, index) => {
    col.columnIndex = index
    return col
  })

  const [groupedColumns, singleColumns] = _.partition(baseColumns, (col) => groupedIds.includes(col.prop))

  const exportPlugin = _.filter(await gridRef.getPlugins(), (list) => list.exportFile)[0]
  const getHeaders = (await exportPlugin.getColPerSource()).headers
  const getDataAsCsvString = await exportPlugin.exportString()

  const columnGroupDepth = getHeaders.length

  const dataToArray = getDataAsCsvString.split('\r\n').map((row) => row.replace(/,/g, '⁂').split('⁂'))
  if (bannedColumnIndex > -1) {
    dataToArray.forEach((arr) => arr.splice(bannedColumnIndex, 1))
    getHeaders.forEach((arr) => arr.splice(bannedColumnIndex, 1))
  }
  dataToArray.splice(0, columnGroupDepth)
  dataToArray.unshift(...getHeaders)

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(option.sheetName)

  dataToArray.forEach((list) => worksheet.addRow(list))

  worksheet.columns.forEach((col) => {
    col.eachCell((cell, rowNum) => {
      cell.style = {}
      if (rowNum < columnGroupDepth + 1) {
        cell.alignment = { horizontal: 'center' }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7EEF8' } }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
          left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
          bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
          right: { style: 'thin', color: { argb: 'FFBFBFBF' } }
        }
      }
    })
  })

  if (columnGroupDepth > 1) {
    const groupedCol = _.map(groupedColumns, (col) => {
      col.level = _.maxBy(groupColumns, (group) => {
        if (group.ids.includes(col.prop)) return group.level
        else return -1
      }).level
      return col
    })

    for (const col of singleColumns) {
      const columnCode = getColumnCode(col.columnIndex + 1)
      const getFieldName = worksheet.getCell(`${columnCode}${columnGroupDepth}`).value
      worksheet.mergeCells(`${columnCode}1:${columnCode}${columnGroupDepth}`)
      worksheet.getCell(`${columnCode}1`).value = getFieldName
      worksheet.getCell(`${columnCode}1`).alignment = { vertical: 'middle', horizontal: 'center' }
    }

    for (const col of groupedCol) {
      if (columnGroupDepth == col.level + 2) continue
      const columnCode = getColumnCode(col.columnIndex + 1)
      const getFieldName = worksheet.getCell(`${columnCode}${columnGroupDepth}`).value
      worksheet.mergeCells(`${columnCode}${col.level + 2}:${columnCode}${columnGroupDepth}`)
      worksheet.getCell(`${columnCode}${col.level + 2}`).value = getFieldName
      worksheet.getCell(`${columnCode}${col.level + 2}`).alignment = { vertical: 'middle', horizontal: 'center' }
    }

    for (const col of groupColumns) {
      const childrenColumns = _.filter(groupedColumns, (gCol) => col.ids.includes(gCol.prop))
      const columnCode = getColumnCode(childrenColumns[0].columnIndex + 1)
      worksheet.mergeCells(
        `${columnCode}${col.level + 1}:${getColumnCode(childrenColumns[0].columnIndex + childrenColumns.length)}${col.level + 1}`
      )
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = option.fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

const onAfterGridInit = (e) => {
  props.gridConfig.gridApi = document.querySelector('revo-grid')
  props.gridConfig.setData = setData
  props.gridConfig.getData = getData
  props.gridConfig.exportData = exportData
  props.gridConfig.getSelectedRows = getSelectedRows
  setColumnDesign()

  emit('gridReady', e)
}

onBeforeUnmount(() => {
  const gridRef = document.querySelector('revo-grid')
  const allCheckRef = gridRef.querySelector('.grid-all-checkbox')
  allCheckRef.removeEventListener('change', onClickAllCheck)
})
</script>

<style scoped>
revo-grid:deep(.attribution.hydrated) {
  display: none;
}
revo-grid:deep(revogr-header) {
  background-color: #e9e9e9;
}
</style>
