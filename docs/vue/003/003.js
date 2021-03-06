class Dep {
  constructor() {
    // 用来存放 Watcher 对象的数组
    this.subs = []
  }

  // 在 subs 中添加一个 Watcher 对象
  addSub (sub) {
    this.subs.push(sub)
  }

  // 通知所有的 Watcher 对象更新视图
  notify () {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

class Watcher {
  constructor(obj, key, cb) {
    // new Watcher 对象的时候，把该对象赋值给 Dep.target, 在 get 中会用到
    Dep.target = this

    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key] // 触发 defineProperty 的 get 方法

    // Dep 添加 watcher 完成
    Dep.target = null 
  }

  update () {
    this.value = this.obj[this.key]
      
    this.cb(this.value)
  }
}

Dep.target = null // 可以把他理解为一个全局变量

function defineReactive (obj, key, val) {

  // 一个 Dep 类对象
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true, // 属性可枚举
    configurable: true, // 属性可修改或者删除
    get: function reactiveGetter () {
       /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target)
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal
       /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify()
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

    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
    new Watcher(this._data, 'test', (value) => {
      console.log('test 视图更新啦')
    })

    /* 在这里模拟render的过程，为了触发test属性的 set 函数 */
    this._data.test = 'abc'
  }
}

let vue = new Vue({
  data: {
    test: "I am test."
  }
})

