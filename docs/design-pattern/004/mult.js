let mult = function() {
  console.log('开始计算乘积')
  let a = 1
  let args = Array.from(arguments)
  for (let num of args) {
    a = a * num
  }
  return a
}

let proxyMult = (function() {
  let cache = {}

  return function() {
    let args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = mult.apply(this, arguments))
  }
})()

console.log(proxyMult(1, 2, 3, 4))
console.log(proxyMult(1, 2, 3, 4))
