import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const getDictsByTypes = (params) => get(`${url}/basics/dict/getDictsByTypes?types=${params}`); // 数据字典

//商品列表
export const goodsMallCheckList = (params, others) => get(`${url}/product/goods/mall/${others}/check/list`, params); //查询审核商品列表checkType=new表示新品审核 checkType=update表示新品更新 checkType=all表示获取所有审核过的商品
export const goodsMallBatchCheckStatus = (params) => postJson(`${url}/product/goods/mall/batch/check/status`, params); //审核商品
export const goodsMallBatchShieldStatus = (params) => postJson(`${url}/product/goods/mall/batch/shield/status`, params); //屏蔽商品
export const goodsMallGetStatistical = (params, others) => get(`${url}/product/goods/mall/get/statistical/${others}`, params); //运营中心搜索统计数据type=list表示商品列表统计 type=newcheck审核商品列表 type=updatecheck更新审核列表
export const goodsMallList = (params) => get(`${url}/product/goods/mall/query`, params); //分页查询商品列表
export const goodsMallRecycleList = (params) => get(`${url}/product/goods/mall/recycle/list`, params); //查询回收站
export const findLastGoodsExamine = (params) => get(`${url}/product/goods/mall/findLastGoodsExamine/${params}`); //获取商品审核最新情况
export const goodsMallListExport = (params) => get(`${url}/product/goods/mall/list/export`, params, { responseType: "blob" }); //导出商品列表

export const goodsMallExamineList = (params, others) => get(`${url}/product/goods/mall/examine/list/${others}`, params); //查询审核记录商品列表checkType=new表示新品审核 checkType=update表示新品更新 checkType=all表示获取所有审核过的商品
export const goodsMallExamineStatistical = (params, type) => get(`${url}/product/goods/mall/examine/statistical/${type}`, params); //运营中心审核记录搜索统计数据type=list表示商品列表统计 type=newcheck审核商品列表 type=updatecheck更新审核列表

//商品详情
export const goodsMallGet = (id) => get(`${url}/product/goods/mall/get/${id}`); //通过id查询商品详情
export const goodsMallGetExamine = (id) => get(`${url}/product/goods/mall/get/examine/${id}`); //通过id查询商品审核变更详情
export const goodsGetExamineGoodDetail = (id) => get(`${url}/product/goods/get/examine/goodDetail/${id}`); //通过id查询商品审核变更详情
export const listGoodsSpecModelByCategoryId = (params) => get(`${url}/product/mmsGoodsSpecModel/mall/listGoodsSpecModelByCategoryId`, params); // 根据分类id查询全部有效的规格模板 带规格值
export const baseAreaFindByParentId = () => get(`${url}/basics/base/area/findByParentId?parentId=0`); // 原产国/地区查询
export const findFreightTemplateList = (params) => get(`${url}/basics/base/logistics/seller/findByIds?ids=${params.ids}&freightType=${params.deliveryType}`); // 运费模板
export const mmsGoodsAttributeListGoodsAttributeByCategoryId = (params) => get(`${url}/product/mmsGoodsAttribute/mall/listGoodsAttributeByCategoryId`, params); // 查询所有商品参数模板
export const isRightful = (params) => get(`${url}/basics/base/operator/filterWords/isRightful`, params); // 判断内容是否合法

//品牌管理
export const brandMallList = (params) => get(`${url}/product/brand/mall/list`, params); //列表
export const brandInfo = (id) => get(`${url}/product/brand/info/${id}`); //通过id查询详情
export const brandBatchCheckStatus = (params) => postJson(`${url}/product/brand/mall/batch/check/status`, params); //批量修改品牌状态
export const brandBatchUpdateStatus = (params, status) => put(`${url}/product/brand/mall/batch/update/status/${status}`, params); //批量修改品牌状态
export const brandCheckStatus = (params) => get(`${url}/product/brand/mall/check/status`, params); //审核商品品牌
export const brandDelete = (id) => deletefn(`${url}/product/brand/mall/delete/${id}`); //通过id删除商品品牌表

