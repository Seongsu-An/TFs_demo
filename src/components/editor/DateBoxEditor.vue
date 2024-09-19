<template>
  <div v-if="item.visible" :class="`col-${item.cols}`">
    <div class="editor_content">
      <label
        v-if="label !== undefined"
        :for="item.valueKey"
        class="editor_label"
        :class="item.required ? 'edit_required' : ''"
      >
        {{ label }}
      </label>
      <div style="display: flex">
        <div class="dateBox start">
          <DatePicker
            :id="item.valueKey"
            v-model="startDateValue"
            dateFormat="yy-mm-dd"
            :showOnFocus="false"
            showIcon
            fluid
          />
          <!-- @blur="changeValue('startDate')" -->
          <DatePicker
            v-if="item.useTime"
            v-model="startTimeValue"
            hourFormat="24"
            timeOnly
            showIcon
            showSeconds
            :showOnFocus="false"
          >
            <template #inputicon="slotProps">
              <i class="pi pi-clock" @click="slotProps.clickCallback"></i>
            </template>
          </DatePicker>
          <!-- @blur="changeValue('startTime')" -->
        </div>
        <div v-if="!item.useSingleMode" class="dateBox end">
          <DatePicker v-model="endDateValue" dateFormat="yy-mm-dd" :showOnFocus="false" showIcon fluid />
          <!-- @blur="changeValue('endDate')" -->
          <DatePicker
            v-if="item.useTime"
            v-model="endTimeValue"
            hourFormat="24"
            timeOnly
            showIcon
            showSeconds
            :showOnFocus="false"
          >
            <template #inputicon="slotProps">
              <i class="pi pi-clock" @click="slotProps.clickCallback"></i>
            </template>
          </DatePicker>
          <!-- @blur="changeValue('endTime')" -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDateFormat, useNow } from '@vueuse/core'
import { useGlobal } from '@/lib/Global'
const g = useGlobal()
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps(['label', 'item', 'isMulti'])

const startDateValue = ref(props.item.startDate)
const startTimeValue = ref(props.item.startTime)
const endDateValue = ref(props.item.endDate)
const endTimeValue = ref(props.item.endTime)

const defaultFormat = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  full: 'YYYY-MM-DD HH:mm:ss'
}

const convertDate = (date, option = defaultFormat.date) => {
  console.log(useDateFormat(date, option))
  return useDateFormat(date, option).value
}
const startTimeRef = ref()

// const changeValue = (type, e) => {
//   if (type == 'startDate') {
//     startDateValue.value = e.target.value
//     return
//   }
//   if (type == 'endDate') {
//     endDateValue.value = e.target.value
//     return
//   }
//   if (type == 'startTime') {
//     startTimeValue.value = e.target.value
//     return
//   }
//   if (type == 'endTime') {
//     endTimeValue.value = e.target.value
//     return
//   }
// }

// const onBlurInput = () => {}

watch([startDateValue, endDateValue, startTimeValue, endTimeValue], ([startDate, endDate, startTime, endTime]) => {
  const getStartDate = startDate ? convertDate(startDate, defaultFormat.date) : startDate
  const getEndDate = endDate ? convertDate(endDate, defaultFormat.date) : endDate
  console.log(startTime)
  const getStartTime = startTime ? convertDate(startTime, defaultFormat.time) : startTime
  console.log(endTime)
  const getEndTime = endTime ? convertDate(endTime, defaultFormat.time) : endTime
  props.item.startDate = getStartDate
  props.item.startTime = getStartTime
  props.item.endDate = getEndDate
  props.item.endTime = getEndTime
  props.item.value = {
    startDate: getStartDate,
    endDate: getEndDate,
    startTime: getStartTime,
    endTime: getEndTime
  }

  console.log(props.item.value)
})
</script>

<style scoped>
/* .dateBox.start + .dateBox.end::before {
  content: ' ~ ';
  display: inline-flex;
  padding: 0 2px;
} */

.p-datepicker {
  width: 150px;
}
</style>
