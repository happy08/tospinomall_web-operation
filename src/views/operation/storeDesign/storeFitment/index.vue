<template>
    <div class="store-design-layout">
        <div class="store-design-layout-top flex between vcenter plr-20">
            <div class="flex center">
                <BmImage style="width: 35px; height: 35px" :src="require('@/assets/img/logo.png')" class="mr-15" />
                <span class="fw">{{ pageName }}</span>
            </div>
            <div>
                <el-button @click="handlePreview" type="success" plain class="ml-20">
                    {{ $t("storeDesign.preview") }}
                </el-button>
                <el-button @click="handleSave(0)" :disabled="saveDisabled" type="primary" plain class="ml-20">
                    {{ $t("storeDesign.saveDrafts") }}
                </el-button>
                <el-button @click="handleSave(1)" :disabled="saveDisabled" type="primary">
                    {{ $t("storeDesign.savePublish") }}
                </el-button>
            </div>
        </div>

        <!-- 左侧基础组件 -->
        <div class="store-design-layout-left" :class="baseComponentShow ? 'show' : ''">
            <i @click="handleBaseComponentShow" class="el-icon-s-fold"></i>
            <Draggable class="" :list="BaseComponentList" :group="{ name: 'center', pull: 'clone', put: false }" :clone="cloneComponent" item-key="id">
                <template #item="{ element }">
                    <div v-if="(isMobile === true && element.device.includes('mobile')) || (isMobile === false && element.device.includes('pc'))" class="base-componen-item">
                        <BmIcon :name="element.icon" style="width:25px;height:25px" />

                        <div class="lh-12">{{ element.name }}</div>
                    </div>
                </template>
            </Draggable>
        </div>

        <!-- 中间视图组件 -->
        <div
            :class="['store-design-layout-center', { 'config-show': configShow }, { 'base-componen-show': baseComponentShow }, { 'is-preview': isPreview && !isMobile }]"
            :style="'transform: scale(' + scale + ');'"
        >
            <!-- 手机端 -->
            <div v-if="isMobile" class="store-design-layout-view store-design-mobile custom-scrollbar" :class="{ 'is-preview': isPreview }">
                <Draggable :list="viewComponentList.components" group="center" tag="transition-group" @change="changeViewComponent" item-key="id" :delay="0">
                    <template #header>
                        <div key="id">
                            <HeaderMobile @click.native="handelHeaderComponent" />
                            <!-- banner -->
                            <Banner :datas="bannerData" @click.native="handelBanner" />
                        </div>
                    </template>
                    <template #item="{ element, index }">
                        <div @click="handelViewComponent(index)" :class="['component-view', { 'is-active': element.isActive }, { 'isnot-preview': !isPreview }]">
                            <div class="component-name">{{ element.name }}</div>
                            <el-tooltip :content="$t('status.delete')" placement="right" effect="light">
                                <el-button class="delete" @click.stop="handleDeleteComponent(index)" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>

                            <component :is="element.component" :datas="element"></component>
                        </div>
                    </template>
                </Draggable>
            </div>

            <!-- 电脑端 -->
            <div v-if="!isMobile" class="store-design-layout-view store-design-pc bg-light-grey">
                <Draggable :distance="1" :list="viewComponentList.components" group="center" tag="transition-group" @change="changeViewComponent" item-key="id">
                    <template #header>
                        <div key="id">
                            <!-- 顶部广告图 -->
                            <TopAdvertising :datas="topAdvertising" @click.native="handelTopAdvertising" />
                            <!-- 导航 -->
                            <HeaderPC @click.native="handelHeaderComponent" />
                            <!-- banner -->
                            <Banner :datas="bannerData" @click.native="handelBanner" />
                        </div>
                    </template>
                    <template #item="{ element, index }">
                        <div @click="handelViewComponent(index)" :class="['component-view', { 'is-active': element.isActive }, { 'isnot-preview': !isPreview }]">
                            <div class="component-name">{{ element.name }}</div>
                            <el-tooltip :content="$t('status.delete')" placement="right" effect="light">
                                <el-button class="delete" @click.stop="handleDeleteComponent(index)" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>
                            <component :is="element.component" :datas="element"></component>
                        </div>
                    </template>
                </Draggable>

                <!-- footer -->
                <div
                    :style="
                        `background:url( ${require('@/assets/img/footer-pc.jpg')}) center no-repeat;
                        background-size: 100%;
                        height: ${isPreview ? '426px' : '280px'}`
                    "
                ></div>
            </div>
        </div>

        <!-- 放大缩小 -->
        <div class="store-design-scale">
            <el-tooltip :content="$t('storeDesign.normal')" placement="top" effect="light">
                <el-button @click="scale = 1" icon="el-icon-check" circle></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('storeDesign.zoomIn')" placement="top" effect="light">
                <el-button @click="scale = scale >= 1.4 ? 1.4 : scale + 0.1" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('storeDesign.shrink')" placement="top" effect="light">
                <el-button @click="scale = scale <= 0.6 ? 0.6 : scale - 0.1" icon="el-icon-minus" circle></el-button>
            </el-tooltip>
        </div>

        <!-- 右侧配置 -->
        <div :class="['store-design-layout-right', { 'config-show': configShow }]">
            <i @click="handleconfigShow" class=" el-icon-s-unfold "></i>
            <div class="content">
                <EditComponentConfig :config="curConfig"></EditComponentConfig>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, provide, getCurrentInstance, toRaw } from "vue";
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

