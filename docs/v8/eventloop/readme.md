# Eventloop 事件循环

## 宏任务

在 JS 中，大部分的任务都是在主线程上执行，常见的任务有:

- 1. 用户交互事件
- 2. 渲染事件
- 3. JS 脚本执行
- 4. 网络请求、文件读写等

为了让这些事件有条不紊地进行，JS 引擎需要对之执行的顺序做一定的安排。V8 引擎使用队列的方式来存储这些任务，按先进先出的方式来执行这些任务，模拟的代码如下：

```js
let keep_running = true

function MainTherad() {
  while (true) {
    //执行队列中的任务
    const task = task_queue.takeTask()

    ProcessTask(task)

    //执行延迟队列中的任务
    ProcessDelayTask()

    if (!keep_running)
      //如果设置了退出标志，那么直接退出线程循环
      break
  }
}
```

这里用到了一个 for 循环，将队列中的任务一一取出，然后执行，这个很好理解。但是其中包含了两种任务队列，除了上述提到的任务队列， 还有一个延迟队列，它专门处理诸如 setTimeout/setInterval 这样的定时器回调任务。

上述提到的，普通任务队列和延迟队列中的任务，都属于宏任务。

具体来说，宏任务包含了这些任务：setTimeout, setInterval, setImmediate, I/O, UI 渲染，JS 脚本

## 微任务

对于每个宏任务而言，其内部都有一个微任务队列。那为什么要引入微任务？微任务在什么时候执行呢？

其实引入微任务的初衷是为了解决异步回调的问题。想一想，对于异步回调的处理，有多少种方式？总结起来有两点:

- 1. 将异步回调进行宏任务队列的入队操作。
- 2. 将异步回调放到当前宏任务的末尾。

如果采用第一种方式，那么执行回调的时机应该是在前面所有的宏任务完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成应用卡顿。

为了规避这样的问题，V8 引入了第二种方式，这就是微任务的解决方式。在每一个宏任务中定义一个微任务队列，当该宏任务执行完成，会检查其中的微任务队列，如果为空则直接执行下一个宏任务，如果不为空，则依次执行微任务，执行完成才去执行下一个宏任务。

常见的微任务有 MutationObserver、Promise.then(或.reject) 以及以 Promise 为基础开发的其他技术(比如 fetch API), 还包括 V8 的垃圾回收过程。

Ok, 这便是宏任务和微任务的概念，接下来正式介绍 JS 非常重要的运行机制——EventLoop。

## 浏览器 EventLoop

### 从一个经典的例子开始说起

```js
console.log('start')
setTimeout(() => {
  console.log('timeout')
})
Promise.resolve().then(() => {
  console.log('resolve')
})
console.log('end')
```

上述代码执行后打印的顺序是：

start、timeout、resolve、end

### 分析

1. 刚开始整个脚本作为一个宏任务来执行，对于同步代码直接压入执行栈进行执行，因此先打印 start 和 end

2. setTimeout 作为一个宏任务放入宏任务队列

3. Promise.resolve() 返回一个 resolve 状态的 Promise 对象，then 中函数参数就是它的回调方法，所以把它加入微任务队列

4. 当本次宏任务执行完，检查当前微任务队列，发现一个 Promise.then, 执行打印 resolve

5. 接下来进入到下一个宏任务——setTimeout, 执行打印 timeout

### 总结

1. 一开始整段脚本作为第一个宏任务执行

2. 执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列

3. 当前宏任务执行完出队，检查微任务队列，如果有则依次执行，直到微任务队列为空

4. 执行浏览器 UI 线程的渲染工作

5. 检查是否有 Web worker 任务，有则执行

6. 执行队首新的宏任务，回到 2，依此循环，直到宏任务和微任务队列都为空

### 习题 1

```js
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

Promise.resolve()
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

- script start
- script end
- promise1
- promise2
- setTimeout

这道题需要一些 promise 相关的知识，.then 方法相当于一个回调，此题 promise 执行完相当于有两个回调，当前宏任务执行完需要清空微任务队列的，所以会把两个回调的微任务都执行完才会执行下一个宏任务。

### 习题 2

```js
Promise.resolve().then(() => {
  console.log('Promise1')
  setTimeout(() => {
    console.log('setTimeout2')
  }, 0)
})
setTimeout(() => {
  console.log('setTimeout1')
  Promise.resolve().then(() => {
    console.log('Promise2')
  })
}, 0)
console.log('start')
```

- start
- Promise1
- setTimeout1
- Promise2
- setTimeout2

这道题一定要细心，根据宏任务微任务的执行原则，一步一步分析，就能得到正确答案。

### 习题 3

```js
setTimeout(() => {
  console.log('1')
})
new Promise(function(resolve) {
  console.log('2')
  resolve()
}).then(function() {
  console.log('3')
})
console.log('4')
```

打印的结果是 2，4，3，1
Promise 传入的函数内部的同步代码是立即执行的！then 中的函数才是回调哈。

### 习题 4

```js
async function a1() {
  console.log('async1 start')
  await a2()
  console.log('async1 end')
}
async function a2() {
  console.log('async2')
}

