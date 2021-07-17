class Component {
  constructor(props) {
    this.props = props
  }

  setState (partialState) {
    // 可以从组件实例上获取到创建组件时候的 Unit 对象，调用它的 update 方法进行组件更新
    this._currentUnit.update(null, partialState)
  }
}

export {
  Component
}