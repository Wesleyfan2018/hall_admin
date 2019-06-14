// import { setToken, setUserInfo } from '@/utils/auth';
import { setToken, getToken, removeToken, getBaseApi, setBaseApi, setEncData, getEncData, getStorageData, setStorageData } from '@/utils/auth';
import { login, logout } from '@/api/user';
import router from '@/router';
// const userInfo = getEncData('userInfoData');
console.log(getBaseApi);
const user = {
    state: {
        token: getToken() || '',
        baseApi: getBaseApi() || ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_BASEAPI: (state, baseApi) => {
            state.baseApi = baseApi;
        }
    },
    actions: {
        userLogin({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login().then(res => {
                    if (res.status === 0 && res.data) {
                        let resData = res.data;
                        let token = resData.info.token;
                        console.log(resData);
                        setToken(token);
                        setEncData('loginInfo', resData);
                        commit('SET_TOKEN', token);
                        resData.project.forEach(pro => {
                            let pEnvs = Object.values(pro.envs);
                            pEnvs.forEach(envs => {
                                if (envs.selected === 1) {
                                    let api = envs.api;
                                    commit('SET_BASEAPI', api);
                                    setBaseApi(api);
                                }
                            });
                        });
                        router.push({
                            path: '/'
                        });
                    }
                    resolve(res);
                });
            });
        },
        userLogout() {
            logout().then(res => {
                if (res.code === 0 && res.data) {
                    removeToken();
                    localStorage.removeItem('loginInfo');
                    router.push({
                        path: '/login'
                    });
                }
            });
        }
    }
};

export default user;
