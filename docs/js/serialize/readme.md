# 对象序列化


一个对象中可以包含各种各样的类型的数据，在了解对象序列化算法前，首先需要了解一下 JavaScript 中有哪些数据类型。

## JavaScript 的数据类型

6 个原始数据类型：

- number
- string
- boolean
- undefind
- null
- symbol

引用数据类型：

- 对象 Object
- 万物皆可对象（包含普通对象、Array 对象, RegExp 对象，Function 对象，Map 对象、Math 对象、Set 对象、Date 对象）


特例：

null 不是对象

> 解释: 虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象,然而 null 表示为全零，所以将它错误的判断为 object

### Map

Map的key相比较普通对象来说更为灵活，普通对象的key只能以基础数据类型作为key值，并且所有传入的key值都会被转化成string类型，而Map的key可以是各种数据类型格式。

### Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

### WeakMap

WeakMap 和 WeakSet 都只接受对象作为键名（null 除外），不接受其他类型的值作为键名，

其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。

WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。

WeakMap 就是为了解决对象引用忘记释放的问题，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。

### WeakMap 与 Map 在 API 上的区别

WeakMap 与 Map 在 API 上的区别主要是两个，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持clear方法。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。


## 数据类型判断

判断数据类型的四个方法：

1. typeof 
2. instanceof 
3. constructor
4. Object.prototype.toString


### typeof

## 简单序列化对象

## 对象深拷贝浅拷贝



