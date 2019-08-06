import ajax from '@/utils/ajax';
import { Enmd5, getStorageData } from '@/utils/auth';
import router from '@/router';

const ignoreList = ['/hall-admin-new/index.php?m=login&p=index&g=10000', '/hall-admin-new/index.php?m=login&p=logout&g=10000'];

// 二次封装axios.post请求
export function revoke(url, params) {
    return new Promise((resolve, reject) => {
        if (ignoreList.indexOf(url) === -1) {
            let g = !getStorageData('g') ? 10000 : getStorageData('g');
            let e = !getStorageData('e') ? 1 : getStorageData('e');
            url = url + '&g=' + g + '&e=' + e;
        }
        params._sig = Enmd5(params);
        ajax.post(url, params).then(res => {
            if (res.code === -99) {
                router.push({
                    path: '/login'
                });
            } else {
                resolve(res);
            }
        }).catch(err => {
            reject(err.data);
        });
    });
}