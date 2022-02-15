//前置补0
function preZero(j) {
    if (j < 10) j = "0" + j;
    return j;
}

// 标准时间转 yy-mm-dd hh-mm-ss
export function formatStandardDate(val, full) {
    if (!val) {
        return "";
    }
    if ((val + "").indexOf("T") === -1) {
        return val;
    }
    const date = new Date(val);
    const y = date.getFullYear();
    const m = preZero(date.getMonth() + 1);
    const d = preZero(date.getDate());
    let t = y + "-" + m + "-" + d;
    if (full) {
        //return '2021-09-01 00:00:00'
        const h = preZero(date.getHours());
        const minute = preZero(date.getMinutes());
        const second = preZero(date.getSeconds());
        return t + " " + h + ":" + minute + ":" + second;
    } else {
        return t;
    }
}

//返回true表示为pc端打开，返回false表示为手机端打开
export function checkIspc() {
    const userAgentInfo = navigator.userAgent;
    const Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

// 判断是否为对象
export function isObject(o) {
    return (typeof o === "object" || typeof o === "function") && o !== null;
}

//深拷贝
export function deepClone(obj, hash = new WeakMap()) {
    if (!isObject(obj)) {
        return obj;
    }
    // 查表
    if (hash.has(obj)) return hash.get(obj);

    const isArray = Array.isArray(obj);
    const cloneObj = isArray ? [] : {};
    // 哈希表设值
    hash.set(obj, cloneObj);

    const result = Object.keys(obj).map((key) => {
        return {
            [key]: deepClone(obj[key], hash)
        };
    });
    return Object.assign(cloneObj, ...result);
}

//导出Excel
export function exportExcel(name, res) {
    const blob = new Blob([res], { type: "application/vnd.ms-excel" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${name}-${formatStandardDate(new Date())}.xlsx`);
    link.click();
    link = null;
}

//节流
export function throttle(fn, delay) {
    let timer;
    return function () {
        let _this = this;
        let args = arguments;
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            fn.apply(_this, args);
            timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
        }, delay);
    };
}

// 金额千分位格式化 num数字, n保留几位小数
export function moneyFormat(num, n = 2) {
    if (!num) return "0.00";
    num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = num
        .split(".")[0]
        .split("")
        .reverse(),
        r = n == 0 ? '' : num.split(".")[1],
        t = "";

    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
    }
    return (
        t
            .split("")
            .reverse()
            .join("") +
        (n == 0 ? '' : ("." + r))
    );
}
