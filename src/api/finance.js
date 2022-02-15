import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
// 基础模块公用请求头
const url = config.DOMAIN_BASE + config.DOMAIN_API + "/basics";
// 财务接口公用请求头
const financeUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/finance";
// upms公用请求头
const upmsUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";
// order订单模块公用请求头
const orderUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/order";
//------------------------------财务------------------------------
// 会员资金
// 应付管理
export const documentTypeList = (params) => post(`${financeUrl}/payable/mall/findPageList`, params); // web->查询当前/指定卖家所有账户
export const financeRefund = (params) => postJson(`${financeUrl}/payable/mall/refund`, params); // 运营web->应付-财务退款
export const documentTypeListExport = (params) => post(`${financeUrl}/payable/mall/findPageList`, params); //  运营web->应付管理列表-导出

// 在线支付
export const onlinePay = (params) => get(`${financeUrl}/buyerOnlinePayment/mall/findPageList`, params); // 在线支付-分页查询
export const siteCurrency = (params) => get(`${url}/base/rate/findSiteCurrency`, params); // 通用->查询当前站点货币信息
export const onlinePayAdd = (params) => postJson(`${financeUrl}/buyerOnlinePayment/mall/saveBuyerOnlinePayment`, params); // 在线支付-新增
export const onlinePayBatchAdd = (params) => postJson(`${financeUrl}/buyerOnlinePayment/batchSave`, params); // 在线支付-批量
export const onlinePayEdit = (params) => put(`${financeUrl}/buyerOnlinePayment/mall/updateBuyerOnlinePayment`, params); // 在线支付-修改
export const queryOperationRecordById = (params) => get(`${financeUrl}/buyerOnlinePayment/mall/findList`, params); // 根据在线支付id查询操作记录
export const getAllUserInfo = (params) => get(`${upmsUrl}/ums/buyer/findByConditionsInner`, params); // 内部使用->通过条件查询用户信息列表（id、用户名、昵称、邮箱、手机号、账号）
export const getNoPayNum = (params) => get(`${financeUrl}/buyerOnlinePayment/mall/findCount`, params); // 待支付数量查询
// 钱包充值
export const getWalletRechargeList = (params) => get(`${financeUrl}/buyerExpensesDetail/mall/findRechargeWalletPage`, params); // 运营-钱包充值列表-分页查询
export const rechargeWalletBalance = (params) => post(`${financeUrl}/buyerExpensesDetail/mall/buyersBalanceRecharge`, params); // 运营-钱包充值列表-充值余额
// 收支明细
export const getIncomeAndExpensesList = (params) => get(`${financeUrl}/buyerExpensesDetail/mall/findIncomeExpenditurePage`, params); // 运营-收入支出列表-分页查询
export const incomeExpensesCollect = (params) => get(`${financeUrl}/buyerExpensesDetail/mall/findIncomeExpenditureAmount`, params); // 运营-收入支出列表-金额汇总

// 卖家资金
// 提现管理
export const manifestManagementList = (params) => get(`${financeUrl}/seller/withdrawLog/findAccountWithdraws`, params); // 运营web->提现管理列表
export const withdrawalReview = (params) => post(`${financeUrl}/seller/withdrawLog/withdrawAudit`, params); // 运营web->提现审核
export const pushToPayoneer = (params) => get(`${financeUrl}/seller/withdrawLog/pushToPayoneer`, params); // 运营web->推送至payoneer
export const getSellerAccountsReceivable = (params) => get(`${financeUrl}/seller/gatheringAccount/getGatheringAccountByTypeAndAccount`, params); // 通用->获取指定卖家用户默认收款账户
export const manifestManagementListExport = (params) => post(`${financeUrl}/seller/withdrawLog/mall/export`, params, { responseType: "blob" }); // 运营web->提现管理列表-导出
export const getFinancePhone = (params) => get(`${url}/base/finance/money/findByCode`, params); // 通用->通过编码查询某项资金配置
export const getFinancePhoneVerificationCode = (params) => get(`${upmsUrl}/ums/checkcode/getFinancePhoneCode`, params); // 通用->获取财务手机号验证码
export const verifyFinancePhoneCode = (params) => post(`${upmsUrl}/ums/checkcode/checkFinancePhoneCode`, params); // 通用->获取财务手机号验证码
export const confirmTransfer = (params) => get(`${financeUrl}/seller/withdrawLog/giro`, params); // 运营web->转账
export const getPayonnerbalance = (params) => get(`${financeUrl}/seller/account/findBySellerId`, params); // 运营web->转账
export const getOrderFindSellerTagWithdrawOrders = (params) => get(`${orderUrl}/omsorder/findSellerTagWithdrawOrders`, params); // 运营web>查询指定商家未被标记提现的订单
export const baseFinanceMoneyFindByCode = (params) => get(`${url}/base/finance/money/findByCode`, { code: 'TXDDJEPPZDBJDD' }); // 通用->通过编码查询某项资金配置
export const financeSellerFindWithdrawDetail = (params) => get(`${financeUrl}/seller/withdrawLog/findWithdrawDetail`, params); // 运营web->查看提现转账详情