export const brandListCanUse = (params) => get(`${url}/product/brand/mall/list/can/use`, params); //根据条件查询所有有效的品牌
export const brandListStatistical = (params) => get(`${url}/product/brand/mall/list/statistical`, params); //品牌各种审核统计
export const brandUpdateStatus = (id) => put(`${url}/product/brand/mall/update/status/${id}`); //修改品牌状态

//属性管理
export const specModelListPage = (params) => get(`${url}/product/mmsGoodsSpecModel/mall/listPage`, params); //属性列表
export const specModelMallAdd = (params) => postJson(`${url}/product/mmsGoodsSpecModel/mall/add`, params); //添加规格模板
export const specModelMallExport = (params) => get(`${url}/product/mmsGoodsSpecModel/mall/export`, params, { responseType: "blob" }); //导出excel
export const specModelMallGet = (params) => get(`${url}/product/mmsGoodsSpecModel/mall/get/${id}`, params); //根据ID查询
export const specModelMallListGoodsCategoryByAttrId = (params) => get(`${url}/product/mmsGoodsSpecModel/mall/listGoodsCategoryByAttrId`, params); //查询该属性所关联的分类
export const specModelMallRelationCategory = (params) => postJson(`${url}/product/mmsGoodsSpecModel/mall/relationCategory`, params); //修改规格关联分类
export const specModelMallRemoveByIds = (ids) => deletefn(`${url}/product/mmsGoodsSpecModel/mall/removeByIds?ids=${ids}`); //单个/批量删除规格模板
export const specModelMallUpdateById = (params) => put(`${url}/product/mmsGoodsSpecModel/mall/updateById`, params); //修改规格模板表
export const specModelMallUpdateEnableDisableByIds = (params) => postJson(`${url}/product/mmsGoodsSpecModel/mall/updateEnableDisableByIds`, params); //单个/批量启用禁用

//属性值管理
export const specsValueModelList = (params) => get(`${url}/product/mmsGoodsSpecsValueModel/mall/list`, params); //属性值列表
export const specsValueModelListPage = (params) => get(`${url}/product/mmsGoodsSpecsValueModel/mall/listPage`, params); //分页查询
export const specsValueModelAdd = (params) => postJson(`${url}/product/mmsGoodsSpecsValueModel/mall/add`, params); //添加规格值模板
export const specsValueModelExport = (params) => get(`${url}/product/mmsGoodsSpecsValueModel/mall/export`, params, { responseType: "blob" }); //导出excel
export const specsValueModelGet = (params) => get(`${url}/product/mmsGoodsSpecsValueModel/mall/get/${id}`, params); //根据ID查询
export const specsValueModelRemoveByIds = (id) => deletefn(`${url}/product/mmsGoodsSpecsValueModel/mall/removeByIds/?ids=${id}`); //单个/批量删除规格值模板
export const specsValueModelUpdateById = (params) => put(`${url}/product/mmsGoodsSpecsValueModel/mall/updateById`, params); //修改规格值模板
export const specsValueModelUpdateEnableDisableByIds = (params) => postJson(`${url}/product/mmsGoodsSpecsValueModel/mall/updateEnableDisableByIds`, params); //单个/批量启用禁用

