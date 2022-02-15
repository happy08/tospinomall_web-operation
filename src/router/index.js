import { createRouter, createWebHashHistory } from "vue-router";

import Layout from "@/views/layout/layout";

export const commontRouterMap = [
    {
        path: "/",
        name: "首页",
        hidden: true,
        redirect: "/home/index",
        component: Layout
    },
    {
        path: "/login",
        name: "登录",
        hidden: true,
        component: () => import("@/views/login/index")
    },
    //店铺装修
    {
        path: "/operation/storeDesign/storeFitment",
        name: "店铺装修",
        hidden: true,
        component: () => import("@/views/operation/storeDesign/storeFitment/index")
    },
    //店铺预览
    {
        path: "/operation/storeDesign/storeFitment/preview",
        name: "店铺预览",
        hidden: true,
        component: () => import("@/views/operation/storeDesign/storeFitment/preview")
    }
];

// 本地后台菜单路由
export const localRouterMap = [];

export const asyncRouterMap = [];

//错误页路由
export const errorRouterMap = [
    {
        path: "/:w+",
        name: "error-404",
        hidden: true,
        meta: {
            title: "404-页面不存在"
        },
        component: () => import("@/views/error-page/404")
    }
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [...commontRouterMap]
});

export default router;
