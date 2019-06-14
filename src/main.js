import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import App from './App.vue';
import router from './router/index';
import '@/router/routerMonitor';
import store from './store/index';
import './assets/Icons/iconfont.css';


Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
/* eslint-disable */
// new Vue({
//     el: '#app',
//     router,
//     store,
//     components: { App },
//     // template: '<App/>'
// });
