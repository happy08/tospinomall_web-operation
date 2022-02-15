import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API;

//店铺装修
export const storeStylesAdd = (params) => postJson(`${url}/basics/base/storeStyles/mall/save`, params); // 添加页面
export const storeStylesGetListPage = (params) => get(`${url}/basics/base/storeStyles/mall/findListPage`, params); // 查询页面
export const storeStylesRemoveId = (params) => postJson(`${url}/basics/base/storeStyles/mall/removeIds`, params); // 删除页面
export const storeStylesUpdateById = (params) => put(`${url}/basics/base/storeStyles/mall/updateById`, params); // 修改页面
export const storeStylesFindHeaderTemplate = (params) => get(`${url}/basics/base/storeStyles/mall/findHeaderTemplate`, params); // 查询所有的头部模板
export const storeStylesGetById = (id) => get(`${url}/basics/base/storeStyles/mall/getById/${id}`); // 查询详情
export const storeStylesPublishNow = (params) => post(`${url}/basics/base/storeStyles/mall/publishNow`, params); // 立即发布
export const storeStylesUpdateComponentInfo = (params) => postJson(`${url}/basics/base/storeStyles/mall/updateComponentInfo`, params); // 装修

export const goodsMallLaunchList = (params) => get(`${url}/product/goods/mall/launch/list`, params); //分页查询已上架商品列表
export const navCategoryListTree = (type) => get(`${url}/product/nav/category/list/tree/${type}`); //分页查询商城分类前端分类导航
export const brandMallListCanUse = (params) => get(`${url}/product/brand/mall/list/can/use`, params); //根据条件查询所有有效的品牌
export const baseAreaFindByParentId = () => get(`${url}/basics/base/area/findByParentId?parentId=0`); // 原产国/地区查询

//商城分类导航列表
export const categoryStyleInfo = (id) => get(`${url}/product/nav/category/style/info/${id}`); // 通过id查询
export const categoryStyleList = (params) => get(`${url}/product/nav/category/style/list`, params); // 分页查询
export const categoryStyleSave = (params) => postJson(`${url}/product/nav/category/style/save`, params); // 新增商城分类导航样式
export const categoryStyleUpdate = (params) => put(`${url}/product/nav/category/style/update`, params); // 修改商城分类导航样式
export const categoryStyleUpdateStatus = (params) => put(`${url}/product/nav/category/style/update/status/${params.status}`, params.id); // 更新模版状态,status 0->草稿 1->发布中 2->禁用
export const categoryStyleClone = (params) => get(`${url}/product/nav/category/style/clone`, params); // 克隆导航模板和关联的导航分类

//商城分类导航详细
export const categoryInfo = (id) => get(`${url}/product/nav/category/info/${id}`); // 通过id查询
export const categoryListTree = (type) => get(`${url}/product/nav/category/list/tree/${type}`); // 分页查询type=1表示APP端 type=2表示PC端
export const categoryMallGetLinkids = (navStyleId) => get(`${url}/product/nav/category/mall/get/linkids/${navStyleId}`); // 通过导航分类类型ID获取关联商品或者分类
export const categoryMallListTree = (navStyleId) => get(`${url}/product/nav/category/mall/list/tree/${navStyleId}`); // 通过导航分类类型ID获取分类树
export const categoryMallDelete = (id) => deletefn(`${url}/product/nav/category/mall/delete/${id}`); // 通过id删除运营后台的分类导航
export const categoryMallUpdate = (params) => put(`${url}/product/nav/category/mall/update`, params); // 修改运营后台的分类导航
