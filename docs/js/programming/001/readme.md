# JS 编程练习题（一）

### 1. 手写 bind 函数

```js
Function.prototype.bind = function() {

  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
  }

  const args = Array.prototype.slice(arguments)

  const t = args.shift() // 拿到 bind 的对象

  const self = this

  return function() {
    const innerArgs = arguments

    return self.apply(t, args.concat(innerArgs)) // 执行
  }
}
```

### 2. 手写 new 函数

```js
function newFunc(ctor, ...args) {

  if (typeof this !== 'function') {
    throw new TypeError('newOperator function the first param must be a function')
  }

  let obj = {}

  obj.__proto__ = ctor.prototype // 原型继承

  let res = ctor.apply(obj, args) // 拷贝属性方法

  let isObject = typeof res === 'object' && typeof res !== null

  return isObject ? res : obj
}
```

### 3. 防抖

```js
// 普通版
function debounce(fn, delay) {
  let timer = null

  return function(...args) {
    let context = this

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay);
  }
}

// 立即执行版
function debounceImmediate(fn, delay) {
  let timer = null
  let flag = true

  return function(...args) {
    let context = this

    if (flag) {
      fn.apply(context, args)
      flag = false
    }

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      flag = true
    }, delay);
  }
}
```

### 4. 节流

```js
function throttle(fn, delay) {
  let flag = false

  return function(...args) {
    let context = this

    if (flag) return;

    flag = true

    setTimeout(() => {
      fn.apply(context, args)
      flag = false
    }, delay);
  }
}

// 立即执行版
function throttleImmediate(fn, delay) {
  let flag = true
  return function(...args) {
    let context = this

    if (flag) {
      fn.apply(context, args)

      flag = false

      setTimeout(() => {
        flag = true
      }, delay);
    }
  }
}
```

### 5. 数组扁平化

字符串处理法

```js
function flatter(arr) {
  let str = JSON.stringify(arr)

  str = str.replace(/(\[|\])/g, '')

  return JSON.parse(`[${str}]`)
}
```

flat 法

```js
array.flat(Infinity)
```

递归法

```js
function flatter(arr) {
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
```

### 6. URL 拆解

URL拆解1（实现一个函数，可以对 url 中的 query 部分做拆解，返回一个 key: value 形式的 object ）：

```js
function getParams(url) {
  let search = url.split('?')[1]
  let arr = search ? search.split('#')[0].split('&') : []

  const res = {}

  arr.forEach(e => {
    const [key, value] = e.split('=')

    if (value) {
      res[key] = value
    } else {
      res[key] = ''
    }
  });

  return res
}
```

URL拆解2：

实现一个 parseParam 函数，将 url 转化为指定结果：

1. 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
2. 中文需解码
3. 未指定值的 key 与约定为 true

```JS
function parseParam(url) {
  let search = url.split('?')[1]
  let arr = search ? search.split('#')[0].split('&') : []

  const res = {}

  arr.forEach(e => {
    const [key, value] = e.split('=')

    if (value == undefined) {
      res[key] = true
    } else if (key in res) {
      Array.isArray(res[key]) ? res[key].push(value) : res[key] = [res[key], value]
    } else {
      res[key] = decodeURI(value)
    }
  })

  return res
}
```

### 7. 手写快排

```js
const quickSort = (arr, left, right) => {
  // 指针遍历结束，或者指向同一个元素，则直接返回当前数组
  if(left >= right) {
    return arr
  }

  let i = left,
      j = right,
      pivot = arr[left] // 基准值

  while(i < j) {
    while(i < j && arr[j] >= pivot) j--  // 从右向左，当前指针元素大于基准值则左移
    while(i < j && arr[i] <= pivot) i++  // 从左向右，当前指针元素小于基准值则右移

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  // 基准值归位
  arr[left] = arr[i]
  arr[i] = pivot

  quickSort(arr, left, i - 1)
  quickSort(arr, i+1, right)
  return arr
}
```

### 8. 将 HTTP header 转换成 js 对象

```js
const solution = (s) => {
  let res = {}

  let arr = s.split('\n')

  arr.forEach(element => {
    let tmp = element.split(': ');
    res[tmp[0]] = tmp[1]
  });

  return res
}
```

### 9. 冒泡排序

```js
function bubbleSort (ary) {
  let len = ary.length

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (ary[j] > ary[j + 1]) { // 因为这里是 j+1 所以上述的终止条件 len - 1 就足够
        [ary[j], ary[j+1]] = [ary[j+1], ary[j]]
      }
    }
  }
  return ary
}
```

### 10. 选择排序

```js
  let len = ary.length

  for (let i = 0; i < len; i++) {
    let idx = i
    
    // 每次找到一个最小值
    for (let j = i + 1; j < len; j++) {
      if (ary[idx] > ary[j]) {
        idx = j
      }
    }

    [ary[idx], ary[i]] = [ary[i], ary[idx]]

  }

  return ary
}
```