//商品参数
export const attributeAdd = (params) => postJson(`${url}/product/mmsGoodsAttribute/mall/add`, params); //新增商品参数
export const attributeExport = (params) => get(`${url}/product/mmsGoodsAttribute/mall/export`, params, { responseType: "blob" }); //导出excel
export const attributeGet = (id) => get(`${url}/product/mmsGoodsAttribute/mall/get/${id}`); //根据ID查询
export const attributeListGoodsCategoryByAttrId = (params) => get(`${url}/product/mmsGoodsAttribute/mall/listGoodsCategoryByAttrId`, params); //查询该属性所关联的分类
export const attributeListPage = (params) => get(`${url}/product/mmsGoodsAttribute/mall/listPage`, params); //商品参数分页查询
export const attributeRelationCategory = (params) => postJson(`${url}/product/mmsGoodsAttribute/mall/relationCategory`, params); //属性关联分类
export const attributeRemoveByIds = (id) => deletefn(`${url}/product/mmsGoodsAttribute/mall/removeByIds/?ids=${id}`); //单个/批量删除商品参数
export const attributeUpdateById = (params) => put(`${url}/product/mmsGoodsAttribute/mall/updateById`, params); //修改商品参数
export const attributeUpdateEnableDisableByIds = (params) => postJson(`${url}/product/mmsGoodsAttribute/mall/updateEnableDisableByIds`, params); //单个/批量启用禁用

//商品分类管理/后台类目
export const categoryListMoretree = (params) => postJson(`${url}/product/category/list/tree`, params); //展示商品详细分类树
export const categoryBatchDelete = (ids) => deletefn(`${url}/product/category/mall/batch/delete/?ids=${ids}`); //ids批量删除商品分类表
export const categoryBatchUpdateStatus = (params) => post(`${url}/product/category/mall/batch/update/status`, params); //批量更新商品分类状态(0代表可用,1代表不可用)
export const categoryDelete = (id) => deletefn(`${url}/product/category/mall/delete/${id}`); //通过id删除商品分类表
export const categoryInfo = (id) => get(`${url}/product/category/info/${id}`); //通过id查询
export const categoryCreateAssociated = (params) => postJson(`${url}/product/category/mall/create/associated`, params); //添加分类配置关联设置
export const categoryConfigAssociatedOp = (params) => postJson(`${url}/product/category/mall/config/associated/op`, params); //更新或者保存分类配置关联设置
export const categoryInfoAssociated = (id) => get(`${url}/product/category/info/associated/${id}`); //通过id查询关联设置
export const categoryUpdateAssociated = (params) => postJson(`${url}/product/category/mall/update/associated`, params); //更新分类配置关联设置
export const categorySave = (params) => postJson(`${url}/product/category/mall/save`, params); //新增商品分类
export const categoryUpdate = (params) => put(`${url}/product/category/mall/update`, params); //修改商品分类表
export const categoryUpdatStatus = (params) => post(`${url}/product/category/mall/update/status`, params); //更新商品分类状态(0代表不可用,1代表可用)
export const categoryListTree = (params) => postJson(`${url}/product/category/listAll`, params); //展示商品分类树
export const categoryGetPath = (id) => get(`${url}/product/category/get/path/${id}`); //通过id查询分类path
export const categoryGetCommissionPercentage = (params) => postJson(`${url}/product/category/get/commission/percentage/{categoryId}`, params); //获取分类的抽佣比例
export const categoryConfigListAll = (params) => get(`${url}/product/category/config/list/all`, params); //查询全部分类配置
export const categoryListByParentId = (params) => get(`${url}/product/category/mall/findByParentId`, params); //根据父级ID查询下级分类配置
// 基础信息地区管理接口
export const findByParentId = (params) => get(`${url}/basics/base/area/findByParentId`, params); // 通用->通过父级ID查询下一级地区，parentId：0为国家

// 修复商品
export const goodsRepairFindTsin = (params) => get(`${url}/product/goods/repair/find/tsin`, params); // 通过tsin查psu商品信息
export const repairFindOperatorPage = (params) => get(`${url}/product/goods/repair/find/operator/page`, params); // 修复商品列表
export const repairApproveSubmit = (params) => postJson(`${url}/product/goods/repair/approve/submit`, params); // 审批提交(修复商品)
export const goodsRepairSubmit = (params) => postJson(`${url}/product/goods/repair/submit`, params); // 提交修复商品
export const goodsRepairFindPage = (params) => get(`${url}/product/goods/repair/find/page`, params); // 修改记录列表查询
export const synchronizeInventory = (params) => postJson(`${url}/product/goods/repair/sync/ware/stock`, params); // 同步库存
