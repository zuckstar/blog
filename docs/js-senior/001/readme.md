# 异常处理

## 回调异常处理

### 场景一：直接抛出错误

结果：异步回调中，回调函数的执行栈与原函数分离开，导致外部无法抓住异常。

```js
function fetch(callback) {
    setTimeout(() => {
        throw Error('请求失败')
    })
}

try {
    fetch(() => {
        console.log('请求处理') // 永远不会执行
    })
} catch (error) {
    console.log('触发异常', error) // 永远不会执行
}

// 计时器到期后程序崩溃
// Uncaught Error: 请求失败
```

### 场景二：传递错误处理函数交由给业务方

```js
function fetch(handleError, callback) {
  setTimeout(() => {
      handleError('请求失败')
  })
}

fetch(() => {
  console.log('失败处理') // 失败处理
}, error => {
  console.log('请求处理') // 永远不会执行
})
```
虽然使用了 error-first 约定，使异常看起来变得可处理，但业务方依然没有对异常的控制权，是否调用错误处理取决于回调函数是否执行，我们无法知道调用的函数是否可靠。

更糟糕的问题是，业务方必须处理异常，否则程序挂掉就会什么都不做，这对大部分不用特殊处理异常的场景造成了很大的精神负担。

## Promise 异常处理

### 场景一：catch

```js
function fetch(callback) {
  return new Promise((resolve, reject) => {
      throw Error('用户不存在')
  })
}

fetch().then(result => {
  console.log('请求成功处理', result) 
}).catch(error => {
  console.log('请求处理异常', error) // 请求处理异常 用户不存在
})
```

不仅是 reject，抛出的异常也会被作为拒绝状态被 Promise 捕获，这里的 throw Error 最后也会被 catch() 方法捕捉到。


但是如果在 Promise 中的异步抛出错误：

```js
function fetch(callback) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
           throw Error('用户不存在')
      })
  })
}

fetch().then(result => {
  console.log('请求成功处理', result) 
}).catch(error => {
  console.log('请求处理异常', error) // 请求处理异常 用户不存在
})

// 程序崩溃
// Uncaught Error: 用户不存在
```
永远不要在 macrotask 队列中抛出异常，因为 macrotask 队列脱离了运行上下文环境，异常无法被当前作用域捕获。

微任务中抛出的错误（throw Error()）可以被捕获，宏任务中抛出的任务无法被捕获，所以要在宏任务中使用 reject() 方法。


### 场景二：第三方函数抛出错误

```js
function thirdFunction() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('三方函数异常')
        })
    })
}

Promise.resolve(true).then((resolve, reject) => {
    return thirdFunction()
}).catch(error => {
    console.log('捕获异常', error) // 捕获异常
})
```

请注意，如果 return thirdFunction() 这行缺少了 return 的话，依然无法抓住这个错误，这是因为没有将对方返回的 Promise 传递下去，错误也不会继续传递。
我们发现，这样还不是完美的办法，不但容易忘记 return，而且当同时含有多个第三方函数时，处理方式不太优雅：

```js
Promise.resolve(true).then((resolve, reject) => {
    return thirdFunction().then(() => {
        return thirdFunction()
    }).then(() => {
        return thirdFunction()
    }).then(() => {
    })
}).catch(error => {
    console.log('捕获异常', error)
})
```


### Async 和 Await

在 Async 函数中，我们使用 try catch 捕获异常。

因为此时的异步其实在一个作用域中，通过 generator 控制执行顺序，所以可以将异步看做同步的代码去编写，包括使用 try catch 捕获异常。

```js
function fetch(callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('no')
        })
    })
}

async function main() {
    try {
        const result = await fetch()
        console.log('请求处理', result) // 永远不会执行
    } catch (error) {
        console.log('异常', error) // 异常 no
    }
}

main()
```

