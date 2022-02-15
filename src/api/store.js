import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
// 基础公用请求头
const urlLogin = config.DOMAIN_LOGIN;
const url = config.DOMAIN_BASE + config.DOMAIN_API + "/basics";
const upmsUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";
// 财务接口公用请求头
const financeUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/finance";
const urls = config.DOMAIN_BASE + config.DOMAIN_API;


// 店铺
// 卖家管理
export const enableOrbanSellerUsers = (params) => get(`${upmsUrl}/ums/seller/openOrCloseSeller`, params); // 运营web->启用/冻结卖家用户
// 入驻审核
export const getSellerList = (params) => get(`${upmsUrl}/ums/seller/store/findByConditions`, params); // 查询所有的订单设置
export const getSellerInfoByID = (params) => get(`${upmsUrl}/ums/seller/store/findStoreAndCompanyById`, params); // 运营web->通过ID查询店铺和企业信息
export const getAuditResult = (params) => get(`${upmsUrl}/ums/seller/store/storeEnterAudit`, params); // 运营web->店铺入驻审核
export const sellerListExport = (params) => get(`${upmsUrl}/ums/seller/store/export/seller/list`, params, { responseType: "blob" }); // 通用->导出卖家用户信息列表

// 卖家列表
export const getSellersAllAccount = (params) => get(`${financeUrl}/seller/gatheringAccount/findCurrentsOrBySellerId`, params); // web->查询当前/指定卖家所有账户
export const inquireSubAccountByCondition = (params) => post(`${upmsUrl}/ums/seller/findCurrentOrByIdSub`, params); // web->查询当前/指定卖家所有账户

export const getSellerListByKeywords = (params) => get(`${urlLogin}/admin/ums/seller/findByKeywords`, params); // 通过Keywords查询卖家用户信息
export const sellerStoreFindUpdateAuditList = (params) => postJson(`${upmsUrl}/ums/seller/store/findUpdateAuditList`, params); // 查询店铺资料变更审核列表

export const adminUmsSellerFindLastUpdateAudit = (params) => get(`${urls}/admin/ums/seller/store/findLastUpdateAudit?storeId=${params}`,); //web->查看最新提交审核记录
export const adminUmsSellerStoreUpdateAudit = (params) => postJson(`${urls}/admin/ums/seller/store/updateAudit`, params); //运营web->店铺变更审核
