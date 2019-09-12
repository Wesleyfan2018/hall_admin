
// JS数据处理对象

// 时间戳转换为时间
/*
    now :传入时间对象 Object类型。

    type：输入时间类型，格式如下
    'yyyy-mm-dd' 获取日期
    'yyyy-mm-dd hh-mm-ss' 获取时间
 */
export function getTimeFormat(now, type = 'yyyy-mm-dd') {
    if (typeof now !== 'object') return false;
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    // 月份、日期不足两位时，自动补零
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (date.toString().length === 1) {
        date = '0' + date;
    }
    if (type === 'yyyy-mm-dd hh-mm-ss') {
        // 转yyyy-mm-dd hh-mm-ss
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        return (
            year +
            '-' +
            month +
            '-' +
            date +
            ' ' +
            hour +
            ':' +
            minute +
            ':' +
            second
        );
    }
    else if (type === 'hh-mm-ss') {
        // 转hh-mm-ss
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        return (
            hour +
            ':' +
            minute +
            ':' +
            second
        );
    } else {
        // 转年月日格式 yyyy-mm-dd
        return year + '-' + month + '-' + date;
    }
}


// 时间戳格式时间 在Date对象原型上操作 后期可把此操作写到公共common函数里面
export function datesFormat(date, _fmt) {
    let o = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,                   // 月份
        'd+': date.getDate(),                        // 日
        'h+': date.getHours(),                       // 小时
        'm+': date.getMinutes(),                     // 分
        's+': date.getSeconds(),                     // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S+': date.getMilliseconds()                 // 毫秒
    };
    let fmt = _fmt;
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            if (k === 'y+') {
                fmt = fmt.replace(RegExp.$1, (String(o[k])).substr(4 - RegExp.$1.length));
            } else if (k === 'S+') {
                let lens = RegExp.$1.length;
                lens = lens === 1 ? 3 : lens;
                fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr((String(o[k])).length - 1, lens));
            } else {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((String(o[k])).length)));
            }
        }
    }
    return fmt;
}

// 根据className，获取指定index的input值
export function getClassValue(className, index) {
    let _value = document.getElementsByClassName(className)[index].value;
    return _value;
}