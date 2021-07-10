
function callName(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(name)
      resolve(name)
    }, 1000);
  })
}

// 事先定义好异步函数执行的顺序
function* gen () {
  yield callName("a")
  yield callName("b")
  yield callName("c")
}

const g = gen()


function run (gen) {
  const next = (value) => {
    console.log(value) // 拿到上次异步执行的结果
    const res = gen.next()
    if (res.done) return // 停止
    res.value.then((value) => {
      next(value) // resovle函数
    }) // 传递回调函数，进行递归
  }
  next()
}

run(g)