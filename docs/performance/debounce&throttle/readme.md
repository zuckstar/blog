# 防抖和节流

## 防抖和节流的本质

这两个东西都以闭包的形式存在。

它们通过对事件对应的回调函数进行包裹、以自由变量的形式缓存时间信息，最后用 setTimeout 来控制事件的触发频率。

## 节流 throttle

按照固定的时间间隔进行响应.

节流的核心思想: 如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器任务。这就好比公交车，10 分钟一趟，10 分钟内有多少人在公交站等我不管，10 分钟一到我就要发车走人！

### 代码实现

```js
function throttle(fn, interval) {
  let flag = true

  return function(...args) {
    let context = this // 保留调用时的this上下文

    if (!flag) return

    flag = false

    setTimeout(() => {
      fn.apply(context, args)
      flag = true
    }, interval)
  }
}
```

另一种写法，本质上是相同的

```js
function throttle(fn, interval) {
  let last = 0

  return function(...args) {
    let context = this
    let now = +new Date()

    if (now - last >= interval) {
      fn.apply(context, args)
      last = now
    }
  }
}

// 用throttle来包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)
```

### 补充 1：节流立即执行

```js
function throttle(fn, delay) {
  let flag = true

  return function(...args) {
    let context = this

    if (flag) {
      fn.apply(context, args)
      flag = false
      setTimeout(function() {
        flag = true
      }, delay)
    }
  }
}
```

### 补充 2：节流（合并版）

```js
function throttle(fn, delay = 300, isImmediate) {
  let flag = true

  return function(...args) {
    let context = this

    if (flag) {
      flag = false

      isImmediate && fn.apply(context, args) // 节流是否立即执行差别在于 apply 函数在 setTimeout 内部还是外部

      setTimeout(() => {
        !isImmediate && fn.apply(context, args)
        flag = true
      }, delay)
    }
  }
}
```

## 防抖 debounce

核心思想: 每次事件触发则删除原来的定时器，建立新的定时器。跟王者荣耀的回城功能类似，你反复触发回城功能，那么只认最后一次，从最后一次触发开始计时。

### 代码实现

```js
function debounce(fn, delay) {
  let timer = null

  return function(...args) {
    let context = this

    // 清除当前定时器
    if (timer) {
      clearTimeout(timer)
    }

    // 设立新的定时器
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}
```

### 补充 1：防抖立即执行

```js
function debounce(fn, delay) {
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
    }, delay)
  }
}
```

### 补充 2：防抖（合并版）

```js
function debounce(fn, delay, isImmediate = false) {
  let timer = null
  let flag = true

  return function(...args) {
    let context = this

    if (timer) clearTimeout(timer)

    if (isImmediate) {
      if (flag) {
        fn.apply(context, args)
        flag = false
      }

      timer = setTimeout(() => {
        flag = true
      }, delay)
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}
```

### 用 Throttle 来优化 Debounce

debounce 的问题在于它“太有耐心了”。试想，如果用户的操作十分频繁——他每次都不等 debounce 设置的 delay 时间结束就进行下一次操作，于是每次 debounce 都为该用户重新生成定时器，回调函数被延迟了不计其数次。频繁的延迟会导致用户迟迟得不到响应，用户同样会产生“这个页面卡死了”的观感。

为了避免弄巧成拙，我们需要借力 throttle 的思想，打造一个“有底线”的 debounce——等你可以，但我有我的原则：delay 时间内，我可以为你重新生成定时器；但只要 delay 的时间到了，我必须要给用户一个响应。这个 throttle 与 debounce “合体”思路，已经被很多成熟的前端库应用到了它们的加强版 throttle 函数的实现中：

### 补充 3：加强版 throttle

```js
function throttle(fn, delay) {
  let last = 0
  let timer = null

  return function(...args) {
    let context = this
    let now = +new Date()

    if (now - last >= delay) {
      last = now
      fn.apply(context, args)
    } else {
      clearTimeout(timmer)

      timmer = setTimeout(function() {
        fn.apply(context, args)
      }, delay)
    }
  }
}
```

## 参考

[1][前端性能优化原理与实践](https://juejin.cn/book/6844733750048210957/section/6844733750119661576)

[2][节流和防抖:立即执行](https://blog.csdn.net/Polaris_tl/article/details/99300458)
