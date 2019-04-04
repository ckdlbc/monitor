import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {
    fullPath: (state, allGetters, rootState) => '123'
  }
})
