# Vue3 响应式原理

## 基本的函数更新模型
目的，每次 a、b 值更新的时候，c都同步更新
```js
let a = 1
let b = 2
let c = 0

const effect = () => {
  c = a * b
}

let dep = new Set() // 注意这里我们使用 Set 来定义 dep，原因就是 Set 本身不能添加重复的 key，读写都非常方便。
 
let track = () => {
  dep.add(effect)
}

let trigger = () => {
  dep.forEach(effect => effect())
}

track() // 收集依赖
effect() // 首次执行更新 c 的值


console.log(c)

a = 2
trigger() // 触发执行

console.log(c)
```

## 响应一个对象的不同属性

通常情况，我们定义的对象都有很多的属性，每一个属性都需要有自己的 dep（即每个属性都需要把那些依赖了自己的effect记录下来放进自己的 new Set() 中），如何来实现这样的功能呢?
```js
const obj = { a: 10, b: 20 }

let timesA = obj.a * 10
let timesB = obj.b * 10

const depsMap = new Map() // 每一项都是一个 Set 对象

const effectA = () => {
  timesA = obj.a * 10
}
const effectB = () => {
  timesB = obj.b * 10
}


function track (key, effect) {
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }
  dep.add(effect)
}

function trigger(key) {
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
  }
}
track('a', effectA)
track('b', effectB)

obj.a = 2
obj.b = 3

trigger('a')
trigger('b')

console.log(timesA, timesB)
```

## 响应多个对象
- targetMap: 存放每个响应式对象（所有属性）的依赖项
- targetMap: 存放响应式对象每个属性对应的依赖项
- dep: 存放某个属性对应的所有依赖项（当这个对象对应属性的值发生变化时，这些依赖项函数会重新执行）
```js
// 利用 WeakMap 可以把对象当作 key
const targetMap = new WeakMap()  // 存储不同对象

function track (target, key, effect) {

  // 根据传入不同的 target 对象，能获取不同的 depsMap
  let depsMap = targetMap.get(target) // 存储对象的不同属性
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map()) 
  }

  let dep = depsMap.get(key) // 存储属性的方法数组
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }
  dep.add(effect) 
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (depsMap) {
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach(effect => effect());
    }
  }
}
```

## Proxy

```js
let proxiedObj = new Proxy(obj, {
  get (target, key) {
    console.log('Get')
    return target[key]
  }
})

console.log(proxiedObj.a) 
// Get
// 10
``` 
## Reflect

### 原型继承的问题

```js
const obj = {
  a: 10,
  get b () {
    return this.a
  }
}

let proxiedObj = new Proxy(obj, {
  get (target, key) {
    console.log('Get')
    return target[key]
  }
})


let childObj = Object.create(proxiedObj)

childObj.a = 2

console.log(childObj.b) // 期望返回2，实际返回10

```
原型继承导致 this 指向出错，原本期望的是返回 2，但实际上 childObj.b 不存在，便去 proxy 上原型找 b，触发了 proxy 中的 get 方法，从原始对象中返回了 target[key]。

为了解决这个问题，我们就需要用到 Reflect

### Reflect.receiver

捕获器 get 有第三个参数叫做 receiver。

Proxy 中 handler.get(target, prop, receiver) 中的参数 receiver ：Proxy 或者继承 Proxy 的对象。
Reflect.get(target, prop, receiver) 中的参数 receiver ：如果 target 对象中指定了 getter，receiver 则为 getter 调用时的 this 值。

这确保了当我们的对象从另一个对象继承了值或函数时使用 this 值的正确性。

修改上述例子如下：

```js
const obj = {
  a: 10,
  get b () {
    return this.a
  }
}

let proxiedObj = new Proxy(obj, {
  get (target, key, receiver) {
    console.log('Get')
    return Reflect.get(target, key, receiver)
  }
})


let childObj = Object.create(proxiedObj)

childObj.a = 2

console.log(childObj.b) // 期望返回2，实际返回2
```

## 实现 Reactive 函数

### 完善 proxy 示例代码

```js
let proxiedObj = new Proxy(obj, {
  get (target, key, receiver) {
    console.log('Get')
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    console.log('Set')
    return Reflect.set(target, key, value, receiver)
  }
})
```

### 封装 Proxy 代码为 Reactive

```js
const reactiveHandler = {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver)
  }
}

function reactive (target) {
  return new Proxy(target, reactiveHandler)
}
```

### reactiveHandler 结合 track 和 trigger

