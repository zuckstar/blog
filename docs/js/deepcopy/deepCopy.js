// 对象深拷贝完整版

// 第一种，最简单的方式
// 存在的问题1：无法解决循环引用的问题
// 存在的问题2：无法拷贝特殊的对象 RegExp, Date, Map, Set
// 存在的问题3：无法拷贝对象身上的函数属性

const deepClone = (target) => {
  return JSON.parse(JSON.stringify(target))
}

// 第二种：基本的深拷贝
// 1. 解决数组和对象的深拷贝
// 2. 解决循环引用的问题
// 3. 解决原型继承的问题
// 4. 解决特殊对象拷贝的问题

const isObject = (obj) => {
  return typeof obj === 'object' && obj !== null
}

const isPrimitive = (value) => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint' ||
    value === null
  )
}

const isFunction = (fn) => {
  return typeof fn === 'function'
}

const isMap = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Map]'
}

const isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]'
}

const deepCloneBase = function(target, map = new WeakMap()) {
  let existobj = map.get(target)

  if (existobj) return existobj

  if (isPrimitive(target)) {
    return target
  }

  if (isObject(target)) {
    let ctor = target.__proto__.constructor

    const cloneTarget = new ctor()

    map.set(target, cloneTarget)

    if (isMap(target)) {
      // 处理 map 数据结构
      target.forEach((item, key) => {
        cloneTarget.set(deepCloneBase(key, map), deepCloneBase(item, map))
      })
    } else if (isSet(target)) {
      // 处理 set 数据结构
      target.forEach((item) => {
        cloneTarget.add(deepCloneBase(item, map))
      })
    } else {
      // 处理对象和数组
      for (let key in target) {
        if (target.hasOwnProperty(key)) {
          cloneTarget[key] = deepCloneBase(target[key], map)
        }
      }
    }

    return cloneTarget
  }

  if (isFunction(target)) {
    return cloneFunc(target)
  }
}

// test area

let b1 = {
  name: 'w',
}

let testData = {
  a1: 123,
  a2: 456,
  a3: [1, 2, 3, 4, 5],
  a4: b1,
  a5: b1,
  a7: new Set([1, 2, 3, 3, 3]),
}

testData.a6 = testData

let c = deepCloneBase(testData)

b1.name = 'wo'

console.log(c)

console.log(c.a7.has(3))
