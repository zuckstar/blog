# 实现简单的 node 中回调函数的机制

回调函数的方式其实内部利用了发布-订阅模式，在这里我们以模拟实现 node 中的 Event 模块为例来写实现回调函数的机制。

```js
function EventEmitter() {
  this.event = new Map()
}
```

这个 EventEmitter 一共需要实现这些方法: addListener, removeListener, once, removeAllListener, emit。

## addListener

首先是 addListener：

```js
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
```

## removeListener

其次是 removeListener:

```js
EventEmitter.prototype.removeListener = function(type, listener) {
  let handler = this.events.get(type)

  if (!handler) return // 没有添加过该监听器，直接返回

  if (!Array.isArray(handler)) {
    // 该监听只有一个的情况下，直接判断两个 callback 是否相等，如果相等则删除当前回调函数
    if (handler.callback === listener.callback) this.events.delete(type)
    else return
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
```

## once

once 实现思路很简单，先调用 addListener 添加上了 once 标记的回调对象

```js
EventEmitter.prototype.once = function(type, fn) {
  this.addListener(type, fn, true)
}
```

## emit

emit 函数就是触发执行回调函数

```js
EventEmitter.prototype.emit = function(type, ...args) {
  let handler = this.events.get(type)

  if (!handler) return

  if (Array.isArray(handler)) {
    handler.map((item) => {
      item.callback.apply(this, args)

      // 标记 once = true 的回调项，在执行过一次后移除
      if (item.once) this.removeListener(type, item)
    })
  } else {
    handler.callback.apply(this, args)
  }

  return true
}
```

## removeAllListener

```js
EventEmitter.prototype.removeAllListener = function(type) {
  let handler = this.events.get(type)
  if (!handler) return
  else this.events.delete(type)
}
```

## 测试

```js
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
function hello() {
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
```

OK，一个简易的 Event 就这样实现完成了，为什么说它简易呢？因为还有很多细节的部分没有考虑:

1. 在参数少的情况下，call 的性能优于 apply，反之 apply 的性能更好。因此在执行回调时候可以根据情况调用 call 或者 apply。

2. 考虑到内存容量，应该设置回调列表的最大值，当超过最大值的时候，应该选择部分回调进行删除操作。

3. 鲁棒性有待提高。对于参数的校验很多地方直接忽略掉了。

不过，这个案例的目的只是带大家掌握核心的原理，如果在这里洋洋洒洒写三四百行意义也不大，有兴趣的可以去看看 Node 中 [Event 模块](https://github.com/Gozala/events/blob/master/events.js) 的源码，里面对各种细节和边界情况做了详细的处理。

## 参考

[三元/实现简单的回调函数机制](http://47.98.159.95/my_blog/blogs/javascript/js-async/003.html)