如果有多个函数需要执行的话就可以写成：
```js
async function main() {
    try {
        const result = await fetch1()
        const result = await fetch2()
        const result = await fetch3()
        const result = await fetch4()
        console.log('请求处理', result) // 永远不会执行
    } catch (error) {
        console.log('异常', error)
    }
}

main()
```
## action 概念中的异常处理
为了防止程序崩溃，需要业务线在所有 async 函数中包裹 try catch
```js
const successRequest = () => Promise.resolve('a')
const failRequest = () => Promise.reject('b')

class Action {
    async successReuqest() {
        const result = await successRequest()
        console.log('successReuqest', '处理返回值', result) // successReuqest 处理返回值 a
    }

    async failReuqest() {
        const result = await failRequest()
        console.log('failReuqest', '处理返回值', result) // 永远不会执行
    }

  async allReuqest () {
    try {
      const result1 = await successRequest()
      console.log('allReuqest', '处理返回值 success', result1) // allReuqest 处理返回值 success a
      const result2 = await failRequest()
      console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
    } catch (e) {
      console.log('有错误了',e)
      }
    }
}

const action = new Action()
action.successReuqest() // 无法捕获异常，抛出错误
action.failReuqest() // 无法捕获异常，抛出错误
action.allReuqest() // 成功捕获异常
```

## 装饰器

### 类级装饰器：
```ts
const asyncClass = (errorHandler?: (error?: Error) => void) => (target: any) => {
  // 把传入 target 对象的每一个自有属性都进行封装，并用 try...catch 进行包裹，在出错的情况下利用 errorHandler 进行处理
  Object.getOwnPropertyNames(target.prototype).forEach(key => {
      const func = target.prototype[key]
      target.prototype[key] = async (...args: any[]) => {
          try {
              await func.apply(this, args)
          } catch (error) {
              errorHandler && errorHandler(error)
          }
      }
  })

  // 处理之后返回 target 对象
  return target
}


const successRequest = () => Promise.resolve('a')
const failRequest = () => Promise.reject('b')

// 生成的装饰器方法
const iAsyncClass = asyncClass(error => {
    console.log('统一异常处理', error) // 错误处理方法
})

@iAsyncClass
class Action {
    async successReuqest() {
        const result = await successRequest()
        console.log('successReuqest', '处理返回值', result)
    }

    async failReuqest() {
        const result = await failRequest()
        console.log('failReuqest', '处理返回值', result) // 永远不会执行
    }

    async allReuqest() {
        const result1 = await successRequest()
        console.log('allReuqest', '处理返回值 success', result1)
        const result2 = await failRequest()
        console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
    }
}

const action = new Action()
action.successReuqest() // 成功捕获异常
action.failReuqest() // 成功捕获异常
action.allReuqest() // 成功捕获异常
```

### 方法（函数）级装饰器：

```js
const asyncMethod = (errorHandler?: (error?: Error) => void) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  // 获取具体的方法
  const func = descriptor.value
  return {
    get() {
          // 重写方法并返回
          return (...args: any[]) => {
              return Promise.resolve(func.apply(this, args)).catch(error => {
                  errorHandler && errorHandler(error)
              })
          }
      },
      set(newValue: any) {
          return newValue
      }
  }
}
const successRequest = () => Promise.resolve('a')
const failRequest = () => Promise.reject('b')

const asyncAction = asyncMethod(error => {
    console.log('统一异常处理', error) // 统一异常处理 b
})

class Action {
    @asyncAction async successReuqest() {
        const result = await successRequest()
        console.log('successReuqest', '处理返回值', result)
    }

    @asyncAction async failReuqest() {
        const result = await failRequest()
        console.log('failReuqest', '处理返回值', result) // 永远不会执行
    }

    @asyncAction async allReuqest() {
        const result1 = await successRequest()
        console.log('allReuqest', '处理返回值 success', result1)
        const result2 = await failRequest()
        console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
    }
}

const action = new Action()
action.successReuqest()
action.failReuqest()
action.allReuqest()
```

### 业务方拥有处理错误的主动权

```js
async login(nickname, password) {
    try {
        const user = await userService.login(nickname, password)
        // 跳转到首页，登录失败后不会执行到这，所以不用担心用户看到奇怪的跳转
    } catch (error) {
        if (error.no === -1) {
            // 跳转到登录页
        } else {
            throw Error(error) // 其他错误不想管，把球继续踢走
        }
    }
}
```

## 全局错误

### nodejs

在 nodejs 端，记得监听全局错误，兜住落网之鱼：

process.on('uncaughtException', (error: any) => {
    logger.error('uncaughtException', error)
})

process.on('unhandledRejection', (error: any) => {
    logger.error('unhandledRejection', error)
})

### 浏览器端

在浏览器端，记得监听 window 全局错误，兜住漏网之鱼：

window.addEventListener('unhandledrejection', (event: any) => {
    logger.error('unhandledrejection', event)
})
window.addEventListener('onrejectionhandled', (event: any) => {
    logger.error('onrejectionhandled', event)
})
