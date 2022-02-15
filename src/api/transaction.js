import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const getDictByType = (params) => get(`${url}/basics/dict/type/${params}`); // 获取数据字典

// 订单查询
export const orderOmsorderSellerList = (params) => get(`${url}/order/omsorder/mall/list`, params); // 运营接口》搜索订单列表

export const omsorderSellerBatchDelivery = (params) => postJson(`${url}/order/omsorder/seller/batch/delivery`, params); // 卖家接口》批量发货
export const omsorderSellerBatchListCount = (params) => get(`${url}/order/omsorder/mall/list/count`, params); // 运营接口》获取订单统计
export const orderSearchExport = (params) => get(`${url}/order/omsorder/mall/list/export`, params, { responseType: "blob" }); // 运营接口》搜索订单列表导出

// 订单详情页
export const omsorderDetail = (params) => get(`${url}/order/omsorder/detail/${params}`); // WEB端公共接口》获取订单详情
export const productQueryWarehouseInfoList = (params) => get(`${url}/product/ware/query/warehouse/infolist`, params); // 运营后台接口》查询所有发货仓库
export const orderOmsOrderSendWMS = (params) => get(`${url}/order/omsorder/mall/sendWMS`, params); // 运营接口》fbt单手动推送WMS
export const orderOmsOrderMallCancel = (params) => postJson(`${url}/order/omsorder/mall/cancel`, params); // 运营中心接口》运营中心取消订单


// 售后单
export const orderReturnListPage = (params) => get(`${url}/order/orderReturn/mall/listPage`, params); // 运营中心接口》搜索售后订单
export const OrderFindByConditions = (params) => get(`${url}/basics/base/trade/orderReason/findByConditions`, params); // 退款原因
export const orderOrderReturnReturn = (params) => postJson(`${url}/order/orderReturn/mall/batchAgreeRefund`, params); // 运营中心接口》 仅退款 -> 同意退款
export const orderBatchAgreeReturnGoods = (params) => postJson(`${url}/order/orderReturn/mall/batchAgreeRefundAndReturnGoods`, params); // 运营中心接口》批量同意退货（退货退款）
export const adminSellerFindByConditionsNoPage = (params) => get(`${url}/admin/ums/seller/store/findByConditionsNoPage`, params); // web->通过条件查询店铺信息，店铺名称、店铺编码、店铺ID
export const adminBuyerFindByConditions = (params) => get(`${url}/admin/ums/buyer/findByConditions`, params); // 运营web->通过条件查询用户信息列表
export const orderReturnDetail = (params) => get(`${url}/order/orderReturn/mall/returnDetail/${params}`); // 售后单详情
export const getAfterSaleOrderNum = (params) => get(`${url}/order/orderReturn/mall/listCount`, params); // 运营中心接口》搜索售后订单

export const findReturnWorkAllegeList = (params) => get(`${url}/order/order/return/work/info/findReturnWorkAllegeList`, params); // 获取举证详情列表
export const orderReturnGetLogisticsInfo = (params) => get(`${url}/order/orderReturn/buyer/getLogisticsInfo?waybillNumber=${params}`); // 查看物流信息
export const orderReturnAgreeRefund = (params) => postJson(`${url}/order/orderReturn/mall/batchAgreeRefund`, params); // 运营中心接口》 仅退款 -> 同意退款
export const orderReturnagreeRefundInReturnGoodsAndRefund = (params) => post(`${url}/order/orderReturn/mall/agreeRefundInReturnGoodsAndRefund`, params); // 运营中心接口》同意退款（退货退款）
export const orderReturnSellerReject = (params) => postJson(`${url}/order/orderReturn/mall/rejected`, params); //运营中心接口》驳回售后
export const orderReturnRejectDelivery = (params) => post(`${url}/order/orderReturn/mall/rejectDelivery`, params); // 运营中心接口》拒收
export const orderReturnConfirmReceipt = (params) => post(`${url}/order/orderReturn/mall/confirmReceipt`, params); // 运营中心接口》确认收货
export const orderReturnWorkOperatorProcess = (params) => postJson(`${url}/order/order/return/work/operator/process`, params); // 运营中心》平台判责
export const orderReturnExport = (params) => get(`${url}/order//orderReturn/mall/export`, params, { responseType: "blob" }); // 运营中心接口》导出
export const getProofDetailList = (params) => get(`${url}/order/order/return/work/info/workDetail`, params); // 获取举证详情列表

export const orderReturnWorkSellerList = (params) => get(`${url}/order/order/return/work/mall/list`, params); // 运营中心》分页查询 工单列表
export const orderReturnWorkSellerCount = (params) => get(`${url}/order/order/return/work/mall/count`, params); // 运营中心》获取工单数据统计
export const orderReturnAddToProof = (params) => get(`${url}/order/order/return/work/seller/addto/proof`, params); // 卖家中心》举证-追加举证
export const aftersalesWorkOrderExport = (params) => get(`${url}/order/order/return/work/mall/export`, params, { responseType: "blob" }); // 运营接口》售后工单导出

// 评价
export const evaluatesSellerList = (params) => get(`${url}/product/evaluate/mall/list`, params); // 运营后台接口>评价分页查询
export const getsCategoryListTree = (params) => postJson(`${url}/product/category/list/tree`, params); // 查询全部分类
export const productEvaluateShielding = (params) => get(`${url}/product/evaluate/shielding`, params); // 运营后台接口>手动屏蔽
export const productEvaluateBatchCheck = (params) => postJson(`${url}/product/evaluate/mall/batch/check`, params); // 运营后台接口》评价批量审核
export const productEvaluateLog = (params) => get(`${url}/product/evaluate/log`, params); // 运营后台接口>评价操作日志
export const productEvaluateInfo = (params) => get(`${url}/product/evaluate/info`, params); // 通过评价id查询评价详情
export const productEvaluateReplyPage = (params) => get(`${url}/product/evaluate/reply/page`, params); // 评论详情分页查询
export const productEvaluateLabelCount = (params) => get(`${url}/product/evaluate/mall/label/count`, params); // 星级标签统计
export const productEvaluatePendingCount = (params) => get(`${url}/product/evaluate/mall/pending/count`, params); // 待处理统计

// 评论投诉管理
export const productEvaluateReportsApprove = (params) => postJson(`${url}/product/evaluate/reports/approve`, params); // 运营后台》批量审批商品评论投诉
export const productEvaluateReportsPage = (params) => get(`${url}/product/evaluate/reports/page`, params); // 运营后台》评论投诉分页查询
