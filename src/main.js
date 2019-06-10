import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import App from './App.vue'
import router from './router/index'
import store from './store'
import './assets/Icons/iconfont.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

console.log(process.env.VUE_APP_URL)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
