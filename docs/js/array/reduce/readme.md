# Array.prototype.reduce()

## reduce 方法

### 常规用法

reduce() 方法对数组中的每个元素执行一个由用户提供的 reducer 函数，将其结果汇总为单个返回值。

```js
const array1 = [1, 2, 3, 4]

const reducer = (accumulator, currentValue) => accumulator + currentValue

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer))
// expected output: 10
```

### 参数说明

语法: array.reduce(function(accumulator, currentValue, currentIndex, arr), initialValue)
reduce() 方法传入两个参数:
第一个参数为一个函数。必须值

第一个参数传入的函数有 4 个参数：

- 1.accumulator 必需。初始值, 或者计算结束后的返回值。
- 2.currentValue 必需。当前元素的值。
- 3.currentIndex 可选。当前元素的索引，元素索引从 1 开始！
- 4.arr 可选。当前元素所属的数组对象。

```js
const array1 = [1, 2, 3, 4]

const reducer = (accumulator, currentValue, index) => {
  console.log(
    '执行了第' + index + '次,accumulator=' + accumulator + ' currentValue=',
    currentValue
  )
  return 'a'
}

let ret = array1.reduce(reducer) // "a"

// index 索引从 1 开始
// Output:
// 执行了第1次,accumulator=1 currentValue= 2
// 执行了第2次,accumulator=a currentValue= 3
// 执行了第3次,accumulator=a currentValue= 4
```

由上述代码可知，数组遍历中每一次的 accumulator 的值，均为上一次遍历中返回的结果。而 accumulator 的初始的值已经被固定，是数组的第一个元素。而最终返回的结果也是最后一次遍历中返回的值。例如这里就是返回一个“a”。

如果数组只有一个元素，reducer 不会被执行，reduce 方法直接返回数组的第一个元素

```js
const array1 = [1]

const reducer = (accumulator, currentValue, index) => {
  console.log(
    '执行了第' + index + '次,accumulator=' + accumulator + 'currentValue=',
    currentValue
  )
  return 9
}

let ret = array1.reduce(reducer)
console.log(ret) // Output: 1
```

如果数组为空则直接报错，提示数组没有初始值（首元素），也就是无法为 accumulator 赋予初值。

```js
const array1 = []

const reducer = (accumulator, currentValue, index) => {
  return 1
}

let ret = array1.reduce(reducer)
// Uncaught TypeError: Reduce of empty array with no initial value
```

第二个参数为一个初始值 initValue。可选值。
reduce 方法在有第二个参数 initValue 的情况下，此时传入的 initValue 就充当了原来数组中的首元素的作用，初始的 accumulator 值被赋予为 initValue, 而不是数组的首元素，如果此时数组为空，也不会报错，会直接返回 initValue 的值。同时数组的 index 序号从 0 开始，数组的第一个元素也参与 reduce 计算。迭代执行的总次数为数组的元素个数。

```js
const array1 = [1, 2, 3, 4]

const reducer = (accumulator, currentValue, index) => {
  console.log('acc=' + accumulator + ' cur=' + currentValue + ' index=' + index)
  return accumulator + currentValue
}

let ret = array1.reduce(reducer, 5)
console.log(ret)

// acc=5 cur=1 index=0
// acc=6 cur=2 index=1
// acc=8 cur=3 index=2
// acc=11 cur=4 index=3
// 15
```

## 手写实现数组的 reduce 方法

```js
Array.prototype.reduce = function(callbackFn, initialValue) {
  // 处理异常数组类型
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null or undefined")
  }

  // 处理异常回调函数
  if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
    throw new TypeError(callbackFn + 'is not a function')
  }

  let O = Object(this) // 转成对象
  let len = O.length >>> 0
  let k = 0

  let accumulator = initialValue // 初始化初始值

  if (accumulator === undefined) {
    // 不传 initialValue 需要主动找到初始值
    for (; k < len; k++) {
      if (k in O) {
        accumulator = O[k]
        k++
        break
      }
    }

    if (accumulator === undefined) {
      throw new Error('Each element of the array is empty')
    }
  }
  for (; k < len; k++) {
    if (k in O) {
      accumulator = callbackFn.call(undefined, accumulator, O[k], k, O)
    }
  }
  return accumulator
}
```
