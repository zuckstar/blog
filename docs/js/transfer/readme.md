# 数据类型转换

## 常见的类型转换

- 转换成数字
- 转换成布尔值
- 转换成字符串

## Object.is

Object.is() 方法判断两个值是否为同一个值

Object.is(value1, value2);

- value1
  被比较的第一个值。
- value2
  被比较的第二个值。

```js
if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y
    }
  }
}
```

![p1-1](./type.jpg)

## == 和 ===

=== 是严格相等，首先判断两边类型是否相等，然后再判断值是否相等

== 只要值相等就返回 true，且涉及一些隐式类型转换

### == 的比较规则

```js
null == undefined // true
'1' == 1 // true
1 == true // true
NaN == NaN // false
```

- Boolean 与 Number 比较：把 Boolean 转成 Number 再进行比较, true 转换成 1 ，false 转换成 0
- String 与 Number 比较： 把 String 转成 Number 再进行比较
- Object 与 Number 比较： 调用对象的 valueOf 方法，用得到的基本类型值按上述的规则进行比较，
  如果没有 valueOf 方法，则调用 toString 方法，转为原始类型再进行比较

- null 与 undefined 是相等的
- NaN 与 NaN 是不相等的
- 如果两个操作数都是对象，则比较它们是不是指向同一个对象（引用）

### 对象转原始类型

1. Symbol.toPrimitive()

2. valueOf()

3. toString()

4. 没有返回原始类型，则报错

```js
let obj = {
  value: 3,
  valueOf() {
    return 4
  },
  toString() {
    return '5'
  },
  [Symbol.toPrimitive]() {
    return 6
  },
}
console.log(obj + 1) // 输出7
```

### 让 a == 1 && a == 2 条件成立

对象的隐式转换

```js
let a = {
  value: 0,
  valueOf: function() {
    this.value++
    return this.value
  },
}
console.log(a == 1 && a == 2) //true
```
