<template>
    <div class="layout-sidebar-container has-logo">
        <div class="layout-sidebar-logo hidden-1">
            <BmImage style="width: 30px; height: 30px" :src="require('@/assets/img/logo.png')" />
            <span v-show="getSidebarOpened">Admin Center</span>
        </div>

        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="$route.path"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :active-text-color="variables.menuActiveText"
                mode="vertical"
                router
                :collapse="!getSidebarOpened"
            >
                <SidebarItem :menu="getRouters" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore, mapGetters } from "vuex";
import { useRoute } from "vue-router";
import { ElMenu, ElScrollbar } from "element-plus";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/css/variables.scss";
export default {
    name: "Sidebar",
    components: { ElMenu, ElScrollbar, SidebarItem },
    computed: {
        ...mapGetters({
            getRouters: "router/getRouters",
            getSidebarOpened: "app/getSidebarOpened"
        }),
        variables() {
            return variables;
        }
    },
    setup() {
        const store = useStore();
        const route = useRoute();

        //监听语言 获取菜单列表
        const lang = computed(() => store.state.app.lang);
        let breadcrumbList = [];
        watch(lang, async (nVal) => {
            const menuList = await store.dispatch("router/GenerateRoutes");
            //设置面包屑
            breadcrumbList = [];
            getMenuPath(menuList);
            store.commit("app/CHANGE_BREADCRUMB", breadcrumbList);
        });

        //设置面包屑
        const getMenuPath = (menuList) => {
            menuList.forEach((v) => {
                route.matched.forEach((item, index) => {
                    if (index === 0) {
                        if (v.path === item.path) {
                            const obj = {
                                title: v.name,
                                path: v.path
                            };
                            breadcrumbList.push(obj);

                            if (v.children && v.children.length > 0) {
                                getMenuPath(v.children);
                            }
                        }
                    } else {
                        const pathArr = item.path.split("/");
                        if (pathArr[index + 1] === v.path) {
                            const obj = {
                                title: v.name,
                                path: v.path
                            };
                            breadcrumbList.push(obj);
                        }
                    }
                });
            });
        };
    }
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

.layout-sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidth !important;
    background-color: $menuBg;
    height: 100vh;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    .layout-sidebar-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        font-size: 18px;
        font-weight: 600;
    }
    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }
    &.has-logo {
        .el-scrollbar {
            height: calc(100% - 64px);
        }
    }

    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }

    .el-scrollbar__bar.is-vertical {
        right: 0px;
    }

    .el-menu {
        border: none;
    }
    .el-scrollbar__view > .el-menu > .menu-wrapper > .el-menu-item {
        font-size: 13px;
        color: #333333 !important;
        &.is-active {
            color: $subMenuActiveText !important;
            > i {
                color: $subMenuActiveText !important;
            }
        }
    }
    .submenu-title-noDropdown,
    .el-submenu__title {
        font-size: 13px;
        color: #333333 !important;
        &:hover {
            background-color: $menuHover !important;
        }
    }
    .is-active > .el-submenu__title {
        color: $subMenuActiveText !important;
        > i {
            color: $subMenuActiveText !important;
        }
    }

    .el-submenu .el-menu-item {
        min-width: $sideBarWidth !important;
        background-color: $subMenuBg !important;
        &.is-active {
            color: $subMenuActiveText !important;
        }
    }
}
.el-menu-item {
    color: #666666 !important;
    &:hover {
        background-color: $subMenuHover !important;
    }
}

.layout-hide-sidebar {
    .layout-sidebar-container {
        width: 64px !important;
    }
    .el-menu--collapse {
        > .menu-wrapper {
            > .el-menu-item,
            .el-submenu > .el-submenu__title {
                > span,
                > i.el-submenu__icon-arrow {
                    height: 0;
                    width: 0;
                    overflow: hidden;
                    visibility: hidden;
                    display: inline-block;
                }
            }
        }
    }
}
</style>