console.log('script start')
setTimeout(function() {
  console.log('setTimeout')
}, 0)
a1()

new Promise((resolve) => {
  console.log('Promise1')
  resolve()
}).then(() => {
  console.log('Promise2')
})
```

- script start
- async1 start
- async2
- Promise1
- Promise2
- async1 end
- setTimeout

关键点在于 async1 end 为什么比 Promise2 后输出，要解释这个原因，需要将题目中的 async 和 await 转换成 promise 的写法后来判断。转换后的代码如下：

```js
function async1() {
  console.log('async1 start')
  const p = async2()
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      p.then(resolve)
    })
  }).then(() => {
    console.log('async1 end')
  })
}

function async2() {
  console.log('async2')
  return Promise.resolve()
}

console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

async1()

new Promise((resolve) => {
  console.log('Promise1')
  resolve()
}).then(() => {
  console.log('Promise2')
})
```

这样看就清楚了些, 当 async2() 执行完了之后，真正的 asnyc1 end 相当于在一个微任务中又包装了一个微任务。

即打印 async2 之后，将 async1 end Promise 加入到微任务队列中，然后执行外层 Promise，打印结果 Promise1，把 Promise2 加入到微任务队列中，此时微任务队列是：

[async1 end Promise,Promise2],

此时执行 async1 end Promise，但是 async1 end 第一次执行，又执行一次回调，把真正的打印 async1 end 的任务，加入到新的微任务队列，此时微任务队列是：

[Promise2，async1 end]

然后依次打印 Promise2，async1 end。

## NodeJS EventLoop

Node 的执行模型也是事件循环，在进程启动的时候，Node 便会创建一个类似 while(true) 的循环，每执行一次循环体的过程我们称为 Tick。每个 Tick 的过程就是查看是否有事件在处理，如果有，就取出事件及其相关的回调函数。如果存在关联的回调函数，就执行它们。然后进入下一个循环，如果不再有事件处理，就退出进程。

### 三个关键阶段

1. 执行 定时器回调 的阶段。检查定时器，如果到了时间，就执行回调。这些定时器就是 setTimeout、setInterval。这个阶段暂且叫它 timer。

2. 轮询(英文叫 poll)阶段。因为在 node 代码中难免会有异步操作，比如文件 I/O，网络 I/O 等等，那么当这些异步操作做完了，就会来通知 JS 主线程，怎么通知呢？就是通过'data'、 'connect'等事件使得事件循环到达 poll 阶段。到达了这个阶段后:

如果当前已经存在定时器，而且有定时器到时间了，拿出来执行，eventLoop 将回到 timer 阶段。

如果没有定时器, 会去看回调函数队列。

- 如果队列不为空，拿出队列中的方法依次执行
- 如果队列为空，检查是否有 setImmdiate 的回调
  - 有则前往 check 阶段(下面会说)
  - 没有则继续等待，相当于阻塞了一段时间(阻塞时间是有上限的), 等待 callback 函数加入队列，加入后会立刻执行。一段时间后自动进入 check 阶段。

3. check 阶段。这是一个比较简单的阶段，直接执行 setImmdiate 的回调。

这三个阶段为一个循环过程。不过现在的 eventLoop 并不完整，我们现在就来一一地完善。

### 完善

首先，当第 1 阶段结束后，可能并不会立即等待到异步事件的响应，这时候 nodejs 会进入到 I/O 异常的回调阶段。比如说 TCP 连接遇到 ECONNREFUSED，就会在这个时候执行回调。

并且在 check 阶段结束后还会进入到 关闭事件的回调阶段。如果一个 socket 或句柄（handle）被突然关闭，例如 socket.destroy()， 'close' 事件的回调就会在这个阶段执行。

梳理一下，nodejs 的 eventLoop 分为下面的几个阶段:

1. timer 阶段

2. I/O 异常回调阶段

3. 空闲、预备状态(第 2 阶段结束，poll 未触发之前)

4. poll 阶段

5. check 阶段

6. 关闭事件的回调阶段

是不是清晰了许多？

### nodejs 和 浏览器关于 eventLoop 的主要区别

两者最主要的区别在于浏览器中的微任务是在每个相应的宏任务中执行的，而 nodejs 中的微任务是在不同阶段之间执行的。

### 关于 process.nextTick 的一点说明

process.nextTick 是一个独立于 eventLoop 的任务队列。

在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务优先于微任务执行。

### process.nextTick() 和 setImmediate()

process.nextTick() 的回调保存在一个数组中，setImmediate() 的结果则是保存在链表中。
在行为上，process.nextTick() 在每轮循环中会将数组中的回调函数全部执行完，而 setImmediate（）在每轮循环中执行链表中的一个回调函数。

## 参考

[习题](https://www.jianshu.com/p/2d896f96c179)

[NodeJS 事件循环](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
