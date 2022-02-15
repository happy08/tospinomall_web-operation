import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const urls = config.DOMAIN_BASE + config.DOMAIN_API + "/basics"; // 基础信息url
const urlAdmin = config.DOMAIN_BASE + config.DOMAIN_API + "/admin"; // admin url
const urlGoods = config.DOMAIN_BASE + config.DOMAIN_API + "/product"; // 商品 product-biz
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const getDictsByTypes = (params) => get(`${urls}/dict/getDictsByTypes?types=${params}`); // 数据字典

//发补货列表
export const productGetOperateHistory = (backProductId) => get(`${urlGoods}/back/product/get/operateHistory/${backProductId}`); // 获取发补货操作历史列表
export const productInfo = (id) => get(`${urlGoods}/back/product/info/${id}`); // 通过id查询
export const productMallListPage = (params) => get(`${urlGoods}/back/product/mall/list/page`, params); // 分页查发补货
export const productMallCheck = (params) => postJson(`${urlGoods}/back/product/mall/check`, params); // 审核
export const baseFbtAddressFind = (params) => get(`${urls}/base/fbt/address/find`, params); // 按类型查询地址，1：收货地址，2：退货地址
export const baseOperateHistory = (id) => get(`${urlGoods}/back/product/get/operateHistory/${id}`); // 获取发补货操作历史列表
export const productMallListExport = (params) => get(`${urlGoods}/back/product/mall/export`, params, { responseType: "blob" }); // 运营中心接口-发补货导出
//发补货退货
export const returnProductInfo = (id) => get(`${urlGoods}/back/return/product/info/${id}`); // 通过id查询
export const returnProductMallCheck = (params) => postJson(`${urlGoods}/back/return/product/mall/check`, params); // 审核发补货列表
export const returnProductMallListPage = (params) => get(`${urlGoods}/back/return/product/mall/list/page`, params); // 查看退货发补货
export const returnProductExport = (params) => get(`${urlGoods}/back/return/product/mall/export`, params, { responseType: "blob" }); // 运营中心接口-发补货退货导出
export const putenterQuery = (params) => get(`${urlGoods}/ware/putenter/query`, params); // 分页查询入库单列表
export const putenterItemQuery = (params) => get(`${urlGoods}/ware/putenter/item/query`, params); // 查询入库单每项列表
export const productMallWareInfoSync = (id) => get(`${urlGoods}/back/product/mall/get/wareInfoSync?id=${id}`); // 同步入库

//仓库查询
export const warehouseInfolist = (params) => get(`${urlGoods}/ware/query/warehouse/infolist`, params); // 查询所有发货仓库
export const wareStockBatchno = (params) => get(`${urlGoods}/ware/stock/batchno/group`, params); // 批次库存查询
export const warehouseSkuExport = (params) => get(`${urlGoods}/ware/seller/stock/good/export`, params, { responseType: "blob" }); // 卖家后台接口》库存明细->sku维度导出
export const wareStockGood = (params) => get(`${urlGoods}/ware/stock/good`, params); // 商品库存查询
export const wareStockWarning = (params) => get(`${urlGoods}/ware/stock/warning`, params); // 预警库存查询
