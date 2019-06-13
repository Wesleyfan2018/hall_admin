import ajax from '@/utils/ajax';

// 登录
export function login() {
    let data = {
        api: {
            m: 'login',
            p: 'index',
            g: 9999,
            e: 3
        }
    };
    return ajax.post('/main/index.php', data);
}

// 退出
export function logout() {
    return ajax.post('/user/logout');
}
