import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
import { encrypt } from "@/utils/cryptoAES"; // 加密
const url = config.DOMAIN_BASE + config.DOMAIN_API;
const urlLogin = config.DOMAIN_LOGIN;
// upms公用请求头
const upmsUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";

export const getCurrentRate = () => get(`${url}/basics/base/rate/findSiteCurrency`); //获取当前站点货币信息

export const getPlatformInfo = () => get(`${url}/basics/base/mall/mallPlatformSet/find`); // 获取当前平台信息

export const getLocales = () => get(`${url}/basics/dict/locale`); // 获取语言

export const getMenuList = (params) => get(`${url}/admin/ums/operator/menu/findCurrentUserMenus`, params); //查询有权限的菜单列表
// get(`${url}/admin/ums/operator/menu/findByStatus`, params); //通过状态查询菜单

export const basePhonePrefix = (status) => get(`${url}/basics/base/phonePrefix/find/${status}`); //获取手机号前缀 0：可用，1：不可用

export const adminFindWebsite = (params) => get(`${urlLogin}/admin/website/findWebsite`, params); // 查询全部站点信息
export const adminWebsiteKey = (key) => get(`${urlLogin}/admin/website/key/${key}`); // 当前站点各端网站域名

export const getPhoneCode = (params) => get(`${url}/admin/ums/checkcode/getPhoneCode`, params); //通用-获取手机验证码
export const checkPhoneCode = (params) => post(`${url}/admin/ums/checkcode/checkPhone`, params); // 通用-校验用户手机号码
export const getCurrentUserInfo = (params) => get(`${upmsUrl}/ums/operator/findCurrent`, params); //通用-获取手机验证码

//Token登录
export const getToken = (params) => {
    const p = { ...params, password: encrypt(params.password) };
    return post(`${urlLogin}/auth/oauth/token?grant_type=password`, p, {
        headers: { Authorization: "Basic b3BlcmF0b3I6b3BlcmF0b3I=" }
    });
};

export const logout = (params) => deletefn(`${urlLogin}/auth/token/logout`, params); //退出
export const getUserInfo = (params) => postJson(`${url}/user/getUserInfo`, params); //获取用户信息

//编辑器中上传文件
export const ossUpLoad = (params) =>
    postJson(`${url}/admin/oss/create/object/product-pic-bucket/product_pic`, params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

//上传路径
export const ossUpLoadUrl = `${url}/admin/oss/create/object/product-pic-bucket/product_pic`;
