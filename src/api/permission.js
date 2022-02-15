import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
import { encrypt } from "@/utils/cryptoAES"; // 加密
const url = config.DOMAIN_BASE + config.DOMAIN_API;

//系统用户
export const userFindById = (params) => get(`${url}/admin/ums/operator​/findById`, params); //通过ID查询用户信息
export const userFindByStatus = (params) => get(`${url}/admin/ums/operator/findByStatus`, params); //通过状态分页查询用户
export const userSave = (params) =>
    postJson(`${url}/admin/ums/operator/save`, {
        ...params,
        password: encrypt(params.password),
        repeatPassword: encrypt(params.repeatPassword)
    }); //新增用户
export const userUpdate = (params) =>
    postJson(`${url}/admin/ums/operator/update`, {
        ...params,
        password: params.password !== "" ? encrypt(params.password) : "",
        repeatPassword: params.password !== "" ? encrypt(params.repeatPassword) : ""
    }); //修改用户
export const userBatchCloseUser = (params) => postJson(`${url}/admin/ums/operator/batchCloseUser`, params); //批量禁用
export const userBatchOpenUser = (params) => postJson(`${url}/admin/ums/operator/batchOpenUser`, params); //批量启用

export const buyerFindByByConditions = (params) => postJson(`${url}/admin/ums/buyer/findByConditionsAndIds`, params); //通过ids分页查询会员

export const sellerStoreFindByConditions = (params) => postJson(`${url}/admin/ums/seller/store/findByConditionsAndIds`, params); //通过ids分页查询店铺

//角色
export const roleFind = (params) => get(`${url}/admin/ums/operator/role/find`, params); //查询所有角色
export const roleSave = (params) => postJson(`${url}/admin/ums/operator/role/save`, params); //新增角色
export const roleUpdate = (params) => postJson(`${url}/admin/ums/operator/role/update`, params); //修改角色
export const roleDelete = (params) => post(`${url}/admin/ums/operator/role/delete`, params); //删除角色

//菜单
export const menuFindByStatus = (params) => get(`${url}/admin/ums/operator/menu/findByStatus`, params); //通过状态查询菜单
export const menuSave = (params) => post(`${url}/admin/ums/operator/menu/save`, params); //新增菜单
export const menuUpdate = (params) => post(`${url}/admin/ums/operator/menu/update`, params); //修改菜单
export const menuDelete = (params) => post(`${url}/admin/ums/operator/menu/delete`, params); //删除菜单

//操作日志
export const logPage = (params) => get(`${url}/admin/log/finByConditionsPage`, params); //分页查询日志
// 短信验证码
export const smsVerificationCode = (params) => get(`${url}/admin/sms/code/log/page`,params) // 运营web->分页查询
