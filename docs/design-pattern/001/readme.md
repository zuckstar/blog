# 设计模式

## 基础知识

### 静态类型语言和动态类型语言

静态类型语言：编译时检查类型不匹配的错误
动态类型语言：无法保证变量的类型，只有在运行的时候才知道。


### 多态

把"不变的事物"和"可能改变的事物"分离开来, 将不变的部分隔离出来，把可变的部分封装起来，这给予了我们扩展程序的能力，程序看起来是可生长的，这就是开放封闭原则。


动物叫（修改前）：
```js
var makeSound = function (animal) {
  if(animal instanceof Duck) {
    console.log('嘎嘎嘎')
  } else if(animal instanceof Chicken) {
    console.log('咯咯咯')
  }
}

var Duck = function (){}
var Chicken = function (){}

makeSound(new Duck())
makeSound(new Chicken())
```

动物叫（修改后）
```js
var makeSound = function (animal) {
  animal.sound()
}

var Duck = function (){}
Duck.prototype.sound = function () {
  console.log('嘎嘎嘎')
}

var Chicken = function (){}
Chicken.prototype.sound = function () {
  console.log('咯咯咯')
}

makeSound(new Duck())
makeSound(new Chicken())

```

Java 语言的多态需要通过继承，子类对象向上转型来实现多态（例如定义一个 Animal 的类，参数可以传递 Animal 子类的对象，如 new Duck() 和 new Chicken()） 而 JS 的多态是天生的，无需向上转型。

### 封装

封装的目的是将信息隐藏。

### 原型模式

作用
：
Object.create() 的实现, 利用原型模式克隆出来一个一模一样的对象。

```js
Object.create = function (obj) {

  var F = function () {}

  F.prototype = obj

  return new F()
}
```

在基于原型的语言中，每一个对象都是基于另外一个对象的克隆。例如在 JS 中，根对象名为 Object。


原型编程中的一个重要特性：即当对象无法响应某个请求的时候，会把该请求委托给它自己的原型。

理解 new 运算的过程

```js
function Person(name) {
  this.name = name
}

Person.prototype.getName = function () {
  return this.name
}

var objectFactory = function () {
  var obj = new Object() // 从 Object.prototype 上克隆一个空对象
  var Construtor = [].shift.call(arguments) // 取参数对象的第一个值，即构造器
  obj.__proto__ = Construtor.prototype // 当前对象指向正确的原型
  var ret = Construtor.apply(obj, arguments) // 借用外部传入的构造器给 obj 设置属性

  return typeof ret === 'object' ? ret : obj; // 确保构造器返回一个对象，如果构造器本身会返回一个对象，则优先用构造器返回的对象
}
```

### this、call、和 apply

js 的 this 总指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数声明时的环境。

Function.prototype.bind 的实现
```js
Function.prototype.bind = function () {
  var self = this

  var context = [].shift.call(arguments)
  var args = [].slice.call(arguments)

  return function (params) {
    return self.apply(context, [].concat.call(args, [].slice.call(arguments)))
  }
}


```

### 闭包和高阶函数

高阶函数需要满足的条件：

- 函数可以作为参数传递 （回调函数）
- 函数可以作为返回值输出

显然 Javascript 语言中的函数满足高阶函数的两个条件。

函数可以作为返回值输出的经典案例，判断数据的类型：

```js
var isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === '[object '+type+']';
  }
}

var isString = isType('String')
var isArray = isType('Array')
var isNumber = isType('Number')
```

### 高阶函数实现AOP 

函数柯里化（部分求值）


```js
var cost = (function () {
  var args = []

  return function () {
    if(arguments.length === 0) {
      var money = 0

      for(var i = 0; i < args.length; i++) {
        money += args[i]
      }

      return money
    } else {
      [].push.apply(args, arguments)
    }
  }
})()
```

函数 uncarying 化

```js
Function.prototype.uncurrying = function () {
  let self = this // 拿到当前函数
  return function () {
    let obj = Array.prototype.shift.call(arguments)
    return self.apply(obj, arguments) // 当前函数给传入的 obj 这个对象执行
  }
}

var shift = Array.prototype.shift.uncurrying()

var obj = {
  length: 3,
  0: 1,
  1: 2,
  2: 3
}

var first = shift(obj)

console.log(first) // 1
```

### 惰性加载函数

根据环境惰性载入函数的一个方案，其中兼容性代码只会在第一次调用的时候执行。
```js
var addEvent = function(elem, type, handler) {
  if(window.addEventListener) {
    addEvent = function(elem, type, handler) {
      elem.addEventListener(type, handler, false)
    }
  } else if(window.attachEvent) {
    addEvent = function (elem, type, handler) {
      elem.attachEvent('on'+type, handler)
    }    
  }

  addEvent(elem, type, handler)
}

```
