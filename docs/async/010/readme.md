# 如何让 Generator 的异步代码按顺序执行完毕？

这里面其实有两个问题:

1. Generator 如何跟异步产生关系？

2. 怎么把 Generator 按顺序执行完毕？

## thunk 函数

要想知道 Generator 跟异步的关系，首先带大家搞清楚一个概念——thunk 函数(即偏函数)，虽然这只是实现两者关系的方式之一。(另一种方式是 Promise, 后面会讲到)

举个例子，比如我们现在要判断数据类型。可以写如下的判断逻辑:

```js
let isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]'
}
let isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]'
}
let isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]'
}
let isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]'
}
// ...
```

可以看到，出现了非常多重复的逻辑。我们将它们做一下封装:

```js
let isType = (type) => {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}
```

现在我们这样做即可:

```js
let isString = isType('String')
let isFunction = isType('Function')
//...
```

相应的 isString 和 isFunction 是由 isType 生产出来的函数，但它们依然可以判断出参数是否为 String（Function），而且代码简洁了不少。

```js
isString('123')
isFunction((val) => val)
```

isType 这样的函数我们称为 thunk 函数。它的核心逻辑是接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。thunk 函数的实现会比单个的判断函数复杂一点点，但就是这一点点的复杂，大大方便了后续的操作。

## Generator 和 异步

### thunk 版本

以 setTimeout 为例，我们看看异步操作如何应用于 Generator

```js
const logFileName = (name) => {
  return (callback) => {
    setTimeout(() => {
      console.log('执行了一坨操作后', name)
      callback(name)
    }, 1000)
  }
}

const gen = function*() {
  const data1 = yield logFileName('001.txt')
  console.log(data1)
  const data2 = yield logFileName('002.txt')
  console.log(data2)
}

let g = gen()

g.next().value((data1) => {
  g.next(data1).value((data2) => {
    g.next(data2)
  })
})
```

打印结果如下：

- (延迟 1000ms)执行了一坨操作后 001.txt
- 001.txt
- (延迟 1000ms)执行了一坨操作后 002.txt
- 002.txt

简要解析：

1、 第一个 g.next() 执行的是 logTime('001.txt'), 执行完调用回调

2、回调中又调用了 第二个 g.next(),

3、第二个 g.next() 执行的是 data1 = '001.txt', console.log(data1)

4、logTime('002.txt'). 执行完调用回调

5、回调中又调用了 第三个 g.next()

6、data2 = '002.txt', console.log(data2)

logFileName 就是一个 thunk 函数。异步操作核心的一环就是绑定回调函数，而 thunk 函数可以帮我们做到。首先传入文件名，然后生成一个针对某个文件的定制化函数。这个函数中传入回调，这个回调就会成为异步操作的回调。这样就让 Generator 和异步关联起来了。

上面嵌套的情况还算简单，如果任务多起来，就会产生很多层的嵌套，可操作性不强，有必要把执行的代码封装一下:

```js
function run(gen) {
  const next = (data) => {
    let res = gen.next(data)
    if (res.done) return
    res.value(next)
  }
  next()
}
run(g)
```

Ok,再次执行，依然打印正确的结果。代码虽然就这么几行，但包含了递归的过程，好好体会一下。

这是通过 thunk 完成异步操作的情况。

## Promise 版本

还是拿上面的例子，用 Promise 来实现一下：

```js
const logTime = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(name)
    }, 1000)
  })
}

const gen = function*() {
  const data1 = yield logTime('001.txt')
  console.log(data1)
  const data2 = yield logTime('002.txt')
  console.log(data2)
}

let g = gen()

function getGenPromise(gen, data) {
  return gen.next(data).value
}

getGenPromise(g)
  .then((data1) => {
    return getGenPromise(g, data1)
  })
  .then((data2) => {
    return getGenPromise(g, data2)
  })
```

打印结果如下

```
001.txt
002.txt
```

同样，我们可以对执行 Generator 的代码加以封装:

```js
function run(g) {
  const next = (data) => {
    let res = g.next(data)
    if (res.done) return
    res.value.then((data) => {
      next(data)
    })
  }
  next()
}

run(g)
```

同样能输出正确的结果。代码非常精炼，希望能参照刚刚链式调用的例子，仔细体会一下递归调用的过程。

## 采用 co 库

以上我们针对 thunk 函数和 Promise 两种 Generator 异步操作的一次性执行完毕做了封装，但实际场景中已经存在成熟的工具包了，如果大名鼎鼎的 co 库, 其实核心原理就是我们已经手写过了（就是刚刚封装的 Promise 情况下的执行代码），只不过源码会各种边界情况做了处理。使用起来非常简单:

```js
const co = require('co')
let g = gen()
co(g).then((res) => {
  console.log(res)
})
```

打印结果如下:

```
001.txt
002.txt
```

简单几行代码就完成了 Generator 所有的操作，真不愧 co 和 Generator 天生一对啊！

## 参考

[如何让 Generator 的异步代码按顺序执行完毕？](http://47.98.159.95/my_blog/blogs/javascript/js-async/010.html#thunk-%E5%87%BD%E6%95%B0)
