let array = [1, [2, [3, [4, 5]]], 6]


let result = []


let fn = function (array) {
  for (let i = 0; i < array.length; i++) {
    let item = array[i]
  
    if (Array.isArray(item)) {
      fn(item)
    } else {
      result.push(item)
    }
  }
}


let fn2 = function (array) {
  return array.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? fn2(cur) : cur)
  }, [])
}

while (array.some(Array.isArray)) {
  array = [].concat(...array)
}

console.log((array))