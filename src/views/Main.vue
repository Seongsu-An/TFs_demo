<template>
  <div class="main" :style="`width: ${innerWidth}px; height: ${innerHeight}px;`">
    <data-grid
      :gridConfig="gridConfig"
      :columnDefs="columnDefs"
      :autoCount="true"
      :useSelection="true"
      :width="1200"
      :height="500"
      @gridReady="onGridReady"
    ></data-grid>

    <div style="display: flex">
      <button @click="onClickBtn0">{{ buttonName0 }}</button>
      <button @click="onClickBtn">{{ buttonName1 }}</button>
      <button @click="onClickSelection">{{ buttonName2 }}</button>
      <button @click="onClickExport">{{ buttonName3 }}</button>
      <button @click="onClickLink">{{ buttonName4 }}</button>
    </div>

    {{ data }}
  </div>
</template>

<script setup>
import { DataGridConfig } from '@/models/grid/DataGridConfig'
import { ColumnConfig } from '@/models/grid/ColumnConfig'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobal } from '@/lib/Global'
import { useModal } from '@/lib/Modal'
import CellCheckBoxTemplate from '@/components/grid/template/CellCheckBoxTemplate.vue'
import _ from 'lodash'

const g = useGlobal()
const m = useModal()

const { innerWidth, innerHeight } = window

const router = useRouter()
const route = useRoute()

const gridConfig = new DataGridConfig()

const columnDefs = [
  new ColumnConfig({
    name: '가',
    prop: 'a',
    children: [
      new ColumnConfig({
        name: '갸',
        prop: 'a1',
        children: [
          new ColumnConfig({ name: '갹', prop: 'a11', size: 100 }),
          new ColumnConfig({ name: '갼', prop: 'a12', size: 100 })
        ],
        size: 100
      }),
      new ColumnConfig({
        name: '거',
        prop: 'a2',
        children: [
          new ColumnConfig({ name: '걱', prop: 'a21', size: 100 }),
          new ColumnConfig({ name: '건', prop: 'a22', size: 100 })
        ],
        size: 100
      }),
      new ColumnConfig({
        name: '겨',
        prop: 'a3',
        children: [
          new ColumnConfig({ name: '격', prop: 'a31', size: 100 }),
          new ColumnConfig({ name: '견', prop: 'a32', size: 100 })
        ],
        size: 100
      })
    ],
    size: 100
  }),
  new ColumnConfig({
    name: '나',
    prop: 'b',
    size: 100,
    cellTemplate: CellCheckBoxTemplate,
    cellRendererParams: {
      valueFormatter: (param) => {
        return param.value == 'Y'
      },
      onValueChanged: (param, value) => {
        param.model[param.prop] = value ? 'Y' : 'N'
      }
    },
    readonly: true
  }),
  new ColumnConfig({ name: '다', prop: 'c', size: 100 }),
  new ColumnConfig({ name: '라', prop: 'd', size: 100 }),
  new ColumnConfig({ name: '마', prop: 'e', size: 100 }),
  new ColumnConfig({ name: '바', prop: 'f', size: 100 }),
  new ColumnConfig({ name: '사', prop: 'g', size: 100 })
  // new ColumnConfig({ name: '아', prop: 'h', size: 100 }),
  // new ColumnConfig({ name: '자', prop: 'i', size: 100 }),
  // new ColumnConfig({ name: '차', prop: 'g', size: 100 }),
  // new ColumnConfig({ name: '카', prop: 'k', size: 100 }),
  // new ColumnConfig({ name: '타', prop: 'l', size: 100 }),
  // new ColumnConfig({ name: '파', prop: 'm', size: 100 }),
  // new ColumnConfig({ name: '하', prop: 'n', size: 100 })
]

const data = ref([])

const gridData = [
  {
    a: '1',
    a11: 'a',
    a12: '2',
    a21: '4',
    a22: '2',
    a31: '3',
    a32: 'a',
    b: 'N',
    c: '4',
    d: '2',
    e: '3',
    f: '가3',
    g: '27'
  },
  {
    a: '2',
    a11: 'b',
    a12: '4',
    a21: '4',
    a22: '4',
    a31: '9',
    a32: 'asadsa',
    b: 'Y',
    c: '4',
    d: '22',
    e: '3',
    f: '가21',
    g: '22327'
  },
  {
    a: '3',
    a11: 'c',
    a12: '6',
    a21: '4',
    a22: '가',
    a31: '27',
    a32: 'asadds',
    b: 'Y',
    c: '4',
    d: '21',
    e: '3',
    f: '가3',
    g: '27'
  },
  {
    a: '4',
    a11: 'd',
    a12: '8',
    a21: 'a3',
    a22: '8',
    a31: '81',
    a32: 'a112',
    b: 'Y',
    c: '4',
    d: '22312',
    e: '3',
    f: '가21',
    g: '27'
  },
  {
    a: '5',
    a11: 'e',
    a12: '10',
    a21: '4',
    a22: '10',
    a31: '243',
    a32: 'asd',
    b: 'N',
    c: '4',
    d: '2',
    e: '323',
    f: '가3',
    g: '2232317'
  }
]

const onGridReady = (e) => {
  gridConfig.setData(gridData)
  // gridConfig.setData(Array.from({ length: 1000 }, (v, i) => _.cloneDeep(gridData)).flat())
}

const onClickBtn0 = async (e) => {
  const alert = await m.$alert('텍스트')
  console.log(alert)
  const confirm = await m.$confirm('1')
  console.log(confirm)
}

const onClickBtn = async (e) => {
  data.value = gridConfig.getData()
}

const onClickExport = async (e) => {
  await gridConfig.exportData()
}

const onClickSelection = async (e) => {
  console.log(await gridConfig.getSelectedRows())
}

const buttonName0 = 'Show Modal'
const buttonName1 = 'Show GridData'
const buttonName2 = 'Console SelectedRows'
const buttonName3 = 'Export File'
const buttonName4 = 'Editor'

const onClickLink = () => {
  router.push({ name: 'editors' })
}
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
