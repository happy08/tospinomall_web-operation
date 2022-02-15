<template>
    <!-- 文件管理器 -->
    <teleport to=".app-wrapper">
        <BmDialog title="选择文件" v-model:visible="show" width="50%" :before-close="beforeClose">
            <div v-for="(item, index) in imgList" :key="index" class="manager-imgs fl m-10">
                <BmImage :src="item.img" fit="cover" />
                <div class="btns flex center">
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button @click="handleChange(item)" type="success" icon="el-icon-check" circle></el-button>
                </div>
            </div>
            <div class="clear"></div>
        </BmDialog>
    </teleport>
</template>

<script>
export default {
    name: "StoreDesignFileManager",
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: {
        "update:show": null,
        changeImg: (value) => {
            return true;
        }
    },
    setup(props, { emit }) {
        let imgList = [
            {
                img: "https://img.quanminyanxuan.com/other/21188f7a1e9340759c113aa569f96699.jpg?x-oss-process=image/resize,h_600,m_lfit"
            },
            {
                img: "http://n.sinaimg.cn/photo/34/w1089h545/20210416/4bde-knvsnuf5803625.jpg"
            }
        ];
        const beforeClose = (done) => {
            emit("update:show", false);
        };

        //选择图片
        const handleChange = (item) => {
            emit("changeImg", item);
            emit("update:show", false);
        };

        return {
            imgList,
            beforeClose,
            handleChange
        };
    }
};
</script>

<style lang="scss" scoped>
.manager-imgs {
    position: relative;
    display: flex;

    width: 100px;
    height: 100px;
    .btns {
        transition: opacity 0.2s;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        opacity: 0;
    }
    &:hover {
        .btns {
            opacity: 1;
        }
    }
}
</style>
