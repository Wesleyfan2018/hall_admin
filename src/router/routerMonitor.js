import router from '@/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken, removeToken, setBaseApi, getBaseApi, getEncData } from '@/utils/auth';
import store from '@/store';
NProgress.configure({ showSpinner: false });

// 路由白名单
const loginPage = '/login';
const whiteList = [loginPage];
router.beforeEach((to, from, next) => {
    NProgress.start();
    let token = getToken();
    let toPath = to.path;
    let baseApi = getBaseApi('baseApi');
    let loginInfo = getEncData('loginInfo');
    // 非登录页
    if (whiteList.indexOf(toPath) === -1) {
        if (token && baseApi && loginInfo) {
            next();
        } else {
            // Toast('用户未登录，请先登录');
            next(loginPage);
        }
    } else {
        removeToken();
        baseApi = process.env.VUE_APP_URL;
        localStorage.removeItem('userInfoData');
        next();
    }
    setBaseApi(baseApi);
    store.commit('SET_BASEAPI', baseApi);
});

router.afterEach(() => {
    NProgress.done();
});
