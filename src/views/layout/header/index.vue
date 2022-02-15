<template>
    <el-header class="layout-header flex between vcenter">
        <i :class="[getSidebarOpened ? 'el-icon-s-unfold' : 'el-icon-s-fold', 'icon']" class="fs-16" @click="toggleSideBar"></i>

        <ul class="flex vcenter">
            <li class="ml-25">
                <el-select v-model="site" @change="handleChangeSite" style="width:180px">
                    <el-option v-for="item in websiteList" :key="item.key" :value="item.key" :label="item.name"> </el-option>
                </el-select>
            </li>
            <!-- 语言 $i18n.availableLocales $i18n.locale-->
            <li class="mlr-20">
                <el-select v-model="$i18n.locale" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in $store.state.app.langList" :key="`locale-${item}`" :value="item.value" :label="item.label"> </el-option>
                </el-select>
            </li>
            <!-- 用户头像 -->
            <li class="flex center">
                <BmImage :src="require('@/assets/img/default.png')" style="width:25px;height:25px" class="round-999" />
            </li>

            <!-- 用户中心下拉菜单 -->
            <li>
                <el-dropdown>
                    <span class="ml-10 cp">
                        {{ $store.state.user.userInfo.account }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="logout">{{ $t("login.logout") }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </li>
        </ul>
    </el-header>
</template>

<script>
import { useI18n } from "vue-i18n";
import { computed, onMounted, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { checkIspc } from "@/utils/";

export default {
    setup() {
        const { proxy } = getCurrentInstance();
        const { locale } = useI18n();
        const store = useStore();
        const router = useRouter();

        // 监听语言
        watch(locale, (val) => {
            store.commit("app/CHANGE_LANG", val);
        });

        // 站点
        const site = computed(() => store.state.app.site);
        const websiteList = computed(() => store.state.app.website);
        const handleChangeSite = (item) => {
            websiteList.value.forEach((element) => {
                element.websiteDetails.forEach((element) => {
                    //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                    if (element.type == 1) {
                        window.open(element.websiteAddress, element.openMode || "_blank");
                    }
                });
            });
        };

        const getSidebarOpened = computed(() => {
            return store.state.app.sidebarOpened;
        });

        onMounted(() => {
            //设置icon小图标
            if (store.state.app.platform.adminIcon) {
                let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
                link.type = "image/x-icon";
                link.rel = "shortcut icon";
                link.href = store.state.app.platform.adminIcon;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
            //如果不是pc端，那就收缩菜单
            if (!checkIspc()) {
                toggleSideBar();
            }
        });

        //展开或缩小菜单
        const toggleSideBar = () => {
            store.commit("app/TOGGLE_SIDEBAR");
        };

        //退出登录
        const logout = async () => {
            try {
                await store.dispatch("user/LogOut");
                router.push(`/login`);
            } catch (error) {
                router.push(`/login`);
            }
        };

        return {
            site,
            websiteList,
            handleChangeSite,
            getSidebarOpened,
            toggleSideBar,
            logout
        };
    }
};
</script>

<style lang="scss" scoped>
.layout-header {
    position: relative;
    height: 64px;
    line-height: 64px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    background: #ffffff;
}
</style>
