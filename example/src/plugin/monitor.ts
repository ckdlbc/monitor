import Monitor from '@monitor/engine'
import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import EventCollector from '@monitor/collector-track'

const monitor = new Monitor('xxx', {
  Vue,
  router,
  debug: true,
  uid: () => '123' || ''
})
