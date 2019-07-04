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
            }
        ]
    },
    // 系统管理
    {
        path: '/',
        name: 'Dashboard',
        component: layout,
        meta: { keepAlive: true },
        children: [
            {
                path: '/sys-manage/user-list',
                name: 'UserList',
                component: _import('SysManage/UserList'),
            },
            {
                path: '/sys-manage/logon-record',
                name: 'LogonRecord',
                component: _import('SysManage/LogonRecord'),
            },
            {
                path: '/sys-manage/demo',
                name: 'DemoPage',
                component: _import('SysManage/demoPage'),
            },
        ]
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes: constantRouterMap
});