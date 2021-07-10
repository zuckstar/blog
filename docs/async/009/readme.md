# 谈谈你对 Generator 以及协程的理解

Generator 函数是 ES6 提供的一种异步编程解决方案（可以按序执行异步方法），但其语法行为与传统函数完全不同。

生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。


## 可迭代协议

要成为可迭代对象， 一个对象必须实现 @@iterator 方法。这意味着对象（或者它原型链上的某个对象）必须有一个键为 @@iterator 的属性，可通过常量 Symbol.iterator 访问该属性：

[Symbol.iterator]	 ：一个无参数的函数，其返回值为一个符合迭代器协议的对象。

## 迭代器协议
迭代器协议定义了产生一系列值（无论是有限个还是无限个）的标准方式。当值为有限个时，所有的值都被迭代完毕后，则会返回一个默认返回值。

只有实现了一个拥有以下语义（semantic）的 next() 方法，一个对象才能成为迭代器。

### next

next 一个无参数函数，返回一个应当拥有以下两个属性的对象：

- done（boolean）:
如果迭代器可以产生序列中的下一个值，则为 false。（这等价于没有指定  done 这个属性。）

如果迭代器已将序列迭代完毕，则为 true。这种情况下，value 是可选的，如果它依然存在，即为迭代结束之后的默认返回值。

- value:
迭代器返回的任何 JavaScript 值。done 为 true 时可省略。
next() 方法必须返回一个对象，该对象应当有两个属性： done 和 value，如果返回了一个非对象值（比如 false 或 undefined），则会抛出一个 TypeError 异常（"iterator.next() returned a non-object value"）。

## 什么是 Generator 函数

生成器是一个带星号的"函数"(注意：它并不是真正的函数)，可以通过 yield 关键字暂停执行和恢复执行的

```js
let log = console.log

function* gen() {
  yield 1
  yield 2
  yield 3
  return 4
}

let g = gen()

log(g.next()) // { value: 1, done: false }
log(g.next()) // { value: 2, done: false }
log(g.next()) // { value: 3, done: false }
log(g.next()) // { value: 4, done: true }
log(g.next()) // { value: undefined, done: true }
```

先看看 Generator 函数在形式上的定义：

1. generator 函数和普通函数不同的是，generator 由 function*定义（function 后带有一个星号 *）

2. yield 表达式：你可以理解为 Generator 函数是一个状态机，封装了多个内部状态，而函数体内部使用 yield 表达式来定义不同的内部状态

3. 执行 Generator 函数后会返回一个遍历器对象(不会直接得到 return 的结果)

4. 依次调用遍历器对象的 next 方法，可以遍历 Generator 函数内部的每一个状态

继续分析上面的代码，如果一个 yield 表达式算一个 generator 的一个状态，上述的代码一共有 4 个状态，即 3 个 yield 表达式和 1 个 return 语句（return 也算一个状态）。

每次调用遍历器的 next 方法，都会返回一个对象 {value: xxx, done: xxx}，表示当前遍历器状态的信息，该对象包含两个属性，一个是 value 属性，表示当前 yield 表达式的值， 一个是 done 属性，表示当前遍历是否结束。当所有状态遍历结束后，done 的值变为 true。

当遍历结束后如果继续调用遍历器的 next 方法，done 的值不再改变，而 value 的值变为 undefined。

```js
function* gen() {
  console.log('enter')
  let a = yield 1
  let b = yield (function() {
    return 2
  })()
  return 3
}
var g = gen() // 阻塞住，不会执行任何语句
console.log(typeof g) // object  看到了吗？不是"function"

console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())

// enter
// { value: 1, done: false }

// { value: 2, done: false }
// { value: 3, done: true }
// { value: undefined, done: true }
```

生成器的执行有这样几个关键点:

1. 调用 gen() 后，程序会阻塞住，不会执行任何语句。

2. 调用 g.next() 后，程序继续执行，直到遇到 yield 程序暂停。

3. next 方法返回一个对象， 有两个属性: value 和 done。value 为当前 yield 后面的结果，done 表示是否执行完，遇到了 return 后，done 会由 false 变为 true。

### yield 表达式

1. yield 语句就是暂停标志，遇到 yield 语句就暂停执行后面的操作，并将紧跟在 yield 后的表达式的值作为返回的对象的 value 属性值。

2. 下一次调用 next 方法时再继续往下执行，知道遇到下一条 yield。

