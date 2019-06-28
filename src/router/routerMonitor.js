import router from '@/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getStorageData, removeStorageData } from '@/utils/auth';
// import store from '@/store';
NProgress.configure({ showSpinner: false });

// 路由白名单
const loginPage = '/login';
const whiteList = [loginPage];
router.beforeEach((to, from, next) => {
    NProgress.start();
    let token = getStorageData('token');
    let toPath = to.path;
    let userInfo = getStorageData('userInfo');
    // 非登录页
    if (whiteList.indexOf(toPath) === -1) {
        if (token && userInfo) {
            next();
        } else {
            // Toast('用户未登录，请先登录');
            next(loginPage);
        }
    } else {
        removeStorageData('token');
        removeStorageData('userInfo');
        next();
    }
});

router.afterEach(() => {
    NProgress.done();
});
