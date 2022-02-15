import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const upmsUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";

// --------------------------------------会员--------------------------------------
// 会员管理
// 会员列表
export const getUserInfoByCondition = (params) => get(`${upmsUrl}/ums/buyer/findByConditions`, params); // 运营web->通过条件查询用户信息列表
export const enableOrDisableUser = (params) => post(`${upmsUrl}/ums/buyer/updateStatus`, params); // 运营web->启用/禁用用户，status:状态（0启用 1禁用）
export const UserInfoByConditionExport = (params) => get(`${upmsUrl}/ums/buyer/export/buyer/list`, params, { responseType: "blob" }); // 运营web->通过条件查询用户信息列表导出Excel