3. 如果没有再遇到新的 yield 语句，就一直运行到函数结束，直到 return 语句为止，并将 return 语句后面的表达式的值作为返回对象的 value 属性值。

4. 如果该函数没有 return 语句，则返回对象的 value 属性值为 undefined。

当一个生成器要调用另一个生成器时，使用 yield\* 就变得十分方便。比如下面的例子:

```js
function* gen1() {
  yield 1
  yield 4
}
function* gen2() {
  yield 2
  yield 3
}
```

我们想要按照 1234 的顺序执行，如何来做呢？

在 gen1 中，修改如下:

```js
function* gen1() {
  yield 1
  yield* gen2()
  yield 4
}
```

这样修改之后，之后依次调用 next 即可。

### next 方法

注意，yield 语句本身没有返回值，或者说总是返回 undefined。next 方法可以带有一个参数，该参数会被当作上一条 yield 语句的返回值。

因为上面这句话，也就有了下面这个经典的例子：

```js
function* foo(x) {
  let y = 2 * (yield x + 1)
  let z = yield y / 3
  return x + y + z
}
let g = foo(5)
log(g.next())
log(g.next())
log(g.next())
```

猜猜打印的结果什么？答案如下：

```js
{ value: 6, done: false }
{ value: NaN, done: false }
{ value: NaN, done: true }
```

第一个 next() 语句中的参数总是无效的，无论传入什么值，都不会对接下来的表达式产生影响，因为在执行第一个 next() 方法的时候，还没遇到 yield 语句，参数也无法作为返回值，所以第一个 next 的参数是无意义的。

可能有点绕，按步骤说明下上述代码的执行过程：

g = foo()， foo 生成了遍历器，返回给了 g 变量

执行第一个，g.next()，g 执行 next 方法，此时在代码中体现为执行了 x + 1 = 6

然后遇到了 yield 语句，暂停，返回结果 {value: 6, done: false}

执行第二个，g.next(), next 参数为空，即默认上一个 yield 语句的返回值为 undefined，执行 let y = 2 \* undefind, y = NaN, 继续计算 y/3 , 即 NaN/3 = NaN

然后遇到了 yield 语句，暂停，返回结果 {value: NaN, done: false}

执行第三个，g.next(), next 参数为空，即默认上一个 yield 语句的返回值为 undefined, 执行 let z = undefined, return (x+y+z) 即 return (5+NaN+undefined) 最后的返回值 undefined。

为 next 方法传入一些参数：

```js
function* foo(x) {
  let y = 2 * (yield x + 1)
  let z = yield y / 3
  return x + y + z
}
let g = foo(5)
log(g.next()) // { value:6, done:false }
log(g.next(12)) // { value:8, done:false }
log(g.next(13)) // { value:42, done:true }
```

可以按上述的过程走一遍，然后把参数代入就得到了注释中的结果。

## 生成器实现机制——协程

可能你会比较好奇，生成器究竟是如何让函数暂停, 又会如何恢复的呢？接下来我们就来对其中的执行机制——协程一探究竟。

### 什么是协程？

协程是一种比线程更加轻量级的存在，协程处在线程的环境中，一个线程可以存在多个协程，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

### 协程的运作过程

那你可能要问了，JS 不是单线程执行的吗，开这么多协程难道可以一起执行吗？

答案是：并不能。一个线程一次只能执行一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中将 JS 线程的控制权转交给 B 协程，那么现在 B 执行，A 就相当于处于暂停的状态。

举个具体的例子:

```js
function* A() {
  console.log('我是A')
  yield B() // A停住，在这里转交线程执行权给B
  console.log('结束了')
}
function B() {
  console.log('我是B')
  return 100 // 返回，并且将线程执行权还给A
}
let gen = A()
gen.next()
gen.next()

// 我是A
// 我是B
// 结束了
```

在这个过程中，A 将执行权交给 B，也就是 A 启动 B，我们也称 A 是 B 的父协程。因此 B 当中最后 return 100 其实是将 100 传给了父协程。

需要强调的是，对于协程来说，它并不受操作系统的控制，完全由用户自定义切换，因此并没有进程/线程上下文切换的开销，这是高性能的重要原因。

OK, 原理就说到这里。可能你还会有疑问: 这个生成器不就暂停-恢复、暂停-恢复这样执行的吗？它和异步有什么关系？而且，每次执行都要调用 next，能不能让它一次性执行完毕呢？下一节我们就来仔细拆解这些问题。

## 参考

[从 Generator 到 Async/Await](https://www.jianshu.com/p/e4014ed3fbf3)
