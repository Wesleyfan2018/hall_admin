import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import App from './App.vue';
import router from './router/index';
// import '@/router/routerMonitor';
import store from './store/index';
import './assets/Icons/iconfont.css';
import '@/styles/index.scss';   // global css
import md5 from 'js-md5';


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$md5 = md5;

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
