let mult = function() {
  console.log('计算乘积')

  let a = 1
  let args = Array.from(arguments)

  for (let num of args) {
    a *= num
  }
  return a
}

let plus = function() {
  console.log('计算总和')

  let a = 0
  let args = Array.from(arguments)

  for (let num of args) {
    a += num
  }

  return a
}

let createProxyFactory = function(fn) {
  let cache = []
  return function() {
    let args = Array.prototype.join.call(arguments, ',')

    if (args in cache) {
      return cache[args]
    }

    return (cache[args] = fn.apply(this, arguments))
  }
}

let proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus)

console.log(proxyMult(1, 2, 3, 4))
console.log(proxyMult(1, 2, 3, 4))
console.log(proxyPlus(1, 2, 3, 4))
console.log(proxyPlus(1, 2, 3, 4))
