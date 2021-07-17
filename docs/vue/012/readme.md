# 012 手写 Vuex 核心原理解析

## 剖析Vuex本质

Vue项目中是怎么引入Vuex。

- 1. 安装Vuex，再通过import Vuex from 'vuex'引入

- 2. 先 var store = new Vuex.Store({...}),再把store作为参数的一个属性值，new Vue({store})

- 3. 通过Vue.use(Vuex) 使得每个组件都可以拥有store实例

由代码：
```js
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});
```
可知，我们引入的Vuex中有Store这个类作为Vuex对象的一个属性,

由 `Vue.use(Vuex);` 可知，Vuex有有install这个方法。Vue.use的一个原则就是执行对象的install这个方法。
由此推理 Vuex.js 对象如下：

```js
class Store {

}

let install = function () {

}

let Vuex = {
  Store,
  install
}

export default Vuex
```

## 分析 Vue.use

Vue.use(plugin);

### 参数

```js
{ Object | Function } plugin
```

### 用法

安装Vue.js插件。如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法。调用install方法时，会将Vue作为参数传入。install方法被同一个插件多次调用时，插件也只会被安装一次。

### 作用

注册插件，此时只需要调用install方法并将Vue作为参数传入即可。但在细节上有两部分逻辑要处理：

1、插件的类型，可以是install方法，也可以是一个包含install方法的对象。

2、插件只能被安装一次，保证插件列表中不能有重复的插件。

### 实现

```js
Vue.use = function(plugin) {
  // 初始化插件列表
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))

  // 查找插件是否存在
  if(installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  const args = toArray(arguments, 1) // 去除第一个插件参数
  args.unshift(this)  // 参数列表推入 vue 实例

  if(typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args) // 在 vue 实例身上执行 plugin 的 install 方法
  } else if(typeof plugin === 'function') {
    plugin.apply(null, args) // 直接执行该方法
  }
  installedPlugins.push(plugin) // 将插件添加到installedPlugins中，保证相同的插件不会反复被注册。
  return this
} 

```

## 完善 install 方法

```js
let install = function (Vue) {
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.store) {
        // 如果是根组件
        this.$store = this.$options.store;
      } else {
        // 如果是子组件
        this.$store = this.$parent && this.$parent.$store;
      }
    }
  })
}
```
代码解析：

1. 参数Vue的作用：我们在分析Vue.use的时候，在执行install的时候，会将Vue实例作为参数传进去。

2. mixin的作用是将mixin的内容混合到Vue的初始参数options中。相信使用vue的同学应该使用过mixin了。

3. 为什么是beforeCreate而不是created呢？因为如果是在created操作的话，$options已经初始化好了。

4. 如果判断当前组件是根组件的话，就将我们传入的store挂在到根组件实例上，属性名为$store。
如果判断当前组件是子组件的话，就将我们根组件的$store也复制给子组件。注意是引用的复制，因此每个组件都拥有了同一个$store挂载在它身上。


可知，在执行子组件的beforeCreate的时候，父组件已经执行完beforeCreate了，那理所当然父组件已经有$store了


## 实现 Vuex 的 state

初始化 state：

```js
class Store{
    constructor(options){
        this.state = options.state || {}
        
    }
}
```

### 实现响应式

```js
class Store {
  constructor(options) {
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })
  }

  get state () {
    return this.vm.state
  }
}
```
那要怎么实现响应式呢？ 我们知道，我们new Vue（）的时候，传入的data是响应式的，那我们是不是可以new 一个Vue，然后把state当作data传入呢？ 没有错，就是这样。

我们可以给Store类添加一个state属性。这个属性自动触发get接口。这是ES6的语法，有点类似于Object.defineProperty的get接口。

## 实现 getters
```js
class Store {
  constructor(options) {

    // 初始化 state
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    // 初始化 getters
    let getters = options.getters || {}
    this.getters = {}

    Object.keys(getters).forEach(getterName => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return getters[getterName](this.state)
        }
      })
    })
  }

  get state () {
    return this.vm.state
  }
}
```

## 实现 mutation
```js
class Store {
  constructor(options) {
    //...

    // 初始化 mutations
    let mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (arg) => {
        mutations[mutationName](this.state, arg)
      }
    })
  }
  // 提供 commit 方法调用 mutations 
  commit (method, arg) {
    this.mutations[method](arg)
  }

  get state () {
    return this.vm.state
  }
}
```

## 实现 actions 

```js
class Store {
  constructor(options) {
    // ... 

    // 初始化 actions
    let actions = options.actions
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      this.actions[actionName] = (arg) => {
        // 这里的 this 指的是 store 实例本身
        actions[actionName](this, arg)
      }
    })
  }

  dispatch (method, arg) {
    this.actions[method](arg)
  }
```
有一点需要解释下，就是这里 ` actions[actionName](this, arg)`为什么是传this进去。这个this代表的就是store实例本身

这是因为我们使用actions是这样使用的：

```js
  actions: {
    asyncIncre({commit},arg){
        setTimeout(()=>{
          commit('incre',arg)
        },1000)
    }
  },
```

其实{commit} 就是对this，即store实例的解构
但是这时候会发现，在执行 asyncIncre 中的 commit 的方法的时候，会报错，此时 commit 中的 this.mutations, 的 this 指向已经不是 store 实例了，这里要在 Store 初始化的时候，对其中的方法做 this 绑定。

```js
class Store {
  constructor(options) {

    // ... 加在构造器末尾

    const store = this

    const { dispatch, commit } = this

    // 重写 this.dispatch 绑定当前 this 对象
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }

    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload)
    }
  }
```

## 参考

https://zhuanlan.zhihu.com/p/166087818