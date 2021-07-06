function Promise(fn) {
  this.cbs = [] // 内部的函数回调队列

  const resolve = (value) => {
    setTimeout(() => { // 微任务执行
      this.data = value 
      this.cbs.forEach((cb) => cb(value)) 
    });
  }

  fn(resolve)
}


Promise.prototype.then = function (onResolve) {

  // onResolve 用户传进来的 onResolve 方法

  return new Promise((resolve) => { // 支持链式调用

    // 注册 then 方法的回调
    this.cbs.push(() => {
      const res = onResolve(this.data) // 拿到用户执行回调的结果
      if (res instanceof Promise) { 
        res.then(resolve) // 如果是 Promise 则把 resovle 的能力交给用户
      } else {
        resolve(res)
      }
    })
  })
}

