import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API + "/basics";
// upms公用请求头
const upmsUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";
// product公用请求头
const proUrl = config.DOMAIN_BASE + config.DOMAIN_API + "/product";
//地区管理
export const areaFindAreasTree = (params) => get(`${url}/base/area/findAreasTree`, params); //查询地区树
export const basicsAreaFindByParentId = (params) => get(`${url}/base/area/findByParentId`, params); // 通过父级ID查询下一级地区，parentId：0为国家
export const areaFindAreas = (params) => get(`${url}/base/area/findAreas`, params); //条件查询地区树
export const areaAdd = (params) => postJson(`${url}/base/area/add`, params); //添加区域地址
export const areaBatchUpdate = (params) => post(`${url}/base/area/batchUpdate`, params); //批量修改地区状态
export const areaDelete = (params) => deletefn(`${url}/base/area/delete?id=${params}`); //通过地区ID删除地区信息
export const areaFindByCode = (params) => get(`${url}/base/area/findByCode`, params); //通过地区编码查询地区信息
export const areaFindById = (params) => get(`${url}/base/area/findById`, params); //通过地区ID查询地区信息
export const areFindByParentId = (params) => get(`${url}/base/area/findByParentId`, params); //通过父级ID查询下一级地区，parentId：0为国家
export const areaFindByStatus = (params) => get(`${url}/base/area/findByStatus`, params); //按条件查询地区
export const areaUpdate = (params) => postJson(`${url}/base/area/update`, params); //修改区域地址

//卖家运费模板
export const addSellerFreightTemplate = (params) => postJson(`${url}/base/logistics/seller/addSellerFreightTemplate`, params); //添加卖家运费模板
export const logisticsSellerDelete = (id) => deletefn(`${url}/base/logistics/seller/delete?id=${id}`); //删除运费模板
export const logisticsSellerFindByConditions = (params) => get(`${url}/base/logistics/seller/findByConditions`, params); //根据条件查询运费模板，模板名称，操作日期
export const updateFreightTemplateList = (params) => postJson(`${url}/base/logistics/seller/updateFreightTemplateList`, params); //修改卖家运费模板
export const logisticsSellerUpdateStatus = (params) => post(`${url}/base/logistics/seller/updateStatus`, params); //启用/禁用运费模板
export const logisticsSellerFindById = (params) => get(`${url}/base/logistics/seller/findById`, params); //根据Id查运费模板
export const getDayByType = () => get(`${url}/dict/type/predict_send_time`); // 通过字典类型查找字典自动获取语言（卖家运费模板时间）

//会员运费模板
export const logisticsBuyerAddFreightTemplate = (params) => postJson(`${url}/base/logistics/buyer/addFreightTemplate`, params); //添加运费模板
export const logisticsBuyerDelete = (params) => get(`${url}/base/logistics/buyer/delete?id=${params}`); //删除运费模板
export const logisticsBuyerFindByConditions = (params) => get(`${url}/base/logistics/buyer/findByConditions`, params); //根据条件查询运费模板，模板名称，操作日期
export const logisticsBuyerFindById = (params) => get(`${url}/base/logistics/buyer/findById`, params); //根据ID查询运费模板
export const logisticsBuyerUpdateSellerFreightTemplate = (params) => postJson(`${url}/base/logistics/buyer/updateSellerFreightTemplate`, params); //修改运费模板
export const logisticsBuyerUpdateStatus = (params) => get(`${url}/base/logistics/buyer/updateStatus`, params); //启用/禁用运费模板，0：启用，1：禁用
export const deliveryTimeType = () => get(`${url}/dict/type/promised_delivery_time`); // // 通过字典类型查找字典自动获取语言（会员运费模板发货时间）

// 手机号验证
export const getPhoneCode = (params) => get(`${upmsUrl}/ums/checkcode/getPhoneCode`, params); //通用-获取手机验证码
export const checkPhoneCode = (params) => post(`${upmsUrl}/ums/checkcode/checkPhone`, params); // 通用-校验用户手机号码

// 货到付款地区
export const getCashOnDeliveryArea = (params) => get(`${url}/base/area/findAreasCurrentAreas`, params); // web->查询支持货到付款的地区
export const editCashOnDeliveryArea = (params) => postJson(`${url}/base/area/batchUpdateIsCod`, params); // web->批量修改支持货到付款的地区

