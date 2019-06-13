import VueCookies from 'vue-cookies';
import CryptoJS from 'crypto-js';
// const CryptoJS = require('crypto-js');
// Vue.use(VueCookies);
const userToken = 'JSESSIONID';
const baseApi = 'baseApi';
const requestApi = 'requestApi';
const aesSecret = 'bndehs6pbr8ia8is';
const aesSecret2 = 'ABCDEF1234123412';

// 设置、获取、删除token
export function getToken() {
    return VueCookies.get(userToken);
}
export function setToken(token) {
    return VueCookies.set(userToken, token, '7d');
}
export function removeToken() {
    return VueCookies.remove(userToken);
}

// 设置、获取、删除域名
export function getBaseApi() {
    return localStorage.getItem(baseApi);
}
export function setBaseApi(value) {
    return localStorage.setItem(baseApi, value);
}
export function removeBaseApi() {
    return localStorage.removeItem(baseApi);
}

// 设置、获取、删除接口
export function getRequestApi() {
    return localStorage.getItem(requestApi);
}
export function setRequestApi(value) {
    return localStorage.setItem(requestApi, value);
}
export function removeRequestApi() {
    return localStorage.removeItem(requestApi);
}

// 设置本地存储, 默认localStorage
export function setStorageData(name, value, type) {
    let values = JSON.stringify(value);
    if (type === 'session') {
        sessionStorage.setItem(name, values);
    } else {
        localStorage.setItem(name, value);
    }
}

// 获取本地存储, 默认localStorage
export function getStorageData(name, type) {
    let value = '';
    if (type === 'session') {
        value = sessionStorage.getItem(name);
    } else {
        value = localStorage.getItem(name);
    }
    console.log(value);
    return value && JSON.parse(value);
}

// 设置加密信息, 默认存本地
export function setEncData(name, value, type) {
    let data = aesEncrypt(JSON.stringify(value));
    if (type === 'cookie') {
        VueCookies.set(name, data, '7d');
    } else {
        localStorage.setItem(name, data);
    }
}

// 获取解密信息, 默认取本地
export function getEncData(name, type) {
    let value = '';
    if (type === 'cookie') {
        value = VueCookies.get(name);
    } else {
        value = localStorage.getItem(name);
    }
    console.log(value);
    return value && JSON.parse(aesDecrypt(value));
}

// aes加密
export function aesEncrypt(content) {
    let key = CryptoJS.enc.Utf8.parse(aesSecret);
    let iv = CryptoJS.enc.Utf8.parse(aesSecret2);
    let srcs = CryptoJS.enc.Utf8.parse(content);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

// aes解密
export function aesDecrypt(content) {
    let key = CryptoJS.enc.Utf8.parse(aesSecret);
    let iv = CryptoJS.enc.Utf8.parse(aesSecret2);
    let encryptedHexStr = CryptoJS.enc.Hex.parse(content);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}