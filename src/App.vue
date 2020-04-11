<template>
  <div id="app">
    <PowerCalc/>
  </div>
</template>

<script>
import PowerCalc from './components/PowerCalc.vue'

export default {
  name: 'App',
  components: {
    PowerCalc
  }
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
