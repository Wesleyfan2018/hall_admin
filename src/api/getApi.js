import ajax from '@/utils/ajax';
import { Enmd5, getStorageData } from '@/utils/auth';
import router from '@/router';

const ignoreList = ['/index.php?m=login&p=index&g=10000', '/index.php?m=login&p=logout&g=10000'];

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
