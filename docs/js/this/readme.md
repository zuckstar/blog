# 谈谈你对 this 的理解

this 对象是在运行时基于函数的执行环境绑定的，在全局环境中，this 等于 window。而当函数被作为某个对象的方法调用时，this 等于那个对象。不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。

## 全局上下文

全局上下文默认 this 指向 window, 严格模式下指向 undefined。

## 函数中的 this

this 的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定 this 到底指向谁，实际上 this 的最终指向的是那个调用它的对象。

- 例子 1：

```js
function a() {
  let name = '张三'
  console.log(this.user) // undefined
  console.log(this) // window
}

a()
```

this 最终指向的是调用它的对象，所以这里在全局环境下调用的 a(), 实际上相当于执行了 window.a()，所以这里的 this 指向是 window

- 例子 2：

```js
let obj = {
  a: function() {
    console.log(this) // window
  },
}

let func = obj.a

func()
```

this 永远指向的是最后调用它的对象，也就是看它执行的时候是谁调用的。这种情况也相当于在全局的上下文的情况下执行，所以 this 的指向也是 window

```js
let obj = {
  a: function() {
    console.log(this) // { a: [Function: a] }
  },
}

obj.a()
```

这种以对象.方法形式调用的哈数，this 指向的是当前对象。
这里的 this 指向的是对象 obj，因为你调用这个 fn 是通过 obj.fn()执行的，那自然指向就是对象 obj，这里再次强调一点，this 的指向在函数创建的时候是决定不了的，在调用的时候才能决定，谁调用的就指向谁，一定要搞清楚这个。

- 例子 3：

如果一个函数中有 this，这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this 指向的也只是它上一级的对象

```js
var o1 = {
  a: 10,
  o2: {
    a: 12,
    fn: function() {
      console.log(this.a) // 12
    },
  },
}
o1.o2.fn()
```

同理：

```js
var o1 = {
  a: 10,
  o2: {
    // a:12,
    fn: function() {
      console.log(this.a) // undefined
    },
  },
}
o1.o2.fn()
```

## 构造函数中的 this

```js
function Fn() {
  this.user = '张三'
}
var a = new Fn()
console.log(a.user) // 张三
```

这里之所以对象 a 可以点出函数 Fn 里面的 user 是因为 new 关键字可以改变 this 的指向，将这个 this 指向对象 a。具体的可以查看 js/new 章节中的 newFactory 的代码实现。

还有，若构造函数有手动指定返回值，那么 new 后的对象中 this 的指向就是那个构造函数中的返回值，因为这个构造函数就变成了普通的函数了。

## DOM 事件绑定

onclick 和 addEventerListener 中 this 默认指向绑定事件的元素。

## 箭头函数

箭头函数没有 this, 因此也不能绑定。里面的 this 会指向当前最近的非箭头函数的 this，找不到就指向全局的顶级对象 window(严格模式是 undefined)。比如:

## 参考

[彻底理解 js 中的 this 指向](https://www.cnblogs.com/pssp/p/5216085.html)
