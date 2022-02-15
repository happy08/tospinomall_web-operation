<template>
    <div class="store-info">
        <!-- 切换风格 -->
        <div class="flex mtb-30">
            <div style="flex:0 0 70px">{{ $t("storeDesign.switchStyle") }}</div>
            <div>
                <el-radio-group v-model="config.storeMenuStyleId">
                    <el-radio v-for="item in templateList" :key="item.id" :label="item.id">
                        <!-- <BmImage :src="item.imageUrl" style="width:50%;height:auto" /> -->
                        {{ item.styleName }}
                    </el-radio>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, inject, watch } from "vue";
import { storeStylesFindHeaderTemplate } from "@/api/storeDesign";

export default {
    name: "HeaderMobile",
    components: {},
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, { emit }) {
        const isMobile = inject("isMobile");
        let templateList = ref([]);
        //查询所有的头部模板
        const getStoreStylesFindHeaderTemplate = () => {
            const params = {
                type: isMobile ? 2 : 1
            };
            storeStylesFindHeaderTemplate(params)
                .then((res) => {
                    templateList.value = res.data;
                })
                .catch(() => {});
        };
        getStoreStylesFindHeaderTemplate();

        return {
            templateList
        };
    }
};
</script>

<style lang="scss" scoped></style>
