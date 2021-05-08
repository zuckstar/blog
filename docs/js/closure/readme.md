# 闭包

## 定义

### MDN

一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

### 红宝书

闭包是指有权访问另外一个函数作用域中的变量的函数

### 实例

```js
function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        alert(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();
```

## 产生的原因

> 首先要明白作用域链的概念，其实很简单，在ES5中只存在两种作用域————全局作用域和函数作用域，当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链，值得注意的是，每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。

## 闭包的应用

- 返回一个函数、或者作为函数参数传递

- 在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。

- IIFE（立即执行函数），保存了全局作用域window和当前函数的作用域

- 循环输出问题

```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function timer(){
    console.log(i)
  }, 0)
}
```

以上代码输出的结果是什么？ 全是 6

解决方案：

(1) 使用 ES6 中的 let 

let使JS发生革命性的变化，让JS有函数作用域变为了块级作用域，用let后作用域链不复存在。代码的作用域以块级为单位

上述代码会变成如下代码再进行执行：

```js
// i = 1
{
  setTimeout(function timer(){
    console.log(1)
  },0)
}
// i = 2
{
  setTimeout(function timer(){
    console.log(2)
  },0)
}
// i = 3
// ...
```

(2) 利用立即执行函数, 当每次for循环时，把此时的i变量传递到定时器中

```js
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```

- 用闭包实现一个累加器

```js
function sum(...arr) {
    let _sum = 0

    for(let i of arr) {
        _sum += i
    }

    let y = function (..._arr) {
        for(let i of _arr) {
            _sum += i
        }
        return y
    }

    y.sumOf = function () {
        return _sum
    }

    return y
}

console.log(sum(1,2,3)(1).sumOf())
```


## 参考

[闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[谈谈你对闭包的理解](http://47.98.159.95/my_blog/blogs/javascript/js-base/004.html#%E4%BB%80%E4%B9%88%E6%98%AF%E9%97%AD%E5%8C%85)