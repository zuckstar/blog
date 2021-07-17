import Vue from "vue"

class Store {
  constructor(options) {

    // 初始化 state
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    const store = this

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

    // 初始化 mutations
    let mutations = options.mutations || {}
    this.mutations = {}

    // 给每个 mutations 注册方法
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (arg) => {
        mutations[mutationName](this.state, arg)
      }
    })

    // 初始化 actions
    let actions = options.actions
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      this.actions[actionName] = (arg) => {
        // 这里的 this 指的是 store 实例本身
        actions[actionName](store, arg)
      }
    })

    
    const { dispatch, commit } = this

    // 重写 this.dispatch 绑定当前 this 对象
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }

    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload)
    }
  }

  dispatch (type, payload) {
    this.actions[type](payload)
  }

  commit (type, payload) {
    this.mutations[type](payload)
  }


  get state () {
    // 响应式保证 this.state 的值是最新的
    return this.vm.state
  }
}

let install = function () {
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.store) {
        // 如果是根组件
        this.$store = this.$options.store;
      } else {
        // 如果是子组件， 这里是引用的复制，因此每个组件都拥有了同一个$store挂载在它身上。
        this.$store = this.$parent && this.$parent.$store;
      }
    }
  })
}

let Vuex = {
  Store,
  install
}

export default Vuex