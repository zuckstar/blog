# forEach 中用 await 会产生什么问题?怎么解决这个问题？

[转载自三元的文章，点击查看](http://47.98.159.95/my_blog/blogs/javascript/js-async/012.html#%E9%87%8D%E6%96%B0%E8%AE%A4%E8%AF%86%E7%94%9F%E6%88%90%E5%99%A8)

问题:对于异步代码，forEach 并不能保证按顺序执行。

```js
async function test() {
  let arr = [4, 2, 1]
  arr.forEach(async (item) => {
    const res = await handle(item)
    console.log(res)
  })
  console.log('结束')
}

function handle(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x)
    }, 1000 * x)
  })
}

test()
```

我们期望的结果是:

```js
4
2
1
结束
```

但是实际上会输出:

```js
结束
1
2
4
```

## 问题原因

这是为什么呢？我想我们有必要看看 forEach 底层怎么实现的。

```js
// 核心逻辑
for (var i = 0; i < length; i++) {
  if (i in array) {
    var element = array[i]
    callback(element, i, array)
  }
}
```

可以看到，forEach 拿过来直接执行了，这就导致它无法保证异步任务的执行顺序。比如后面的任务用时短，那么就又可能抢在前面的任务之前执行。

## 解决方案

如何来解决这个问题呢？

其实也很简单, 我们利用 for...of 就能轻松解决。

```js
async function test() {
  let arr = [4, 2, 1]
  for (const item of arr) {
    const res = await handle(item)
    console.log(res)
  }
  console.log('结束')
}
```

## 解决原理

好了，这个问题看起来好像很简单就能搞定，你有想过这么做为什么可以成功吗？

其实，for...of 并不像 forEach 那么简单粗暴的方式去遍历执行，而是采用一种特别的手段——迭代器去遍历。

首先，对于数组来讲，它是一种可迭代数据类型。那什么是可迭代数据类型呢？

> 原生具有[Symbol.iterator]属性数据类型为可迭代数据类型。如数组、类数组（如 arguments、NodeList）、Set 和 Map

可迭代对象可以通过迭代器进行遍历。

```js
let arr = [4, 2, 1]
// 这就是迭代器
let iterator = arr[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

// {value: 4, done: false}
// {value: 2, done: false}
// {value: 1, done: false}
// {value: undefined, done: true}
```

因此，我们的代码可以这样来组织:

```js
async function test() {
  let arr = [4, 2, 1]
  let iterator = arr[Symbol.iterator]()
  let res = iterator.next()
  while (!res.done) {
    let value = res.value
    console.log(value)
    await handle(value)
    res = iterater.next()
  }
  console.log('结束')
}
// 4
// 2
// 1
// 结束
```

多个任务成功地按顺序执行！其实刚刚的 for...of 循环代码就是这段代码的语法糖。

## 重新认识生成器

回头再看看用 iterator 遍历[4,2,1]这个数组的代码。

```js
let arr = [4, 2, 1]
// 迭代器
let iterator = arr[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

// {value: 4, done: false}
// {value: 2, done: false}
// {value: 1, done: false}
// {value: undefined, done: true}
```

咦？返回值有 value 和 done 属性，生成器也可以调用 next,返回的也是这样的数据结构，这么巧?!

没错，生成器本身就是一个迭代器。

既然属于迭代器，那它就可以用 for...of 遍历了吧？

当然没错，不信来写一个简单的斐波那契数列(50 以内)：

```js
function* fibonacci() {
  let [prev, cur] = [0, 1]
  console.log(cur)
  while (true) {
    ;[prev, cur] = [cur, prev + cur]
    yield cur
  }
}

for (let item of fibonacci()) {
  if (item > 50) break
  console.log(item)
}
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
```

是不是非常酷炫？这就是迭代器的魅力：）同时又对生成器有了更深入的理解，没想到我们的老熟人 Generator 还有这样的身份。

以上便是本文的全部内容，希望对你有所启发。
