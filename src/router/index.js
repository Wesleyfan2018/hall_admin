
// export default new Router({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes: [
//         {
//             path: '/',
//             name: 'Dashboard',
//             component: () => import('@/views/Dashboard.vue')
//         },
//         {
//             path: '/login',
//             name: 'Login',
//             component: () => import('@/views/login/index.vue')
//         }
//     ]
// });


import Vue from 'vue';
import Router from 'vue-router';
import layout from '../views/layout/layout.vue';
const _import = require('./_import_' + process.env.NODE_ENV);
Vue.use(Router);
export const constantRouterMap = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: _import('login/index'),
    },
    // 首页
    {
        path: '/',
        name: 'home',
        component: layout,
        children: [
            // 首页
            {
                path: '/',
                name: 'index',
                component: _import('home/index'),
            }
        ]
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes: constantRouterMap
});