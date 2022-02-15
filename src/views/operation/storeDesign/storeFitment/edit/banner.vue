<template>
    <div class="mb-15">{{ $t("storeDesign.recommendedSize") }}: {{ isMobile ? "750px * 372px" : "1920px * 500px" }}</div>
    <Draggable :list="config.componentDetails" group="center" tag="transition-group" item-key="imageUrl">
        <template #item="{ element, index }">
            <div class="manager-imgs">
                <BmUpload @change="onChangeUpload($event, element)" :fileUrl="element.imageUrl" :showFileList="false" />

                <div @click="handleAddLink(index)" class="mt-5 p-5 bg-white border round-2">
                    {{ getLinkTypeName(element.imageLinkType) || $t("storeDesign.selectLink") }}
                </div>

                <div class="btns">
                    <el-button @click="handleDeleteImg(index)" type="danger" icon="el-icon-delete" circle></el-button>
                </div>
            </div>
        </template>
    </Draggable>

    <el-button @click="handleAddImage" class="w-100 mt-20 mb-10" icon="el-icon-plus">
        {{ $t("storeDesign.addImage") }}
    </el-button>

    <div class="tc">
        {{ $t("storeDesign.dragSort") }}
    </div>

    <!-- 选择图片 目前没有图片管理 -->
    <!-- <FileManager v-model:show="dialogVisible" @changeImg="changeImg" /> -->

    <!-- 图片链接 -->
    <teleport to="#app">
        <SelectionLinkUrl v-if="linkUrlVisible" v-model:visible="linkUrlVisible" :config="curConfig" />
    </teleport>
</template>

<script>
import { ref, getCurrentInstance, inject } from "vue";
import Draggable from "vuedraggable";
//import FileManager from "./component/fileManager";
import SelectionLinkUrl from "./component/selectionLinkUrl";

export default {
    name: "StoreDesignEditBanner",
    components: { Draggable, SelectionLinkUrl },
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },

    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const isMobile = inject("isMobile");
        const dialogVisible = ref(false);

        //添加图片
        const handleAddImage = () => {
            const data = {
                brandIds: [], //品牌id
                fbmCountrys: "", //FBM（多个国家用,拼接）
                fbtCountrys: "", //FBT（多个国家用,拼接）
                frontMenuIds: [], //前端分类id
                serverMenuIds: [], //后端分类id
                goodsId: "", //商品id
                imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                imageUrl: "", //图片
                outerLink: "" //自定义外部链接
            };
            props.config.componentDetails.push(data);
        };

        //删除图片
        const handleDeleteImg = (index) => {
            if (props.config.componentDetails.length <= 1) {
                proxy.$message.error(proxy.$t("storeDesign.onePicture"));
                return;
            }
            props.config.componentDetails.splice(index, 1);
        };

        //上传图片
        const onChangeUpload = (file, element) => {
            element.imageUrl = file;
        };

        //选择链接
        const linkUrlVisible = ref(false);
        let curConfig = ref(null);
        const handleAddLink = (index) => {
            linkUrlVisible.value = true;
            curConfig.value = props.config.componentDetails[index];
        };

        //链接类型
        let linkTypeList = [
            {
                value: 0,
                name: proxy.$t("storeDesign.goodsLink")
            },
            {
                value: 1,
                name: proxy.$t("storeDesign.frontCategory")
            },
            {
                value: 2,
                name: proxy.$t("storeDesign.backCategory")
            },
            {
                value: 3,
                name: proxy.$t("storeDesign.brind")
            },
            {
                value: 4,
                name: "FBT"
            },
            {
                value: 5,
                name: "FBM"
            },
            {
                value: 6,
                name: proxy.$t("storeDesign.outLink")
            }
        ];
        const getLinkTypeName = (val) => {
            for (let i in linkTypeList) {
                if (linkTypeList[i].value == val) {
                    console.log("linkTypeList[i].name", linkTypeList[i].name);
                    return linkTypeList[i].name;
                }
            }
            return "";
        };

        return {
            isMobile,
            dialogVisible,
            handleAddImage,
            handleDeleteImg,
            handleAddLink,
            getLinkTypeName,
            onChangeUpload,
            linkUrlVisible,
            curConfig
        };
    }
};
</script>

<style lang="scss" scoped>
.manager-imgs {
    position: relative;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #f2f2f2;
    .btns {
        transition: opacity 0.2s;
        position: absolute;
        top: 0px;
        right: 0px;
        opacity: 0;
    }
    &:hover {
        .btns {
            opacity: 1;
        }
    }
}
::v-deep(.el-upload--picture-card) {
    width: 100%;
    height: auto;
    min-height: 120px;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