import { storeStylesUpdateComponentInfo, storeStylesGetById } from "@/api/storeDesign";
import { deepClone } from "@/utils/";
import { useRoute } from "vue-router";

let idGlobal = 1;

export default {
    name: "StoreDesign",
    components: {
        EditComponentConfig,
        Draggable,
        goods2Column,
        goods3Column,
        goods6Column,
        imageHot,
        Banner,
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

        const pageName = route.query.name || "";

        let scale = ref(1);
        let curConfig = ref(null); //正在编辑的组件参数配置

        //左侧基础组件
        let BaseComponentList = [
            // {
            //     type: 1,
            //     device: ["mobile", "pc"],
            //     component: "banner", //mobile&PC 轮播图
            //     name: proxy.$t("storeDesign.slideshow"), //组件名称
            //     //moduleTitle: proxy.$t("storeDesign.slideshow"), //标题
            //     icon: "banner",
            //     componentDetails: [
            //         {
            //             imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
            //             imageUrl: "",
            //         },
            //         {
            //             imageLinkType: -1,
            //             imageUrl: "",
            //         },
            //     ],
            // },
            {
                type: 2,
                device: ["mobile", "pc"],
                component: "imageHot", //mobile&PC 热区图片
                name: proxy.$t("storeDesign.hotPictures"), //组件名称
                // moduleTitle: proxy.$t("storeDesign.hotPictures"), //标题
                // moduleTitleDisplay: 0, //是否显示组件标题(0不显示1显示）
                icon: "hot",
                imageUrl: "",
                componentDetails: []
            },
            {
                type: 3,
                device: ["mobile"], //mobile专用
                component: "goods3Column", //mobile 一行三列
                name: proxy.$t("storeDesign.threeColumns"),
                moduleTitle: proxy.$t("storeDesign.threeColumns"),
                moduleTitleDisplay: 1, //是否显示组件标题(0不显示1显示）
                effect: 2, //轮播效果（1底部按钮2无轮播）
                icon: "column3",
                goodsNum: 0,
                componentDetails: [
                    // {
                    //     goodTitle: proxy.$t("storeDesign.goodTitle"),
                    //     minPrice: "0.00",
                    //     mainPictureUrl: "",
                    // },
                    // {
                    //     goodTitle: proxy.$t("storeDesign.goodTitle"),
                    //     minPrice: "0.00",
                    //     mainPictureUrl: "",
                    // },
                    // {
                    //     goodTitle: proxy.$t("storeDesign.goodTitle"),
                    //     minPrice: "0.00",
                    //     mainPictureUrl: "",
                    // },
                ]
            },
            {
                type: 4,
                device: ["mobile"], //mobile专用
                component: "goods2Column", //mobile 一行两列
                name: proxy.$t("storeDesign.twoColumns"),
                moduleTitle: proxy.$t("storeDesign.twoColumns"),
                moduleTitleDisplay: 1, //是否显示组件标题(0不显示1显示）
                icon: "column2",
                goodsNum: 0,
                componentDetails: [
                    // {
                    //     goodTitle: proxy.$t("storeDesign.goodTitle"),
                    //     minPrice: "0.00",
                    //     mainPictureUrl: "",
                    // },
                    // {
                    //     goodTitle: proxy.$t("storeDesign.goodTitle"),
                    //     minPrice: "0.00",
                    //     mainPictureUrl: "",
                    // },
                ]
            },
            // {
            //     type: 5,
            //     device: ["pc"], //PC专用
            //     component: "topAdvertising", //PC 顶部广告图
            //     name: proxy.$t("storeDesign.topAD"), //组件名称
            //     icon: "hot",
            //     imageUrl: "",
            //     componentDetails: [
            //         {
            //             imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
            //             imageUrl: "",
            //         },
            //     ],
            // },
            {
                type: 6,
                device: ["pc"], //PC专用
                component: "goods6Column", //PC 一行六列
                name: proxy.$t("storeDesign.sixColumns"),
                moduleTitle: proxy.$t("storeDesign.sixColumns"),
                moduleTitleDisplay: 1, //是否显示组件标题(0不显示1显示）
                effect: 2, //轮播效果（1底部按钮2无轮播）
                icon: "column3",
                goodsNum: 0,
                componentDetails: []
            }
        ];
        let baseComponentShow = ref(true);
        const handleBaseComponentShow = () => {
            baseComponentShow.value = !baseComponentShow.value;
        };

        let viewComponentList = ref({
            components: []
        }); //中间显示组件

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
                // {
                //     imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                //     imageUrl: "",
                // },
            ]
        });
        //顶部导航风格的配置
        let headerNavStype = reactive({
            component: "HeaderMobile", //必须
            storeMenuStyleId: "",
            name: "",
            logo: "",
            bgImg: ""
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
                        //一行两列 一行三列 一行六列
                        if (item.type === 3 || item.type === 4 || item.type === 6) {
                            item.componentDetails.forEach((pitem) => {
                                pitem.id = pitem.goodsId;
                                pitem.mainPictureUrl = pitem.goodsPic;
                                pitem.minPrice = pitem.goodsPrice;
                                pitem.goodTitle = pitem.goodsTitle;
                            });
                        }
                        //banner、热区的 链接转成数组
                        if (item.type === 1 || item.type === 2) {
                            item.componentDetails.forEach((pitem) => {
                                pitem.frontMenuIds = (pitem.frontMenuIds && JSON.parse(pitem.frontMenuIds)) || [];
                                pitem.serverMenuIds = (pitem.serverMenuIds && JSON.parse(pitem.serverMenuIds)) || [];
                                pitem.brandIds = (pitem.brandIds && pitem.brandIds.split(",")) || [];
                                pitem.fbmCountrys = (pitem.fbmCountrys && pitem.fbmCountrys.split(",")) || [];
                                pitem.fbtCountrys = (pitem.fbtCountrys && pitem.fbtCountrys.split(",")) || [];
                            });
                        }
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

                    headerNavStype.storeMenuStyleId = (res.data.storeMenuStyle && res.data.storeMenuStyle.id) || "";

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

        // 点击头部
        const handelHeaderComponent = () => {
            curConfig.value = headerNavStype;
            configShow.value = true;
        };

        // 点击顶部广告图
        const handelTopAdvertising = () => {
            console.log("topAdvertising.value", topAdvertising.value);
            curConfig.value = topAdvertising.value;
            configShow.value = true;
        };

        // 点击banner
        const handelBanner = () => {
            curConfig.value = bannerData.value;
            configShow.value = true;
        };

        //拖动组件到中间视图
        const cloneComponent = (item) => {
            return {
                id: idGlobal++,
                ...deepClone(item)
            };
        };

        // 点击中间视图组件
        const handelViewComponent = (index) => {
            for (let i = 0, length = viewComponentList.value.components.length; i < length; i++) {
                viewComponentList.value.components[i].isActive = i === index ? true : false;
            }
            curConfig.value = viewComponentList.value.components[index];
            configShow.value = true;
        };

        //中间视图组件变化时
        const changeViewComponent = (element) => {
            const { moved, added } = element;
            const newIndex = (moved && moved.newIndex) || (added && added.newIndex);
            handelViewComponent(newIndex);
        };

        //删除组件
        const handleDeleteComponent = (index) => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), "", {
                    type: "warning"
                })
                .then(() => {
                    viewComponentList.value.components.splice(index, 1);
                    curConfig.value = {};
                })
                .catch(() => {});
        };

        //保存 status=1草稿 2=发布
        let saveDisabled = ref(false);
        const handleSave = (status, closeWindow = true) => {
            return new Promise((resolve, reject) => {
                let msg = "";
                const viewComponent = deepClone(toRaw(viewComponentList.value));
                viewComponent.status = status;
                viewComponent.components.unshift(bannerData.value); //添加轮播图

                viewComponent.components.forEach((item) => {
                    //热区图片 热区换算成%
                    if (item.type === 2) {
                        if (item.imageUrl != "") {
                            let areaData = item.componentDetails;
                            const pageWidth = isMobile ? 375 : 980;
                            if (item.imgInfo.width < pageWidth) {
                                for (let i = 0, length = areaData.length; i < length; i++) {
                                    areaData[i].positionX = (areaData[i].positionX / item.imgInfo.width) * 100;
                                    areaData[i].positionY = (areaData[i].positionY / item.imgInfo.height) * 100;
                                    areaData[i].areaWidth = (areaData[i].areaWidth / item.imgInfo.width) * 100;
                                    areaData[i].areaHeight = (areaData[i].areaHeight / item.imgInfo.height) * 100;
                                }
                            } else {
                                for (let i = 0, length = areaData.length; i < length; i++) {
                                    areaData[i].positionX = (areaData[i].positionX * 100) / pageWidth;
                                    areaData[i].positionY = (areaData[i].positionY * 100) / (pageWidth / item.imgInfo.percent);
                                    areaData[i].areaWidth = (areaData[i].areaWidth * 100) / pageWidth;
                                    areaData[i].areaHeight = (areaData[i].areaHeight * 100) / (pageWidth / item.imgInfo.percent);
                                }
                            }
                            item.proportion = item.imgInfo.percent;
                        } else {
                            msg = `[ ${item.name} ]` + proxy.$t("storeDesign.uploadImage");
                        }
                    }
                    //一行两列
                    if (item.type === 4) {
                        if (item.componentDetails.length < 2) {
                            msg = `[ ${item.moduleTitle} ]` + proxy.$t("storeDesign.selectGoodsNum", { num: 2 });
                        }
                        //item.componentDetails = item.componentDetails.slice(0, 2); //前2个
                    }
                    //一行三列
                    if (item.type === 3) {
                        if (item.componentDetails.length < 3) {
                            msg = `[ ${item.moduleTitle} ]` + proxy.$t("storeDesign.selectGoodsNum", { num: 3 });
                        }
                    }
                    //一行六列
                    if (item.type === 6) {
                        if (item.componentDetails.length < 6) {
                            msg = `[ ${item.moduleTitle} ]` + proxy.$t("storeDesign.selectGoodsNum", { num: 6 });
                        }
                    }
                    //轮播图
                    if (item.type === 1) {
                        if (item.componentDetails.length < 1) {
                            msg = `[ ${item.name} ]` + proxy.$t("storeDesign.onePicture");
                        }
                        item.componentDetails.forEach((citem) => {
                            if (citem.imageUrl === "") {
                                msg = `[ ${item.name} ]` + proxy.$t("storeDesign.uploadImage");
                            }
                        });
                    }
                });
                if (msg) {
                    proxy.$message.error(msg);
                    reject();
                    return;
                }

                viewComponent.components.forEach((item) => {
                    //轮播图&热区图片  转链接数组为字符串格式
                    if (item.type === 1 || item.type === 2) {
                        item.componentDetails.forEach((uItem) => {
                            //链接类型（1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                            uItem.frontMenuIds = uItem.frontMenuIds && JSON.stringify(uItem.frontMenuIds);
                            uItem.serverMenuIds = uItem.serverMenuIds && JSON.stringify(uItem.serverMenuIds);
                            uItem.brandIds = uItem.brandIds && uItem.brandIds.join(",");
                            uItem.fbtCountrys = uItem.fbtCountrys && uItem.fbtCountrys.join(",");
                            uItem.fbmCountrys = uItem.fbmCountrys && uItem.fbmCountrys.join(",");
                            // switch (uItem.imageLinkType) {
                            //     case 1:
                            //         uItem.frontMenuIds = JSON.stringify(uItem.frontMenuIds);
                            //         break;
                            //     case 2:
                            //         uItem.serverMenuIds = JSON.stringify(uItem.serverMenuIds);
                            //         break;
                            //     case 3:
                            //         uItem.brandIds = uItem.brandIds.join(",");
                            //         break;
                            //     case 4:
                            //         uItem.fbtCountrys = uItem.fbtCountrys.join(",");
                            //         break;
                            //     case 5:
                            //         uItem.fbmCountrys = uItem.fbmCountrys.join(",");
                            //         break;
                            //     default:
                            //         break;
                            // }
                        });
                    }
                });

                if (!isMobile) {
                    viewComponent.components.unshift(topAdvertising.value);
                }
                viewComponent.storeMenuStyleId = headerNavStype.storeMenuStyleId;

                // console.log("viewComponentList", viewComponent);
                // return;
                saveDisabled.value = true;
                storeStylesUpdateComponentInfo(viewComponent)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        saveDisabled.value = false;
                        resolve();

                        //是否关闭窗口
                        if (closeWindow) {
                            setTimeout(() => {
                                window.close();
                            }, 1500);
                        }
                    })
                    .catch(() => {
                        saveDisabled.value = false;
                        reject();
                    });
            });
        };

        let configShow = ref(true);
        const handleconfigShow = () => {
            configShow.value = !configShow.value;
        };

        //预览
        const handlePreview = () => {
            proxy
                .$confirm(proxy.$t("storeDesign.saveDraftsPreview"), {
                    type: "warning"
                })
                .then(() => {
                    //保存草稿 才能预览到最新的
                    handleSave(0, false)
                        .then(() => {
                            window.open(
                                window.location.origin + window.location.pathname + `#/operation/storeDesign/storeFitment/preview?type=preview&pageType=${route.query.pageType}&id=${route.query.id}`
                            );
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        };

        return {
            pageName,
            scale,
            isPreview,
            isMobile,
            topAdvertising,
            bannerData,
            curConfig,
            baseComponentShow,
            handleBaseComponentShow,
            BaseComponentList,
            viewComponentList,
            handelHeaderComponent,
            handelTopAdvertising,
            handelBanner,
            handelViewComponent,
            cloneComponent,
            changeViewComponent,
            handleDeleteComponent,
            saveDisabled,
            handleSave,
            configShow,
            handleconfigShow,
            handlePreview
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
    display: block;
    position: relative;
    min-width: 100%;
    min-height: 100%;
    height: 100%;
    .store-design-layout-top {
        position: fixed;
        left: 0px;
        top: 0px;
        right: 0px;
        width: 100%;
        height: 64px;
        background: #ffffff;
        box-shadow: 2px 0px 8px 0px #bcc3ce;
        z-index: 1003;
    }
    .store-design-layout-left {
        position: fixed;
        left: 0;
        top: 64px;
        bottom: 0px;
        width: 240px;
        background: #ffffff;
        padding: 16px;
        box-sizing: border-box;
        z-index: 1002;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
        transform: translateX(-240px);
        &.show {
            transform: translateX(0px);
        }
        > i {
            position: absolute;
            right: -36px;
            top: 10px;
            padding: 8px;
            border-radius: 0 20px 20px 0;
            z-index: 9;
            font-size: 20px;
            color: #6b7075;
            background-color: #ffffff;
            cursor: pointer;
            box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
        }
    }
    .base-componen-item {
        display: inline-block;
        transition: all 0.25s;
        width: 80px;
        height: 80px;
        margin: 10px;
        padding-top: 15px;
        border-radius: 4px;
        text-align: center;
        border: solid 1px #e8e8e8;
        cursor: move;
        &:hover {
            border-color: #b3e2df;
            background-color: #b3e2df;
        }
        i {
            font-size: 26px;
        }
    }
    .store-design-layout-center {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding: 100px 0px 100px 0px;
        overflow-y: auto;
        transition: padding 0.3s;
        &.config-show {
            padding-right: 400px;
        }
        &.base-componen-show {
            padding-left: 360px;
        }
        &.is-preview {
            padding-top: 0px;
        }
        .store-design-layout-view {
            .base-componen-item {
                width: 100%;
                margin: 10px 0;
                border-color: #b3e2df;
                background-color: #b3e2df;
                border-radius: 0px;
            }
            position: relative;
            margin: 0 auto;
            box-shadow: -10px 20px 30px 0px rgba(0, 0, 0, 0.2);
            &.store-design-mobile {
                width: 375px;
                min-height: 667px;
                .component-header {
                    height: 100px;
                    background-size: cover;
                }
                &.is-preview {
                    height: 667px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            }
            &.store-design-pc {
                width: 1280px;
                //max-width: 100%;
                min-height: 667px;
                .component-view {
                    width: 980px;
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
            .component-name {
                position: absolute;
                right: 100%;
                top: 0px;
                height: 32px;
                line-height: 32px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 16px;
                padding: 0 16px;
                word-break: keep-all;
                white-space: nowrap;
                font-size: 14px;
                transform: translateX(-8px);
                color: #6b7075;
            }
            .delete {
                transition: opacity 0.25s;
                position: absolute;
                top: 0;
                opacity: 0;
                right: -35px;
            }
            &.isnot-preview {
                &::before {
                    transition: opacity 0.25s;
                    opacity: 0;
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: dashed 2px transparent;
                    z-index: 9;
                }
                &:hover {
                    &::before {
                        opacity: 1;
                        border-color: $baseColor;
                    }
                    .delete {
                        opacity: 1;
                    }
                }
                &.is-active {
                    &::before {
                        opacity: 1;
                        border-style: solid;
                        border-color: $baseColor;
                    }
                }
            }
        }
    }
    .store-design-scale {
        position: fixed;
        bottom: 20px;
        left: 250px;
        width: 120px;
    }
    .store-design-layout-right {
        position: relative;
        background: #fff;
        width: 360px;
        position: fixed;
        right: 0px;
        top: 64px;
        bottom: 0px;
        z-index: 99;
        transition: transform 0.3s;
        transform: translateX(360px);
        box-sizing: border-box;
        &.config-show {
            transform: translateX(-0px);
        }
        > i {
            position: absolute;
            left: -36px;
            top: 10px;
            padding: 8px;
            border-radius: 20px 0 0 20px;
            z-index: 9;
            font-size: 20px;
            color: #6b7075;
            background-color: #ffffff;
            cursor: pointer;
            box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.1);
        }
        .content {
            height: 100%;
            padding: 25px;
            overflow: auto;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
    }
}
</style>
