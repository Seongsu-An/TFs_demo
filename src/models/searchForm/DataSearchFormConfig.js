import { useGlobal } from '@/lib/Global'

class DataSearchFormConfig {
  constructor(editorList = []) {
    this.editorList = editorList

    this.obj = {}

    for (const [index, editor] of editorList.entries()) {
      if (editor.valueKey === undefined || editor.valueKey === null || editor.valueKey === '') {
        editor.valueKey = `editor_${index}`
        this.obj[`editor_${index}`] = editor
        continue
      }
      if (editor.type == 'DateBoxEditor') {
        this.obj[editor.valueKey[0]] = editor
        this.obj[editor.valueKey[1]] = editor
      }

      this.obj[editor.valueKey] = editor
    }
  }
}

export { DataSearchFormConfig }
