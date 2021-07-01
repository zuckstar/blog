Function.prototype.uncurrying = function () {
  let self = this // 拿到当前函数
  return function () {
    let obj = Array.prototype.shift.call(arguments)
    return self.apply(obj, arguments) // 当前函数给传入的 obj 这个对象执行
  }
}

// const push = Array.prototype.push.uncurrying()

// function aaa() {
//   push(arguments, 4)
//   console.log(arguments)
// }


// aaa(1, 2, 3)


var shift = Array.prototype.shift.uncurrying()

var obj = {
  length: 3,
  0: 1,
  1: 2,
  2: 3
}

var first = shift(obj)

console.log(first)