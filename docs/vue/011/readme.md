# Vue2/3 响应式对数组的处理

## Object.defineProperty 的缺陷

如果通过下标方式修改数组数据或者给对象新增属性并不会触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作，更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 Vue 内部通过重写函数的方式解决了这个问题。

原因：

其实说白了就是vue的监听机制都是通过defineproperty来实现的，但是不能检测对象新添加的属性，对象可以初始化的时候就设置好属性，不加新属性，数组也是对象，然而如果要求数组初始化的时候就设置好所有属性(索引)，不能新增索性(改变长度)，显然是不可能的，那么要数组也就没用了。


具体来说有以下几种情况：

1.直接改变数组的length

2.通过索引改变数组或通过键改变对象的值

3.初始渲染时data中的数组或对象没有初始化某个键值，但是后来动态的添加了，数据能检测到但不能热更新

对于第一个问题，Vue 提供了一个 API 解决 Vue.$set，
数组的话可以用 splice 方法来触发更新

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 判断是否为数组且下标是否有效
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 调用 splice 函数触发派发更新 
    // 该函数已被重写
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val) 
    return val
  }
  // 判断 key 是否已经存在
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  // 如果对象不是响应式对象，就赋值返回
  if (!ob) {
    target[key] = val
    return val
  }
  // 进行双向绑定
  defineReactive(ob.value, key, val)
  // 手动派发更新
  ob.dep.notify()
  return val
}
```

对于数组而言，Vue 内部重写了以下函数实现派发更新：拦截并覆盖数组的原型

```js
// 获得数组原型
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// 重写以下函数
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach(function (method) {
  // 缓存原生函数
  const original = arrayProto[method]
  // 重写函数
  def(arrayMethods, method, function mutator (...args) {
  // 先调用原生函数获得结果
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    // 调用以下几个函数时，监听新数据
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 手动派发更新
    ob.dep.notify()
    return result
  })
})
```
## 深度递归监听数组

## Proxy 和 Object.defineProperty

Object.defineProperty 是遍历劫持对象的每一个属性（key），进行监听处理
而 Proxy 是劫持一整个对象

## 生命周期钩子函数

在 beforeCreate 钩子函数调用的时候，是获取不到 props 或者 data 中的数据的，因为这些数据的初始化都在 initState 中。

然后会执行 created 钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的。

接下来会先执行 beforeMount 钩子函数，开始创建 VDOM，最后执行 mounted 钩子，并将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。

接下来是数据更新时会调用的钩子函数 beforeUpdate 和 updated，这两个钩子函数没什么好说的，就是分别在数据更新前和更新后会调用。

另外还有 keep-alive 独有的生命周期，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

最后就是销毁组件的钩子函数 beforeDestroy 和 destroyed。前者适合移除事件、定时器等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 destroyed 钩子函数。

## 参考

https://zhuanlan.zhihu.com/p/365479507