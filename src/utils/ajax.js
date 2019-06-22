import axios from 'axios';
// import router from '@/router'
// import store from '@/store';
axios.defaults.withCredentials = false;
const service = axios.create({
    baseURL: process.env.VUE_APP_URL,
    timeout: 5000
});
// request
service.interceptors.request.use(config => {
    debugger;
    if (localStorage.token) {
        console.log(localStorage.token);
        config.headers.Authorization = 'JWT' + localStorage.token;
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
