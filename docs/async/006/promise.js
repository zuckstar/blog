// 构造函数

function Promise (fn) {
  this.cbs = [] // cbs 的作用就是要是当前 promise 对象注册了多个 then 方法，需要按序执行 cbs

  const resolve = (value) => {
    setTimeout(() => {
      this.data = value
      this.cbs.forEach((cb)=>cb(value))
    }, 0);
  }
 
  fn(resolve)
}

Promise.prototype.then = function (onResolved) {
  return new Promise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data) // 注册的回调方法
      if (res instanceof Promise) {
        res.then(resolve)
      } else {
        resolve(res)
      }
    })
  })
}