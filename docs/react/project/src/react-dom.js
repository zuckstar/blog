import { createUnit } from './unit'
import $ from 'jquery'

let ReactDom = {
  render,
  rootIndex: 0
}

// 渲染方法
function render (element, container) {

  // 包装 element 元素对象
  let unit = createUnit(element)

  // 利用 unit.getMarkUp 将 element 转换成 html 标记
  let markUp = unit.getMarkUp(ReactDom.rootIndex)
  
  // 在页面上渲染并展示
  $(container).html(markUp)

  $(document).trigger("mounted")
}

export default ReactDom