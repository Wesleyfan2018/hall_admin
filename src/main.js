import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
// import axios from 'axios';
// import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router/index';
import './accessControl';
import store from './store/index';
import './assets/Icons/iconfont.css';


Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.use(VueAxios, axios);

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
