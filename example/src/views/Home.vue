<template>
  <div class="home">
    <img src="logo1.png" @click="aaa">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>123213
    <!-- <img src="/aa.png" alt="" id="ididid" name="nameeee" class="bbb"> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '../components/HelloWorld.vue' // @ is an alias to /src
import axios from 'axios'
@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  aaa() {
    this.$trackEvent('aa')
  }
  mounted() {
    axios.get('/aa')
    throw '123'
  }
}
</script>
