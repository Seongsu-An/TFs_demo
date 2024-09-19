<template>
  <input
    ref="cellInput"
    type="text"
    v-model="inputValue"
    @input="changeValue"
    @blur="onBlurInput"
    @keydown.enter="onSaveValue(false)"
    @keydown.esc="onKeyDownEsc"
  />
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps([
  'rowIndex',
  'column',
  'model',
  'save',
  'close',
  'colIndex',
  'colType',
  'type',
  'data',
  'value',
  'prop'
])
const cellInput = ref()

const inputValue = ref(props.model[props.prop])

onMounted(() => {
  nextTick(() => {
    if (cellInput?.value) {
      cellInput.value.focus()
    }
  })
})

const changeValue = (e) => {
  inputValue.value = e.target.value
}

const onSaveValue = (prevent) => {
  props.save(inputValue.value, prevent)
}

const onKeyDownEsc = (e) => {
  props.close()
}

const onBlurInput = (e) => {
  if (e?.relatedTarget?.className == 'rgCell') {
    onSaveValue(true)
  }
}

onClickOutside(cellInput, (e) => {
  onSaveValue(false)
})
</script>
