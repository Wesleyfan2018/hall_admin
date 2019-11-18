import axios from 'axios';
import ajax from '@/utils/ajax';
import { Enmd5, getStorageData } from '@/utils/auth';
import router from '@/router';

const ignoreList = [
    '/index.php?m=login&p=index&g=10000',
    '/index.php?m=login&p=logout&g=10000'
];

// 二次封装axios.post请求(支持文件上传)
export function revoke() {
    let url = arguments[0];// url
    let params = arguments[1];// 参数
    let fileData;// 文件上传
    axios.defaults.timeout = 8000;
    // 3个参数最后一个参数是文件上传参数
    if (arguments.length > 2) {
        fileData = arguments[2];
        // 上传文件超时时间不同
        if (axios.defaults.timeout === 8000) {
            axios.defaults.timeout = 30 * 60 * 1000;// 上传文件30分钟超时
        }
    }
    return new Promise((resolve, reject) => {
        if (ignoreList.indexOf(url) === -1) {
            let g = !getStorageData('g') ? 10000 : getStorageData('g');
            let e = !getStorageData('e') ? 1 : getStorageData('e');
            url = url + '&g=' + g + '&e=' + e;
        }
        params._sig = Enmd5(params);
        // 如果是文件上传重新拼接参数
        if (arguments.length > 2) {
            // 拼接参数
            let formData = new FormData();
            for (let key in params) {
                formData.append(key, params[key]);
            }
            // 拼接文件
            for (let key in fileData) {
                formData.append(key, fileData[key]);
            }
            params = formData;
        }
        ajax.post(url, params)
            .then(res => {
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                } else {
                    resolve(res);
                }
            })
            .catch(err => {
                reject(err.data);
            });
    });
}



// 导出excel文件通用方法
export function exportToExcel(obj1, obj2, obj3) {
    return new Promise((resolve, reject) => {
        require.ensure([], () => {
            const {
                export_json_to_excel
            } = require('../assets/js/Export2Excel');
            const tHeader = obj1;
            const filterVal = obj2;
            const list = obj3;
            const data = list.map(v => filterVal.map(j => v[j]));
            export_json_to_excel(tHeader, data, '列表excel');
        });
    });
}
