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
      <Select
        :inputId="item.valueKey"
        v-model="selectValue"
        :options="item.options"
        :optionLabel="item.optionLabelKey"
        :placeholder="item.placeholder"
        :style="`width: ${typeof item.width == 'string' ? item.width : `${item.width}px`}`"
      ></Select>
      <!-- <small :id="`${label}-help`">{{ item.description }}11</small> -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps(['label', 'value', 'item', 'isMulti'])

const selectValue = ref(props.value)

const propValue = computed(() => selectValue.value)

watch(propValue, (newValue, oldValue) => {
  props.item.value = newValue
  props.item.oldValue = oldValue
})
</script>

<style></style>
