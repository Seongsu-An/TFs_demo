<template>
  <div class="main" :style="`width: ${innerWidth - 300}px; height: ${innerHeight}px; width: auto;`">
    <data-search-form :config="searchConfig"></data-search-form>
  </div>
</template>

<script setup>
import { DataSearchFormConfig } from '@/models/searchForm/DataSearchFormConfig'
import { DateBox, InputBox, SelectBox } from '@/models/editor/EditorConfig'
import { useGlobal } from '@/lib/Global'
const g = useGlobal()
import { useModal } from '@/lib/Modal'
const m = useModal()

const { innerWidth, innerHeight } = window

const searchConfig = new DataSearchFormConfig([
  new DateBox({ label: 'Date', valueKey: 'Date1', startDate: '', endDate: '', cols: 6 }),
  new DateBox({ label: 'Date+Single+Time', valueKey: 'Date2', useSingleMode: true, useTime: true, cols: 6 }),
  new InputBox({
    label: 'Input',
    valueKey: 'Input',
    value: '1',
    cols: 3
  }),
  new InputBox({
    label: 'Input+Btn',
    valueKey: 'InputBtn',
    value: '',
    cols: 3,
    description: 'Enter your username to reset your password.',
    btnOption: {
      onClickBtn: async (param) => {
        await m.$alert(`value : '${param.value}'`)
      }
    }
  }),
  new SelectBox({
    label: 'Select',
    valueKey: 'Select-123',
    value: { Code: '2', CODENAME: 'B' },
    options: [
      { Code: '1', CODENAME: 'A' },
      { Code: '2', CODENAME: 'B' },
      { Code: '3', CODENAME: 'C' }
    ],
    optionValueKey: 'Code',
    optionLabelKey: 'CODENAME',
    cols: 3
  })
])
</script>

<style></style>
