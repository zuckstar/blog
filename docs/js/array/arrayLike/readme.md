# 伪数组转数组

## 类数组对象

### arguments

在函数体内，可以通过 arguments 对象来访问参数数组，从而获取传递给函数的每一个参数。
但其实 arguments 对象只是和数组类似，并不是一个真实的数组。

但是可以通过方括号 arguments[0] 来访问它的每一个元素，并且可以通过访问 arguments 对象的 length 属性可以获知有多少个参数传递给了函数，所以称其为类数组对象。

```js
function sayHi(name, age, from) {
  console.log(arguments)
  // [Arguments] { '0': 'zhangsan', '1': 18, '2': 'China' }
  console.log(arguments.length)
  // 3
}

sayHi('zhangsan', 18, 'China')
```

### 其他常见的类数组

用 getElementByTagName/ClassName/Name() 获得的 HTMLCollection
用 querySlector 获得的 nodeList

## 转换为数组

类数组对象导致很多数组的方法就不能用了，必要时需要我们将它们转换成数组

### Array.prototype.slice.call()

遍历+浅拷贝，并返回一个新数组

```js
function sayHi(name, age, from) {
  let args = Array.prototype.slice.call(arguments)
  console.log(args) // [ 'zhangsan', 18, 'China' ]
}

sayHi('zhangsan', 18, 'China')
```

### Array.from()

```js
function sayHi(name, age, from) {
  let args = Array.from(arguments)
  console.log(args) // [ 'zhangsan', 18, 'China' ]
}

sayHi('zhangsan', 18, 'China')
```

### ES6 展开运算符

```js
function sayHi(name, age, from) {
  let args = [...arguments]
  console.log(args) // [ 'zhangsan', 18, 'China' ]
}

sayHi('zhangsan', 18, 'China')
```

### 利用 concat+apply

```js
function sayHi(name, age, from) {
  let args = Array.prototype.concat.apply([], arguments) //apply方法会把第二个参数展开
  console.log(args) // [ 'zhangsan', 18, 'China' ]
}

sayHi('zhangsan', 18, 'China')
```
