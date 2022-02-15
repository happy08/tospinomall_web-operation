<template>
    <BmDialog v-model:visible="visible" :title="$t('table.rejectReason')" :width="600">
        <el-form :model="form" label-width="80px">
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="reason">
                <el-input v-model="form.reason" type="textarea" maxlength="100" autosize show-word-limit autocomplete="off" disabled></el-input>
            </el-form-item>

            <!-- 图片 -->
            <el-form-item :label="$t('image')">
                <BmImage v-for="item in form.imgList" :key="item" :src="item" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="$emit('update:visible', false)">{{ $t("close") }}</el-button>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, watch } from "vue";
import { findLastGoodsExamine } from "@/api/goods";

export default {
    name: "GoodsCheck",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        let form = ref({ reason: "", imgList: [] });
        //获取审核详情
        const getFindLastGoodsExamine = () => {
            findLastGoodsExamine(props.row.id)
                .then((res) => {
                    form.value = res.data;
                })
                .catch((err) => {});
        };
        watch(
            () => props.row,
            (nVal, oVal) => {
                if (nVal.id !== oVal.id) {
                    getFindLastGoodsExamine();
                }
            }
        );

        return {
            form
        };
    }
};
</script>
