<template>
    <div :class="{ 'layout-hide-sidebar': !getSidebarOpened }" class="app-wrapper">
        <Sidebar />
        <div class="layout-wrapper">
            <MyHeader />
            <div class="layout-container">
                <router-view v-slot="{ Component }">
                    <keep-alive :max="10">
                        <component :is="Component" v-if="$route.meta.keepAlive" />
                    </keep-alive>
                    <component :is="Component" v-if="!$route.meta.keepAlive" />
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Sidebar from "./sidebar/";
import MyHeader from "./header/";

export default {
    name: "Layout",
    components: { Sidebar, MyHeader },
    computed: {
        ...mapGetters({ getSidebarOpened: "app/getSidebarOpened" })
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: relative;
    height: 100vh;
    width: 100%;
    background: #f2f2f2;
}
.layout-wrapper {
    min-height: 100vh;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
}
.layout-container {
    padding: 25px 20px 25px 25px;
    margin-right: 2px;
    height: calc(100vh - 64px);
    overflow: scroll;
    &::-webkit-scrollbar {
        width: 6px;
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: rgba(144, 147, 153, 0.3);
    }
    &::-webkit-scrollbar-track {
        border-radius: 4px;
    }
}
.layout-hide-sidebar {
    .layout-wrapper {
        margin-left: 64px;
    }
}
</style>
