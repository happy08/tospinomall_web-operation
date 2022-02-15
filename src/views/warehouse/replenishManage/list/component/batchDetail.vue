<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" :cancel="cancel" noConfirm :width="1200" top="10vh">
        <div class="bg-white round-4">
            <div>
                {{ $t("warehouse.odd") }}：{{ detail.backSn }}
                <span class="plr-30">{{ $t("warehouseTable.createTime") }}：{{ detail.createTime }}</span>
                <span class="plr-30">{{ $t("warehouse.inboundNumber") }}：{{ detail.enterOrderNo }}</span>
                <span class="plr-30">{{ $t("warehouse.inboundTime") }}：{{ detail.enterCreateTime }}</span>
            </div>
            <div class="mtb-15">{{ $t("warehouseTable.receiveWareAddress") }}：{{ detail.receiveWareAddress }}</div>

            <BmTable :data="tableData" class="mb-20">
                <BmTableColumn prop="batchNo" :label="$t('warehouse.batchNo')"></BmTableColumn>
                <BmTableColumn prop="fnsku" label="FNSKU"></BmTableColumn>
                <BmTableColumn prop="putVolume" :label="$t('warehouse.inboundSingleVolume')"></BmTableColumn>
                <BmTableColumn prop="weight" :label="$t('warehouse.inboundSingleWeight')"></BmTableColumn>

                <BmTableColumn prop="totalQuantity" :label="$t('warehouse.inboundQuantityGoods')"></BmTableColumn>
                <BmTableColumn prop="putTotalVolume" :label="$t('warehouse.inboundTotalCapacity')"></BmTableColumn>
                <BmTableColumn prop="putTotalWeight" :label="$t('warehouse.inboundTotalWeight')"></BmTableColumn>
                <BmTableColumn prop="goodQuantity" :label="$t('warehouse.inboundAuthentic')"></BmTableColumn>
                <BmTableColumn prop="badQuantity" :label="$t('warehouse.inboundDefective')"></BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { putenterItemQuery } from "@/api/warehouse";
export default {
    name: "warehouseBatchDetail",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["update:visible"],
    setup(props, { emit }) {
        let detail = ref({});
        //分页
        let pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchForm = reactive({
            wareId: "",
            pageNum: 1,
            pageSize: pageSize
        });

        watch(
            () => props.row,
            (nVal) => {
                detail.value = { ...nVal };

                searchForm.wareId = nVal.id;
                searchForm.pageNum = 1;
                initData();
            }
        );

        let tableData = ref([]);
        //获取列表
        const initData = () => {
            //批次列表
            putenterItemQuery(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records;
                })
                .catch((err) => {});
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            detail,
            pageTotal,
            searchForm,
            tableData,
            handleSizeChange,
            handleCurrentChange,
            cancel
        };
    }
};
</script>
