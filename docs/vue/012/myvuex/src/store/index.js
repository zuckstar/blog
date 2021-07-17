import Vue from "vue";
import Vuex from './myVuex' // 引入自己的 Vuex 文件

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    num: 0
  },
  getters: {
    getNum: (state) => {
      return state.num
    }
  },
  mutations: {
    increseNumber: (state, arg) => {
      state.num += arg
    }
  },
  actions: {
    asyncIncre({commit},arg){
      setTimeout(()=>{
        commit('increseNumber',arg)
      },1000)
    }
  },
  modules: {},
});
