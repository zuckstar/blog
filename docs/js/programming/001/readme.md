# JS 编程练习题（一）

### 手写 bind 函数

```js

Function.prototype.bind = function () {

  if(typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
  }

  const args = Array.prototype.slice(arguments)

  const t = args.shift()

  const self = this

  return function () {
    const innerArgs = arguments

    return self.apply(t, args.concat(innerArgs))
  }
}

```
### 手写 new 函数

```js
function newFunc (ctor, ...args) {

  if(typeof this !== 'function') {
    throw new TypeError('newOperator function the first param must be a function')
  }

  let obj = {}

  obj.__proto__ = ctor.prototype // 原型继承

  let res = ctor.apply(obj, args) // 拷贝属性方法

  let isObject = typeof res === 'object' && typeof res !== null

  return isObject ? res : obj
}
```