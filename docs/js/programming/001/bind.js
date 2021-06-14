// bind

Function.prototype.bind = function () {

  let args = Array.prototype.slice.call(arguments)

  let t = args.shift() // 即上下文 context

  let self = this

  return function () {

    let innerArgs = Array.prototype.slice.call(arguments)

    return self.apply(t, args.concat(innerArgs))
  }

}

function fn1 (a, b, c) {
  console.log('this', this)
  console.log(a, b, c)
  return 'this is fn1'
}

console.log(fn1(11, 22, 33))

const fn2 = fn1.bind({ x: 100 }, 10, 20, 30)
console.log(fn2())