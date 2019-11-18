import md5 from "js-md5";

const secret = "zpMWYl#7fz&*^&*12I7IWWdT";

// 设置本地存储, 默认localStorage
export function setStorageData(name, value, type) {
    let values = "";
    if (typeof value === "object") {
        values = JSON.stringify(value);
    } else {
        values = value;
    }
    if (type === "session") {
        sessionStorage.setItem(name, values);
    } else {
        localStorage.setItem(name, values);
    }
}

// 获取本地存储, 默认localStorage
export function getStorageData(name, type) {
    let value = "";
    if (type === "session") {
        value = sessionStorage.getItem(name);
    } else {
        value = localStorage.getItem(name);
    }
    return value;
}

// 删除本地存储, 默认localStorage
export function removeStorageData(name) {
    localStorage.removeItem(name);
}

// md5加密
export function Enmd5(data) {
    let mDataStr = "";
    let sortList = [];
    for (let t in data) {
        sortList.push(t);
    }
    sortList = sortList.sort();
    for (let i in sortList) {
        if (data[sortList[i]] !== "") {
            mDataStr += "&" + sortList[i] + "=" + data[sortList[i]];
        }
    }
    mDataStr = mDataStr.substr(1) + secret;
    let md5Str = md5(mDataStr);
    return md5Str;
}
