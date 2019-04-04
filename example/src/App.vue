<template>
  <div id="app">
    <div id="nav">
      <span @click="go">
        <router-link to="/">Home</router-link>
      </span>
      |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { trackEvent } from '@monitor/collector-track/src'
@Component
export default class App extends Vue {
  go() {
    trackEvent('gogogo')
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
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
