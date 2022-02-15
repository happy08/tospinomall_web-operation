<template>
    <div class="plr-15">
        <div v-show="datas.moduleTitleDisplay" class="ptb-10 fs-14 lh-12">{{ datas.moduleTitle }}</div>

        <el-carousel
            v-if="datas.componentDetails && datas.componentDetails.length > 2"
            ref="carouselRef"
            :height="isPreview ? '280px' : '210px'"
            :indicator-position="datas.effect === 2 ? 'none' : ''"
        >
            <el-carousel-item v-for="(citem, index) in componentDetails" :key="index">
                <el-row :gutter="15">
                    <el-col v-for="(item, index) in citem" :key="index" :span="12">
                        <BmImage :style="'width: 100%; height: ' + (isPreview ? '165px' : '165px')" :src="item.goodsPic || require('@/assets/img/default.png')" fit="cover" />
                        <div class="plr-10 bg-white">
                            <div class="pt-10 lh-12 hidden-2" style="height:38px">{{ item.goodsTitle }}</div>
                            <div class="ptb-10 red">{{ $store.state.app.currencySymbol }} {{ item.goodsPrice || "0.00" }}</div>
                        </div>
                    </el-col>
                </el-row>
            </el-carousel-item>
        </el-carousel>
        <el-row v-else-if="datas.componentDetails && datas.componentDetails.length > 0" :gutter="15">
            <el-col v-for="(item, index) in datas.componentDetails" :key="index" :span="12">
                <BmImage :style="'width: 100%; height: ' + (isPreview ? '165px' : '165px')" :src="item.goodsPic || require('@/assets/img/default.png')" fit="cover" />
                <div class="plr-10 bg-white">
                    <div class="pt-10 lh-12 hidden-2" style="height:38px">{{ item.goodsTitle }}</div>
                    <div class="ptb-10 red">{{ $store.state.app.currencySymbol }} {{ item.goodsPrice || "0.00" }}</div>
                </div>
            </el-col>
        </el-row>
        <el-row v-else :gutter="15">
            <el-col v-for="(item, index) in 2" :key="index" :span="12">
                <BmImage :style="'width: 100%; height: ' + isPreview ? '165px' : '165px'" :src="require('@/assets/img/default.png')" fit="cover" />
                <div class="plr-10 bg-white">
                    <div class="pt-10 lh-12 hidden-2" style="height:38px">{{ $t("storeDesign.goodTitle") }}</div>
                    <div class="ptb-10 red">{{ $store.state.app.currencySymbol }} 0.00</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { ref, inject, watch, nextTick } from "vue";
import { ElCarousel, ElCarouselItem } from "element-plus";

export default {
    name: "goods2Column",
    components: {
        [ElCarousel.name]: ElCarousel,
        [ElCarouselItem.name]: ElCarouselItem
    },
    props: ["datas"],
    setup(props) {
        //const isMobile = inject("isMobile");

        let carouselRef = ref(null);
        let componentDetails = ref([]);
        watch(
            () => props.datas.componentDetails,
            (nVal) => {
                let result = [];
                //=1底部按钮 =2无轮播
                if (props.datas.effect == 2) {
                    result = props.datas.componentDetails.slice(0, 2); //无轮播 截取前2个
                } else {
                    //每2个一组
                    if (props.datas.componentDetails.length > 2) {
                        for (let i = 0; i < props.datas.componentDetails.length; i += 2) {
                            result.push(props.datas.componentDetails.slice(i, i + 2));
                        }
                    } else {
                        result = props.datas.componentDetails;
                    }
                }
                // debugger;
                componentDetails.value = result;
            },
            { immediate: true, deep: true }
        );

        watch(
            () => props.datas.effect,
            (nVal) => {
                //=1底部按钮 =2无轮播
                let result = [];
                if (nVal == 2) {
                    nextTick(() => {
                        carouselRef.value && carouselRef.value.setActiveItem(0);
                    });

                    result = props.datas.componentDetails.slice(0, 2); //前2个
                } else {
                    //每2个一组
                    if (props.datas.componentDetails.length > 2) {
                        for (let i = 0; i < props.datas.componentDetails.length; i += 2) {
                            result.push(props.datas.componentDetails.slice(i, i + 2));
                        }
                    } else {
                        result = props.datas.componentDetails;
                    }
                }
                componentDetails.value = result;
            },
            { immediate: true }
        );

        return {
            carouselRef,
            componentDetails
        };
    }
};
</script>

<style lang="scss" scoped>
::v-deep(.el-carousel__button) {
    background-color: #42b7ae;
}
</style>
