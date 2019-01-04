import Vue from 'vue'
import router from './router/index'
import store from './vuex/store'

Vue.use(router)

Vue.config.productionTip = true

const app = new Vue({
  router,
  store
})

app.$mount('#app')
