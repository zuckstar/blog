function EventEmitter() {
  this.events = new Map()
}

const wrapCallback = (fn, once = false) => ({ callback: fn, once })

EventEmitter.prototype.addListener = function(type, fn, once = false) {
  
  let handler = this.events.get(type) // 获取 type 类型事件的回调

  if (!handler) {
    // 为 type 事件绑定回调
    this.events.set(type, wrapCallback(fn, once))
  } else if (handler && typeof handler.callback === 'function') {
    // type 事件只有一个回调，所以直接设置数组
    this.events.set(type, [handler, wrapCallback(fn, once)])
  } else {
    // type 事件的回调数 >= 2, 或者说 handler 是 Array
    handler.push(wrapCallback(fn, once))
  }
}

EventEmitter.prototype.removeListener = function (type, listener) {
  let handler = this.events.get(type)

  if (!handler) return; // 没有添加过该监听器，直接返回

  if (!Array.isArray(handler)) {
    // 该监听只有一个的情况下，直接判断两个 callback 是否相等，如果相等则删除当前回调函数
    if (handler.callback === listener.callback) this.events.delete(type)
    else return;
  }

  // handler 为数组的情况
  for (let i = 0; i < handler.length; i++) {
    let item = handler[i]
    if (item.callback === listener.callback) {
      handler.splice(i, 1)
      i--
      // 如果剩余回调个数为1则不用数组存储
      if (handler.length === 1) {
        this.events.set(type, handler[0])
      }
    }
  }
}

EventEmitter.prototype.once = function(type, fn) {
  this.addListener(type, fn, true)
}


EventEmitter.prototype.emit = function(type, ...args) {
  let handler = this.events.get(type)

  if (!handler) return;

  if (Array.isArray(handler)) {
    handler.map(item => {
      item.callback.apply(this, args)

      // 标记 once = true 的回调项，在执行过一次后移除
      if(item.once) this.removeListener(type, item)
    })
  } else {
    handler.callback.apply(this, args)
  }

  return true

}


EventEmitter.prototype.removeAllListener = function (type) {
  let handler = this.events.get(type)
  if (!handler) return;
  else this.events.delete(type)
}


let e = new EventEmitter()

// 新增监听事件: hello
e.addListener('hello', () => {
  console.log('hello 事件被触发, 回调函数1')
})

// 新增监听事件：hello
e.addListener('hello', () => {
  console.log('hello 事件被触发, 回调函数2')
})

// 新增只触发一次的监听事件：hello
function hello () {
  console.log('只触发一次的 hello 事件')
}

e.once('hello', hello)


// 第一次触发 hello 事件

e.emit('hello')

/*
hello 事件被触发, 回调函数1
hello 事件被触发, 回调函数2
只触发一次的 hello 事件 
*/

// 第二次触发 hello 事件

e.emit('hello')
/*
hello 事件被触发, 回调函数1
hello 事件被触发, 回调函数2
*/ 
