<template>
  <div class="data-search-form">
    <div class="search-form-box">
      <div class="search-form-content">
        <component
          v-for="(item, index) in config.editorList"
          :key="index"
          v-bind:is="item.component"
          :label="item.label"
          :value="item.value"
          :item="item"
          :options="item.options"
          @search="onSearchForm"
          class="search-form-field"
        ></component>
      </div>
      <slot name="btn_area">
        <div class="search-form-btn-area"></div>
      </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['config'])

console.log(props)
const onSearchForm = () => {}
</script>

<style></style>
