import Vue from 'vue'
// import VueRouter from 'vue-router'

import VueRouter from './vue-router'
// VueRouter 是一个类
import routes from './router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash', //  #/
  // mode: 'history', // /
  routes
})
