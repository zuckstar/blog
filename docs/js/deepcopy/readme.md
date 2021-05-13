# 深浅拷贝

## 浅拷贝

### 数组的 slice 方法

```js
const arr = [1, 2, 3, 4, 5, 6]
const newArr = arr.slice() // [1, 2, 3, 4, 5, 6]
```

### 数组的 concat 方法

```js
const arr = [1, 2, 3, 4, 5, 6]
const newArr = arr.concat() // [1, 2, 3, 4, 5, 6]
```

### 展开运算符

```js
const arr = [1, 2, 3, 4, 5, 6]
const newArr = [...arr] //跟arr.slice()是一样的效果
```

### Object.assign

Object.assgin() 拷贝的是对象的属性的引用，而不是对象本身。

```js
let obj = { name: 'sy', age: 18, attrs: { sex: '男' } }
let obj2 = Object.assign({}, obj)

obj2.attrs.sex = '女'

console.log(obj.attrs.sex) // 女
```

### 手写一个浅拷贝

```js
const shallowClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    // 判断目标是一个数组还是一个对象
    const cloneTarget = Array.isArray(target) ? [] : {}

    // 遍历一个对象的所有自身属性, 忽略掉继承属性
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop]
      }
    }

    return cloneTarget
  } else {
    // 非对象类型直接返回值本身
    return target
  }
}
```

### 浅拷贝的限制

```js
let arr = [1, 2, 3, {}]
let arr1 = arr.slice()
arr1[3].name = 'abc'

console.log(arr) // [1, 2, 3, {name: 'abc'}]
```

浅拷贝的限制: 它只能拷贝一层对象。如果有对象的嵌套，那么浅拷贝将无能为力。
如果修改新数组中对象的值，原数组中对象的值也会发生变化。有时候我们希望新拷贝的引用对象不影响原来的对象，显然浅拷贝无法做到。
但幸运的是，深拷贝就是为了解决这个问题而生的，它能解决无限极的对象嵌套问题，实现彻底的拷贝。

## 深拷贝

### JSON 对象

```js
JSON.parse(JSON.stringify())
```

JSON 拷贝大法的问题

1. 无法解决循环引用的问题

```js
let obj = { val: 2 }
obj.target = obj

let copyObj = JSON.parse(JSON.stringify(obj))
/*

拷贝的时候报错，报系统栈溢出，因为对象存在循环引用的问题

VM2370:1 Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property 'target' closes the circle
    at JSON.stringify (<anonymous>)
    at <anonymous>:1:25
(anonymous) @ VM2370:1
*/
```

2. 无法拷贝函数（重点）

丢失函数属性

```js
let obj = { name: 'function', value: function() {} }

let newObj = JSON.parse(JSON.stringify(obj))

newObj // {name: "function"}
```

### 一步一步手写深拷贝代码

一：完成简版拷贝

```js
const deepClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {}
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop]) // 递归拷贝
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

二：解决循环引用

```js
const isObject = (target) => {
  typeof target === 'object' || typeof target !== null
}

