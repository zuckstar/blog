// 对象深拷贝，简易版

function deepClone (obj) {
  if (typeof obj === 'object' && typeof obj !== null) {
    if (Array.isArray(obj)) {

      let array = []

      for (let i = 0; i < obj.length; i++) {
        array.push(deepClone(obj[i]))
      }

      return array
    } else {
      let newObj = {}
      for (let key in obj) {
        // 判断自身中是否包含自身属性而不是继承的属性
        if (obj.hasOwnProperty(key)) {
          newObj[key] = deepClone(obj[key])
        }
      }
      return newObj
    }
  } else {
    return obj
  }
}

let o = { a: 1, d: { c: '4' } };

const res = deepClone(o);
console.log(res);
console.log(res == o);