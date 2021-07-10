Promise.prototype.all = function (arrs) {
  return new Promise((resolve, reject) => {
    const res = []
    let count = 0

    const innerResolved = (data, index) => {
      res[index] = data
      count++
      if (count === arrs.length) {
        resolve(res)
      }
    }

    for (let i = 0; i < arrs.length; i++) {
      Promise.resolve(arrs[i]).then((data) => {
        innerResolved(data, i)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

Promise.prototype.race = function (arrs) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arrs.length; i++) {
      Promise.resolve(arrs[i]).then((data) => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000);
})

let promis2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 500);
})

Promise.all([promise1, promis2]).then(res => {
  console.log(res)
})

Promise.race([promise1, promis2]).then(res => {
  console.log(res)
})