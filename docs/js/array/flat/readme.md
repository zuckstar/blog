# 数组扁平化

对于前端项目开发过程中，偶尔会出现层叠数据结构的数组，我们需要将多层级数组转化为一级数组（即提取嵌套数组元素最终合并为一个数组），使其内容合并且展开。那么该如何去实现呢？

需求:多维数组=>一维数组

```js
let array = [1, [2, [3, [4, 5]]], 6] // -> [1, 2, 3, 4, 5, 6]
```

## 1. 调用 ES6 中的 flat 方法

### 介绍

flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

### 语法

var newArray = arr.flat([depth])

```js
array.flat(Infinity) // (6) [1, 2, 3, 4, 5, 6]
```

## 2. 转换成字符串后进行处理的方法

### replace + split

利用 replace 方法替换掉字符串中的 "[" 和 "]" 字符，然后再用 split 方法切割字符串生成新的数组

```js
let str = JSON.stringify(array)
let ary = str.replace(/(\[|\])/g, '').split(',')
```

### replace + JSON.parse

```js
let str = JSON.stringify(array)
str = str.replace(/(\[|\]))/g, '')
str = '[' + str + ']'
let ary = JSON.parse(str)
```

与上述方法同理，只不过生成数组用了 JSON.parse 来解析字符串

### 3. 递归

```js
let array = [1, [2, [3, [4, 5]]], 6]

let result = []

let fn = function(array) {
  for (let i = 0; i < array.length; i++) {
    let item = array[i]

    if (Array.isArray(item)) {
      fn(item)
    } else {
      result.push(item)
    }
  }
}

fn(array)

console.log(result) // [ 1, 2, 3, 4, 5, 6 ]
```

### 4.使用 reduce 函数进行迭代

```js
let fn2 = function(array) {
  return array.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? fn2(cur) : cur)
  }, [])
}

console.log(fn2(array)) // [ 1, 2, 3, 4, 5, 6 ]
```

和解法三类似，不过是用了数组的 reduce 方法，迭代更方便

### 5. 使用数组 some 函数 + 扩展运算符

```js
while (array.some(Array.isArray)) {
  array = [].concat(...array)
}

console.log(array) // [ 1, 2, 3, 4, 5, 6 ]
```

## 参考

[Array.prototype.flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
