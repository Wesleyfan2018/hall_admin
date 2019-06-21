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
    // 选择界面
    {
        path: '/sel-project',
        name: 'sel-project',
        component: _import('sel-project/index'),
    },
    // 首页
    {
        path: '/',
        name: 'dashboard',
        component: layout,
        children: [
            // 首页
            {
                path: '/',
                name: 'index',
                component: _import('dashboard/index'),
            }
        ]
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes: constantRouterMap
});