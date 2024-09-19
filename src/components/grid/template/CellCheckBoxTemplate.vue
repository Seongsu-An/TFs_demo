<template>
  <input
    ref="cellCheck"
    type="checkbox"
    v-model="checkValue"
    :checked="checkValue"
    :disabled="cellDisable"
    @change="changeValue"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps(['rowIndex', 'column', 'model', 'colIndex', 'colType', 'type', 'data', 'value', 'prop'])

const cellCheck = ref()
const cellDisable = ref()
const checkValue = ref(props.model[props.prop])

if (props?.column?.cellRendererParams?.valueFormatter) {
  checkValue.value = props.column.cellRendererParams.valueFormatter(props)
}
if (props?.column?.cellRendererParams?.disable) {
  if (typeof props?.column?.cellRendererParams?.disable === 'function') {
    cellDisable.value = props.column.cellRendererParams.disable(props)
  } else {
    cellDisable.value = props.column.cellRendererParams.disable
  }
}

const changeValue = (e) => {
  if (props?.column?.cellRendererParams?.onValueChanged) {
    props.column.cellRendererParams.onValueChanged(props, e.target.checked)
  } else {
    props.model[props.prop] = e.target.checked
  }
}

const getChangeData = computed(() => {
  return props.data[props.rowIndex][props.prop]
})

watch(getChangeData, (val) => {
  if (props?.column?.cellRendererParams?.valueFormatter) {
    checkValue.value = props.column.cellRendererParams.valueFormatter({ ...props, value: val })
    return
  }
  if (typeof val === 'boolean') {
    checkValue.value = val
    return
  }
})
</script>
