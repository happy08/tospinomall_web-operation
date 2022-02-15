<template>
    <div>
        <el-carousel v-if="datas && componentDetails.length > 0" height="70px" indicator-position="none" arrow="never" direction="vertical" :interval="6000">
            <el-carousel-item v-for="(item, index) in componentDetails" :key="index">
                <BmImage
                    :src="item.imageUrl || require('@/assets/img/default-pc.png')"
                    @click="handleLink(item)"
                    fit="cover"
                    style="width:100%;height:100%"
                    :class="item.imageLinkType != -1 ? 'cp' : ''"
                />
            </el-carousel-item>
        </el-carousel>
        <BmImage v-else :src="require('@/assets/img/default-pc.png')" fit="cover" style="width:100%;height:70px" />
    </div>
</template>

<script>
import { ElCarousel, ElCarouselItem } from "element-plus";
import { ref, watch, getCurrentInstance, nextTick, inject } from "vue";

export default {
    name: "topAdvertising",
    components: { ElCarousel, ElCarouselItem },
    props: {
        datas: Object
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const isPreview = inject("isPreview");

        let componentDetails = ref([]);
        watch(
            () => props.datas.componentDetails,
            (nVal) => {
                componentDetails.value = nVal;
                nextTick(() => {
                    proxy.$forceUpdate();
                });
            },
            { immediate: true, deep: true }
        );

        const handleLink = (item) => {
            if (isPreview) {
                //链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                switch (item.imageLinkType) {
                    case 0:
                        alert("商品链接");
                        break;
                    case 1:
                        alert("前端分类id");
                        break;
                    case 2:
                        alert("后端分类id");
                        break;
                    case 3:
                        alert("品牌");
                        break;
                    case 4:
                        alert("FBT");
                        break;
                    case 5:
                        alert("FBM");
                        break;
                    case 5:
                        alert("外部链接");
                        break;

                    default:
                        break;
                }
            }
        };

        return {
            componentDetails,
            handleLink
        };
    }
};
</script>

<style lang="scss" scoped></style>
