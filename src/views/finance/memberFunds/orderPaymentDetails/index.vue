<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
                    <el-form-item :label="$t('copingManagement.createTime')" prop="createTime">
                        <el-date-picker
                            v-model="searchForm.createTime"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                            style="width: 100%"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 会员信息-->
                    <el-form-item :label="$t('copingManagement.memberInfo')" prop="id">
                        <el-input v-model="searchForm.id" :placeholder="$t('onlinePayments.id')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 单据编号-->
                    <el-form-item :label="$t('copingManagement.documentNumber')" prop="orderNo">
                        <el-input v-model="searchForm.orderNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 关联单号-->
                    <el-form-item :label="$t('copingManagement.contactNumber')" prop="relationOrderNo">
                        <el-input v-model="searchForm.relationOrderNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 单据类型 -->
                    <el-form-item :label="$t('copingManagement.documentType')" prop="type">
                        <el-select v-model="searchForm.type" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in fromSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in statusSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handleSearch" type="primary">
                    {{ $t("search") }}
                </el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex mb-10" style="justify-content: flex-end">
            <div class="flex">
                <!-- 导出 -->
                <el-button @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="copingManagementTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 单据类型) -->
            <BmTableColumn :label="$t('copingManagementTable.type')" prop="type">
                <template #default="scope">{{ scope.row.typeName }}</template>
            </BmTableColumn>
            <!-- 单据编号 -->
            <BmTableColumn :label="$t('copingManagementTable.orderNo')" prop="orderNo">
                <template #default="scope">{{ scope.row.orderNo }}</template>
            </BmTableColumn>
            <!-- 关联单号 -->
            <BmTableColumn :label="$t('copingManagementTable.relationOrderNo')" prop="relationOrderNo">
                <template #default="scope">{{ scope.row.relationOrderNo }}</template>
            </BmTableColumn>
            <!-- 会员信息(姓名+id) -->
            <BmTableColumn :label="$t('copingManagementTable.buyerInfo')" align="center" prop="buyerInfo">
                <template #default="scope">
                    <span>{{ scope.row.buyerName }}</span>
                    <span>{{ scope.row.buyerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 应退金额 -->
            <BmTableColumn :label="$t('copingManagementTable.refundableAmount')" prop="refundableAmount">
                <template #default="scope">{{ scope.row.refundableAmount }}</template>
            </BmTableColumn>
            <!-- 实退金额 -->
            <BmTableColumn :label="$t('copingManagementTable.actualRefundAmount')" prop="actualRefundAmount">
                <template #default="scope">{{ scope.row.actualRefundAmount }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('copingManagementTable.status')" width="100" align="center" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 退款日期 -->
            <BmTableColumn :label="$t('copingManagementTable.refundTime')" prop="refundTime">
                <template #default="scope">{{ scope.row.refundTime }}</template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('copingManagementTable.remarks')" prop="remarks">
                <template #default="scope">{{ scope.row.remarks }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                <template #default="scope">
                    <!-- 退款(状态为待付款0) -->
                    <el-button v-if="scope.row.status == 0" @click.stop="handleRefund(scope.row)" type="text">{{ $t("copingManagement.returnOnly") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
        <!-- 退款弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { documentTypeList } from "@/api/finance";
import { getSellerList, getSellerInfoByID, enableOrbanSellerUsers } from "@/api/store";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    name: "GoodsAttribute",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: 10,
            pageNum: pageNum,
            createTime: [],
            id: null, // 会员id
            orderNo: null, // 单据编号
            relationOrderNo: null, // 关联单号
            type: null, // 单据类型(0仅退款 1退货退款 2换货)
            status: null // 状态(0未支付 1支付成功 2支付失败)
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 单据类型select选择数据
        const fromSelectList = [
            { value: "", label: proxy.$t("status.all") },
            { value: "0", label: proxy.$t("copingManagement.returnOnly") },
            { value: "1", label: proxy.$t("copingManagement.returnRefund") },
            { value: "2", label: proxy.$t("copingManagement.exchange") }
        ];
        // 状态select选择数据
        const statusSelectList = [
            { value: "", label: proxy.$t("status.all") },
            { value: "0", label: proxy.$t("copingManagement.pendingPayment") },
            { value: "1", label: proxy.$t("copingManagement.Paid") },
            { value: "2", label: proxy.$t("copingManagement.paymentFailed") }
        ];
        //搜索
        const handleSearch = () => {
            searchForm.pageNum = pageNum.value;
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.registerEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.registerStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.registerEndTime = searchForm.registerStartTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        // 快速筛选
        const handleSelect = (num) => {
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["type", "orderNo", "relationOrderNo", "buyerInfo", "refundableAmount", "actualRefundAmount", "status", "refundTime", "remarks"];
        //获取列表
        const getListPage = () => {
            searchForm.pageNum = pageNum.value;
            documentTypeList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 退单类型(数字转文字 0->退款 1->退款退货 2->换货)
                        for (let i in dict.value.chargebackType) {
                            if (dict.value.chargebackType[i].value == item.type) {
                                item.typeName = dict.value.chargebackType[i].name;
                                break;
                            }
                        }
                        // 退单状态(数字转文字 0未支付1支付成功2支付失败)
                        for (let i in dict.value.chargebackStatus) {
                            if (dict.value.chargebackStatus[i].value == item.status) {
                                item.statusName = dict.value.chargebackStatus[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                })
                .catch((err) => {});
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 启用/冻结
        const handleEnableFrozen = (sellerId, statusNum) => {
            proxy
                .$confirm(statusNum == 2 ? proxy.$t("sellerList.enableTips") : proxy.$t("sellerList.frozenTips"), proxy.$t("sellerList.tips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    enableOrbanSellerUsers({ sellerId, status: statusNum })
                        .then((res) => {
                            initData();
                        })
                        .catch(() => {});
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        };
        // 点击子账号按钮触发的监听事件
        let lookVisible = ref(false);
        // 点击子账号时传过去的ID
        let sellerId = ref("");
        const handlesubAccount = (id) => {
            sellerId.value = id;
            lookVisible.value = true;
        };

        // 查看
        let editVisible = ref(false);
        let editRow = ref({});
        // 退款
        const handleRefund = (row) => {
            editRow.value = {
                orderNo: row.orderNo,
                refundableAmount: row.refundableAmount,
                id: row.id
            };
            editVisible.value = true;
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

        return {
            dict,
            initData,
            pageNum,
            pageSize,
            pageTotal,
            searchFormRef,
            handleSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,

            editVisible,
            editRow,
            handleSizeChange,
            handleCurrentChange,
            handleSelect,
            fromSelectList,
            shortcuts,
            statusSelectList,
            disabledDate,
            lookVisible,
            sellerId,
            handleRefund
        };
    }
};
</script>
