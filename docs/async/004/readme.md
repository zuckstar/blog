# Promise 系列(一)：Promise 是如何消除回调地狱的?

## 什么是回调地狱？

1. 多层嵌套的问题。

2. 每种任务的处理结果存在两种可能性（成功或失败），那么需要在每种任务执行结束后分别处理这两种可能性。

这两种问题在回调函数时代尤为突出。Promise 的诞生就是为了解决这两个问题。

## 解决方案

Promise 利用了三大技术手段来解决回调地狱:

- 回调函数延迟绑定
- 返回值穿透。
- 错误冒泡。

### 回调函数延迟绑定

```js
let readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
readFilePromise('1.json').then((data) => {
  return readFilePromise('2.json')
})
```

从上述例子可以看到，回调函数不是直接声明的，而是在通过后面的 then 方法传入的，即延迟传入。这就是回调函数延迟绑定。

### 返回值穿透

然后我们做以下微调:

```js
let x = readFilePromise('1.json').then((data) => {
  return readFilePromise('2.json') //这是返回的Promise
})
x.then(/* 内部逻辑省略 */)
```

我们会根据 then 中回调函数的传入值创建不同类型的 Promise, 然后把返回的 Promise 穿透到外层, 以供后续的调用。这里的 x 指的就是内部返回的 Promise，然后在 x 后面可以依次完成链式调用。

这便是返回值穿透的效果。

这两种技术一起作用便可以将深层的嵌套回调写成下面的形式:

```js
readFilePromise('1.json')
  .then((data) => {
    return readFilePromise('2.json')
  })
  .then((data) => {
    return readFilePromise('3.json')
  })
  .then((data) => {
    return readFilePromise('4.json')
  })
```

这样就显得清爽了许多，更重要的是，它更符合人的线性思维模式，开发体验也更好。

两种技术结合产生了链式调用的效果。

### 错误冒泡

这解决的是多层嵌套的问题，那另一个问题，即每次任务执行结束后分别处理成功和失败的情况怎么解决的呢？

Promise 采用了错误冒泡的方式。其实很简单理解，我们来看看使用例子：

```js
readFilePromise('1.json')
  .then((data) => {
    return readFilePromise('2.json')
  })
  .then((data) => {
    return readFilePromise('3.json')
  })
  .then((data) => {
    return readFilePromise('4.json')
  })
  .catch((err) => {
    // xxx
  })
```

这样前面产生的错误会一直向后传递，被 catch 接收到，就不用频繁地检查错误了。

## 总结

- 1、 实现链式调用，解决多层嵌套问题
- 2、 实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题
