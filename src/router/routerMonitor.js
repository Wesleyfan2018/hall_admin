import router from '@/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken, removeToken, getEncData } from '@/utils/auth';
// import store from '@/store';
NProgress.configure({ showSpinner: false });

// 路由白名单
const loginPage = '/login';
const whiteList = [loginPage];
router.beforeEach((to, from, next) => {
    NProgress.start();
    let token = getToken();
    let toPath = to.path;
    let loginInfo = getEncData('loginInfo');
    // 非登录页
    if (whiteList.indexOf(toPath) === -1) {
        if (token && loginInfo) {
            next();
        } else {
            // Toast('用户未登录，请先登录');
            next(loginPage);
        }
    } else {
        removeToken();
        localStorage.removeItem('userInfoData');
        next();
    }
});

router.afterEach(() => {
    NProgress.done();
});