// 利用 WeakMap 对 target 构成弱引用
const deepClone = (target, map = new WeakMap()) => {
  // 如果已经拷贝过该对象，则直接返回
  if (map.get(target)) return target

  if (isObject(target)) {
    map.set(target, true)
    const cloneTarget = Array.isArray(target) ? [] : {}
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map)
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

三、拷贝特殊对象

```js
// 判断是否是基本数据类型
const isPrimitive = (value) => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'undefined' ||
    value === null
  )
}

// 判断是否是一个对象
const isObject = (target) => {
  typeof target === 'object' || typeof target !== null
}

const getType = (target) => Object.prototype.toString.call(target)

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
}

const deepClone = (target, map = new WeakMap()) => {
  // 处理基本值
  if (isPrimitive(target)) {
    return target
  }

  let type = getType(target)

  let cloneTarget

  if (!canTraverse[type]) {
    // 处理不能迭代遍历的对象(扩展)
    handleNotTraverse(target, type)
    return
  } else {
    // 保证对象的原型不丢失
    let ctor = target.prototype
    cloneTarget = new ctor()
  }

  // 如果已经拷贝过该对象，则直接返回
  if (map.get(target)) return target

  map.set(target, true)

  if (type === '[object Map]') {
    // 处理 Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map))
    })
  }

  if (type === '[object Set]') {
    // 处理 Set
    target.forEach((item) => {
      target.add(deepClone(item, map))
    })
  }

  // 处理数组和对象, 可以被 for...in 遍历，而 Map 和 Set 不能
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = deepClone(target[prop], map)
    }
  }

  return cloneTarget
}
```

四、处理不能被迭代的对象（扩展）

```js
const mapTag = '[object Map]'
const setTag = '[object Set]'
const boolTag = '[object Boolean]'
const numberTag = '[object Number]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const regexpTag = '[object RegExp]'
const funcTag = '[object Function]'

// 处理函数
const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if (!func.prototype) return func
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcString = func.toString()
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString)
  const body = bodyReg.exec(funcString)
  if (!body) return null
  if (param) {
    const paramArr = param[0].split(',')
    return new Function(...paramArr, body[0])
  } else {
    return new Function(body[0])
  }
}

// 处理正则表达式
const handleRegExp = (target) => {
  const { source, flags } = target
  return new target.constructor(source, flags)
}

const handleNotTraverse = (target, type) => {
  const Ctor = target.constructor
  switch (tag) {
    case boolTag:
      return new Object(Boolean.prototype.valueOf.call(target))
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target))
    case stringTag:
      return new Object(String.prototype.valueOf.call(target))
    case symbolTag:
      return new Object(Symbol.prototype.valueOf.call(target))
    case errorTag:
    case dateTag:
      return new Ctor(target)
    case regexpTag:
      return handleRegExp(target)
    case funcTag:
      return handleFunc(target)
    default:
      return new Ctor(target)
  }
}
```

## 序列化对象

### 思路

1. 区分基本数据类型和对象

2. 基本数据类型调用 toString 方法转成字符串

3. 普通对象/数组对象中 null 返回 null，其他对象遍历属性转成字符串进行对象拼接（涉及深拷贝）

4. 特殊对象进行特殊处理

简单实现

```js
const isObject = (target) => {
  typeof target === 'object' || typeof target !== null
}

const json2str = (target) => {
  let arr = []
  const isArray = (target) => {
    return Array.isArray(target)
  }
  const fmt = function(s) {
    if (typeof s == 'object' && s !== null) return json2str(s)
    return /^(string)$/.test(typeof s) ? `"${s}"` : s
  }

  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      if (isArray(target)) {
        arr.push(`${fmt(target[prop])}`)
      } else {
        arr.push(`"${prop}":${fmt(target[prop])}`)
      }
    }
  }

  if (!isArray(target)) return `{${arr.join(',')}}`
  else return `[${arr.join(',')}]`
}
```

## 判断两个对象是否相等

```js
const deepEqual = function(x, y) {
  // 两个对象指向同一内存 , 包括 null，基本变量
  if (x === y) {
    return true
  } else if (
    typeof x === 'object' &&
    typeof y === 'object' &&
    x !== null &&
    y !== null
  ) {
    // x, y 皆为非 null 的对象

    // 属性个数不符合
    if (Object.keyes(x).length !== Object.keys(y).length) return false

    // 对 x 逐个遍历
    for (let prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false // 递归进行深度比较
      } else {
        return false
      }
    }

    return true
  }

  return false
}
```

实现代码中，以下边界情况无法处理：

其中某个属性本身是一个对象
某个属性的值为 NaN
一个对象的属性的值为 undefined，另一个对象中没有这个属性

## 参考文章

[ 能不能写一个完整的深拷贝？](http://47.98.159.95/my_blog/blogs/javascript/js-api/005.html#_1-%E7%AE%80%E6%98%93%E7%89%88%E5%8F%8A%E9%97%AE%E9%A2%98)