//语言汇率
export const currencyExchange = (params) => get(`${url}/base/rate/currencyExchange`, params); //货币兑换
export const rateFind = (params) => get(`${url}/base/rate/find`, params); //按条件查询货币汇率
export const exchangecurrencyRate = (params) => post(`${url}/base/rate/update`, params); //修改货币汇率
export const batchStart = (params) => postJson(`${url}/base/rate/updateStatusBatch`, params); //批量启用禁用汇率

// FBT仓收货地址
export const typeQueryAddress = (params) => get(`${url}/base/fbt/address/find`, params); // 按类型查询地址，type 1：收货地址，2：退货地址，sendModel 1：直发模式，2：集货仓模式
export const receivingAddress = (params) => get(`${url}/base/fbt/address/findDefault`, params); //查询FBT默认地址
export const editReceiveAddress = (params) => postJson(`${url}/base/fbt/address/update`, params); //web运营-编辑地址
export const receiveAddressDel = (params) => deletefn(`${url}/base/fbt/address/delete?id=${params}`); //通过地区ID删除地区信息
export const addReceiveAddress = (params) => post(`${url}/base/fbt/address/add`, params); //web运营-添加地址

// 主营类目
export const getAllCategory = (params) => get(`${url}/base/businessCategory/find`, params); // 通用->查询所有主营类目
export const editMainCategories = (params) => post(`${url}/base/businessCategory/update`, params); // web->编辑主营类目
export const addMainCategories = (params) => post(`${url}/base/businessCategory/add`, params); // web->新增主营类目
export const delMainCategory = (params) => deletefn(`${url}/base/businessCategory/delete?id=${params}`); // 运营web->删除主营类目

//-----------------------------------商城设置-----------------------------------
// 平台信息
export const getPlatformInfo = (params) => get(`${url}/base/mall/mallPlatformSet/find`, params); // 获取平台信息
export const editPlatformInfo = (params) => post(`${url}/base/mall/mallPlatformSet/update`, params); // 修改平台信息
// SEO设置
export const getAllSeoInfo = (params) => get(`${url}/base/mall/seo/find`, params); // 获取所有SEO信息
export const getCategoriesSeoInfo = (params) => get(`${url}/base/mall/seo/findGoodsCategory`, params); // 获取商品分类页SEO信息
export const getGoodsDetailSeoInfo = (params) => get(`${url}/base/mall/seo/findGoodsDetail`, params); // 获取商品详情页SEO信息
export const getGoodsSearchSeoInfo = (params) => get(`${url}/base/mall/seo/findGoodsSearch`, params); // 获取商品搜索页SEO信息
export const getIndexSeoInfo = (params) => get(`${url}/base/mall/seo/findIndex`, params); // 获取商城首页SEO信息
export const editCategoriesSeoInfo = (params) => post(`${url}/base/mall/seo/updateCategory`, params); // 修改商品分类页SEO信息
export const editGoodsDetailSeoInfo = (params) => post(`${url}/base/mall/seo/updateGoodsDetail`, params); // 修改商品详情页SEO信息
export const editGoodsSearchSeoInfo = (params) => post(`${url}/base/mall/seo/updateGoodsSearch`, params); // 修改商品搜索页SEO信息
export const editIndexSeoInfo = (params) => post(`${url}/base/mall/seo/updateIndex`, params); // 修改商城首页SEO信息

