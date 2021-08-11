# Vue 的通信方式

常见使用场景可以分为三类：

- 父子通信：
  父向子传递数据是通过 props，子向父是通过 events（`$emit`）；通过父链 / 子链也可以通信（`$parent` / `$children`）；ref 也可以访问组件实例；provide / inject API；`$attrs/$listeners`

- 兄弟通信：
  Bus；Vuex

- 跨级通信：
  Bus；Vuex；provide / inject API、`$attrs/$listeners`

## 父子组件通信

### props & $emit

父组件通过 props 向下传递数据给子组件。（组件中的数据共有三种形式：data、props、computed）

```Vue
//App.vue父组件
<template>
  <div id="app">
    <users v-bind:users="users"></users>//前者自定义名称便于子组件调用，后者要传递数据名
  </div>
</template>
<script>
import Users from "./components/Users"
export default {
  name: 'App',
  data(){
    return{
      users:["Henry","Bucky","Emily"]
    }
  },
  components:{
    "users":Users
  }
}
```

```Vue
//users子组件
<template>
  <div class="hello">
    <ul>
      <li v-for="user in users">{{user}}</li>//遍历传递过来的值，然后呈现到页面
    </ul>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props:{
    users:{           //这个就是父组件中子标签自定义名字
      type:Array,
      required:true
    }
  }
}
</script>
```

子组件通过events给父组件发送消息，实际上就是子组件把自己的数据发送到父组件。

```Vue
// 子组件
<template>
  <header>
    <h1 @click="changeTitle">{{title}}</h1>//绑定一个点击事件
  </header>
</template>
<script>
export default {
  name: 'app-header',
  data() {
    return {
      title:"Vue.js Demo"
    }
  },
  methods:{
    changeTitle() {
      this.$emit("titleChanged","子向父组件传值");//自定义事件  传递值“子向父组件传值”
    }
  }
}
</script>
```

```Vue
// 父组件
<template>
  <div id="app">
    <app-header v-on:titleChanged="updateTitle" ></app-header>//与子组件titleChanged自定义事件保持一致
   // updateTitle($event)接受传递过来的文字
    <h2>{{title}}</h2>
  </div>
</template>
<script>
import Header from "./components/Header"
export default {
  name: 'App',
  data(){
    return{
      title:"传递的是一个值"
    }
  },
  methods:{
    updateTitle(e){   //声明这个函数
      this.title = e;
    }
  },
  components:{
   "app-header":Header,
  }
}
</script>
```

[Vue通过$emit实现父子组件的通讯原理](https://juejin.cn/post/6844904115806404615)

### $parent & $children 与 ref



- $parent / $children：访问父 / 子实例

通过 this.$children 可以获取到当前组件的所有子组件，返回的是一个数组，不保证先后顺序
通过 this.$parent 可以获取到父组件实例的数据

- ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例

需要注意的是：这两种都是直接得到组件实例，使用后可以直接调用组件的方法或访问数据。我们先来看个用 ref 来访问组件的例子：

```js
// component-a 子组件
export default {
  data () {
    return {
      title: 'Vue.js'
    }
  },
  methods: {
    sayHello () {
      window.alert('Hello');
    }
  }
}
```

```Vue
// 父组件
<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted () {
      const comA = this.$refs.comA;
      console.log(comA.title);  // Vue.js
      comA.sayHello();  // 弹窗
    }
  }
</script>
```
不过，这两种方法的弊端是，无法在跨级或兄弟间通信.
## 兄弟间通信

### Bus $emit/$on

详见 《JS高阶》 => 事件总线

### Vuex

详见 008 Vuex 状态管理的工作原理

## 跨级通信

### $attrs/$listeners

多级组件嵌套需要传递数据时，通常使用的方法是通过vuex。但如果仅仅是传递数据，而不做中间处理，使用 vuex 处理，未免有点大材小用。为此Vue2.4 版本提供了另一种方法----$attrs/$listeners

- $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 interitAttrs 选项一起使用。

- $listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件

简单来说：$attrs与$listeners 是两个对象，$attrs 里存放的是父组件中绑定的非 Props 属性，$listeners里存放的是父组件中绑定的非原生事件。

### 示例1


- 通过 v-bind="$attrs" 进行传递，属性可以一层一层向下传递

- 通过 v-on="$listeners" 进行传递，可以将父组件传递给孩子节点的非默认事件向下传递

父组件

```Vue
<template>
  <div id="app">
    <ChildCom title="前端" :foo="foo" :coo="coo" :doo="doo" @sayHi="sayHi" />
  </div>
</template>

<script>
import ChildCom from './components/ChildCom.vue'

export default {
  name: 'App',
  components: {
    ChildCom,
  },
  data() {
    return {
      foo: 'foo',
      coo: 'coo',
      doo: 'doo',
    }
  },
  methods: {
    sayHi() {
      console.log('hello world')
    },
  },
}
</script>

```

孩子节点

```Vue
<template>
  <div>
    <h1>孩子节点</h1>
    {{ $attrs }}

    <grand-child v-bind="$attrs" v-on="$listeners"></grand-child>
  </div>
</template>

<script>
import GrandChild from './GrandChildCom.vue'
export default {
  components: {
    GrandChild,
  },
}
</script>

```

孙子组件

```vue
<template>
  <div>
    <h1>孙子</h1>
    {{ $attrs }}
  </div>
</template>

<script>
export default {
  created() {
    this.$listeners.sayHi() // hello world
  },
}
</script>

```

### provide/inject

Vue2.2.0新增API,这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。一言而蔽之：祖先组件中通过provider来提供变量，然后在子孙组件中通过inject来注入变量。

provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

示例


父组件

```vue
<template>
  <div id="app">
    <ChildCom title="前端" />
  </div>
</template>

<script>
import ChildCom from './components/ChildCom.vue'

export default {
  provide: {
    name: 'Vue',
  },
  name: 'App',
  components: {
    ChildCom,
  },
}
</script>

```

任意多层嵌套子组件使用变量

```vue
<template>
  <div>
    <h1>孙子</h1>
    {{ name }} <!-- > Vue <!-->
  </div>
</template>

<script>
export default {
  inject: ['name'],
}
</script>

```

## 参考

[vue组件间通信六种方式](https://segmentfault.com/a/1190000019208626?utm_source=tag-newest)