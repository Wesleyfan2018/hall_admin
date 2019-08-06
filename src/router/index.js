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
                path: '/sys-manage/actor',
                name: 'Actor',
                component: _import('SysManage/actor'),
            },
            {
                path: '/sys-manage/logon-record',
                name: 'LogonRecord',
                component: _import('SysManage/LogonRecord'),
            },
            {
                path: '/sys-manage/menu',
                name: 'Menu',
                component: _import('SysManage/menu'),
            }


        ]
    },
    // 业务
    {
        path: '/',
        name: 'Dashboard',
        component: layout,
        meta: { keepAlive: true },
        children: [
            {
                path: '/business/smslog',
                name: 'smslog',
                component: _import('business/smslog'),
            },
            {
                path: '/business/exchangelog',
                name: 'Exchangelog',
                component: _import('business/exchangelog'),
            },
            {
                path: '/business/userinfo',
                name: 'userinfo',
                component: _import('business/userinfo'),
            },



        ]
    },
    // 调试工具
    {
        path: '/',
        name: 'Dashboard',
        component: layout,
        meta: { keepAlive: true },
        children: [
            {
                path: '/debug/run',
                name: 'phprun',
                component: _import('debug/run'),
            },
            {
                path: '/debug/logs',
                name: 'index',
                component: _import('debug/logs'),
            },
            {
                path: '/debug/statistics',
                name: 'statistics',
                component: _import('debug/statistics'),
            },
        ]
    },
    // 配置管理
    {
        path: '/',
        name: 'Dashboard',
        component: layout,
        meta: { keepAlive: true },
        children: [
            {
                path: '/confmanage/exchangetag',
                name: 'index',
                component: _import('ConfManage/exchangeTag'),
            },
            {
                path: '/confmanage/sendlog',
                name: 'index',
                component: _import('ConfManage/sendlog'),
            },
        ]
    },
    // 页面demo
    {
        path: '/',
        name: 'Dashboard',
        component: layout,
        meta: { keepAlive: true },
        children: [
            {
                path: '/demo-module/demo1',
                name: 'Demo1',
                component: _import('DemoModule/demo1'),
            },
            {
                path: '/demo-module/demo2',
                name: 'Demo2',
                component: _import('DemoModule/demo2'),
            }
        ]
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes: constantRouterMap
});