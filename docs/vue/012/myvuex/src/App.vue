<template>
  <div id="app">
    Hello Vuex!
    <p>state: {{ this.$store.state.num }}</p>
    <p>getter: {{ this.$store.getters.getNum }}</p>
    <button @click="add">+1</button>
    <button @click="asyncAdd">异步+2</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    add() {
      this.$store.commit('increseNumber', 1)
    },
    asyncAdd() {
      this.$store.dispatch('asyncIncre', 2)
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
