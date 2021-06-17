function flatter(arr) {
  let str = JSON.stringify(arr)
  
  str = str.replace(/(\[|\])/g, '')

  return JSON.parse(`[${str}]`)
}

console.log(flatter([1, [2, [3, 4]]]))


function  flatter2(arr) {
  let res = []

  for (let item of arr) {
    if (Array.isArray(item)) {
      let _ary = flatter2(item)
      res.push(..._ary)
    } else {
      res.push(item)
    }
  }

  return res
}

console.log(flatter2([1, [2, [3, [4, 5]]], 6]))