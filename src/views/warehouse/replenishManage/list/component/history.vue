<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.operateHistory')" :noConfirm="true" :cancel="cancel" :width="600">
        <el-timeline>
            <el-timeline-item v-for="(item, index) in historyList" :key="index" :timestamp="item.updateTime" :color="index === historyList.length - 1 ? '#42b7ae' : ''">
                <div class="light-grey">{{ item.createTime }}</div>
                {{ item.remark }}
                <div v-if="item.voucherImgList && item.voucherImgList.length > 0">
                    <a v-for="(item, index) in item.voucherImgList" :key="index" :href="item" target="_blank">
                        <BmImage :src="item" style="width:80px;height:80px" class="m-5" />
                    </a>
                </div>
            </el-timeline-item>
        </el-timeline>
    </BmDialog>
</template>

<script>
import { ref, computed, getCurrentInstance, watch } from "vue";
import { baseOperateHistory } from "@/api/warehouse";

export default {
    name: "replenishManageHistory",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object,
        status: Number
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //状态0->草稿 1->审核中 2->待发货 3->待收货 4->在运营中心 5->入仓完成 6->驳回 7->已拒签
        const statusList = computed(() => [
            proxy.$t("warehouse.operateStep1"),
            proxy.$t("warehouse.operateStep2"),
            proxy.$t("warehouse.operateStep5"),
            proxy.$t("warehouse.operateStep6"),
            proxy.$t("warehouse.operateStep7"),
            proxy.$t("warehouse.operateStep8"),
            proxy.$t("warehouse.operateStep3"),
            proxy.$t("warehouse.operateStep4")
        ]);

        let historyList = ref([]);
        watch(
            () => props.row.id,
            (nVal) => {
                baseOperateHistory(nVal)
                    .then((res) => {
                        historyList.value = res.data;
                    })
                    .catch((err) => {});
            }
        );

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            statusList,
            historyList,
            cancel
        };
    }
};
</script>
