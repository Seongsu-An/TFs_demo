class Editor {
  constructor(obj = {}) {
    this.label = obj.label

    this.class = obj.class

    this.style = obj.style

    this.valueKey = obj.valueKey

    this.value = obj.value

    this.defaultValue = obj.value

    this.cols = obj.cols === undefined ? 3 : obj.cols

    this.readonly = obj.readonly === undefined ? false : obj.readonly

    this.itemVisible = obj.itemVisible === undefined ? true : obj.itemVisible

    this.visible = obj.visible === undefined ? true : obj.visible

    this.onValueChanged = obj.onValueChanged

    this.validate = obj.validate

    this.required = obj.required === undefined ? false : obj.required

    this.description = obj.description === undefined ? '' : obj.description

    this.disable = obj.disable === undefined ? false : obj.disable
  }
}

export default Editor
