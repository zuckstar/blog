import $ from 'jquery'
import { Element } from "./element"

class Unit {
  constructor(element) {
    this._currentElement = element
  }

  getMarkUp () {
    throw Error('此方法应该被重写，不能直接被使用')
  }
}

class NativeUnit extends Unit {
  // 获取字符串标签
  getMarkUp (reactid) {
    this._reactid = reactid
    let { type, props } = this._currentElement
    let tagStart = `<${type} data-reactid="${this._reactid}"`
    let childString = ''
    let tagEnd = `</${type}>`

    for (let propName in props) {
      if (/^on[A-Z]/.test(propName)) {
        let eventName = propName.slice(2).toLowerCase(); // 获取 on 后面的事件名

        // 绑定事件
        $(document).delegate(`[data-reactid="${this._reactid}"]`, `${eventName}.${this._reactid}`, props[propName])
      } else if (propName === 'style') {
        let styleObj = props[propName]
        let styles = Object.entries(styleObj).map(([attr, value]) => {
          // 把驼峰式转成 连接符号例如：backgroundColor => background-color, 替换的是大写首字母
          return `${attr.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${value}`
        }).join(';')
        tagStart += (` style="${styles}"`)
      } else if (propName === 'className') {
        tagStart += (` class=${props[propName]}`)
      } else if (propName === 'children') {
        let children = props[propName]
        // 递归创建子节点标签
        children.forEach((child, index) => {
          // 创建单元
          let childUnit = createUnit(child)
          let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`)
          childString += childMarkUp
        })
      } else {
        // 其他的自定义属性
        tagStart += (` ${propName}="${props[propName]}"`)
      }
    }
    return tagStart+'>'+childString+tagEnd
  }
}

class TextUnit extends Unit {
  getMarkUp (reactid) {
    this._reactid = reactid
    return `<span data-reactid="${reactid}">${this._currentElement}</span>`
  }
  update (nextElement) {
    // debugger
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement
      $(`[data-reactid="${this._reactid}"]`).html(nextElement)
    }
  }
}
function shouldDeepCompare(oldElement, newElement){
  if (oldElement != null && newElement != null) {
    let oldType = typeof oldElement
    let newType = typeof newElement
    if ((oldType === 'string' || oldType === 'number') && (newType === 'string' || newType === 'number')) {
      return true
    }
    if (oldElement instanceof Element && newElement instanceof Element) {
      return oldElement.type === newElement.type
    }
  }
  return false
}

class CompositeUnit extends Unit {
  update (nextElement, partialState) {
    this._currentElement = nextElement || this._currentElement

    // 获取最新的状态
    let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState)

    // 获取最新的属性对象
    let nextProps = this._currentElement.props

    if (this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextProps, nextState)) {
      // 不需要更新，停止比较
     
      return;
    }

    // 获取上次用来渲染的 unit，在 getMarkUp 方法中保存了这个实例
    let preRenderedUnitInstance = this._renderUnit;

    // 获取上次渲染的元素
    let preRenderElement = preRenderedUnitInstance._currentElement

    // 得到最新的渲染元素
    let nextRenderElement = this._componentInstance.render()

    // 两个元素进行比较
    if (shouldDeepCompare(preRenderElement, nextRenderElement)) {
      preRenderedUnitInstance.update(nextRenderElement)
      this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate()
    } else {
      // 直接替换更新
      this._renderUnit = createUnit(nextRenderElement)
      let nextMarkUp = this._renderUnit.getMarkUp(this._reactid)
      $(`[data-reactid="${this._reactid}"]`).replaceWith(nextMarkUp)
    }
  }
  getMarkUp (reactid) {
    this._reactid = reactid
    let { type: Component, props } = this._currentElement
    
    // 把 实例对象 保存到这个 当前的 unit
    let componentInstance = this._componentInstance = new Component(props)

    // 把 unit 挂载到实例 componentInstance 的  _currentUnit 属性上
    componentInstance._currentUnit = this

    // 添加生命周期函数
    componentInstance.componentWillMount && componentInstance.componentWillMount()

    let renderElement = componentInstance.render() // 调用组件的 render 方法，转化成 createElement
    let renderUnit = this._renderUnit = createUnit(renderElement) // 再把 createElement 转化成创建 Unit
    
    // 增加一个组件监听事件
    $(document).on("mounted",()=>{
      componentInstance.componentDidMount &&  componentInstance.componentDidMount()
    })
    
    return renderUnit.getMarkUp(this._reactid) // 最后生成 markup
  }
}
function createUnit (element) {
  // 渲染文本节点的 unit
  if (typeof element === 'string' || typeof element === 'number') {
    return new TextUnit(element)
  }

  // 渲染 Element 的 unit
  if (element instanceof Element && typeof element.type === 'string') {
    return new NativeUnit(element)
  }

  // 渲染 React.component 的 unit
  if (element instanceof Element && typeof element.type === 'function') {
    return new CompositeUnit(element)
  }
}

export {
  createUnit
}