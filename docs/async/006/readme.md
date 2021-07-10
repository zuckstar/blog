# Promise 系列(三): Promise 如何实现链式调用?

从现在开始，我们就来动手实现一个功能完整的 Promise，一步步深挖其中的细节。我们先从链式调用开始。

## Promises/A+ 规范

要了解一个 Promise 是如何实现，要先了解 Promise 是什么，以及它拥有哪些功能，内容可参考 Promises/A+ 规范的官方文档：

[英文原版](https://promisesaplus.com/)

[中文](https://zhuanlan.zhihu.com/p/143204897)



核心三件套：


1. 回调函数延迟绑定（利用 then 方法）

2. 返回值穿透（链式调用）

3. 错误冒泡


Promise 的状态：

promise必须是这三个状态中的一种：等待态pending,解决态fulfilled或拒绝态rejected

且一旦由 pending 转成 fulfilled 或者 rejected 态，promise 状态就不再改变。


then 方法：

Promise必须提供一个then方法来访问当前或最终的值或原因。

Promise的then方法接受俩个参数：

promise.then(onFulfilled, onRejected)

then 必须返回一个 promise 对象。



## 实现精简版的 Promise （20 行）

### 核心案例

核心案例 1：

```js
new Promise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 500)
})
  .then((res) => {
    console.log(res)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 500)
    })
  })
  .then(console.log)
```

上述的代码执行结果如下：

1. 500ms 后输出 1
2. 又过了 500ms 后输出 2

核心案例 2：

```js
let promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

promise.then((res) => {
  console.log(res, 111)
})
promise.then((res) => {
  console.log(res, 222)
})
```

过了 1000ms 后，接连输出

- 1,111
- 1,222

### 实现构造函数

```js
function Promise(fn) {
  // Promise resolve 时候的回调函数集合
  this.cbs = []

  // resolve方法: 将作为工具处理函数作为参数传递给 fn
  const resolve = (value) => {
    // 模拟异步执行
    setTimeout(() => {
      this.data = value // 设置处理结果
      this.cbs.forEach((cb) => cb(value)) // 逐个执行回调
    })
  }

  // 执行用户传入的函数
  // 并且把 resolve 方法教给用户执行
  fn(resolve)
}
```

根据案例 2，我们可以注册多个 then 方法，所以得出 this.cbs 应该是一个数组，保存所有的回调函数，当 promise1 resolve 后，按序执行回调。

### 实现 then 方法

```js
Promise.prototype.then = function(onResolved) {
  // 这里称之为 promise2
  return new Promise((resolve) => {
    // 这里的this其实是promise1
    this.cbs.push(() => {
      const res = onResolved(this.data)

      if (res instanceof Promise) {
        // resolve 的权利交给了 user promise
        res.then(resolve)
      } else {
        // 如果返回的是普通值，就直接 resolve
        resolve(res)
      }
    })
  })
}
```

### 逐步解析

再回到案例里

```js
const fn = (resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 500)
}

const promise1 = new Promise(fn)

promise1.then((res) => {
  console.log(res)
  // user promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2)
    }, 500)
  })
})
```

注意这里的命名：

1. 我们把 new Promise 返回的实例叫做 promise1

2. 在 Promise.prototype.then 的实现中，我们构造了一个新的 promise 返回，叫它 promise2

3. 在用户调用 then 方法的时候，用户手动构造了一个 promise 并且返回，用来做异步的操作，叫它 user promise

那么在 then 的实现中，内部的 this 其实就指向 promise1

而 promise2 的传入的 fn 函数执行了一个 this.cbs.push()，其实是往 promise1 的 cbs 数组中 push 了一个函数，等待后续执行。

```js
Promise.prototype.then = function(onResolved) {
  // 这里叫做promise2
  return new Promise((resolve) => {
    // 这里的this其实是promise1
    this.cbs.push(() => {})
  })
}
```

那么重点看这个 push 的函数，注意，这个函数在 promise1 被 resolve 了以后才会执行。

```js
// promise2
return new Promise((resolve) => {
  this.cbs.push(() => {
    // onResolved就对应then传入的函数
    const res = onResolved(this.data)
    // 例子中的情况 用户自己返回了一个user promise
    if (res instanceof Promise) {
      // user promise的情况
      // 用户会自己决定何时resolve promise2
      // 只有promise2被resolve以后
      // then下面的链式调用函数才会继续执行
      res.then(resolve)
    } else {
      resolve(res)
    }
  })
})
```

如果用户传入给 then 的 onResolved 方法返回的是个 user promise，那么这个 user promise 里用户会自己去在合适的时机 resolve promise2，那么进而这里的 res.then(resolve) 中的 resolve 就会被执行：

```js
if (res instanceof Promise) {
  res.then(resolve)
}
```

结合下面这个例子来看：

```js
new Promise((resolve) => {
  setTimeout(() => {
    // resolve1
    resolve(1)
  }, 500)
})
  // then1
  .then((res) => {
    console.log(res)
    // user promise
    return new Promise((resolve) => {
      setTimeout(() => {
        // resolve2
        resolve(2)
      }, 500)
    })
  })
  // then2
  .then(console.log)
```

then1 这一整块其实返回的是 promise2，那么 then2 其实本质上是 promise2.then(console.log)，
也就是说 then2 注册的回调函数，其实进入了 promise2 的 cbs 回调数组里，又因为我们刚刚知道，resolve2 调用了之后，user promise 会被 resolve，进而触发 promise2 被 resolve，进而 promise2 里的 cbs 数组被依次触发。
这样就实现了用户自己写的 resolve2 执行完毕后，then2 里的逻辑才会继续执行，也就是异步链式调用。

## 实现简易版本 Promise

### 基础版本

```js
// 定义三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(executor) {
  let self = this // 缓存当前 promise 实例 （即 promise1）

  self.value = null
  self.error = null
  self.status = PENDING
  self.onFulfilled = null // 成功的回调
  self.onRejected = null // 失败的回调

  const resolve = (value) => {
    if (self.status !== PENDING) return

    setTimeout(() => {
      self.staus = FULFILLED
      self.value = value
      self.onFulfilled(self.value)
    })
  }

  const reject = (error) => {
    if (self.status !== PENDING) return

    setTimeout(() => {
      self.status = REJECTED
      self.error = error
      self.onRejected(self.error)
    })
  }

  executor(resolve, reject)
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value)
  } else {
    onRejected(this.error)
  }
  return this
}
```

可以看到，Promise 的本质是一个有限状态机，存在三种状态:

- PENDING(等待)
- FULFILLED(成功)
- REJECTED(失败)

对于 Promise 而言，状态的改变不可逆，即由等待态变为其他的状态后，就无法再改变了。

不过，回到目前这一版的 Promise, 还是存在一些问题的。

### 设置回调数组

目前的版本只能执行一个回调函数，对于多个回调的绑定就无能为力，例如如下的代码：

```js
let promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

promise.then((res) => {
  console.log(res, '第一次展示')
})
promise.then((res) => {
  console.log(res, '第二次展示')
})
promise.then((res) => {
  console.log(res, '第三次展示')
})
```

这里我绑定了三个回调，想要在 resolve() 之后一起执行，那怎么办呢？

需要将 onFulfilled 和 onRejected 改为数组，调用 resolve 时将其中的方法拿出来一一执行即可。

修改后的代码如下：

```js
// 定义三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(executor) {
  let self = this // 缓存当前 promise 实例 （即 promise1）

  self.value = null
  self.error = null
  self.status = PENDING
  self.onFulfilledCallbacks = [] // 成功的回调数组
  self.onRejectedCallbacks = [] // 失败的回调数组

  const resolve = (value) => {
    if (self.status !== PENDING) return

    setTimeout(() => {
      self.staus = FULFILLED
      self.value = value
      self.onFulfilledCallbacks.forEach((cb) => {
        cb(self.value)
      })
    })
  }

  const reject = (error) => {
    if (self.status !== PENDING) return

    setTimeout(() => {
      self.status = REJECTED
      self.error = error
      self.onRejectedCallbacks.forEach((cb) => {
        cb(self.error)
      })
    })
  }

  executor(resolve, reject)
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(onFulfilled)
    this.onRejectedCallbacks.push(onRejected)
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value)
  } else {
    onRejected(this.error)
  }
  return this
}
```

### 完成链式调用

```js
Promise.prototype.then = function(onFulfilled, onRejected) {
  //...
  return this
}
```

这么写每次返回的都是第一个 Promise。then 函数当中返回的第二个 Promise 直接被无视了！

说明 then 当中的实现还需要改进, 我们现在需要对 then 中返回值重视起来。

```js
Promise.prototype.then = function(onFulfilled, onRejected) {
  let self = this
  if (this.status === PENDING) {
    return new Promise((resolve, reject) => {
      this.onFulfilledCallbacks.push((value)=>{
        try {
          let x = onFulfilled(value)
          resovle(x)
        } catch(e) {
          reject(e)
        }
      }))
      this.onRejectedCallbacks.push((error)=>{
        try {
          let x = onRejected(error)
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value)
  } else {
    onRejected(this.error)
  }
  return this
}
```

假若当前状态为 PENDING，将回调数组中添加如上的函数，当 Promise 状态变化后，会遍历相应回调数组并执行回调。

但是这段程度还是存在一些问题:

1. 首先 then 中的两个参数不传的情况并没有处理，

2. 假如 then 中的回调执行后返回的结果(也就是上面的 x)是一个 Promise, 直接给 resolve 了，这是我们不希望看到的。

怎么来解决这两个问题呢？

先对参数不传的情况做判断:

```js
// 成功回调不传给它一个默认函数
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
// 对于失败回调直接抛错
onRejected =
  typeof onRejected === 'function'
    ? onRejected
    : (error) => {
        throw error
      }
```

然后对返回 Promise 的情况进行处理:

```js
function resolvePromise(bridgePromise, x, resolve, reject) {
  //如果x是一个promise
  if (x instanceof Promise) {
    // 拆解这个 promise ，直到返回值不为 promise 为止
    if (x.status === PENDING) {
      x.then(
        (y) => {
          resolvePromise(bridgePromise, y, resolve, reject)
        },
        (error) => {
          reject(error)
        }
      )
    } else {
      x.then(resolve, reject)
    }
  } else {
    // 非 Promise 的话直接 resolve 即可
    resolve(x)
  }
}
```

然后在 then 的方法实现中作如下修改:

```js
resolve(x) =>  resolvePromise(bridgePromise, x, resolve, reject);
```

在这里大家好好体会一下拆解 Promise 的过程，其实不难理解，我要强调的是其中的递归调用始终传入的 resolve 和 reject 这两个参数是什么含义，其实他们控制的是最开始传入的 bridgePromise 的状态，这一点非常重要。

紧接着，我们实现一下当 Promise 状态不为 PENDING 时的逻辑。

成功状态下调用 then：

```js
if (self.status === FULFILLED) {
  return (bridgePromise = new Promise((resolve, reject) => {
    try {
      // 状态变为成功，会有相应的 self.value
      let x = onFulfilled(self.value)
      // 暂时可以理解为 resolve(x)，后面具体实现中有拆解的过程
      resolvePromise(bridgePromise, x, resolve, reject)
    } catch (e) {
      reject(e)
    }
  }))
}
```

失败状态下调用 then：

```js
if (self.status === REJECTED) {
  return (bridgePromise = new Promise((resolve, reject) => {
    try {
      // 状态变为失败，会有相应的 self.error
      let x = onRejected(self.error)
      resolvePromise(bridgePromise, x, resolve, reject)
    } catch (e) {
      reject(e)
    }
  }))
}
```

Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 setTimeout(属于宏任务的范畴) 来模拟，用 setTimeout 将需要执行的任务包裹 ，当然，上面的 resolve 实现也是同理, 大家注意一下即可，其实并不是真正的微任务。

```js

if (self.status === FULFILLED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      //...
    })
}

```

```js

if (self.status === REJECTED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      //...
    })
}

```

### 错误捕获及冒泡机制分析

现在来实现 catch 方法:

```js
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}
```

对，就是这么几行，catch 原本就是 then 方法的语法糖。

相比于实现来讲，更重要的是理解其中错误冒泡的机制，即中途一旦发生错误，可以在最后用 catch 捕获错误。

我们回顾一下 Promise 的运作流程也不难理解，贴上一行关键的代码:

```js
// then 的实现中
onRejected =
  typeof onRejected === 'function'
    ? onRejected
    : (error) => {
        throw error
      }
```

一旦其中有一个 PENDING 状态的 Promise 出现错误后状态必然会变为失败, 然后执行 onRejected 函数，而这个 onRejected 执行又会抛错，把新的 Promise 状态变为失败，新的 Promise 状态变为失败后又会执行 onRejected......就这样一直抛下去，直到用 catch 捕获到这个错误，才停止往下抛。

这就是 Promise 的错误冒泡机制。

至此，Promise 三大法宝: 回调函数延迟绑定、回调返回值穿透和错误冒泡都已经全部分析完毕。

### 完整代码参考

```js
// 定义三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(executor) {
  let self = this // 缓存当前 promise 实例 （即 promise1）

  self.value = undefined
  self.error = undefined
  self.status = PENDING
  self.onFulfilledCallbacks = [] // 成功的回调数组
  self.onRejectedCallbacks = [] // 失败的回调数组

  const resolve = (value) => {
    if (self.status !== PENDING) return;

    setTimeout(() => {
      self.staus = FULFILLED
      self.value = value
      self.onFulfilledCallbacks.forEach((cb) => {
        cb(self.value)
      })
    })
  }

  const reject = (error) => {
    if (self.status !== PENDING) return

    setTimeout(() => {
      self.status = REJECTED
      self.error = error
      self.onRejectedCallbacks.forEach((cb) => {
        cb(self.error)
      })
    })
  }

  executor(resolve, reject)
}

Promise.prototype.then = function(onFulfilled, onRejected) {

  // 成功回调不传给它一个默认函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
  // 对于失败回调直接抛错
  onRejected = typeof onRejected === 'function' ? onRejected : (error) => { throw error }

  let self = this

  let brigePromise

  if (self.status === PENDING) {
    return new Promise((resolve, reject) => {
      self.onFulfilledCallbacks.push((value)=>{
        try {
          let x = onFulfilled(value)
          resovle(x)
        } catch(e) {
          reject(e)
        }
      }))
      self.onRejectedCallbacks.push((error)=>{
        try {
          let x = onRejected(error)
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }
  else if (self.status === FULFILLED) {
    bridgePromise = new Promise((resolve, reject) => {
      try {
        // 状态变为成功，会有相应的 self.value
        let x = onFulfilled(self.value)
        // 暂时可以理解为 resolve(x)，后面具体实现中有拆解的过程
        resolvePromise(bridgePromise, x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  }
  else if (self.status === REJECTED) {
    bridgePromise = new Promise((resolve, reject) => {
      try {
        // 状态变为失败，会有相应的 self.error
        let x = onRejected(self.error)
        resolvePromise(bridgePromise, x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  }
  return bridgePromise
}

function resolvePromise(bridgePromise, x, resolve, reject) {
  //如果x是一个promise
  if (x instanceof Promise) {
    // 拆解这个 promise ，直到返回值不为 promise 为止
    if (x.status === PENDING) {
      x.then(
        (y) => {
          resolvePromise(bridgePromise, y, resolve, reject)
        },
        (error) => {
          reject(error)
        }
      )
    } else {
      x.then(resolve, reject)
    }
  } else {
    // 非 Promise 的话直接 resolve 即可
    resolve(x)
  }
}
```

## 参考

[最简实现 Promise，支持异步链式调用（20 行）](https://juejin.cn/post/6844904094079926286)

[实现 Promise](http://47.98.159.95/my_blog/blogs/javascript/js-async/006.html)

[实现 Promise2](https://blog.csdn.net/qq_18864907/article/details/90050274?spm=1001.2014.3001.5501)
