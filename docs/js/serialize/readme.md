# 序列化对象

## 思路

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