// 引导启动
export const bootStart = (params) => get(`${url}/base/mall/guideStart/find`, params); // 通过类型查询引导启动信息
export const editBootStart = (params) => post(`${url}/base/mall/guideStart/update`, params); // 通过类型修改引导启动信息
// 运营设置
// 分享设置
export const getShareContent = (params) => post(`${url}/mmsoperateenjoy/find`, params); // 运营web->获取分享内容
export const editShareContent = (params) => postJson(`${url}/mmsoperateenjoy/update`, params); // 运营web->修改基础信息-运营-分享设置
// 商品评价设置
export const goodsSettingsInfo = (params) => get(`${proUrl}/evaluate/config/find`, params); // 运营web->查询商品评价设置
export const editGoodsSettingsInfo = (params) => postJson(`${proUrl}/evaluate/config/edit`, params); // 运营web->修改商品评价设置
// 搜索发现
export const getLanguageByType = () => get(`${url}/dict/type/operator_base_search_find`); // 通过字典类型查找字典自动获取语言
export const editLanguageByid = (params) => postJson(`${url}/dict/updateItemById`, params); // 修改运营后台搜索发现
// 过滤词库
export const filterThesaurus = (params) => get(`${url}/base/operator/filterWords/findByConditions`, params); // 运营web->按条件查询过滤词汇
export const addFilterWords = (params) => post(`${url}/base/operator/filterWords/add`, params); // 运营web->新增过滤词汇
export const editFilterWords = (params) => post(`${url}/base/operator/filterWords/update`, params); // 运营web->编辑过滤词汇
export const enableAllFilterWords = (params) => post(`${url}/base/operator/filterWords/updateBatchStatus`, params); // 运营web->批量启用/禁用过滤词汇
export const deleteAllFilterWords = (params) => deletefn(`${url}/base/operator/filterWords/deletes?ids=${params}`); // 运营web->批量删除过滤词汇

// 首页推荐词
export const indexRecommendWords = (params) => get(`${url}/base/operator/indexRecommendWords/find`, params); // 运营web->按条件查询首页推荐词
export const addIndexRecommendWords = (params) => post(`${url}/base/operator/indexRecommendWords/add`, params); // 运营web->新增首页推荐词
export const editIndexRecommendWords = (params) => post(`${url}/base/operator/indexRecommendWords/update`, params); // 运营web->编辑首页推荐词
export const enableAllIndexRecommendWords = (params) => post(`${url}/base/operator/indexRecommendWords/updateBatchStatus`, params); // 运营web->批量启用/禁用首页推荐词
export const deleteAllIndexRecommendWords = (params) => deletefn(`${url}/base/operator/indexRecommendWords/delete?ids=${params}`); // 运营web->批量删除首页推荐词
// 纠错词库
export const errorCorrectionThesaurus = (params) => get(`${url}/base/operator/errorWords/findErrorWords`, params); // 运营web->按条件查询纠错词汇列表
export const addErrorCorrectionThesaurus = (params) => post(`${url}/base/operator/errorWords/add`, params); // 运营web->编辑纠错词汇
export const editErrorCorrectionThesaurus = (params) => post(`${url}/base/operator/errorWords/update`, params); // 运营web->编辑纠错词汇
export const enableAllErrorCorrectionThesaurus = (params) => post(`${url}/base/operator/errorWords/updateBatchStatus`, params); // 运营web->批量启用/禁用纠错词汇
export const deleteAllErrorCorrectionThesaurus = (params) => deletefn(`${url}/base/operator/errorWords/deleteBatch?ids=${params.ids}&&names=${params.names}`); // 运营web->批量删除首页推荐词
// 搜索推荐词
export const searchRecommendedWords = (params) => get(`${url}/base/operator/searchRecommendWords/find`, params); // 运营web->按条件查询搜索推荐词
export const addSearchRecommendedWords = (params) => post(`${url}/base/operator/searchRecommendWords/add`, params); // 运营web->添加搜索推荐
export const editSearchRecommendedWords = (params) => post(`${url}/base/operator/searchRecommendWords/update`, params); // 运营web->编辑搜索推荐词
export const enableAllSearchRecommendedWords = (params) => post(`${url}/base/operator/searchRecommendWords/updateBatchStatus`, params); // 运营web->批量启用/禁用搜索推荐词
export const deleteAllSearchRecommendedWords = (params) => deletefn(`${url}/base/operator/searchRecommendWords/delete?ids=${params.ids}&&names=${params.names}`); // 运营web->批量删除搜索推荐词
// 搜索跳转
export const searchJump = (params) => get(`${url}/base/operator/searchJump/find`, params); // 运营web->按条件查询搜索跳转
export const editSearchJump = (params) => postJson(`${url}/base/operator/searchJump/update`, params); // 运营web->编辑搜索跳转
export const enableAllSearchJump = (params) => post(`${url}/base/operator/searchJump/updateBatchOpenStatus`, params); // 运营web->批量启用搜索跳转
export const disableAllSearchJump = (params) => post(`${url}/base/operator/searchJump/updateBatchCloseStatus`, params); // 运营web->批量禁用搜索跳转
export const deleteAllSearchJump = (params) => deletefn(`${url}/base/operator/searchJump/deleteBatch?ids=${params}`); // 运营web->批量删除搜索跳转
// 搜索权重
// 发补货设置管理
export const getSORSettings = (params) => get(`${url}/base/fbt/sendGoods/find`, params); // 运营web->查询发补货设置列表
export const editSORSettings = (params) => post(`${url}/base/fbt/sendGoods/update`, params); // 运营web->修改发补货设置

