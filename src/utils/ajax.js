import axios from 'axios';
import { getStorageData } from '@/utils/auth';
// import router from '@/router'
// import store from '@/store';
axios.defaults.withCredentials = false;
const service = axios.create({
    baseURL: process.env.VUE_APP_URL,
    timeout: 5000
});
// request
service.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (config.url.indexOf('p=index') === -1) {
        config.headers['stv-admin-token'] = getStorageData('token');
    }
    return config;
}, error => {
    Promise.reject(error);
});

// respone
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        console.log('error' + error);
    }
);

export default service;
