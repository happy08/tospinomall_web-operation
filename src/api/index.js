import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API + "/basics";
// upms公用请求头
const upmsUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";
// 财务接口公用请求头
const financeUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/finance";
// 订单接口公用请求头
const orderUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/order";
const productUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/product";

export const getStoreTotalAndMemberTotal = (params) => get(`${upmsUrl}/ums/seller/storeTotalAndMemberTotal`, params); // 统计：店铺总数/会员总数
export const getMemberWalletAndRechargeBalance = (params) => get(`${financeUrl}/buyerExpensesDetail/mall/balanceAndRechargeBalance`, params); // 统计：会员钱包余额/总充值金额
export const getQuotaAndOrderInfo = (params) => get(`${orderUrl}/omsorder/mall/index/count`, params); // 统计：交易额/佣金/待发货/订单数量
export const getRefundAndAfterSale = (params) => get(`${orderUrl}/orderReturn/mall/index/count`, params); // 统计：退款/贷款/售后单
export const getGoodsNum = (params) => get(`${productUrl}/goods/mall/index/count`, params); // 统计：退款/贷款/售后单