```js

const targetMap = new WeakMap()

let timesA = 0
let divideA = 0

const effectTimesA = function () {
  timesA = obj.a * 10
}

const effectDivideA = function () {
  divideA = obj.a / 10
}


const reactiveHandler = {
  get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver)
    track(target, key)
    return result
  },
  set(target, key, value, receiver) {
    const oldVal = target[key]
    const result = Reflect.set(target, key, value, receiver)

    if(oldVal !== result) {
      trigger(target, key)
    }
    return result
  }
}

function track (target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }
  // dep.add(effect) 
  if(key === 'a'){
    dep.add(effectTimesA)
    dep.add(effectDivideA)
  }
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (depsMap) {
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach(effect => effect());
    }
  }
}

function reactive (target) {
  return new Proxy(target, reactiveHandler)
}

const obj = reactive({a: 10})

effectTimesA()
effectDivideA()

console.log(timesA, divideA) // 100, 1

obj.a = 200

console.log(timesA, divideA) // 2000. 20
```
现在的代码中已经去除了手动 track 和 trigger 相关的代码，实现了 reactive 函数，但是还有如下问题：
- track 函数中的 effect 现在还没处理，只能手动添加
- reactive 现在只能作用于对象，基本类型变量怎么处理？

## activeEffect 和 ref

在 effect 执行的时候，我们也访问了 obj.a, 因此也会触发 track 收集该依赖并 effect。
同理 console.log(obj.a) 这一行也同样触发了 track，但这并不是响应式代码，我们预期不触发 track。

我们想要的是只在 effect 中的代码才触发 track。

能想到怎么来实现吗？

### 只响应需要依赖更新的代码（effect）
```js

const targetMap = new WeakMap()
let acctiveEffect = null


function effect (eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

const reactiveHandler = {
  get (target, key, receiver) {
    console.log("Get")
    const result = Reflect.get(target, key, receiver)
    track(target, key)
    return result
  },
  set (target, key, value, receiver) {
    console.log("Set")
    const oldVal = target[key]
    const result = Reflect.set(target, key, value, receiver)

    if(oldVal !== result) {
      trigger(target, key)
    }
    return result
  }
}

function track (target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, depsMap = new Map())
    }
  
    let dep = depsMap.get(key)

    if (!dep) {
      depsMap.set(key, dep = new Set())
    }

    dep.add(activeEffect) 
  }
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (depsMap) {
    let dep = depsMap.get(key)
    if (dep) {
      dep.forEach(effect => effect());
    }
  }
}

function reactive (target) {
  return new Proxy(target, reactiveHandler)
}

const obj = reactive({a: 10})

let timesA = 0

effect(() => {
  timesA = obj.a * 10
})

console.log(timesA) // 100

obj.a = 200

console.log(timesA) // 2000
```

利用 acctiveEffect、effect，实现代码不重复响应，并且只针对对应的函数响应

## 实现 ref，来包装基本类型变量
可以用两种方法来实现 ref

1. 直接给一个对象添加 value 属性, 用 reactive 包装并返回


```js
function ref(intialValue) {
  return reactive({
    value: intialValue
  })
}

let refValue = ref(0)
let sum = 0

effect(() => {
  sum = refValue.value + 1
})

console.log(sum)  // 1

refValue.value = 100

console.log(sum) // 101
```

2. 用 getter 和 setter 来实现
```js
function ref(raw) {
  const r = {
    get value () {
      track(r, 'value')
      return raw
    },
    set value (newVal) {
      raw = newVal
      trigger(r, 'value')
    }
  }
  return r
}
```

实际上 vue3 是使用第二种方式来实现的，主要有三方面原因：

- 1.根据定义，ref 应该只有一个公开的属性，即 value，如果使用了 reactive 你可以给这个变量增加新的属性，这其实就破坏了 ref 的设计目的，它应该只用来包装一个内部的 value 而不应该作为一个通用的 reactive 对象；

- 2.Vue 3中有一个 isRef 函数，用来判断一个对象是 ref 对象而不是 reactive 对象，这种判断在很多场景都是非常有必要的；

- 3.性能方面考虑，Vue 3中的 reactive 做的事情远比第二种实现 ref 的方法多，比如有各种检查。
## Computed 的简单实现
思考一下 computed 应该是什么样的？

- 返回响应式对象，也许是 ref()
- 内部需要执行 effect 函数以收集依赖

```js
function computed (getter) {
  const result = ref()
  effect(() => result.value = getter())
  return result
}

let obj = reactive({ a: 10, b: 20 })
let timesA = computed(() => obj.a * 10)
let sum = computed(() => timesA.value + obj.b)


console.log(timesA.value, sum.value)

obj.a = 100

console.log(timesA.value, sum.value)
```

## 参考

https://segmentfault.com/a/1190000022871354