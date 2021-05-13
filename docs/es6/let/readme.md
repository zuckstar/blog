# let 和 const 命令

## let 和 var

ES6 新增了 let 命令，用于声明变量。用法与 var 类似。但是有以下几个不同点。

let 和 var 区别：

1. let 声明的变量只在他的代码块内有效，有块级作用域，而 var 声明的变量没有块级作用域(但有函数作用域，函数内部声明的变量函数外部不能访问)。
2. let 没有变量提升(报错)，var 声明的变量存在变量提升(undefined)。
3. let 不允许变量重复声明，var 允许变量重复声明，后面声明的变量覆盖前面的变量。
4. 暂时性死区，某区域若定义使用了 let 命令，则该区域遵守 let 命令的规范。

### 块级作用域

在 let 命令所在的代码块内有效。

```js
{
  let a = 10
  var b = 1
}

a // ReferenceError: a is not defined.
b // 1
```

### 不存在变量提升

```js
// var 的情况
console.log(foo) // 输出undefined
var foo = 2

// let 的情况
console.log(bar) // 报错ReferenceError
let bar = 2
```

### 不允许重复声明

let 不允许在相同作用域内，重复声明同一个变量。

```js
// 报错
function func() {
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  let a = 10;
  let a = 1;
```

因此，不能在函数内部重新声明参数。

```js
function func(arg) {
  let arg
}
func() // 报错

function func(arg) {
  {
    let arg
  }
}
func() // 不报错
```

### 暂时性死区

只要块级作用域内存在 let 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```js
var tmp = 123

if (true) {
  tmp = 'abc' // ReferenceError
  let tmp
}
```

上面代码中，存在全局变量 tmp，但是块级作用域内 let 又声明了一个局部变量 tmp，导致后者绑定这个块级作用域，所以在 let 声明变量前，对 tmp 赋值会报错。

ES6 明确规定，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用 let 命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

## const

const 命令用来声明常量，需要注意以下几点

1. const 声明的常量的值不允许重新赋值
2. const 声明的常量必须初始化
3. const 声明的变量不存在变量提升(和 let 一样)
4. const 声明的变量也存在暂时性死区，只能在声明后使用。(和 let 一样)

### 不允许重复赋值

```js
const PI = 3.1415
PI // 3.1415

PI = 3
// TypeError: Assignment to constant variable.
```

### 必须初始化

```js
const foo;
// SyntaxError: Missing initializer in const declaration
```

### 本质

const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

## 参考

[阮一峰-let](https://es6.ruanyifeng.com/#docs/let)
