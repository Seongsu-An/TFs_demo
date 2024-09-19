<template>
  <Teleport to="#modal-destination">
    <div v-if="isOpen" class="modal-mask" ref="modalRef">
      <div class="modal-container">
        <div class="modal-header">
          <h1>{{ title }}</h1>
          <span @click="closeModal"><h1>&times;</h1></span>
        </div>
        <div class="modal-body">
          <div class="modal-content">
            <div class="modal_top_area" v-html="topInnerHTML"></div>
            <div class="modal_message_area">
              <span v-html="message"></span>
            </div>
            <div class="modal_bottom_area" v-html="bottomInnerHTML"></div>
            <div class="modal_btn_area">
              <button @click="onClickConfirmBtn">{{ confirmLabel }}</button>
              <button v-if="type == 'confirm'" @click="closeModal">{{ cancelLabel }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount, onMounted } from 'vue'

const modalRef = ref()
const type = ref()
const callback = ref()
const instance = ref()
const onPromiseHandler = ref()

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const topInnerHTML = ref()
const bottomInnerHTML = ref()
const confirmLabel = ref()
const cancelLabel = ref()

document.body.onkeyup = (e) => {
  if (isOpen.value && e.keyCode == 13 && type.value == 'alert') {
    closeModal()
  }
}

const closeModal = () => {
  isOpen.value = false
  onPromiseHandler.value(type.value == 'alert')
}

const onClickConfirmBtn = () => {
  isOpen.value = false
  onPromiseHandler.value(true)
}

const computedOpen = computed(() => {
  return isOpen.value
})

watch(computedOpen, async (val) => {
  if (!val) {
    document.body.onkeyup = undefined
    if (callback.value !== undefined) {
      await callback()
    }
  } else {
    document.activeElement?.blur()
  }
})

defineExpose({
  modalRef,
  type,
  isOpen,
  title,
  message,
  callback,
  topInnerHTML,
  bottomInnerHTML,
  confirmLabel,
  cancelLabel,
  instance,
  onPromiseHandler
})
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  width: 300px;
  margin: 150px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.modal-header {
  display: flex;
  justify-content: space-between;
}
</style>
