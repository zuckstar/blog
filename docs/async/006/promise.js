// 构造函数

function Promise (fn) {
  this.cbs = []

  const resolve = (value) => {
    setTimeout(() => {
      this.data = value
      this.cbs.forEach(cb => {
        cb(value)
      })
    }, 0);
  }

  fn(resolve)
}

Promise.prototype.then = function (onResolved) {
  return new Promise((resolve) => {
    
    this.cbs.push(() => {
      const res = onResolved(this.data)

      if (res instanceof Promise) {
        res.then(resolve)
      } else {
        resolve(res)
      }
    })

  })
}