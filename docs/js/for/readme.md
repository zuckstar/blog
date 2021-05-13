# for 语句

## for...in 和 for...of 的区别

### for...in

循环遍历对象的键名

- 对于数组来说就是遍历下标值，对于对象来说就是遍历属性名称

- for … in 循环会以任意的顺序遍历键名

- for … in 循环不仅可以遍历数字键名,还会遍历原型上的 key 值和手动添加的其他键(for of 不能)

```js
const arr = ['a', 'b', 'c']

for (let x in arr) {
  console.log(x) // 1,2,3
}

const json = { a: 1, b: 2, c: 3 }

for (let i in json) {
  console.log(i) // a, b, c
}
```

### for...of

用来遍历键值

- 对数组来说就是遍历数组

```js
const arr = ['a', 'b', 'c']

for (let x of arr) {
  console.log(x) // a,b,c
}
```

- 对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错

```js
var obj = {
  name: 'Jim Green',
  age: 12,
}

for (let key of obj) {
  console.log('for of obj', key)
}
// Uncaught TypeError: obj is not iterable
```

- 也可以使用 Object.keys(obj) 方法将对象的键名生成一个数组，然后遍历这个数组

```js
for (let key of Object.keys(obj)) {
  console.log('key', key)
}
/*
   key name
   key age
 */
```

- 无论是 for...in 还是 for...of 都不能遍历出 Symbol 类型的值，遍历 Symbol 类型的值需要用 Object.getOwnPropertySymbols() 方法

### forEach 和 for...of

forEach 循环无法中途跳出，break 命令或 return 命令都不能奏效

for...of 循环可以与 break、continue 和 return 配合使用，跳出循环

```js
let arr = [1, 2, 3, 5, 9]
arr.forEach((item) => {
  if (item % 2 === 0) {
    return
  }
  console.log('item', item)
})

for (let item of arr) {
  if (item % 2 === 0) {
    break
  }
  console.log('item', item)
}
// item 1
```

## 参考

[for in 和 for of 的区别](https://www.cnblogs.com/rogerwu/p/10738776.html)
