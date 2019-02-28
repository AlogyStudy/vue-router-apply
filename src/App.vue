<template>
  <div id="app">
    <div>HelloWorld</div>

    <router-link tag="div" to="/home">Home</router-link>
    &nbsp;&nbsp;
    <router-link tag="div" to="/about">About</router-link>

    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  mounted () {
    console.log(this.$router, '$router')
    console.log(this.$route, '$route')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
