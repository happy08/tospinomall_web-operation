<template>
    <div class="orange">{{ $t("storeDesign.tip1", { num: 2 }) }}</div>
    <!-- 组件标题 -->
    <div class="flex mtb-30">
        <div style="flex:0 0 70px">{{ $t("storeDesign.componentTitle") }}</div>
        <div>
            <el-radio-group v-model="config.moduleTitleDisplay">
                <el-radio :label="0">{{ $t("storeDesign.noDisplay") }}</el-radio>
                <el-radio :label="1">{{ $t("storeDesign.display") }}</el-radio>
            </el-radio-group>
            <el-input v-model="config.moduleTitle" class="mt-5" :placeholder="$t('storeDesign.componentTitle')"></el-input>
        </div>
    </div>
    <!-- 轮播效果 -->
    <div class="flex">
        <div style="flex:0 0 70px">{{ $t("storeDesign.carousel") }}</div>
        <el-radio-group v-model="config.effect">
            <el-radio :label="1">{{ $t("storeDesign.bottomDot") }}</el-radio>
            <el-radio :label="2">{{ $t("storeDesign.noCarousel") }}</el-radio>
        </el-radio-group>
    </div>

    <el-button @click="handleAddGoods" class="w-100 mt-30 mb-10" icon="el-icon-plus">
        {{ $t("storeDesign.selectGoods") }}
        <span v-if="config.goodsNum !== 0"> （{{ $t("selectedN", { num: config.componentDetails.length || 0 }) }}）</span>
    </el-button>

    <!-- 商品 -->
    <teleport to="#app">
        <SelectionGoodsList v-model:visible="goodsVisible" :rows="curConfig" @change="onChangeSelectionGoodsList" />
    </teleport>
</template>

<script>
import { ref } from "vue";
import SelectionGoodsList from "@/components/selectionGoodsList";

export default {
    name: "goods2Column",
    components: { SelectionGoodsList },
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },

    setup(props, { emit }) {
        //选择商品
        const goodsVisible = ref(false);
        let curConfig = ref(null);

        const handleAddGoods = () => {
            goodsVisible.value = true;
            curConfig.value = props.config.componentDetails;
        };

        const onChangeSelectionGoodsList = (rows) => {
            props.config.componentDetails = rows.map((item) => {
                return {
                    id: item.id,
                    goodsId: item.id,
                    goodsTitle: item.goodTitle,
                    goodsPrice: item.minPrice,
                    goodsPic: item.mainPictureUrl,
                    goodTitle: item.goodTitle,
                    tsin: item.tsin,
                    minPrice: item.minPrice,
                    mainPictureUrl: item.mainPictureUrl
                };
            });
            props.config.goodsNum = props.config.componentDetails.length;
        };

        return {
            handleAddGoods,
            goodsVisible,
            curConfig,
            onChangeSelectionGoodsList
        };
    }
};
</script>

<style lang="scss" scoped></style>
