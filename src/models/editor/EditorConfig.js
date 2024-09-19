import Editor from './Editor.js'
import { defineAsyncComponent, markRaw } from 'vue'

class InputBox extends Editor {
  constructor(obj = {}) {
    if (obj.value === undefined) {
      obj.value = ''
    }

    super(obj)

    this.type = 'InputBoxEditor'

    this.component = markRaw(defineAsyncComponent(() => import('@/components/editor/InputBoxEditor.vue')))

    this.width = obj.width === undefined ? 150 : obj.width

    this.btnOption = obj.btnOption

    if (obj.btnOption !== undefined && obj.btnOption.disable === undefined) {
      this.btnOption.disable = false
    }

    this.placeholder = obj.placeholder

    this.maxLength = obj.maxLength === undefined ? 200 : obj.maxLength

    this.maxByte = obj.maxByte

    this.editMode = obj.type

    this.onBlur = obj.onBlur

    this.onKeyUp = obj.onKeyUp

    this.autocomplete = obj.autocomplete
  }
}

class SelectBox extends Editor {
  constructor(obj = {}) {
    if (obj.value === undefined) {
      obj.value = ''
    }

    super(obj)

    this.type = 'SelectBoxEditor'

    this.component = markRaw(defineAsyncComponent(() => import('@/components/editor/SelectBoxEditor.vue')))

    this.options = obj.options === undefined ? [] : obj.options

    this.width = obj.width === undefined ? 150 : obj.width

    this.btnOption = obj.btnOption

    if (obj.btnOption !== undefined && obj.btnOption.disable === undefined) {
      this.btnOption.disable = false
    }

    this.optionLabelKey = obj.optionLabelKey === undefined ? 'label' : obj.optionLabelKey

    this.optionValueKey = obj.optionValueKey

    this.placeholder = obj.placeholder
  }
}

class DateBox extends Editor {
  constructor(obj = {}) {
    super(obj)

    const typeOf = (data) => Object.prototype.toString.call(data).match(/([\w]+)\]/)[1]
    const convertDate = (date) => {
      const offset = new Date().getTimezoneOffset() * 60000
      return new Date(date - offset).toISOString().split('T')[0]
    }

    this.type = 'DateBoxEditor'

    this.component = markRaw(defineAsyncComponent(() => import('@/components/editor/DateBoxEditor.vue')))

    this.width = obj.width === undefined ? 100 : obj.width

    this.useSingleMode = obj.useSingleMode === undefined ? false : obj.useSingleMode

    this.useTime = obj.useTime === undefined ? false : obj.useTime

    this.defaultDateInterval =
      obj.defaultDateInterval === undefined ? (obj.useSingleMode ? 0 : 7) : obj.defaultDateInterval

    if (obj.startDate === undefined) {
      const date = new Date()
      obj.startDate = convertDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - this.defaultDateInterval)
      )
    } else {
      if (typeOf(obj.startDate) == 'Date') {
        obj.startDate = convertDate(obj.startDate)
      } else if (typeOf(obj.startDate) == 'String' && obj.startDate.trim().length > 0) {
        if (obj.startDate.length == 8) {
          obj.startDate = obj.startDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        } else if (obj.startDate.length == 10) {
        } else {
          obj.startDate = convertDate(new Date())
        }
      } else {
        obj.startDate = convertDate(new Date())
      }
    }

    this.startDate = obj.startDate

    this.startDefaultDate = obj.startDate

    this.startTime = obj.startTime === undefined ? '00:00:00' : obj.startTime

    this.defaultStartTime = obj.startTime === undefined ? '00:00:00' : obj.startTime

    if (!obj.useSingleMode) {
      if (obj.endDate === undefined) {
        obj.endDate = convertDate(new Date())
      } else {
        if (typeOf(obj.endDate) == 'Date') {
          obj.endDate = convertDate(obj.endDate)
        } else if (typeOf(obj.endDate) == 'String' && obj.endDate.trim().length > 0) {
          if (obj.endDate.length == 8) {
            obj.endDate = obj.endDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
          } else if (obj.endDate.length == 10) {
          } else {
            obj.endDate = convertDate(new Date())
          }
        } else {
          obj.endDate = convertDate(new Date())
        }
      }
    }

    this.endDate = obj.endDate

    this.defaultEndDate = obj.endDate

    this.endTime = obj.endTime === undefined ? '23:59:59' : obj.endTime

    this.defaultEndTime = obj.endTime === undefined ? '23:59:59' : obj.endTime

    this.dateFormat = obj.dateFormat === undefined ? 'yyyy-MM-dd' : obj.dateFormat

    this.timeFormat = obj.timeFormat === undefined ? 'HH:mm:ss' : obj.timeFormat
  }
}

class CheckBox extends Editor {}

class RadioBox extends Editor {}

export { InputBox, SelectBox, DateBox, CheckBox, RadioBox }
