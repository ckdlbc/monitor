<template>
  <div class="about">
    <h1 @click="aaa">This is an about page</h1>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
@Component
export default class About extends Vue {
  aaa() {
    bbbb
    axios.get('/aa')
  }
  mounted() {
    axios.get('/aa')
  }
}
</script>
