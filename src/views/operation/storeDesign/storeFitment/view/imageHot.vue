<template>
    <div class="image-hot flex center">
        <!-- <el-tooltip v-if="!isPreview" :content="$t('storeDesign.addHotArea')" placement="right" effect="light">
            <el-button @click.prevent="addHot" icon="el-icon-plus" circle class="addhotarea"></el-button>
        </el-tooltip> -->

        <div class="img-box">
            <div class="container">
                <BmImage
                    style="width:100%"
                    :src="datas.imageUrl || require('@/assets/img/default-pc.png')"
                    ondragstart="return false;"
                    oncontextmenu="return false;"
                    onselect="document.selection.empty();"
                />
                <!--已有的热区-->
                <div v-if="showAreaBox">
                    <ImageHotAreaBox v-for="(item, index) in areaData" :index="index" :key="index" :area-init="item" @delAreaBox="delAreaBox" :imgInfo="imgInfo" @linkUrlVisible="onLinkUrlVisible" />
                </div>
            </div>
        </div>
    </div>

    <teleport to="#app">
        <SelectionLinkUrl v-if="linkUrlVisible" v-model:visible="linkUrlVisible" :config="areaConfig" />
    </teleport>
</template>

<script>
import { getCurrentInstance, reactive, ref, inject, watch, toRaw } from "vue";
import ImageHotAreaBox from "./component/imageHotAreaBox";
import SelectionLinkUrl from "../edit/component/selectionLinkUrl";

export default {
    name: "imageHot",
    components: {
        ImageHotAreaBox,
        SelectionLinkUrl
    },
    props: ["datas"],
    setup(props) {
        const { proxy } = getCurrentInstance();
        const isMobile = inject("isMobile");
        const isPreview = inject("isPreview");

        let showAreaBox = ref(false);
        let areaData = props.datas.componentDetails;
        let imgInfo = reactive({});

        // //添加热区
        // const addHot = () => {
        //     if (props.datas.imageUrl.indexOf("http") === -1) {
        //         proxy.$message.error(proxy.$t("storeDesign.uploadImage"));
        //         return;
        //     }
        //     const data = {
        //         brandIds: [], //品牌id
        //         fbmCountrys: "", //FBM（多个国家用,拼接）
        //         fbtCountrys: "", //FBT（多个国家用,拼接）
        //         frontMenuIds: [], //前端分类id
        //         serverMenuIds: [], //后端分类id
        //         goodsId: "", //商品id
        //         imageLinkType: 0, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
        //         imageUrl: "", //图片
        //         outerLink: "", //自定义外部链接
        //         positionX: 0, //坐标x
        //         positionY: 0, //坐标y
        //         areaWidth: 100, //面积宽
        //         areaHeight: 50 //面积高
        //     };
        //     areaData.push(data);
        // };

        const getImgInfo = () => {
            let img = new Image();
            img.src = props.datas.imageUrl;
            const pageWidth = isMobile ? 375 : 980;
            img.onload = function() {
                // if (img.width < pageWidth) {
                //     proxy.$message.error(proxy.$t("storeDesign.imageSize", { num: pageWidth }));
                //     //return;
                // }

                imgInfo.width = img.width; //图片实际宽度
                imgInfo.height = img.height; //图片实际高度
                imgInfo.percent = (img.width / img.height).toFixed(2); //图片比例

                //通过%换算成实际坐标，宽高
                for (let i = 0, length = areaData.length; i < length; i++) {
                    areaData[i].positionX = pageWidth * (areaData[i].positionX / 100);
                    areaData[i].positionY = (pageWidth / imgInfo.percent) * (areaData[i].positionY / 100);
                    areaData[i].areaWidth = pageWidth * (areaData[i].areaWidth / 100);
                    areaData[i].areaHeight = (pageWidth / imgInfo.percent) * (areaData[i].areaHeight / 100);
                }
                showAreaBox.value = true;
                props.datas.imgInfo = toRaw(imgInfo);
            };
        };
        if (!props.datas.imgInfo && !isPreview) {
            getImgInfo();
        } else {
            showAreaBox.value = true;
        }

        //监听图片变化 重新计算
        watch(
            () => props.datas.imageUrl,
            () => {
                showAreaBox.value = false;

                const pageWidth = isMobile ? 375 : 980;
                //通过实际坐标，宽高 - 换算成%
                if (imgInfo.width < pageWidth) {
                    for (let i = 0, length = areaData.length; i < length; i++) {
                        areaData[i].positionX = (areaData[i].positionX / imgInfo.width) * 100;
                        areaData[i].positionY = (areaData[i].positionY / imgInfo.height) * 100;
                        areaData[i].areaWidth = (areaData[i].areaWidth / imgInfo.width) * 100;
                        areaData[i].areaHeight = (areaData[i].areaHeight / imgInfo.height) * 100;
                    }
                } else {
                    for (let i = 0, length = areaData.length; i < length; i++) {
                        areaData[i].positionX = (areaData[i].positionX * 100) / pageWidth;
                        areaData[i].positionY = (areaData[i].positionY * 100) / (pageWidth / imgInfo.percent);
                        areaData[i].areaWidth = (areaData[i].areaWidth * 100) / pageWidth;
                        areaData[i].areaHeight = (areaData[i].areaHeight * 100) / (pageWidth / imgInfo.percent);
                    }
                }

                getImgInfo();
            }
        );

        // 删除指定热区
        const delAreaBox = (index) => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), {
                    type: "warning"
                })
                .then(() => {
                    areaData.splice(index, 1);
                })
                .catch(() => {});
        };

        //选择链接
        let areaConfig = ref({});
        const linkUrlVisible = ref(false);
        const onLinkUrlVisible = (item) => {
            areaConfig.value = item;
            linkUrlVisible.value = true;
        };

        return {
            isPreview,
            showAreaBox,
            areaData,
            //addHot,
            imgInfo,
            delAreaBox,
            areaConfig,
            linkUrlVisible,
            onLinkUrlVisible
        };
    }
};
</script>

<style scoped lang="scss">
.image-hot {
    position: relative;
    background-color: #f8f8f8;
    .addhotarea {
        position: absolute;
        right: -35px;
        top: 35px;
        z-index: 99;
        opacity: 0;
    }
    &:hover {
        .addhotarea {
            opacity: 1;
        }
    }
    .img-box {
        .container {
            position: relative;
            overflow: hidden;
        }
        img {
            cursor: crosshair;
        }
    }
}
</style>
