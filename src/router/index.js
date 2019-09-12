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
        // meta: { keepAlive: true },
        component: _import('login/index')
    },
    // 选择界面
    {
        path: '/sel-project',
        name: 'sel-project',
        meta: { keepAlive: true },
        component: _import('sel-project/index')
    },
    // 首页
    {
        path: '/',
        // name: "Dashboard",
        component: layout,
        children: [
            // 首页
            {
                path: '/',
                name: 'index',
                meta: { keepAlive: true },
                component: _import('dashboard/index')
            },
            // 修改密码
            {
                path: '/changepwd',
                name: 'changePwd',
                meta: { keepAlive: true },
                component: _import('changePwd/index')
            }
        ]
    },
    // 数据统计
    {
        path: '/stat',
        // name: "stat",
        component: layout,
        children: [
            {
                path: '/stat/overview',
                name: 'overview',
                meta: { keepAlive: true },
                component: _import('stat/overview')
            },
            {
                path: '/stat/online',
                name: 'online',
                meta: { keepAlive: true },
                component: _import('stat/online')
            },
            {
                path: '/stat/onlineDau',
                name: 'onlineDau',
                meta: { keepAlive: true },
                component: _import('stat/onlineDau')
            },
            {
                path: '/stat/userRemain',
                name: 'userRemain',
                meta: { keepAlive: true },
                component: _import('stat/userRemain')
            },
            {
                path: '/stat/realBrief',
                name: 'realBrief',
                meta: { keepAlive: true },
                component: _import('stat/realBrief')
            },
            {
                path: '/stat/onlineRecharge',
                name: 'onlineRecharge',
                meta: { keepAlive: true },
                component: _import('stat/onlineRecharge')
            },
            {
                path: '/stat/onlineReg',
                name: 'onlineReg',
                meta: { keepAlive: true },
                component: _import('stat/onlineReg')
            },
            {
                path: '/stat/onlineCoin',
                name: 'onlineCoin',
                meta: { keepAlive: true },
                component: _import('stat/onlineCoin')
            },
            {
                path: '/stat/warmRound',
                name: 'warmRound',
                meta: { keepAlive: true },
                component: _import('stat/warmRound')
            },
            {
                path: '/stat/playRound',
                name: 'playRound',
                meta: { keepAlive: true },
                component: _import('stat/playRound')
            },
            {
                path: '/stat/playScore',
                name: 'playScore',
                meta: { keepAlive: true },
                component: _import('stat/playScore')
            },
            {
                path: '/stat/playWinner',
                name: 'playWinner',
                meta: { keepAlive: true },
                component: _import('stat/playWinner')
            },
            {
                path: '/stat/playMiltiple',
                name: 'playMiltiple',
                meta: { keepAlive: true },
                component: _import('stat/playMiltiple')
            },
            {
                path: '/stat/playStreak',
                name: 'playStreak',
                meta: { keepAlive: true },
                component: _import('stat/playStreak')
            },
            {
                path: '/stat/playTrack',
                name: 'playTrack',
                meta: { keepAlive: true },
                component: _import('stat/playTrack')
            },
            {
                path: '/stat/payScene',
                name: 'payScene',
                meta: { keepAlive: true },
                component: _import('stat/payScene')
            },
            {
                path: '/stat/sharehub',
                name: 'statSharehub',
                meta: { keepAlive: true },
                component: _import('stat/shareHub')
            }


        ]
    },
    // 系统管理
    {
        path: '/sys-manage',
        // name: "Dashboard",
        component: layout,
        children: [
            {
                path: '/sys-manage/user-list',
                name: 'UserList',
                meta: { keepAlive: true },
                component: _import('SysManage/UserList')
            },
            {
                path: '/sys-manage/actor',
                name: 'Actor',
                meta: { keepAlive: true },
                component: _import('SysManage/actor')
            },
            {
                path: '/sys-manage/logon-record',
                name: 'LogonRecord',
                meta: { keepAlive: true },
                component: _import('SysManage/LogonRecord')
            },
            {
                path: '/sys-manage/menu',
                name: 'Menu',
                meta: { keepAlive: true },
                component: _import('SysManage/menu')
            },
            {
                path: '/sys-manage/SendConf',
                name: 'SendConf',
                meta: { keepAlive: true },
                component: _import('SysManage/SendConf')
            },
            {
                path: '/sys-manage/sendlog',
                name: 'sendlog',
                meta: { keepAlive: true },
                component: _import('SysManage/SendLog')
            },



        ]
    },
    // 业务
    {
        path: '/business',
        // name: "Dashboard",
        component: layout,
        children: [
            {
                path: '/business/smslog',
                name: 'smslog',
                meta: { keepAlive: true },
                component: _import('business/smslog')
            },
            {
                path: '/business/exchangelog',
                name: 'Exchangelog',
                meta: { keepAlive: true },
                component: _import('business/exchangelog')
            },
            {
                path: '/business/userinfo',
                name: 'userinfo',
                meta: { keepAlive: true },
                component: _import('business/userinfo')
            },
            {
                path: '/business/cashlog',
                name: 'cashlog',
                meta: { keepAlive: true },
                component: _import('business/cashlog')
            },
            {
                path: '/business/rechargelog',
                name: 'rechargelog',
                meta: { keepAlive: true },
                component: _import('business/rechargelog')
            },
            {
                path: '/business/phonefeelog',
                name: 'phonefeelog',
                meta: { keepAlive: true },
                component: _import('business/phoneFeeLog')
            },
            {
                path: '/business/drawRecord',
                name: 'drawRecord',
                meta: { keepAlive: true },
                component: _import('business/drawRecord')
            },
            {
                path: '/business/catVerCode',
                name: 'catVerCode',
                meta: { keepAlive: true },
                component: _import('business/catvercode')
            },
            {
                path: '/business/qrcode',
                name: 'qrcode',
                meta: { keepAlive: true },
                component: _import('business/qrcode')
            },
            {
                path: '/business/currencyRecord',
                name: 'currencyRecord',
                meta: { keepAlive: true },
                component: _import('business/currencyRecord')
            },
            {
                path: '/business/redticketRecord',
                name: 'redticketRecord',
                meta: { keepAlive: true },
                component: _import('business/redticketRecord')
            }
        ]
    },
    // 调试工具
    {
        path: '/debug',
        // name: "Dashboard",
        component: layout,
        children: [
            {
                path: '/debug/run',
                name: 'phprun',
                meta: { keepAlive: true },
                component: _import('debug/run')
            },
            {
                path: '/debug/logs',
                name: 'index',
                meta: { keepAlive: true },
                component: _import('debug/logs')
            },
            {
                path: '/debug/operalog',
                name: 'index',
                meta: { keepAlive: true },
                component: _import('debug/operalog')
            },
            {
                path: '/debug/statistics',
                name: 'statistics',
                meta: { keepAlive: true },
                component: _import('debug/statistics')
            },
            {
                path: '/debug/apiTest',
                name: 'apiTest',
                meta: { keepAlive: true },
                component: _import('debug/apiTest')
            },
            {
                path: '/debug/generalOss',
                name: 'generalOss',
                meta: { keepAlive: true },
                component: _import('debug/generaloss')
            },



        ]
    },
    // 配置管理
    {
        path: '/confmanage',
        // name: "Dashboard",
        component: layout,
        children: [
            {
                path: '/confmanage/exchangetag',
                name: 'index',
                meta: { keepAlive: true },
                component: _import('ConfManage/exchangeTag')
            },
            {
                path: '/confmanage/sendlog',
                name: 'index',
                meta: { keepAlive: true },
                component: _import('ConfManage/sendlog')
            },
            {
                path: '/confmanage/shareconf',
                name: 'shareConf',
                meta: { keepAlive: true },
                component: _import('ConfManage/shareConf')
            },
            {
                path: '/confmanage/wxconf',
                name: 'wxconf',
                meta: { keepAlive: true },
                component: _import('ConfManage/wxconf')
            },
            {
                path: '/confmanage/channelconf',
                name: 'channelconf',
                meta: { keepAlive: true },
                component: _import('ConfManage/channelconf')
            },
            {
                path: '/confmanage/chaseRace',
                name: 'chaseRace',
                meta: { keepAlive: true },
                component: _import('ConfManage/chaseRace')
            }
        ]
    },
    // 页面demo
    {
        path: '/demo-module',
        // name: "Dashboard",
        component: layout,
        children: [
            {
                path: '/demo-module/demo1',
                name: 'Demo1',
                component: _import('DemoModule/demo1'),
                meta: { keepAlive: true }
            },
            {
                path: '/demo-module/demo2',
                name: 'Demo2',
                component: _import('DemoModule/demo2'),
                meta: { keepAlive: true }
            }
        ]
    },

    // 图表类
    {
        path: '/echarts',
        // name: "Dashboard",
        component: layout,
        children: [
            {
                path: '/echarts/demo',
                name: 'demo',
                meta: { keepAlive: true },
                component: _import('echarts/demo')
            }
        ]
    },
    {
        path: '*',
        redirect: '/'
    }
];
export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes: constantRouterMap
});
