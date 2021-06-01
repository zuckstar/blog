# Array.prototype.sort()

## 基础用法

### 简介

sort() 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 UTF-16 代码单元值序列时构建的(升序排序)

由于它取决于具体实现，因此无法保证排序的时间和空间复杂性。

### 语法

arr.sort([compareFunction])

### 案例

```js
let nums = [2, 3, 1]
//两个比较的元素分别为a, b
nums.sort(function(a, b) {
  if (a > b) return 1
  else if (a < b) return -1
  else if (a == b) return 0
})

// 1, 2, 3
```

- 如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
- 如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。
- 如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。

## 手写 sort 方法

### V8 引擎思路分析

- 当 n <= 10 的时候，采用插入排序

- 当 n > 10 的时候，采用三路快速排序

  - 0 < n <= 1000, 采用中位数作为哨兵元素
  - n > 1000, 每隔 200~215 个元素挑出一个元素，放到一个新数组，然后对它排序，找到中间位置的数，以此作为中位数

### 第一、为什么元素个数少的时候要采用插入排序？

虽然插入排序理论上说是 O(n^2)的算法，快速排序是一个 O(nlogn)级别的算法。但是别忘了，这只是理论上的估算，在实际情况中两者的算法复杂度前面都会有一个系数的， 当 n 足够小的时候，快速排序 nlogn 的优势会越来越小，倘若插入排序 O(n^2)前面的系数足够小，那么就会超过快排。而事实上正是如此，插入排序经过优化以后对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排。

因此，对于很小的数据量，应用插入排序是一个非常不错的选择。

### 第二、为什么要花这么大的力气选择哨兵元素？

因为快速排序的性能瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或者最大元素，那么进行 partition(一边是小于哨兵的元素，另一边是大于哨兵的元素)时，就会有一边是空的，那么这么排下去，递归的层数就达到了 n, 而每一层的复杂度是 O(n)，因此快排这时候会退化成 O(n^2)级别。

这种情况是要尽力避免的！如果来避免？

就是让哨兵元素进可能地处于数组的中间位置，让最大或者最小的情况尽可能少。这时候，你就能理解 V8 里面所做的种种优化了。

### 插入实现

插入排序（交换法）

```js
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length

  for (let i = start; i < end; i++) {
    for (let j = i; j > start && arr[j - 1] > arr[j]; j--) {
      let temp = arr[j]
      arr[j] = arr[j - 1]
      arr[j - 1] = temp
    }
  }
  return
}
```

![p1-1](./1.gif)

看似可以正确的完成排序，但实际上交换元素会有相当大的性能消耗，我们完全可以用变量覆盖的方式来完成,优化后代码如下:

插入排序（覆盖法）

```js
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length

  for (let i = start; i < end; i++) {
    let e = arr[i]
    let j = i
    for (j = i; j > start && arr[j - 1] > arr[j]; j--) {
      arr[j] = arr[j - 1]
    }
    arr[j] = e
  }
  return
}
```

### sort 骨架

```js
Array.prototype.sort = (comparefn) => {
  let array = Object(this)
  let length = array.length >>> 0
  return InnerArraySort(array, length, comparefn)
}

const InnerArraySort = (array, length, comparefn) => {
  // 当比较函数未传入的时候
  if (Object.prototype.toString.call(comparefn) !== '[object Function]') {
    comparefn = function(x, y) {
      if (x === y) return 0
      x = x.toString()
      y = y.toString()
      if (x == y) return 0
      else return x < y ? -1 : 1
    }
  }

  const insertSort = () => {
    // ...
  }

  const getThirdIndex = (a, from, to) => {
    // 元素个数大于 1000 的时候寻找哨兵元素
  }

  const quickSort = (a, from, to) => {
    // 哨兵位置
    let thirdIndex = 0

    while (true) {
      if (to - from <= 10) {
        // 插入排序
        insertSort(a, from, to)
        return
      }
      if (to - from > 1000) {
        thirdIndex = getThirdIndex(a, from, to)
      } else {
        // 小于 1000 直接取中点
        thirdIndex = from + ((to - from) >> 1)
      }

      // 快排的部分
    }
  }
}
```

### 求取哨兵位置的代码

```js
const getThirdIndex = (a, from, to) => {
  let tempArr = []
  // 15 的二进制为 1111 所以任何正数和15做与运算都不会超过15， 取值范围在 1~15
  let increment = 200 + ((to - from) & 15)

  let j = 0
  from += 1
  to -= 1

  for (let i = from; i < to; i += increment) {
    tmpArr[j] = [i, a[i]]
    j++
  }

  // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
  tmpArr.sort(function(a, b) {
    return comparefn(a[1], b[1])
  })

  let thirdIndex = tmpArr[tmpArr.length >> 1][0]

  return thirdIndex
}
```

### 完成快排

