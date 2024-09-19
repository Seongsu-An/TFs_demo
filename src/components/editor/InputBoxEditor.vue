<template>
  <div v-if="item.visible" :class="`col-${item.cols}`" style="display: flex; align-items: center">
    <div class="editor_content">
      <label
        v-if="label !== undefined"
        :for="item.valueKey"
        class="editor_label"
        :class="item.required ? 'edit_required' : ''"
      >
        {{ label }}
      </label>
      <InputGroup>
        <InputText
          :id="item.valueKey"
          v-model="inputValue"
          @input="changeValue"
          :style="`width: ${typeof item.width == 'string' ? item.width : `${item.width}px`}`"
        ></InputText>
        <Button
          v-if="item.btnOption && item.btnOption.visible != false"
          :disabled="item.btnOption.disable"
          :label="g.$nvl(item?.btnOption?.label, 'Search')"
          @click="onClickInputBtn"
        />
      </InputGroup>
      <small v-if="item?.description" :id="`${item.valueKey}-help`">{{ item.description }}</small>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useGlobal } from '@/lib/Global'
const g = useGlobal()

const props = defineProps(['label', 'value', 'item', 'isMulti'])

const inputValue = ref(props.value)

const changeValue = (e) => {
  inputValue.value = e.target.value
}

const onClickInputBtn = async () => {
  if (props?.item?.btnOption?.onClickBtn) {
    await props.item.btnOption.onClickBtn(props.item)
  }
}

const propValue = computed(() => inputValue.value)

watch(propValue, (newValue, oldValue) => {
  props.item.value = newValue
  props.item.oldValue = oldValue
})
</script>

<style></style>
