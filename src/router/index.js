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
        name: 'Dashboard',
        component: layout,
        meta: { keepAlive: true },
        children: [
            // 首页
            {
                path: '/',
                name: 'index',
                component: _import('dashboard/index'),
            },
            // 修改密码
            {
                path: '/changepwd',
                name: 'changePwd',
                component: _import('changePwd/index'),
            },
            {
                path: '/test1',
                name: 'Test1',
                component: _import('test/test1'),
            },
            {
                path: '/test2',
                name: 'Test2',
                component: _import('test/test2'),
            }
        ]
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes: constantRouterMap
});