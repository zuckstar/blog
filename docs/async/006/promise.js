
class Promise {
  constructor(executor) {

    // 初始化内部状态
    this.status = Promise.PENDING
    this.value = null  // fulfilled 状态的时候，返回的信息
    this.reason = null // rejected 状态的时候，拒绝的原因
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    
    this.bindThis()

    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  bindThis () {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve (value) {
    const that = this
    setTimeout(() => {
      // 变成其他状态了就不再继续执行方法了
      if (that.status !== Promise.PENDING) return
      that.status = Promise.FULFILLED
      that.value = value
      that.onFulfilledCallbacks.forEach(cb => cb(that.value))
    });
  }


  reject (reason) {

    const that = this
    
    setTimeout(() => {
      // 变成其他状态了就不再继续执行方法了
      if (that.status !== Promise.PENDING) return
      that.status = Promise.REJECTED
      that.reason = reason
      that.onRejectedCallbacks.forEach(cb => cb(that.reason))
    });
  }


  then (onFulfilled, onRejected) {
    let newPromise
    let that = this

    // 处理参数默认值
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason
    }


    if (that.status === Promise.FULFILLED) {
      return newPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulfilled(that.value)
            Promise.resolvePromise(newPromise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        });
      })
    }

    if (that.status === Promise.REJECTED) {
      return newPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(that.value)
            Promise.resolvePromise(newPromise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        });
      })
    }


    if (that.status === Promise.PENDING) {
      return newPromise = new Promise((resolve, reject) => {
        that.onFulfilledCallbacks.push((value) => {
          try {
            let x = onFulfilled(value);
            Promise.resolvePromise(newPromise, x, resolve, reject);
          } catch(e) {
              reject(e);
          }
        })
        that.onRejectedCallbacks.push((reason) => {
          try {
            let x = onRejected(reason);
            Promise.resolvePromise(newPromise, x, resolve, reject);
          } catch(e) {
            reject(e);
          }
        })
      })
    }
  }

  catch (onRejected) {
    return this.then(null, onRejected)
  }
}


// 定义 promise 的三种状态
Promise.PENDING = "pending" // 进行中
Promise.FULFILLED = "fulfilled" // 成功
Promise.REJECTED = "rejected" // 失败
Promise.resolvePromise =  function (promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环引用'))
  }

  let called = false

  if (x instanceof Promise) {
    if (x.status === Promise.PENDING) {
      x.then(y => {
        Promise.resolvePromise(promise2, y, resolve, reject)
      }, reason => {
        reject(reason)
      })
    } else {
      x.then(resolve, reject)
    }
  } else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true
          Promise.resolvePromise(promise2, y, resolve, reject)
        }, reason => {
          if (called) return;
          called = true
          reject(reason)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return;
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.deferred = function() { // 延迟对象
  let defer = {};
  defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
  });
  return defer;
}

Promise.resolve = function (value) {
  return new Promise(resolve => {
      resolve(value);
  });
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
      reject(reason);
  });
}


module.exports = Promise