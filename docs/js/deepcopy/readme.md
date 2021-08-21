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

2. 无法拷贝一些特殊的对象，诸如 RegExp,Date,Set,Map等


3. 无法拷贝函数（重点）

丢失函数属性

```js
let obj = { name: 'function', value: function() {} }

let newObj = JSON.parse(JSON.stringify(obj))

newObj // {name: "function"}
```

4. 原型丢失的情况

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

const deepCloneBase = function(target, map = new WeakMap()) {
  let existobj = map.get(target)

  if (existobj) return existobj

  if (isPrimitive(target)) {
    return target
  }

  if (isObject(target)) {
    const cloneTarget = Array.isArray(target) ? [] : {}

    map.set(target, cloneTarget)

    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = deepCloneBase(target[key], map)
      }
    }
    return cloneTarget
  }
}
```

三、拷贝特殊对象

```js
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



## 参考文章

[ 能不能写一个完整的深拷贝？](http://47.98.159.95/my_blog/blogs/javascript/js-api/005.html#_1-%E7%AE%80%E6%98%93%E7%89%88%E5%8F%8A%E9%97%AE%E9%A2%98)