// 收款账户
export const getSellerAccountList = (params) => get(`${financeUrl}/seller/gatheringAccount/findByConditions`, params); // 运营web->按条件查询卖家账户列表
export const getSellerAccountChangeList = (params) => get(`${financeUrl}/seller/accountUpdateLog/find`, params); // 运营web—>查询卖家收款账户变更记录表
// 账单明细
export const getBillingDetails = (params) => get(`${financeUrl}/seller/billDetails/findPageOperator`, params); // 运营web->账单明细
// 赏罚管理
export const rewardPunishmentList = (params) => post(`${financeUrl}/seller/rewardManagement/findRewardsPage`, params); // 运营web->分页查询赏罚列表
export const dealReward = (params) => post(`${financeUrl}/seller/rewardManagement/handleReward`, params); // 运营web->处理赏罚
export const addReward = (params) => post(`${financeUrl}/seller/rewardManagement/addRewardManagement`, params); // 运营web->添加赏罚
export const getAllSellerInfo = (params) => get(`${upmsUrl}/ums/seller/findByConditions`, params); // 内部使用->通过条件查询卖家用户信息列表
export const getAllStoreInfo = (params) => get(`${upmsUrl}/ums/seller/store/findByConditionsNoPage`, params); // 通过条件查询店铺信息
export const getAllSellerOrder = (params) => post(`${orderUrl}/omsorder/findBySellerId`, params); // 运营web->查询卖家下的所有订单
export const getAllSellerAfterSaleOrder = (params) => post(`${orderUrl}/orderReturn/findBySellerId`, params); // 运营web->查询卖家下的所有售后单
export const getAllSellerWithdrawOrder = (params) => post(`${financeUrl}/seller/withdrawLog/findBySellerId`, params); // 运营web->查询卖家下的所有提现单
// 卖家对账中心
export const getReconciliationCenter = (params) => get(`${financeUrl}/seller/billDetails/findPageSettled`, params); // 运营web->对账中心
// 卖家提现概况
export const sellerWithdrawalDetail = (params) => get(`${financeUrl}/seller/withdrawLog/findAccountWithdrawsCount`, params); // 卖家提现概况
export const sellerWithdrawalDetails = (params) => get(`${financeUrl}/seller/withdrawLog/findAccountWithdrawsCountDetail`, params); // 卖家提现概况-查看明细
// 保证金
export const marginList = (params) => get(`${financeUrl}/seller/shopSecurityAmountRecode/findShopSecurityAmountRecords`, params); // 运营web->保证金记录列表查询
export const marginWithdrawalReview = (params) => post(`${financeUrl}/seller/shopSecurityAmountRecode/withdrawAudit`, params); // 运营web->提现审核
export const withdrawalProcessing = (params) => post(`${financeUrl}/seller/shopSecurityAmountRecode/withdrawHandle`, params); // 运营web->提现处理
export const rechargeOrWithhold = (params) => post(`${financeUrl}/seller/shopSecurityAmountRecode/rechargeOrWithhold`, params); // 运营web->充值/扣款
export const rechargeAudit = (params) => post(`${financeUrl}/seller/shopSecurityAmountRecode/rechargeAudit`, params); // 运营web->充值确认

export const baseFinanceMoneyFind = (params) => get(`${url}/base/finance/money/find`, params); // 运营web->查询资金配置,moneyType 资金类型，1：店铺资金，2：保证金，3：会员资金，4：其他，5：平台通知提醒
