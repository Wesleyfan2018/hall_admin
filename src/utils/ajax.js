import axios from 'axios';
// import router from '@/router'
import store from '@/store';
console.log(process.env);
axios.defaults.withCredentials = false;
console.log(store.state.user.baseApi);
let baseApi = store.state.user.baseApi;
const service = axios.create({
    // baseURL: process.env.VUE_APP_URL,
    baseURL: baseApi,
    timeout: 5000
});
// request
service.interceptors.request.use(config => {
    console.log(config);
    config.baseURL = store.state.user.baseApi;
    return config;
}, error => {
    console.log(error);
    Promise.reject(error);
});

// respone
service.interceptors.response.use(
    response => {
        console.log(response);
        return response.data;
    },
    error => {
        console.log('error' + error);
    }
);

export default service;
