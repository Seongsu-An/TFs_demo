import { createApp, inject } from 'vue'
import ModalComponent from '@/components/modal/Modal.vue'

const injectionKey = Symbol('ModalInjection')

export const modal = {
  install(app) {
    const modalValue = {
      $alert: async (msg, option = { title: 'Modal' }) => {
        const instance = createApp(ModalComponent).mount(document.createElement('div'))

        return new Promise((res, rej) => {
          instance.isOpen = true
          instance.title = option?.title ? option.title : 'Modal'
          instance.type = 'alert'
          instance.message = msg
          instance.callback = option.callback
          instance.topInnerHTML = option.topInnerHTML
          instance.bottomInnerHTML = option.bottomInnerHTML
          instance.instance = instance
          instance.onPromiseHandler = res
          instance.confirmLabel = option.confirmLabel === undefined ? '확인' : option.confirmLabel
        })
      },
      $confirm: (msg, option = { title: 'Modal' }) => {
        const instance = createApp(ModalComponent).mount(document.createElement('div'))

        return new Promise((res, rej) => {
          instance.isOpen = true
          instance.title = option?.title ? option.title : 'Modal'
          instance.type = 'confirm'
          instance.message = msg
          instance.callback = option.callback
          instance.topInnerHTML = option.topInnerHTML
          instance.bottomInnerHTML = option.bottomInnerHTML
          instance.instance = instance
          instance.onPromiseHandler = res
          instance.confirmLabel = option.confirmLabel === undefined ? '예' : option.confirmLabel
          instance.cancelLabel = option.cancelLabel === undefined ? '아니오' : option.cancelLabel
        })
      }
    }

    app.provide(injectionKey, modalValue)
  }
}

export const useModal = () => {
  return inject(injectionKey)
}
