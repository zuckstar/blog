# 模拟实现 new 运算符

## new 运算符

### 定义

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

### 语法

new constructor[([arguments])]

- constructor: 一个指定对象实例的类型的类或函数。

- arguments: 一个用于被 constructor 调用的参数列表。

### 具体描述

new 关键字会进行如下的操作：

1. 创建一个空的简单JavaScript对象（即{}）；
2. 链接该对象（设置该对象的constructor）到另一个对象 ；
3. 将步骤1新创建的对象作为this的上下文 ；
4. 如果该函数没有返回对象，则返回this。


## Object.create()

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 

```js
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);

me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"
```

### 手动实现

```js
Object.prototype.create = function(proto) {
    function F() {}
    F.prototype = proto
    return new F()
}
```

## new 代码实现

当代码 new Foo(...) 执行时，会发生以下事情：

1. 一个继承自 Foo.prototype 的新对象被创建。

2. 使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。

3. 由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

```js
function newFactory(ctor, ...args) {

  // 检查 ctor 是否是 function
  if(typeof ctor !== 'function'){
    throw 'newOperator function the first param must be a function';
  }

  // 1. 一个继承自 ctor.prototype 的新对象被创建
  let obj = new Object();
  obj.__proto__ = Object.create(ctor.prototype);

  // 2. 将 this 绑定到新创建的对象，并传入参数
  let res = ctor.apply(obj, args);
  
  // 3. 如果构造函数有显式地返回一个对象（或者函数），则返回该对象（或函数）（规范定义的）。否则返回步骤1创建的对象
  let isObject = typeof res === 'object' && typeof res !== null;
  let isFunction = typeof res === 'function';


  return isObject || isFunction ? res : obj;
};
```
## 参考文章

[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)
[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
[001 如何模拟实现一个new的效果？](http://47.98.159.95/my_blog/blogs/javascript/js-api/001.html)