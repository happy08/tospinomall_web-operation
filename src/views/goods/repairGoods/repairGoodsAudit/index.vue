<template>
    <template v-if="!editVisible">
        <div class="top-search-form">
            <BmBreadcrumb />

            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 申请时间 -->
                        <el-form-item :label="$t('applyTime')" prop="_timeType">
                            <el-date-picker
                                v-model="searchForm._timeType"
                                type="datetimerange"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                                :disabled-date="disabledDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- 审核时间 -->
                        <el-form-item :label="$t('auditTime')" prop="_reviewTimeType">
                            <el-date-picker
                                v-model="searchForm._reviewTimeType"
                                type="datetimerange"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                                :disabled-date="disabledDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item label="TSIN" prop="goodsTsin">
                            <el-input v-model="searchForm.goodsTsin" placeholder="TSIN" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="table-search-btns">
                    <!-- 查询 -->
                    <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                    <!-- 重置 -->
                    <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                </div>
            </el-form>
        </div>

        <div class="p-25 bg-white round-4">
            <div class="flex between mb-10">
                <div class="mb-10 mr-20">
                    <!-- 0->草稿；1->审核中 2->审核失败 3->待出库 4->退货协商中；5->退货出库完成； -->
                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus">
                        <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                        <el-radio-button :label="1">{{ $t("status.beAudit") }}</el-radio-button>
                        <el-radio-button :label="2">{{ $t("status.pass") }}</el-radio-button>
                        <el-radio-button :label="3">{{ $t("status.reject") }}</el-radio-button>
                    </el-radio-group>
                    <!-- 同步库存 -->
                    <el-button class="ml-20" @click="handleSynchronize">{{ $t("repairGoods.synchronizeInventory") }}</el-button>
                </div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" class="mb-20" @selection-change="handleSelectionChange" @row-click="handleRowClick">
                <BmTableColumn type="selection"></BmTableColumn>
                <BmTableColumn :label="$t('repairGoods.sellerInfo')" align="center">
                    <template #default="scope">
                        {{ scope.row.storeName }} <br />
                        {{ scope.row.storeCode }}
                    </template>
                </BmTableColumn>
                <BmTableColumn :label="$t('repairGoods.goodsInfo')" align="center" width="350">
                    <template #default="scope">
                        <div class="green">{{ scope.row.goodTitle }}</div>
                        TSIN: {{ scope.row.goodsTsin }}
                    </template>
                </BmTableColumn>
                <!-- 申请修改内容 -->
                <BmTableColumn prop="repairUpdateType" :label="$t('repairGoods.modifyContent')" align="center">
                    <template #default="scope">
                        <div v-for="(item, index) in scope.row.repairUpdateTypeName" :key="index">{{ item }}</div>
                    </template>
                </BmTableColumn>
                <!-- 申请时间 -->
                <BmTableColumn prop="createTime" :label="$t('applyTime')" align="center"></BmTableColumn>
                <!-- 数据来源 -->
                <BmTableColumn prop="createUserName" :label="$t('repairGoods.dataFrom')" width="145" align="center"> </BmTableColumn>
                <!-- 审核状态 -->
                <BmTableColumn prop="status" :label="$t('status.status')" align="center">
                    <template #default="scope">
                        {{ scope.row.statusName }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="reviewUserName" :label="$t('repairGoods.examiner')" align="center">
                    <template #default="scope">
                        {{ scope.row.reviewUserName }}<br />
                        {{ scope.row.reviewTime }}
                    </template>
                </BmTableColumn>
                <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                    <template #default="scope">
                        <!-- 详情  v-permission="'warehouse_returns_detail'" -->
                        <el-button @click.stop="handleDetail(scope.row, 'detail')" type="text">
                            {{ $t("table.detail") }}
                        </el-button>
                        <!-- 审核  v-permission="'warehouse_returns_detail'" -->
                        <el-button v-if="scope.row.status == 1" @click.stop="handleDetail(scope.row, 'audit')" type="text">
                            {{ $t("status.audit") }}
                        </el-button>

                        <!-- 驳回原因 -->
                        <el-popover v-if="scope.row.status == 3" placement="top-start" trigger="hover">
                            <template #reference>
                                <el-button type="text">
                                    {{ $t("rewardPunishmentManagement.rejectReason") }}
                                </el-button>
                            </template>
                            {{ scope.row.reviewOpinion }}
                        </el-popover>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
        </div>
    </template>

    <!-- 查看详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" @reloadData="initData" />

    <!-- 商品信息修复-->
    <AddEdit v-if="editVisible" v-model:visible="editVisible" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { repairFindOperatorPage, synchronizeInventory } from "@/api/goods";
import { dateShortcuts } from "@/utils/dateShortcuts";
import Detail from "./component/detail";
import AddEdit from "./component/addEdit";

export default {
    name: "repairGoodsListAudit",
    components: { Detail, AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let pageSize = 10,
            pageTotal = ref(0);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //状态
        const statusList = [
            {
                name: proxy.$t("status.beAudit"),
                value: 1
            },
            {
                name: proxy.$t("status.auditPass"),
                value: 2
            },
            {
                name: proxy.$t("status.auditRejected"),
                value: 3
            }
        ];

        //申请修改内容
        const repairUpdateTypeList = [
            {
                name: `sku${proxy.$t("repairGoods.code")}`,
                value: 1
            },
            {
                name: proxy.$t("repairGoods.attributeName"),
                value: 2
            },
            {
                name: proxy.$t("repairGoods.attributeValue"),
                value: 3
            }
        ];
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            _timeType: [], //申请时间
            _reviewTimeType: [],
            tsin: "",
            status: "",
            pageNum: 1,
            pageSize: pageSize
        });
        //搜索
        const handelSearch = () => {
            searchForm.createBeginTime = proxy.utils.formatStandardDate(searchForm._timeType && searchForm._timeType[0], 1) || "";
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm._timeType && searchForm._timeType[1], 1) || "";
            searchForm.reviewBeginTime = proxy.utils.formatStandardDate(searchForm._reviewTimeType && searchForm._reviewTimeType[0], 1) || "";
            searchForm.reviewEndTime = proxy.utils.formatStandardDate(searchForm._reviewTimeType && searchForm._reviewTimeType[1], 1) || "";
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.createBeginTime = searchForm.createEndTime = "";
            searchForm.reviewBeginTime = searchForm.reviewEndTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        const handleChangeStatus = (val) => {
            searchForm.status = val;
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }

            repairFindOperatorPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in statusList) {
                            if (statusList[i].value == item.status) {
                                item.statusName = statusList[i].name;
                                break;
                            }
                        }
                        let repairUpdateTypeName = [];
                        let repairUpdateType = item.repairUpdateType.split(",");
                        for (let i in repairUpdateTypeList) {
                            for (let j in repairUpdateType) {
                                if (repairUpdateTypeList[i].value == repairUpdateType[j]) {
                                    repairUpdateTypeName.push(repairUpdateTypeList[i].name);
                                }
                            }
                        }
                        item.repairUpdateTypeName = repairUpdateTypeName;

                        return item;
                    });
                })
                .catch((err) => {});
            pageFlag.value = false;
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        //编辑
        let editVisible = ref(false);
        const handleAddEdit = (type, row) => {
            editVisible.value = true;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row, updateType) => {
            detailRow.value = {
                type: row.repairUpdateType.split(",").map((item) => Number(item)),
                ...JSON.parse(row.dataSource),
                id: row.id,
                updateType: updateType
            };
            detailVisible.value = true;
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            pageFlag.value = true;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };
        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };
        //点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.findIndex((item) => item.id == row.id);
            if (index > -1) {
                tableSelectionRows.push(row);
            } else {
                tableSelectionRows.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
        };
        // 同步库存
        const handleSynchronize = () => {
            debugger;
            let flag = true;
            let goodIds = [];

            tableSelectionRows.forEach((item) => {
                if (item.status != "2") {
                    proxy.$message.warning(proxy.$t("repairGoods.synchronizeInventoryTip"));
                    flag = false;
                    throw new Error(); // 终止跳出循环
                }
                goodIds.push(item.goodsId);
            });
            if (flag) {
                synchronizeInventory(goodIds)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                    })
                    .catch(() => {});
            }
        };
        return {
            dict,
            initData,
            shortcuts,
            disabledDate,
            pageFlag,
            pageSize,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            handleChangeStatus,
            tableData,
            multipleTable,

            detailVisible,
            detailRow,
            handleDetail,
            editVisible,
            handleAddEdit,
            handleSizeChange,
            handleCurrentChange,
            tableSelectionRows,
            handleSelectionChange,
            handleRowClick,
            handleSynchronize
        };
    }
};
</script>