```js
const _sort = (a, b, c) => {
  let arr = [a, b, c]
  insertSort(arr, 0, 3)
  return arr
}

const quickSort = (a, from, to) => {
  // 为了再次确保 thirdIndex 不是最值，把这三个值进行排序
  ;[a[from], a[thirdIndex], a[to]] = _sort(a[from], a[thirdIndex], a[to - 1])

  let pivot = a[thirdIndex]
  ;[a[from], a[thirdIndex]] = [a[thirdIndex], a[from]]

  // 正式进入快排
  let lowEnd = from + 1
  let highStart = to - 1

  a[thirdIndex] = a[lowEnd]
  a[lowEnd] = pivot

  for (let i = lowEnd + 1; i < highStart; i++) {
    let element = a[i]
    let order = comparefn(element, pivot)
    if (order < 0) {
      a[i] = a[lowEnd]
      a[lowEnd] = element
      lowEnd++
    } else if (order > 0) {
      do {
        highStart--
        if (highStart === i) break
        order = comparefn(a[highStart], pivot)
      } while (order > 0)

      a[i] = a[highStart]
      a[highStart] = element
      if (order < 0) {
        element = a[i]
        a[i] = a[lowEnd]
        a[lowEnd] = element
        lowEnd++
      }
    }
  }

  // 永远切分大区间
  if (lowEnd - from > to - highStart) {
    to = lowEnd
    quickSort(a, highStart, to)
  } else if (lowEnd - from <= to - highStart) {
    from = highStart
    quickSort(a, from, lowENd)
  }
}
```

### 完整代码

```js
Array.prototype.sort = (comparefn) => {
  let array = Object(this)
  let length = array.length >>> 0
  return InnerArraySort(array, length, comparefn)
}
const InnerArraySort = (array, length, comparefn) => {
  // 当比较函数未传入的时候
  if (Object.prototype.toString.call(comparefn) !== '[object Function]') {
    comparefn = function(x, y) {
      if (x === y) return 0
      x = x.toString()
      y = y.toString()
      if (x == y) return 0
      else return x < y ? -1 : 1
    }
  }

  // 插入排序
  const insertSort = (arr, start = 0, end) => {
    end = end || arr.length

    for (let i = start; i < end; i++) {
      let e = arr[i]
      let j = i
      for (j = i; j > start && arr[j - 1] > arr[j]; j--) {
        arr[j] = arr[j - 1]
      }
      arr[j] = e
    }
    return
  }

  // 求哨兵
  const getThirdIndex = (a, from, to) => {
    let tempArr = []
    // 15 的二进制为 1111 所以任何正数和15做与运算都不会超过15， 取值范围在 1~15
    let increment = 200 + ((to - from) & 15)

    let j = 0
    from += 1
    to -= 1

    for (let i = from; i < to; i += increment) {
      tmpArr[j] = [i, a[i]]
      j++
    }

    // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
    tmpArr.sort(function(a, b) {
      return comparefn(a[1], b[1])
    })

    let thirdIndex = tmpArr[tmpArr.length >> 1][0]

    return thirdIndex
  }

  const _sort = (a, b, c) => {
    let arr = [a, b, c]
    insertSort(arr, 0, 3)
    return arr
  }

  const quickSort = (a, from, to) => {
    // 哨兵位置
    let thirdIndex = 0

    while (true) {
      if (to - from <= 10) {
        // 插入排序
        insertSort(a, from, to)
        return
      }
      if (to - from > 1000) {
        thirdIndex = getThirdIndex(a, from, to)
      } else {
        // 小于 1000 直接取中点
        thirdIndex = from + ((to - from) >> 1)
      }

      // 快排的部分
      // 保险起见，再从这三个数中取中间值作为哨兵
      let tmpArr = _sort(a[from], a[thirdIndex], a[to - 1])
      a[from] = tmpArr[0]
      a[thirdIndex] = tmpArr[1]
      a[to - 1] = tmpArr[2]
      // 现在正式把 thirdIndex 作为哨兵
      let pivot = a[thirdIndex]

      let lowEnd = from + 1
      let highStart = to - 1

      // 基准值提前
      a[thirdIndex] = a[lowEnd]
      a[lowEnd] = pivot

      for (let i = lowEnd + 1; i < highStart; i++) {
        let element = a[i]
        let order = comparefn(element, pivot)
        if (order < 0) {
          a[i] = a[lowEnd]
          a[lowEnd] = element
          lowEnd++
        } else if (order > 0) {
          do {
            highStart--
            if (highStart === i) break
            order = comparefn(a[highStart], pivot)
          } while (order > 0)
          // 现在 a[highStart] <= pivot
          // a[i] > pivot
          // 两者交换
          a[i] = a[highStart]
          a[highStart] = element
          if (order < 0) {
            // a[i] 和 a[lowEnd] 交换
            element = a[i]
            a[i] = a[lowEnd]
            a[lowEnd] = element
            lowEnd++
          }
        }
      }
      // 永远切分大区间
      if (lowEnd - from > to - highStart) {
        // 单独处理小区间
        quickSort(a, highStart, to)
        // 继续切分lowEnd ~ from 这个区间
        to = lowEnd
      } else if (lowEnd - from <= to - highStart) {
        quickSort(a, from, lowEnd)
        from = highStart
      }
    }
  }
  quickSort(array, 0, length)
}
```

## 参考

http://47.98.159.95/my_blog/blogs/javascript/js-array/011.html#v8-%E5%BC%95%E6%93%8E%E7%9A%84%E6%80%9D%E8%B7%AF%E5%88%86%E6%9E%90

https://juejin.cn/post/6844903504654368781
