import axios from "axios";
import qs from "qs";
import router from "../router";
import store from "../store";
import storage from "@/utils/storage";
import { ElMessage, ElLoading } from "element-plus";

//本地配置
const development = {
    DOMAIN_BASE: "", //域名
    DOMAIN_API: "/api", //请求地址
    DOMAIN_LOGIN: "/loginApi"
};

//国内测试配置
const dev = {
    DOMAIN_BASE: "https://devtospinomallapi.fyynet.com",
    DOMAIN_API: "",
    DOMAIN_LOGIN: "https://devauthapi.fyynet.com"
};

//国内测试配置
const test = {
    //DOMAIN_BASE: "https://tospinomallapi1.tospinomall.com.gh", //https://tospinomallapi1.tospinomall.com.gh https://tospinomallapi.fyynet.com http://152.32.143.32:9999 "https://tospinomallapi1.tospinomall.com.gh",
    DOMAIN_BASE: "https://tospinomallapi.fyynet.com", //https://tospinomallapi1.tospinomall.com.gh https://tospinomallapi.fyynet.com http://152.32.143.32:9999 "https://tospinomallapi1.tospinomall.com.gh",
    DOMAIN_API: "",
    DOMAIN_LOGIN: "https://auth.fyynet.com" //https://oauthapi1.tospinomall.com.gh https://auth.fyynet.com https://tospinomallapi.fyynet.com
};

//国内线上配置
const china = {
    DOMAIN_BASE: "https://tospinomallapi.tospinomall.com",
    DOMAIN_API: "",
    DOMAIN_LOGIN: "https://oauthapi.tospinomall.com"
};

//加纳ghana线上配置
const ghana = {
    DOMAIN_BASE: "https://tospinomallapi.tospinomall.com.gh",
    DOMAIN_API: "",
    DOMAIN_LOGIN: "https://oauthapi.tospinomall.com.gh"
};

//越南vn线上配置
const vn = {
    DOMAIN_BASE: "https://tospinomallapi.tospinomall.vn",
    DOMAIN_API: "",
    DOMAIN_LOGIN: "https://oauthapi.tospinomall.com.gh"
};
let config = development;
if (process.env.NODE_ENV === "production") config = test;
if (process.env.VUE_APP_MODE === "dev") config = dev;
if (process.env.VUE_APP_MODE === "test") config = test;
if (process.env.VUE_APP_MODE === "china") config = china;
if (process.env.VUE_APP_MODE === "ghana") config = ghana;
if (process.env.VUE_APP_MODE === "vn") config = vn;

export { config };

// 创建axios实例
const instance = axios.create({
    timeout: 120000,
    withCredentials: true, // 设置 withCredentials 使请求带上 `cookies`
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
window.loadingInstance = null;
window.loadingInstanceNum = 0;

window.__axiosPromiseArr = [];
instance.interceptors.request.use(
    (config) => {
        console.log("config", config);
        if (loadingInstanceNum <= 0) {
            loadingInstance = ElLoading.service({ fullscreen: true });
        }
        loadingInstanceNum++;

        const token = store.state.user.toten || storage.get("token");
        // 后台加上跨域和放开Authorization权限
        if (token && !config.headers["Authorization"]) {
            config.headers["Authorization"] = token;
        }

        config.headers["language"] = store.state.app.lang || storage.get("lang") || "en"; //语言
        config.headers["site"] = store.state.app.site || ""; //站点ID
        config.headers["clientType"] = "web"; //
        config.headers["version"] = ""; //版本
        config.cancelToken = new axios.CancelToken((cancel) => {
            //取消请求存在全局，切换路由时执行
            window.__axiosPromiseArr.push({ cancel });
        });
        return config;
    },
    (error) => Promise.error(error)
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
    async (response) => {
        loadingInstanceNum--;
        if (loadingInstanceNum <= 0) {
            loadingInstance.close();
        }

        if (response.status === 200) {
            //code=0成功 无code是导出文件
            if (response.data.code === 0 || typeof response.data.code == "undefined") {
                return response.data;
            } else if (response.data.code === 10401) {
                //重新登录
                try {
                    await store.dispatch("user/LogOut");
                } catch (error) {}
                toLogin();
                return Promise.reject(response);
            } else {
                if (response.data.msg) {
                    tip(response.data.msg);
                }
                return Promise.reject(response);
            }
        } else {
            return Promise.reject(response);
        }
    },
    (error) => {
        loadingInstanceNum--;
        if (loadingInstanceNum <= 0) {
            loadingInstance.close();
        }

        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status);
            return Promise.reject(response);
        } else if (!error.message) {
            //取消请求
            return Promise.reject();
        } else {
            // 处理断网的情况
            tip("Network error");
            return Promise.reject();
        }
    }
);

/**
 * get方法
 * @param {String} url 地址
 * @param {Object} params 参数
 */
export function get(url, params, others) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params: params,
                ...others
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * post方法
 * @param {String} url 地址
 * @param {Object} params 参数
 */
export function post(url, params, others) {
    return new Promise((resolve, reject) => {
        instance
            .post(url, qs.stringify(params), others)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * postJson方法
 * @param {String} url 地址
 * @param {Object} params 参数
 */
export function postJson(url, params) {
    return new Promise((resolve, reject) => {
        instance
            .post(url, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
/**
put方法
 * @param {String} url 地址
 * @param {Object} params 参数
*/
export function put(url, params) {
    return new Promise((resolve, reject) => {
        instance
            .put(url, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
delete
 * @param {String} url 地址
 * @param {Object} params 参数
*/
export function deletefn(url) {
    return new Promise((resolve, reject) => {
        instance
            .delete(url)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

//提示
const tip = (msg) => {
    ElMessage.closeAll();
    ElMessage.error({
        showClose: true,
        message: msg,
        type: "error"
    });
};

/**
 * 跳转登录页
 * 携带当前页面路由，在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.push({
        path: "/login",
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = async (status) => {
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            try {
                await store.dispatch("user/LogOut");
            } catch (error) {}
            toLogin();
            break;
        case 403:
            tip("Login expired. Please log in again"); //登录过期，请重新登录
            try {
                await store.dispatch("user/LogOut");
            } catch (error) {}
            toLogin();
            break;
        case 404:
            tip("The requested resource does not exist"); //请求的资源不存在
            break;
        case 408:
            tip("The request timeout"); //请求超时
            break;
        case 500:
            tip("Server busy, please try again later"); //服务器错误
            break;
        case 501:
            tip("Service not implemented"); //服务未实现
            break;
        case 502:
            tip("Network error"); //网络错误
            break;
        case 503:
            tip("Service unavailable"); //服务不可用
            break;
        case 504:
            tip("Network timeout"); //网络超时
            break;
        case 505:
            tip("The HTTP version is not supported"); //HTTP版本不支持
            break;
        default:
            tip(`Error(${status})!`);
    }
};
