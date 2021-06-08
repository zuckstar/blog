

const logTime = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(name)
    }, 1000);
  })
}

const gen = function* () {
  const data1 = yield logTime('001.txt')
  console.log(data1)
  const data2 = yield logTime('002.txt')
  console.log(data2)
}

let g = gen()

function getGenPromise (gen, data) {
  return gen.next(data).value
}


// getGenPromise(g).then((data1) => {
//   return getGenPromise(g, data1)
// }).then(data2 => {
//   return getGenPromise(g, data2)
// })

function run(g) {
  const next = (data) => {
    let res = g.next(data)
    if (res.done) return
    res.value.then((data) => {
      next(data)
    })
  }
  next()
}

run(g)