import CellInputBox from '@/components/grid/editor/CellInputBox.vue'
import { VGridVueEditor, VGridVueTemplate } from '@revolist/vue3-datagrid'

/**
 * ColumnConfig 정의
 * @param { object } obj
 * @param { string } obj.prop column 필드명
 * @param { string } obj.name column 헤더에 표시되는 이름
 * @param { boolean } obj.sortable column 정렬 가능 여부
 * @param { string } obj.order column 정렬 방식 // [undefined, 'asc', 'desc']
 * @param { boolean } obj.readonly column edit readonly 여부
 * @param { number } obj.size column 너비
 * @param { Array<ColumnConfig> } obj.children column 자식 요소 <그룹컬럼>
 * @param { boolean } obj.hide column 숨김 여부
 *
 */

class ColumnConfig {
  constructor(obj = {}) {
    this.prop = obj.prop

    this.name = obj.name === undefined ? '' : obj.name

    this.sortable = obj.sortable === undefined ? true : obj.sortable

    this.order = obj.order

    this.readonly = obj.readonly === undefined ? false : obj.readonly

    this.size = obj.size === undefined ? 200 : obj.size

    this.children = obj.children

    this.columnTemplate = obj.columnTemplate

    this.editor = obj.editor === undefined ? VGridVueEditor(CellInputBox) : VGridVueEditor(obj.editor)

    this.cellTemplate =
      obj.editor !== undefined || obj.cellTemplate === undefined ? undefined : VGridVueTemplate(obj.cellTemplate)

    this.cellRendererParams = obj.cellRendererParams
    // this.hide = obj.hide === undefined ? false : obj.hide
  }
}

export { ColumnConfig }
