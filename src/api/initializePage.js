// 初始化页面请求接口(为了把请求接口存下来), 默认post
import ajax from '@/utils/ajax';
import { setRequestApi } from '@/utils/auth';
export function initPage(url, data, type) {
    /* eslint-disable */
    type = type || 'post';
    setRequestApi(url);
    return new Promise((resolve) => {
        ajax[type](url, data).then(res => {
            if (res.code === 0) {
                resolve(res.data);
            }
        });
    });
}