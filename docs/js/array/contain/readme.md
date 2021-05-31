# 判断数组中是否存在某值

## 1. array.indexOf

此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1。

```js
const arr = ['西瓜', '香蕉', '苹果', '梨', '菠萝']

console.log(arr.indexOf('西瓜')) // 0
```

## 2. array.includes

此方法判断数组中是否存在某个值，如果存在返回 true，否则返回 false

```js
const arr = ['西瓜', '香蕉', '苹果', '梨', '菠萝']

console.log(arr.includes('西瓜')) // true
```

## 3. array.find

返回数组中满足条件的第一个元素的值，如果没有，返回 undefined

```js
const arr = [1, 2, 3, 4, 5]

console.log(arr.find((item) => item >= 4)) // 4
```

## 4. array.findIndex

返回数组中满足条件的第一个元素的下标，如果没有找到，返回-1

```js
const arr = [1, 2, 3, 4, 5]

console.log(arr.findIndex((item) => item >= 4)) // 3
```
