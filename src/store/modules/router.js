import { toRaw, markRaw } from "vue";
import { commontRouterMap, localRouterMap, errorRouterMap } from "@/router";
import Router from "@/router/";
import { getMenuList } from "@/api/user";

const router = {
    namespaced: true,
    state: {
        //当前已存在的路由列表
        routers: [
            ...commontRouterMap //公共页面路由
        ],
        //动态添加的路由列表
        addRouters: null
    },
    getters: {
        //获取动态添加的路由列表
        getaddRouters: (state) => state.addRouters,
        //获取当前已存在的路由列表
        getRouters: (state) => state.routers,
        //获取第一个动态路由
        getFirstRouter: (state) => {
            return getTreeRouterPath(state.addRouters[0], [state.addRouters[0].path]);
        }
    },
    mutations: {
        //归并路由
        SET_ROUTERS: (state, data) => {
            let { accessedRouters: addRouters } = data;

            //保存属于该角色动态添加的权限路由（远程菜单路由+本地权限路由都是动态添加的+错误页路由）
            state.addRouters = markRaw([...addRouters]); //, ...localRouterMap, ...errorRouterMap(错误路由一定要放在最后添加，否则页面会被错误路由劫持)
            //将当前已存在的路由与动态添加的路由合并保存
            state.routers = markRaw([...commontRouterMap, ...state.addRouters]);
        },

        //清除动态添加的路由
        CLEAR_ADDROUTERS: (state) => {
            //删除已添加的路由
            const getRoutes = Router.getRoutes();
            if (state.addRouters) {
                const routersName = toRaw(state.addRouters).map((item) => item.name);
                for (let i = 0; i < getRoutes.length; i++) {
                    if (routersName.includes(getRoutes[i].name)) {
                        Router.removeRoute(getRoutes[i].name);
                    }
                }
            }
            state.addRouters = null;
        }
    },
    actions: {
        // 根据角色 生成响应的路由
        GenerateRoutes({ state, commit }) {
            return new Promise((resolve, reject) => {
                getMenuList()
                    .then((res) => {
                        //清除动态添加的路由
                        commit("CLEAR_ADDROUTERS");

                        const menuList = getTree(res.data);

                        let res2 = {
                            state: 200,
                            message: "操作成功!",
                            data: [
                                {
                                    path: "/home",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "home",
                                    roleMenuId: "1",
                                    meta: {
                                        icon: "el-icon-menu",
                                        title: "Home"
                                    },
                                    children: [
                                        {
                                            path: "index",
                                            component: "/home/index",
                                            hidden: false,
                                            alone: false,
                                            name: "homeIndex",
                                            roleMenuId: "5",
                                            meta: {
                                                icon: "el-icon-menu",
                                                title: "主页"
                                            },
                                            children: []
                                        }
                                    ],
                                    alone: true
                                },
                                {
                                    path: "/operation",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "operation",
                                    roleMenuId: "2",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "运营"
                                    },
                                    children: [
                                        {
                                            path: "toolMarketing",
                                            component: "/operation/index",
                                            hidden: false,
                                            name: "toolMarketing",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "工具营销",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "memberWallet",
                                                    component: "/operation/toolMarketing/memberWallet/index",
                                                    hidden: false,
                                                    name: "memberWallet",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "会员钱包",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "storeDesign",
                                            component: "/operation/index",
                                            hidden: false,
                                            name: "StoreDesignIndex",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "商城装修",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "storeList",
                                                    component: "/operation/storeDesign/storeList/index",
                                                    hidden: false,
                                                    name: "storeListIndex",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "商城装修",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "categoryList",
                                                    component: "/operation/storeDesign/categoryList/index",
                                                    hidden: false,
                                                    name: "categoryList",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "商城分类导航",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "contentManage",
                                            component: "/operation/index",
                                            hidden: false,
                                            name: "contentManage",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "内容管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "memberMsg",
                                                    component: "/operation/contentManage/memberMsg/index",
                                                    hidden: false,
                                                    name: "memberMsgIndex",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "会员消息推送",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "sellerMsg",
                                                    component: "/operation/contentManage/sellerMsg/index",
                                                    hidden: false,
                                                    name: "sellerMsgIndex",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "卖家消息推送",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "video",
                                                    component: "/operation/contentManage/video/index",
                                                    hidden: false,
                                                    name: "videoIndex",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "卖家视频教程",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "ruleCenter",
                                                    component: "/operation/contentManage/ruleCenter/index",
                                                    hidden: false,
                                                    name: "ruleCenterIndex",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "卖家规则中心",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "helpCenter",
                                                    component: "/operation/contentManage/helpCenter/index",
                                                    hidden: false,
                                                    name: "helpCenterIndex",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "卖家帮助中心",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "singlePageInfo",
                                                    component: "/operation/contentManage/singlePageInfo/index",
                                                    hidden: false,
                                                    name: "singlePageInfo",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "单页信息",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "feedbackManagement",
                                            component: "/operation/index",
                                            hidden: false,
                                            name: "feedbackManagement",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "反馈管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "sellerFeedbackList",
                                                    component: "/operation/feedbackManagement/sellerFeedbackList/index",
                                                    hidden: false,
                                                    name: "sellerFeedbackList",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "卖家反馈列表",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "memberFeedbackList",
                                                    component: "/operation/feedbackManagement/memberFeedbackList/index",
                                                    hidden: false,
                                                    name: "memberFeedbackList",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "会员反馈列表",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "feedbackClassification",
                                                    component: "/operation/feedbackManagement/feedbackClassification/index",
                                                    hidden: false,
                                                    name: "feedbackClassification",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "反馈分类",
                                                        role: ["0", "1", "2"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    path: "/goods",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "goods",
                                    roleMenuId: null,
                                    meta: {
                                        icon: "el-icon-news",
                                        title: "商品"
                                    },
                                    children: [
                                        {
                                            path: "repairGoods",
                                            component: "/goods/index",
                                            hidden: false,
                                            name: "repairGoods",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "商品修复"
                                            },
                                            children: [
                                                {
                                                    path: "repairGoods",
                                                    component: "/goods/repairGoods/repairGoods/index",
                                                    hidden: false,
                                                    name: "repairGoods",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: "",
                                                        title: "商品修复"
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "repairGoodsAudit",
                                                    component: "/goods/repairGoods/repairGoodsAudit/index",
                                                    name: "repairGoodsAudit",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "商品修复审核"
                                                    }
                                                }
                                            ]
                                        },
                                        // {
                                        //     path: "repairGoodsAudit",
                                        //     component: "/goods/repairGoods/repairGoodsAudit/index",
                                        //     hidden: false,
                                        //     name: "repairGoodsAudit",
                                        //     roleMenuId: "2",
                                        //     meta: {
                                        //         icon: "",
                                        //         title: "商品修复审核"
                                        //     },
                                        //     children: []
                                        // },
                                        {
                                            path: "manager",
                                            component: "/goods/manager/index",
                                            name: "manager",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                icon: "el-icon-news",
                                                title: "商品管理"
                                            },
                                            children: [
                                                // {
                                                //     path: "list",
                                                //     component: "/goods/manager/list/index",
                                                //     name: "list",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     meta: {
                                                //         title: "商品列表",
                                                //     },
                                                // },
                                            ]
                                        },
                                        {
                                            path: "check",
                                            component: "/goods/check/index",
                                            name: "check",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                icon: "el-icon-news",
                                                title: "新品审核"
                                            },
                                            children: []
                                        },
                                        {
                                            path: "checkChange",
                                            component: "/goods/checkChange/index",
                                            name: "checkChange",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                icon: "el-icon-news",
                                                title: "商品审核变更"
                                            },
                                            children: [
                                                // {
                                                //     path: "list",
                                                //     component: "/goods/checkChange/index",
                                                //     name: "changeList",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     meta: {
                                                //         title: "商品变更审核详情",
                                                //     },
                                                // },
                                            ]
                                        },
                                        {
                                            path: "base",
                                            component: "/goods/index",
                                            name: "goodsBase",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                icon: "el-icon-news",
                                                title: "商品基础信息"
                                            },
                                            children: [
                                                {
                                                    path: "brand",
                                                    component: "/goods/base/brand/index",
                                                    name: "brand",
                                                    hidden: false,
                                                    alone: true,
                                                    meta: {
                                                        title: "品牌管理"
                                                        //keepAlive: true,
                                                    }
                                                },
                                                // {
                                                //     path: "brand/detail",
                                                //     component: "/goods/base/brand/detail",
                                                //     name: "detail",
                                                //     hidden: true,
                                                //     alone: false,
                                                //     meta: {
                                                //         title: "详情",
                                                //     },
                                                // },
                                                {
                                                    path: "attribute",
                                                    component: "/goods/base/attribute/index",
                                                    name: "attribute",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "商品参数"
                                                    }
                                                },
                                                {
                                                    path: "spec",
                                                    component: "/goods/base/spec/index",
                                                    name: "spec",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "属性管理"
                                                    }
                                                },
                                                // {
                                                //     path: "specValues",
                                                //     component: "/goods/base/spec/specValues",
                                                //     name: "specValues",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     meta: {
                                                //         title: "属性值管理",
                                                //     },
                                                // },
                                                {
                                                    path: "category",
                                                    component: "/goods/base/category/index",
                                                    name: "category",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "后台类目"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },

                                {
                                    path: "/warehouse",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "warehouse",
                                    roleMenuId: null,
                                    meta: {
                                        icon: "el-icon-news",
                                        title: "库存"
                                    },
                                    children: [
                                        {
                                            path: "replenishManage",
                                            component: "/warehouse/replenishManage/index",
                                            name: "replenishManage",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                icon: "el-icon-news",
                                                title: "发补货管理"
                                            },
                                            children: [
                                                {
                                                    path: "list",
                                                    component: "/warehouse/replenishManage/list/index",
                                                    name: "list",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "发补货列表"
                                                    }
                                                },
                                                {
                                                    path: "returns",
                                                    component: "/warehouse/replenishManage/returns/index",
                                                    name: "returns",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "发补货退货"
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            path: "stockSearch",
                                            component: "/warehouse/stockSearch/index",
                                            name: "stockSearch",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                icon: "el-icon-news",
                                                title: "库存查询"
                                            },
                                            children: [
                                                {
                                                    path: "search",
                                                    component: "/warehouse/stockSearch/search/index",
                                                    name: "search",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "商品库存查询"
                                                    }
                                                },
                                                {
                                                    path: "batch",
                                                    component: "/warehouse/stockSearch/batch/index",
                                                    name: "batch",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "批次库存"
                                                    }
                                                },
                                                {
                                                    path: "warning",
                                                    component: "/warehouse/stockSearch/warning/index",
                                                    name: "warning",
                                                    hidden: false,
                                                    alone: false,
                                                    meta: {
                                                        title: "库存预警"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },

                                {
                                    path: "/base",
                                    component: "/layout/layout",
                                    hidden: false,
                                    alone: false,
                                    name: "base",
                                    roleMenuId: null,
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "基础"
                                    },
                                    children: [
                                        {
                                            path: "baseInfo",
                                            component: "/base/baseInfo/index",
                                            hidden: false,
                                            alone: false,
                                            name: "baseInfo",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "基础信息",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "area",
                                                    component: "/base/baseInfo/area/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "baseInfoArea",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "区域列表",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "category",
                                                    component: "/base/baseInfo/category/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "baseInfoCategory",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "主营类目",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "mallSettings",
                                            component: "/base/mallSettings/index",
                                            hidden: false,
                                            alone: false,
                                            name: "mallSettings",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "商城设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "platformInfo",
                                                    component: "/base/mallSettings/platformInfo/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "platformInfo",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "平台信息",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "seoSettings",
                                                    component: "/base/mallSettings/seoSettings/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "seoSettings",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "SEO设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "bootStart",
                                                    component: "/base/mallSettings/bootStart/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "bootStart",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "APP闪屏页",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "operationalSettings",
                                            component: "/base/operationalSettings/index",
                                            hidden: false,
                                            alone: false,
                                            name: "operationalSettings",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "运营设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "sharingSettings",
                                                    component: "/base/operationalSettings/sharingSettings/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "sharingSettings",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "分享设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "commodityEvaluationSettings",
                                                    component: "/base/operationalSettings/commodityEvaluationSettings/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "commodityEvaluationSettings",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "商品评价设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                                // {
                                                //     path: "searchFound",
                                                //     component: "/base/operationalSettings/searchFound/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "searchFound",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "搜索发现",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                                // {
                                                //     path: "filtertheThesaurus",
                                                //     component: "/base/operationalSettings/filtertheThesaurus/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "filtertheThesaurus",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "过滤词库",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                                // {
                                                //     path: "indexRecommendWords",
                                                //     component: "/base/operationalSettings/indexRecommendWords/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "indexRecommendWords",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "首页推荐词",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                                // {
                                                //     path: "errorCorrectionThesaurus",
                                                //     component: "/base/operationalSettings/errorCorrectionThesaurus/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "errorCorrectionThesaurus",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "纠错词库",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                                // {
                                                //     path: "searchRecommendedWords",
                                                //     component: "/base/operationalSettings/searchRecommendedWords/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "searchRecommendedWords",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "搜索推荐词",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                                // {
                                                //     path: "searchJump",
                                                //     component: "/base/operationalSettings/searchJump/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "searchJump",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "搜索跳转",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                            ]
                                        },
                                        {
                                            path: "FBTSetting",
                                            component: "/base/FBTSetting/index",
                                            hidden: false,
                                            alone: false,
                                            name: "FBTSetting",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "FBT仓设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "sendOrRecoil",
                                                    component: "/base/FBTSetting/sendOrRecoil/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "FBTSendOrRecoil",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "发补货设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "area",
                                                    component: "/base/FBTSetting/address/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "FBTSettingAddress",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "FBT仓收货地址",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "transactionSetting",
                                            component: "/base/transactionSetting/index",
                                            hidden: false,
                                            alone: false,
                                            name: "transactionSetting",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "交易设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "oderSetting",
                                                    component: "/base/transactionSetting/oderSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "oderSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "订单设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "afterSalesServiceSetting",
                                                    component: "/base/transactionSetting/afterSalesServiceSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "afterSalesServiceSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "售后原因设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "serviceOrderSetting",
                                                    component: "/base/transactionSetting/serviceOrderSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "serviceOrderSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "售后单设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "workOrderSetting",
                                                    component: "/base/transactionSetting/workOrderSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "workOrderSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "工单设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "workOrderReasonSetting",
                                                    component: "/base/transactionSetting/workOrderReasonSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "workOrderReasonSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "工单原因设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "logistics",
                                            component: "/base/logistics/index",
                                            hidden: false,
                                            alone: false,
                                            name: "logistics",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "物流设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "memberFreight",
                                                    component: "/base/logistics/memberFreight/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "memberFreight",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "会员运费模板",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "cashOnDeliveryArea",
                                                    component: "/base/logistics/cashOnDeliveryArea/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "cashOnDeliveryArea",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "货到付款地区",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "sellerFreight",
                                                    component: "/base/logistics/sellerFreight/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "sellerFreight",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "卖家运费设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "returnAddress",
                                                    component: "/base/logistics/returnAddress/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "returnAddress",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "FBT退货地址",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "financeSetting",
                                            component: "/base/financeSetting/index",
                                            hidden: false,
                                            alone: false,
                                            name: "financeSetting",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "财务设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "memberFundSetting",
                                                    component: "/base/financeSetting/memberFundSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "memberFundSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "会员资金设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "storeCapitalSetting",
                                                    component: "/base/financeSetting/storeCapitalSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "storeCapitalSetting",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: null,
                                                        title: "店铺资金设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "withdrawalPaymentChannels",
                                                    component: "/base/financeSetting/withdrawalPaymentChannels/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "withdrawalPaymentChannels",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: null,
                                                        title: "提现支付渠道",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "collectPaymentChannels",
                                                    component: "/base/financeSetting/collectPaymentChannels/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "collectPaymentChannels",
                                                    roleMenuId: "2",
                                                    meta: {
                                                        icon: null,
                                                        title: "收款支付渠道",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "storeMarginSetting",
                                                    component: "/base/financeSetting/storeMarginSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "storeMarginSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "店铺保证金设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "marginCollectionAccount",
                                                    component: "/base/financeSetting/marginCollectionAccount/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "marginCollectionAccount",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "保证金收款账户",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "goodsSetting",
                                            component: "/base/goodsSetting/index",
                                            hidden: false,
                                            alone: false,
                                            name: "goodsSetting",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "商品设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "goodSetting",
                                                    component: "/base/goodsSetting/goodSetting/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "goodSetting",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "商品设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "notificationSettings",
                                            component: "/base/notificationSettings/index",
                                            hidden: false,
                                            alone: false,
                                            name: "notificationSettings",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "通知设置",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "businessMessageSettings",
                                                    component: "/base/notificationSettings/businessMessageSettings/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "businessMessageSettings",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "商家消息设置",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "thirdPartyPlatform",
                                            component: "/base/thirdPartyPlatform/index",
                                            hidden: false,
                                            alone: false,
                                            name: "thirdPartyPlatform",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "第三方平台",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "emailPush",
                                                    component: "/base/thirdPartyPlatform/emailPush/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "emailPush",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "邮件推送",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "oauthLogin",
                                                    component: "/base/thirdPartyPlatform/oauthLogin/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "oauthLogin",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "oauth登录",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "smsPlatform",
                                                    component: "/base/thirdPartyPlatform/smsPlatform/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "smsPlatform",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "短信平台",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        },
                                        {
                                            path: "languageExchangeRate",
                                            component: "/base/languageExchangeRate/index",
                                            hidden: false,
                                            alone: false,
                                            name: "languageExchangeRate",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "语言汇率",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "language",
                                                    component: "/base/languageExchangeRate/language/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "language",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "货币汇率",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    path: "/finance",
                                    component: "/layout/layout",
                                    name: "finance",
                                    hidden: false,
                                    alone: false,
                                    meta: {
                                        icon: "el-icon-coin",
                                        title: "财务"
                                    },
                                    children: [
                                        {
                                            path: "memberFunds",
                                            component: "/finance/memberFunds/index",
                                            name: "memberFunds",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                title: "会员资金",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "copingManagement",
                                                    component: "/finance/memberFunds/copingManagement/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "copingManagement",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "应付管理",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "onlinePayments",
                                                    component: "/finance/memberFunds/onlinePayments/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "onlinePayments",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "在线支付",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "walletRecharge",
                                                    component: "/finance/memberFunds/walletRecharge/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "walletRecharge",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "钱包充值",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "incomeExpenditureDetails",
                                                    component: "/finance/memberFunds/incomeExpenditureDetails/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "incomeExpenditureDetails",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "收支明细",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                                // {
                                                //     path: "orderPaymentDetails",
                                                //     component:
                                                //         "/finance/memberFunds/orderPaymentDetails/index",
                                                //     hidden: false,
                                                //     alone: false,
                                                //     name: "orderPaymentDetails",
                                                //     roleMenuId: "3",
                                                //     meta: {
                                                //         icon: null,
                                                //         title: "订单回款明细",
                                                //         role: ["0"],
                                                //     },
                                                //     children: [],
                                                // },
                                            ]
                                        },
                                        {
                                            path: "sellerFunds",
                                            component: "/finance/sellerFunds/index",
                                            name: "sellerFunds",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                title: "卖家资金",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "withdrawalManagement",
                                                    component: "/finance/sellerFunds/withdrawalManagement/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "withdrawalManagement",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "提现管理",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "accountsReceivable",
                                                    component: "/finance/sellerFunds/accountsReceivable/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "accountsReceivable",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "收款账户",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "billingDetails",
                                                    component: "/finance/sellerFunds/billingDetails/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "billingDetails",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "账单明细",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "rewardPunishmentManagement",
                                                    component: "/finance/sellerFunds/rewardPunishmentManagement/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "rewardPunishmentManagement",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "赏罚管理",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "sellerReconciliationCenter",
                                                    component: "/finance/sellerFunds/sellerReconciliationCenter/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "sellerReconciliationCenter",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "卖家对账中心",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "sellerWithdrawalOverview",
                                                    component: "/finance/sellerFunds/sellerWithdrawalOverview/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "sellerWithdrawalOverview",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "卖家提现概况",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "marginFile",
                                                    component: "/finance/sellerFunds/marginFile/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "marginFile",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "保证金",
                                                        role: ["0"]
                                                    },
                                                    children: [
                                                        {
                                                            path: "margin",
                                                            component: "/finance/sellerFunds/marginFile/margin/index",
                                                            hidden: false,
                                                            alone: false,
                                                            name: "margin",
                                                            roleMenuId: "3",
                                                            meta: {
                                                                icon: null,
                                                                title: "保证金",
                                                                role: ["0"]
                                                            },
                                                            children: []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    path: "/store",
                                    component: "/layout/layout",
                                    name: "store",
                                    hidden: false,
                                    alone: false,
                                    meta: {
                                        icon: "el-icon-shopping-bag-2",
                                        title: "店铺"
                                    },
                                    children: [
                                        {
                                            path: "sellerAdmin",
                                            component: "/store/sellerAdmin/index",
                                            name: "sellerAdmin",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                title: "卖家管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "sellerList",
                                                    component: "/store/sellerAdmin/sellerList/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "sellerList",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "卖家列表",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                },
                                                {
                                                    path: "entryAudit",
                                                    component: "/store/sellerAdmin/entryAudit/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "entryAudit",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "入驻审核",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    path: "/member",
                                    component: "/layout/layout",
                                    name: "member",
                                    hidden: false,
                                    alone: false,
                                    meta: {
                                        icon: "el-icon-user-solid                                ",
                                        title: "会员"
                                    },
                                    children: [
                                        {
                                            path: "memberManagement",
                                            component: "/member/memberManagement/index",
                                            name: "memberManagement",
                                            hidden: false,
                                            alone: false,
                                            meta: {
                                                title: "会员管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: [
                                                {
                                                    path: "memberList",
                                                    component: "/member/memberManagement/memberList/index",
                                                    hidden: false,
                                                    alone: false,
                                                    name: "memberList",
                                                    roleMenuId: "3",
                                                    meta: {
                                                        icon: null,
                                                        title: "会员列表",
                                                        role: ["0"]
                                                    },
                                                    children: []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    path: "/permission",
                                    component: "/layout/layout",
                                    hidden: false,
                                    alone: false,
                                    name: "permission",
                                    roleMenuId: null,
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "权限管理"
                                    },
                                    children: [
                                        {
                                            path: "user",
                                            component: "/permission/user/index",
                                            hidden: false,
                                            alone: false,
                                            name: "user",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "用户管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: []
                                        },
                                        {
                                            path: "role",
                                            component: "/permission/role/index",
                                            hidden: false,
                                            alone: false,
                                            name: "role",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "角色管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: []
                                        },
                                        {
                                            path: "menu",
                                            component: "/permission/menu/index",
                                            hidden: false,
                                            alone: false,
                                            name: "menu",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "菜单管理",
                                                role: ["0", "1", "2"]
                                            },
                                            children: []
                                        },
                                        {
                                            path: "log",
                                            component: "/permission/log/index",
                                            hidden: false,
                                            alone: false,
                                            name: "log",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: " 操作日志",
                                                role: ["0", "1", "2"]
                                            },
                                            children: []
                                        },
                                        {
                                            path: "smsVerificationCode",
                                            component: "/permission/smsVerificationCode/index",
                                            hidden: false,
                                            alone: false,
                                            name: "smsVerificationCode",
                                            roleMenuId: "3",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: " 短信验证码",
                                                role: ["0", "1", "2"]
                                            },
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        };
                        try {
                            // 处理远程获取的路由
                            //const newRouters = importComponents(res2.data); //menuList res2.data;
                            const newRouters = importComponents(menuList);
                            // 递归循环路由获取该角色的允许的路由并返回
                            const accessedRouters = newRouters; //filterAsyncRoutes(newRouters);
                            // 保存允许访问的路由
                            commit("SET_ROUTERS", { accessedRouters });

                            //获取动态添加的路由
                            const addRoutes = toRaw(state.addRouters);

                            //注入到路由
                            for (let i = 0; i < addRoutes.length; i++) {
                                Router.addRoute(addRoutes[i]); // 动态添加可访问路由表
                            }
                            resolve(menuList);
                        } catch (error) {
                            console.log("error", error);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    }
};

function getTree(data) {
    // 删除 所有 children,以防止多次调用
    // data.forEach(function(item) {
    //     delete item.children;
    // });
    let map = {};
    data.forEach(function(item) {
        item.meta = {};
        map[item.menuId] = item;
    });
    let menuList = [];
    data.forEach(function(item) {
        let parent = map[item.parentId];
        if (parent) {
            //=0菜单 1按钮
            if (item.type === "0") {
                (parent.children || (parent.children = [])).push(item);
            } else if (item.type === "1") {
                (parent.meta.btnGroup || (parent.meta.btnGroup = [])).push(item.permission);
            }
        } else if (item.parentId === -1) {
            if (item.path == "/home") {
                item.alone = true;
            }
            item.component = "/layout/layout";
            menuList.push(item);
        }
    });
    return menuList;
}

/**
 * 递归循环路由获取属于该角色的路由
 * @param routes asyncRoutes
 */
export function filterAsyncRoutes(routes) {
    return routes;
}

/**
 * 转换字符换为成引入组件的函数
 * @param routes //要查找的路由对象
 */
function importComponents(routes) {
    routes.forEach((item, index) => {
        item.component = item.component && getViews(item.component);
        if (item.children && item.children.length > 0) {
            importComponents(item.children);
        } else {
            delete item.children;
        }
    });
    return routes;
}

/**
 * 转路径为函数
 * @param component //组件路径
 */
function getViews(component) {
    return () => import("@/views" + component + ".vue");
    // return resolve => {
    //   require.ensure([], require => {
    //     resolve(require("@/views/" + path + ".vue"));
    //   });
    // };
}

/**
 * 第一个有权限的路由
 * @param component //组件路径
 */
function getTreeRouterPath(data, path) {
    let arr = path;
    if (data.children && data.children.length > 0) {
        arr.push(data.children[0].path);
        getTreeRouterPath(data.children[0], arr);
    }
    return path.join("/");
}

export default router;
