function cb(params) {
  // 渲染视图

  console.log("视图更新啦~")
}

// 添加响应式操作
function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true, // 属性可枚举
    configurable: true, // 属性可修改或者删除
    get: function reactiveGetter() {
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal
      cb(newVal)
    }
  })
}

function observer(value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }

  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key])
  })
}

class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

let vue = new Vue({
  data: {
    test: "I am test."
  }
})

vue._data.test = "hello, world"

console.log(vue._data.test)