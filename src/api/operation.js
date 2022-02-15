import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API;

// ------------------------------------------工具营销-----------------------------------------
// 会员钱包
export const memberWalletQuery = (params) => get(`${url}/basics/baseRechargeCard/mall/findMmsBaseRechargeCardPage`, params); // 工具营销-会员钱包-分页查询
export const editRechargeCard = (params) => put(`${url}/basics/baseRechargeCard/mall/updateBaseRechargeCard`, params); // 修改充值卡
export const addRechargeCard = (params) => postJson(`${url}/basics/baseRechargeCard/mall/saveBaseRechargeCard`, params); // 新增充值卡
export const enableRechargeCard = (params) => put(`${url}/basics/baseRechargeCard/mall/enableRechargeCard`, params); // 启用/禁用充值卡(支持批量操作)
export const removeRechargeCardById = (ids) => deletefn(`${url}/basics/baseRechargeCard/mall/removeById?ids=${ids}`); /// 通过ID删除充值卡(支持批量操作)

//内容管理类别
export const toolCategoryMallFindById = (params) => get(`${url}/basics/toolCategory/mall/findById/{id}`, params); // 通过id查询
export const toolCategoryMallFindList = (params) => get(`${url}/basics/toolCategory/mall/findList`, params); // 视频分类/规则中心/帮助中心分类查询
export const toolCategoryMallRemoveById = (ids) => deletefn(`${url}/basics/toolCategory/mall/removeById?ids=${ids}`); // 批量删除分类
export const toolCategoryMallSave = (params) => postJson(`${url}/basics/toolCategory/mall/save`, params); // 新增分类
export const toolCategoryMallUpdateById = (params) => post(`${url}/basics/toolCategory/mall/updateById`, params); // 修改分类

//内容管理列表
export const sellerRulesHelpMallAdd = (params) => postJson(`${url}/basics/sellerRulesHelp/mall/add`, params); // 新增卖家规则中心/卖家帮助中心/视频教程
export const sellerRulesHelpMallExport = (params) => get(`${url}/basics/sellerRulesHelp/mall/export`, params, { responseType: "blob" }); // 导出
export const sellerRulesHelpMallFindById = (params) => get(`${url}/basics/sellerRulesHelp/mall/findById/{id}`, params); // 视频
export const sellerRulesHelpMallFindMmsSellerRulesHelpPage = (params) => get(`${url}/basics/sellerRulesHelp/mall/findMmsSellerRulesHelpPage`, params); // 分页查询
export const sellerRulesHelpMallFindPage = (params) => get(`${url}/basics/sellerRulesHelp/mall/findPage`, params); // 分页查询
export const sellerRulesHelpMallRemoveByIds = (ids) => deletefn(`${url}/basics/sellerRulesHelp/mall/removeByIds?ids=${ids}`); // 批量删除
export const sellerRulesHelpMallEnableDisable = (params) => post(`${url}/basics/sellerRulesHelp/mall/enableDisable`, params); // 批量启用禁用
export const sellerRulesHelpMallUpdateById = (params) => put(`${url}/basics/sellerRulesHelp/mall/updateById`, params); // 修改卖家规则中心/卖家帮助中心/视频教程

// 单页信息
export const singlePageInfo = (params) => get(`${url}/basics/operateSinglePage/mall/findPage`, params); // 分页查询
export const editSinglePageInfo = (params) => postJson(`${url}/basics/operateSinglePage/mall/updateById`, params); // 修改单页信息
export const AddSinglePageInfo = (params) => postJson(`${url}/basics/operateSinglePage/mall/save`, params); // 新增单页信息
export const delSinglePageInfo = (ids) => deletefn(`${url}/basics/operateSinglePage/mall/removeByIds?ids=${ids}`); // 批量删除单页信息
export const singlePageInfoExport = (params) => get(`${url}/basics/operateSinglePage/mall/export`, params, { responseType: "blob" }); // 单页信息导出

// ------------------------------------------反馈管理-----------------------------------------
// 卖家反馈列表
export const feedbackMessage = (params) => get(`${url}/basics/operateFeedbackMsg/mall/findListPage`, params); // 分页查询
export const feedbackMessageExport = (params) => get(`${url}/basics/operateFeedbackMsg/mall/export`, params, { responseType: "blob" }); // 列表导出
// 会员反馈列表
export const feedbackMessageChangeRead = (params) => post(`${url}/basics//operateFeedbackMsg/seller/updateStatusById`, params); // 买家消息标为已读
// 反馈分类updateStatusById
export const feedbackClassification = (params) => get(`${url}/basics/operateFeedbackCategory/mall/findList`, params); // 卖家-反馈分类查询全部-下拉
export const feedbackClassificationList = (params) => get(`${url}/basics/operateFeedbackCategory/mall/findPage`, params); // 卖家-反馈分类查询全部-列表
export const addFeedbackClassification = (params) => postJson(`${url}/basics/operateFeedbackCategory/mall/save`, params); /// 新增反馈分类表
export const editFeedbackClassification = (params) => postJson(`${url}/basics/operateFeedbackCategory/mall/updateById`, params); /// 修改反馈分类表
export const delFeedbackClassification = (ids) => deletefn(`${url}/basics/operateFeedbackCategory/mall/removeByIds?ids=${ids}`); /// 通过ID删除反馈分类表
export const batchEnableFeedbackClassification = (params) => post(`${url}/basics/operateFeedbackCategory/mall/enableDisable`, params); // 批量启用禁用

//会员消息推送 、卖家消息推送
export const msgCategoryMallFindById = (id) => get(`${url}/sock/msgCategory/mall/findById/${id}`); // 通过id查询
export const msgCategoryMallFindList = (params) => get(`${url}/sock/msgCategory/mall/findList`, params); // 会员消息推送/卖家消息推送分类查询
export const msgCategoryMallRemoveById = (params) => deletefn(`${url}/sock/msgCategory/mall/removeById?ids=` + params); // 批量删除分类
export const msgCategoryMallSave = (params) => postJson(`${url}/sock/msgCategory/mall/save`, params); // 新增分类
export const msgCategoryMallUpdateById = (params) => postJson(`${url}/sock/msgCategory/mall/updateById`, params); // 修改分类

export const messagePushMallAddMsg = (params) => postJson(`${url}/sock/messagePush/mall/addMsg`, params); // 新增消息推送列表
export const messagePushMallExport = (params) => get(`${url}/sock/messagePush/mall/export`, params, { responseType: "blob" }); // 导出
export const messagePushMallFindById = (id) => get(`${url}/sock/messagePush/mall/findById/${id}`); // 通过id查询
export const messagePushMallFindPage = (params) => get(`${url}/sock/messagePush/mall/findPage`, params); // 分页查询
export const messagePushMallPushMsg = (params) => postJson(`${url}/sock/messagePush/mall/pushMsg`, params); // 发布消息
export const messagePushMallRemoveMsgByIds = (ids) => deletefn(`${url}/sock/messagePush/mall/removeMsgByIds?ids=${ids}`); // 批量删除消息
export const messagePushMallUpdateById = (params) => postJson(`${url}/sock/messagePush/mall/updateById`, params); // 修改消息推送表
