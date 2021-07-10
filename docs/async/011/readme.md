# 解释一下 async/await 的运行机制

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里面。

```js
async function fn(args) {
  // ...
}
// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```
所有的async函数都可以写成上面的第二种形式，其中的spawn函数就是自动执行器。

下面给出spawn函数的实现，基本就是前文自动执行器的翻版。

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

## async

async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

async函数对 Generator 函数的改进，体现在以下四点。
（1）内置执行器。

Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，async函数的执行，与普通函数一模一样，只要一行。
```
asyncReadFile();
```
上面的代码调用了asyncReadFile函数，然后它就会自动执行，输出最后结果。这完全不像 Generator 函数，需要调用next方法，或者用co模块，才能真正执行，得到最后结果。

（2）更好的语义。

async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。

（3）更广的适用性。

co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）

（4）返回值是 Promise。

async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作。

进一步说，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

async 函数返回一个 Promise 对象

## await

我们来看看 await做了些什么事情。

以一段代码为例:
```js
async function test() {
  console.log(100)
  let x = await 200
  console.log(x)
  console.log(200)
}
console.log(0)
test()
console.log(300)
```
我们来分析一下这段程序。首先代码同步执行，打印出0，然后将test压入执行栈，打印出100, 下面注意了，遇到了关键角色await。

放个慢镜头:
```js
await 100;
```
被 JS 引擎转换成一个 Promise :
```js
let promise = new Promise((resolve,reject) => {
   resolve(100);
})
```
这里调用了 resolve，resolve的任务进入微任务队列。

然后，JS 引擎将暂停当前协程的运行，把线程的执行权交给父协程。

回到父协程中，父协程的第一件事情就是对await返回的Promise调用then, 来监听这个 Promise 的状态改变 。
```js
promise.then(value => {
  // 相关逻辑，在resolve 执行之后来调用
})
```
然后往下执行，打印出300。

根据EventLoop机制，当前主线程的宏任务完成，现在检查微任务队列, 发现还有一个Promise的 resolve，执行，现在父协程在then中传入的回调执行。我们来看看这个回调具体做的是什么。
```js
promise.then(value => {
  // 1. 将线程的执行权交给test协程
  // 2. 把 value 值传递给 test 协程
})
```
Ok, 现在执行权到了test协程手上，test 接收到父协程传来的200, 赋值给 a ,然后依次执行后面的语句，打印200、200。

最后的输出为:
```
0
100
300
200
200
```

总结一下，async/await利用协程和Promise实现了同步方式编写异步代码的效果，其中Generator是对协程的一种实现，虽然语法简单，但引擎在背后做了大量的工作，我们也对这些工作做了一一的拆解。用async/await写出的代码也更加优雅、美观，相比于之前的Promise不断调用then的方式，语义化更加明显，相比于co + Generator性能更高，上手成本也更低，不愧是JS异步终极解决方案！

## 参考
[asyncs](https://www.bookstack.cn/read/es6-3rd/spilt.1.docs-async.md)
[011 解释一下 async/await 的运行机制。](http://47.98.159.95/my_blog/blogs/javascript/js-async/011.html)
