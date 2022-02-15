<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.viewInboundDetails')" :cancel="cancel" noConfirm :width="1300" top="5vh">
        <div class="bg-white round-4">
            <div>
                {{ $t("warehouse.odd") }}：{{ row.backSn }} <span class="plr-30">{{ $t("warehouseTable.createTime") }}：{{ row.createTime }}</span>
            </div>
            <div class="mtb-15">{{ $t("warehouseTable.receiveWareAddress") }}：{{ row.receiveWareAddress }}</div>

            <BmTable :data="tableData" class="mb-20">
                <BmTableColumn prop="enterOrderNo" :label="$t('warehouse.inboundNumber')"></BmTableColumn>
                <BmTableColumn prop="totalPutNum" :label="$t('warehouse.inboundQuantityGoods')"></BmTableColumn>
                <BmTableColumn prop="putTotalVolume" :label="$t('warehouse.inboundTotalCapacity')"></BmTableColumn>
                <BmTableColumn prop="putTotalWeight" :label="$t('warehouse.inboundTotalWeight')"></BmTableColumn>
                <BmTableColumn prop="putGoodsNum" :label="$t('warehouse.inboundAuthentic')"></BmTableColumn>
                <BmTableColumn prop="putBadNum" :label="$t('warehouse.inboundDefective')"></BmTableColumn>
                <BmTableColumn prop="createTime" :label="$t('warehouse.inboundTime')"></BmTableColumn>
                <BmTableColumn :label="$t('table.operation')" fixed="right" width="100" align="center">
                    <template #default="scope">
                        <el-button @click.stop="handleDetail(scope.row)" type="text">
                            {{ $t("table.detail") }}
                        </el-button>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
        </div>
    </BmDialog>

    <!-- 查看批次详情 -->
    <BatchDetail v-model:visible="detailVisible" :row="detailRow" />
</template>

<script>
import { ref, reactive, watch } from "vue";
import BatchDetail from "./batchDetail";

import { putenterQuery } from "@/api/warehouse";
export default {
    name: "warehouseInboundDetail",
    components: { BatchDetail },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["update:visible"],
    setup(props, { emit }) {
        watch(
            () => props.row,
            (nVal) => {
                searchForm.correlationOrderNo = nVal.backSn;
                searchForm.pageNum = 1;
                initData();
            }
        );
        //分页
        let pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchForm = reactive({
            correlationOrderNo: "",
            pageNum: 1,
            pageSize: pageSize
        });

        let tableData = ref([]);
        //获取列表
        const initData = () => {
            putenterQuery(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records;
                })
                .catch((err) => {});
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = {
                ...row,
                enterCreateTime: row.createTime,

                backSn: props.row.backSn,
                createTime: props.row.createTime,
                receiveWareAddress: props.row.receiveWareAddress
            };
            detailVisible.value = true;
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
            pageTotal,
            searchForm,
            tableData,
            detailVisible,
            detailRow,
            handleDetail,
            handleSizeChange,
            handleCurrentChange,
            cancel
        };
    }
};
</script>