// 交易设置-订单设置
export const getAllOrdersSettings = (params) => get(`${url}/base/trade/order/findByOrderType`, params); // 查询所有的订单设置
export const editOrdersSettings = (params) => post(`${url}/base/trade/order/update`, params); // web运营->修改订单设置项

// 交易设置-订单原因
export const getOrderReason = (params) => get(`${url}/base/trade/orderReason/findByConditions`, params); // 通用->按条件查询售后订单原因列表
export const addOrderReason = (params) => post(`${url}/base/trade/orderReason/add`, params); // web运营->新增订单原因
export const editOrderReason = (params) => post(`${url}/base/trade/orderReason/update`, params); // web运营->编辑订单原因
export const delOrderReason = (id, orderType) => deletefn(`${url}/base/trade/orderReason/delete?id=${id}&&orderType=${orderType}`); // web运营->删除订单原因
// 财务设置
export const getMoneyType = (params) => get(`${url}/base/finance/money/find`, params); // 运营web->查询资金配置,moneyType 资金类型，1：店铺资金，2：保证金，3：会员资金
export const editCapitalAllocation = (params) => post(`${url}/base/finance/money/update`, params); // web运营->修改某项资金配置
// 支付渠道相关
// anelType渠道类型，1：提现支付渠道，2：收款支付渠道，3：保证金收款账户
export const getcanelType = (params) => get(`${url}/base/finance/findByCanelType`, params); // 查询支付渠道
export const editcanelType = (params) => post(`${url}/base/finance/edit`, params); // web运营->修改某项资金配置
// ------------------------------------------商品设置--------------------------------------------
export const getAllGoodsSettings = (params) => get(`${url}/base/goodsSet/find`, params); // 查询所有的商品配置
export const editGoodsSettings = (params) => post(`${url}/base/goodsSet/update`, params); // 运营web->编辑商品配置
// ------------------------------------------通知设置--------------------------------------------
// 商家消息设置
export const messageSettings = (params) => get(`${url}/base/msg/findByType`, params); // 运营web->根据类型查询消息模板，1卖家消息模板，2用户消息模板
export const editMessageTemplate = (params) => post(`${url}/base/msg/update`, params); // 运营web->编辑消息模板
// ------------------------------------------第三方平台--------------------------------------------
// 邮件推送
export const emailPush = (params) => post(`${url}/base/thrid/emailDefine/find`, params); // 运营web->查询邮件配置
export const testEmailPush = (params) => post(`${url}/base/thrid/emailDefine/sendEmailTest`, params); // 运营web->发送测试邮件
export const editEmailPush = (params) => post(`${url}/base/thrid/emailDefine/updateEmailDefine`, params); // 运营web->修改邮件定义
// oauth登录
export const oauthLogin = (params) => get(`${url}/base/auth/findByStatus`, params); // 通过状态查询oauth登录方式，不传status则查询所有oauth登录方式
export const oauthLoginByID = (params) => get(`${url}/base/auth/findById`, params); // 查询某个oauth登录方式
export const editOauthLogin = (params) => post(`${url}/base/auth/update`, params); // 编辑某个oauth登录方式
// 短信平台
export const smsPlatform = (params) => get(`${url}/base/third/sms/findByStatus`, params); // 运营web->查询短信配置列表
export const editSmsPlatform = (params) => postJson(`${url}/base/third/sms/update`, params); // 运营web->修改短信平台
// 地区管理接口
export const getAreaInfo = (params) => get(`${url}/base/area/findByParentId`, params); // 通用->通过父级ID查询下一级地区，parentId：0为国家
