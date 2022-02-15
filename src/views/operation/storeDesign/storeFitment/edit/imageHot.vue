<template>
    <div class="mb-15">{{ $t("storeDesign.recommendedSize") }}: {{ isMobile ? "750px * 100~1500px" : "1280px * 100~600px" }}</div>
    <div>
        <BmUpload @change="onChangeUpload($event, config)" :fileUrl="config.imageUrl" :showFileList="false" />
    </div>
    <div v-for="(item, index) in config.componentDetails" :key="index" class="manager-imgs">
        <div>{{ $t("storeDesign.hotArea") }}{{ index + 1 }}</div>
        <div @click="handleAddLink(index)" class="bg-white p-5 border round-2">
            {{ getLinkTypeName(item.imageLinkType) || $t("storeDesign.selectLink") }}
        </div>
        <div class="btns">
            <el-button @click="handleDelete(index)" type="danger" icon="el-icon-delete" circle></el-button>
        </div>
    </div>

    <el-button @click="handleAddHot" class="w-100 mt-20 mb-10" icon="el-icon-plus">
        {{ $t("storeDesign.addHotArea") }}
    </el-button>

    <teleport to="#app">
        <SelectionLinkUrl v-if="linkUrlVisible" v-model:visible="linkUrlVisible" :config="curConfig" />
    </teleport>
</template>

<script>
import { getCurrentInstance, inject, ref, watch } from "vue";
import Draggable from "vuedraggable";
import SelectionLinkUrl from "./component/selectionLinkUrl";

export default {
    name: "StoreDesignEditImage",
    components: { Draggable, SelectionLinkUrl },
    props: {
        config: {
            type: Object,
            default: () => {
                return true;
            }
        }
    },

    setup(props) {
        const { proxy } = getCurrentInstance();
        const isMobile = inject("isMobile");

        let areaData = [];
        watch(
            () => props.config,
            (nVal) => {
                areaData = props.config.componentDetails;
            },
            {
                immediate: true
            }
        );

        //添加热区
        const handleAddHot = () => {
            if (props.config.imageUrl.indexOf("http") === -1) {
                proxy.$message.error(proxy.$t("storeDesign.uploadImage"));
                return;
            }
            const data = {
                brandIds: [], //品牌id
                fbmCountrys: "", //FBM（多个国家用,拼接）
                fbtCountrys: "", //FBT（多个国家用,拼接）
                frontMenuIds: [], //前端分类id
                serverMenuIds: [], //后端分类id
                goodsId: "", //商品id
                imageLinkType: -1, //图片链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                imageUrl: "", //图片
                outerLink: "", //自定义外部链接
                positionX: 0, //坐标x
                positionY: 0, //坐标y
                areaWidth: 100, //面积宽
                areaHeight: 50 //面积高
            };
            areaData.push(data);
        };

        //选择链接
        const linkUrlVisible = ref(false);
        let curConfig = ref(null);
        const handleAddLink = (index) => {
            linkUrlVisible.value = true;
            curConfig.value = areaData[index];
        };

        //上传图片
        const onChangeUpload = (file, element) => {
            element.imageUrl = file;
        };

        //删除图片
        const handleDelete = (index) => {
            props.config.componentDetails.splice(index, 1);
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
            linkUrlVisible,
            handleAddHot,
            handleAddLink,
            curConfig,
            onChangeUpload,
            handleDelete,
            getLinkTypeName
        };
    }
};
</script>

<style lang="scss" scoped>
.manager-imgs {
    position: relative;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    background-color: #f2f2f2;
    .btns {
        transition: opacity 0.2s;
        position: absolute;
        top: 0px;
        right: 0px;
        opacity: 0;
        line-height: 1;
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
