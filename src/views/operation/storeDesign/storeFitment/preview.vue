<template>
    <div class="store-design-layout">
        <!-- 中间视图组件 -->
        <div class="store-design-layout-center">
            <!-- 手机端 -->
            <div v-if="isMobile" class="store-design-layout-view store-design-mobile custom-scrollbar">
                <HeaderMobile />
                <!-- banner -->
                <Banner :datas="bannerData" :websiteUrl="websiteUrl" />

                <div v-for="(element, index) in viewComponentList.components" :key="index">
                    <div class="component-view">
                        <component :is="element.component" :datas="element" :isMobile="isMobile" :websiteUrl="websiteUrl"></component>
                    </div>
                </div>
            </div>

            <!-- 电脑端 -->
            <div v-if="!isMobile" class="store-design-layout-view store-design-pc bg-light-grey">
                <!-- 顶部广告图 -->
                <div>
                    <TopAdvertising :datas="topAdvertising" :websiteUrl="websiteUrl" />
                </div>
                <!-- 导航 -->
                <HeaderPC />

                <!-- banner -->
                <Banner :datas="bannerData" :websiteUrl="websiteUrl" />

                <!-- 所有组件 -->
                <div v-for="(element, index) in viewComponentList.components" :key="index">
                    <div class="component-view">
                        <component :is="element.component" :datas="element" :websiteUrl="websiteUrl"></component>
                    </div>
                </div>

                <!-- footer -->
                <div
                    :style="
                        `background:url( ${require('@/assets/img/footer-pc.jpg')}) center no-repeat;
                        height: ${isPreview ? '426px' : '280px'}`
                    "
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, provide, getCurrentInstance } from "vue";
import Draggable from "vuedraggable";

import EditComponentConfig from "./edit/index";
import goods2Column from "./view/goods2Column";
import goods3Column from "./view/goods3Column";
import goods6Column from "./view/goods6Column";
import Banner from "./view/banner";
import imageHot from "./view/imageHot";
import HeaderMobile from "./view/headerMobile";
import HeaderPC from "./view/headerPC";
import TopAdvertising from "./view/topAdvertising";

import { storeStylesGetById } from "@/api/storeDesign";
import { adminWebsiteKey } from "@/api/user";
import { useRoute } from "vue-router";

export default {
    name: "StoreDesignPreview",
    components: {
        EditComponentConfig,
        Draggable,
        goods2Column,
        goods3Column,
        goods6Column,
        Banner,
        imageHot,
        HeaderMobile,
        HeaderPC,
        TopAdvertising
    },
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const route = useRoute();

        let scale = ref(1),
            curConfig = ref(null); //正在编辑的组件参数配置

        let viewComponentList = ref({}); //中间显示组件

        //是否预览
        let isPreview = route.query.type == "preview" ? true : false;
        provide("isPreview", isPreview);

        //是否手机端 pageType 1=PC 2=手机
        let isMobile = route.query.pageType == 1 ? false : true;
        provide("isMobile", isMobile);

        //顶部广告图的配置
        let topAdvertising = ref({
            type: 5,
            device: ["pc"], //PC专用
            component: "topAdvertising", //PC 顶部广告图
            name: proxy.$t("storeDesign.topAD"), //组件名称
            icon: "hot",
            imageUrl: "",
            componentDetails: [
                {
                    imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                    imageUrl: ""
                }
            ]
        });
        //banner图的配置
        let bannerData = ref({
            type: 1,
            device: ["mobile", "pc"],
            component: "banner", //mobile&PC 轮播图
            name: proxy.$t("storeDesign.slideshow"), //组件名称
            //moduleTitle: proxy.$t("storeDesign.slideshow"), //标题
            icon: "banner",
            componentDetails: [
                {
                    imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                    imageUrl: ""
                },
                {
                    imageLinkType: -1,
                    imageUrl: ""
                }
            ]
        });
        // 获取详情
        if (route.query.id) {
            storeStylesGetById(route.query.id)
                .then((res) => {
                    let components = [];
                    res.data.components.forEach((item) => {
                        componentType.forEach((citem) => {
                            if (citem.type === item.type) {
                                item.component = citem.component;
                                item.name = citem.name;
                            }
                        });
                        if (item.type === 5) {
                            //取出顶部广告图 放最上面
                            topAdvertising.value = item;
                        } else if (item.type === 1) {
                            //取出banner 放最上面
                            bannerData.value = item;
                        } else {
                            components.push(item);
                        }
                    });

                    viewComponentList.value = {
                        id: res.data.id,
                        storeMenuStyleId: (res.data.storeMenuStyle && res.data.storeMenuStyle.id) || "",
                        components: components
                    };
                })
                .catch(() => {});
        }
        //组件列表
        const componentType = [
            {
                type: 1,
                component: "banner",
                name: proxy.$t("storeDesign.slideshow")
            },
            {
                type: 2,
                component: "imageHot",
                name: proxy.$t("storeDesign.hotPictures")
            },
            {
                type: 3,
                component: "goods3Column",
                name: proxy.$t("storeDesign.threeColumns")
            },
            {
                type: 4,
                component: "goods2Column",
                name: proxy.$t("storeDesign.twoColumns")
            },
            {
                type: 5,
                component: "topAdvertising",
                name: proxy.$t("storeDesign.topAD")
            },
            {
                type: 6,
                component: "goods6Column",
                name: proxy.$t("storeDesign.sixColumns")
            }
        ];

        //获取当前站点域名
        let websiteUrl = [];
        const getWebsite = () => {
            adminWebsiteKey(proxy.$store.state.app.site)
                .then((res) => {
                    //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                    const website = res.data.websiteDetails.filter((item) => (item.type == isMobile ? 4 : 3));
                    if (website && website.length) {
                        websiteUrl = website[0].websiteAddress;
                    }
                })
                .catch((err) => {});
        };
        getWebsite();

        return {
            scale,
            isPreview,
            isMobile,
            topAdvertising,
            bannerData,
            curConfig,
            viewComponentList,
            websiteUrl
        };
    }
};
</script>

<style>
html,
body {
    overflow-y: auto;
}
</style>
<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.store-design-layout {
    .quit-preview {
        position: fixed;
        right: 15px;
        top: 15px;
        z-index: 9;
    }
    position: fixed;
    left: 0;
    top: 0;
    background-color: #ffffff;
    z-index: 9999;
    min-width: 100%;
    min-height: 100%;
    height: 100%;
    .store-design-layout-center {
        position: relative;
        padding: 0;
        width: 100%;
        min-height: 100%;
        overflow-y: auto;
        transition: padding 0.3s;

        .store-design-layout-view {
            position: relative;
            margin: 0 auto;
            box-shadow: -10px 20px 30px 0px rgba(0, 0, 0, 0.2);
            &.store-design-mobile {
                width: 375px;
                height: 667px;
                margin-top: 5vh;
                overflow-y: auto;
                .component-header {
                    height: 100px;
                    background-size: cover;
                }
            }
            &.store-design-pc {
                width: 100%;
                //max-width: 100%;
                height: 100vh;
                overflow-y: auto;
                .component-view {
                    width: 1280px;
                    .component-name {
                        transform: translateX(-158px);
                    }
                }
            }
        }
        .component-view {
            margin: 0 auto;
            position: relative;
            line-height: 1;
        }
    }
}
</style>
