# 实现一个 call & apply 函数

## Function.prototype.call()

### 定义

call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。

### 语法

function.call(thisArg, arg1, arg2, ...)


### 使用 call 方法调用函数并且指定上下文的 'this'

```js
function greet() {
  var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
  console.log(reply);
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
};

greet.call(obj);  // cats typically sleep between 12 and 16 hours
```
### 代码实现

```js
Function.prototype.call = function(context, ...args) {
    // 考虑不传 context 的情况
    let context = context || window

    // 把当前的方法添加到该对象身上去
    context.fn = this

    // eval 函数解决了执行方法传参的问题
    let result = eval('context.fn(...args)')

    // 在对象身上删除这个方法
    delete context.fn

    return result
}
```

## Function.prototype.apply()

### 定义

apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。

> 注意：call()方法的作用和 apply() 方法类似，区别就是call()方法接受的是参数列表，而apply()方法接受的是一个参数数组。

### 语法

func.apply(thisArg, [argsArray])


### 代码实现

类似的，有apply的对应实现:

```js
Function.prototype.apply = function (context, args) {
  let context = context || window;
  context.fn = this;
  // 参数会一一对应传入
  let result = eval('context.fn(...args)');

  delete context.fn
  return result;
}
```

## 参考

[js 实现call和apply方法，超详细思路分析](https://www.cnblogs.com/echolun/p/12144344.html)