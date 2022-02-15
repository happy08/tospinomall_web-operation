<template>
    <BmDialog v-model:visible="visible" :title="$t('sellerWithdrawalOverview.lookDetail')" :confirm="confirm" :cancel="cancel" width="80vw" :showFooter="false">
        <div class="top-search-form">
            <!-- <BmBreadcrumb /> -->
            <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 申请时间/审核时间 -->
                        <el-form-item prop="createTime">
                            <template #label>
                                <el-select v-model="searchForm.timeType">
                                    <el-option v-for="item in timeTypeSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
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
                        <!-- 店铺名称/编码-->
                        <el-form-item>
                            <template #label>
                                <el-select v-model="searchForm.keyWord">
                                    <el-option v-for="item in storeNameTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                            <el-select v-model="searchForm.keyValue" filterable remote reserve-keyword :placeholder="$t('pleaseEnter')" :remote-method="allStoreInfo" :loading="loading">
                                <el-option v-for="item in list" :key="item.userId" :label="searchForm.keyWord == 'storeName' ? item.storeName : item.storeCode" :value="item.userId"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- 提现状态 -->
                        <el-form-item :label="$t('sellerWithdrawalDetail.withdrawalStatus')" prop="status">
                            <el-select v-model="searchForm.status">
                                <el-option v-for="item in withdrawalStatusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                    <!-- 展开 -->
                    <!-- <BmCollapse el="#elCollapse" :isShow="false" /> -->
                </div>
            </el-form>
        </div>
        <!-- 统计显示区域 -->
        <div class="flex vcenter bg-white p-25">
            <!-- 提现总金额 -->
            <div class="border round-4 tc p-20 mr-30" style="width:340px;height:100px">
                <div>
                    {{ $t("sellerWithdrawalDetail.withdrawAmount") }}
                    ({{ $store.state.app.currencySymbol }})
                </div>
                <div class="fw fs-20">{{ dataCount.withdrawAmount }}</div>
            </div>
            <!-- 提现总次数 -->
            <div class="border round-4 tc p-20" style="width:340px;height:100px">
                <div>
                    {{ $t("sellerWithdrawalDetail.withdrawCount") }}
                </div>
                <div class="fw fs-20">{{ dataCount.withdrawCount }}</div>
            </div>
        </div>
        <div class="p-25 bg-white round-4">
            <div class="flex mb-10" style="justify-content: flex-end">
                <div class="flex">
                    <!-- 导出 -->
                    <el-button @click="handleExportExcel">
                        {{ $t("table.exportExcel") }}
                    </el-button>
                    <!-- 表格选项 -->
                    <!-- <BmTableOption
            table="sellerWithdrawalDetailTable"
            :column="tableColumn"
            class="ml-10"
          /> -->
                </div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
                <!-- 提现单号 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.withdrawNo')" prop="withdrawNo">
                    <template #default="scope">{{ scope.row.withdrawNo }}</template>
                </BmTableColumn>
                <!-- 卖家信息 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.memberInfo')" align="center" prop="memberInfo">
                    <template #default="scope">
                        <span class="block">{{ scope.row.storeName }}</span>
                        <span class="block">{{ scope.row.sellerId }}</span>
                    </template>
                </BmTableColumn>
                <!-- 申请提现金额 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.amount') + '(' + $store.state.app.currencySymbol + ')'" prop="amount">
                    <template #default="scope">
                        <span>{{ scope.row.amount }}</span>
                    </template>
                </BmTableColumn>
                <!-- 收款账户信息 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.receivingAccountInfo')" align="center" prop="receivingAccountInfo">
                    <template #default="scope">
                        <!-- 开户人 -->
                        <span class="block">{{ scope.row.holder }}</span>
                        <!-- 联系方式 -->
                        <span class="block">{{ scope.row.phone }}</span>
                    </template>
                </BmTableColumn>
                <!-- 状态 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.status')" prop="status">
                    <template #default="scope">
                        <span>{{ scope.row.statusName }}</span>
                    </template>
                </BmTableColumn>
                <!-- 申请时间 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.createTime')" prop="createTime">
                    <template #default="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </BmTableColumn>
                <!-- 审核人 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.auditUser')" prop="auditUser">
                    <template #default="scope">
                        <span>{{ scope.row.auditUser }}</span>
                    </template>
                </BmTableColumn>
                <!-- 审核时间 -->
                <BmTableColumn :label="$t('sellerWithdrawalDetailTable.auditTime')" prop="auditTime">
                    <template #default="scope">
                        <span>{{ scope.row.auditTime }}</span>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"></BmPagination>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { financeRefund, sellerWithdrawalDetails, getAllStoreInfo } from "@/api/finance";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        let sellerId = "";
        watch(
            () => props.row,
            (nVal) => {
                sellerId = props.row.sellerId;
                initData();
            }
        );
        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                emit("update:visible");
            });
        };
        const cancel = () => {
            emit("update:visible", false);
        };
        //分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: pageSize,
            pageNo: pageNo,
            createTime: [],
            keyWord: "storeName",
            status: "", // (不传：全部，1待审核2处理中3提现完成4已驳回5已取消)
            timeType: 1 // 时间类型(1：申请时间，2：审核时间),
            // sellerId: ''
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 提现状态select选择数据
        const withdrawalStatusSelect = [
            { value: "", label: proxy.$t("status.all") },
            { value: 1, label: proxy.$t("withdrawalManagement.pendingReview") },
            { value: 2, label: proxy.$t("withdrawalManagement.processing") },
            { value: 3, label: proxy.$t("withdrawalManagement.withdrawalCompleted") },
            { value: 4, label: proxy.$t("withdrawalManagement.rejected") },
            { value: 5, label: proxy.$t("withdrawalManagement.cancelled") }
        ];
        // 时间类型select选择数据
        const timeTypeSelectList = [
            { value: 1, label: proxy.$t("sellerWithdrawalOverview.settlementTime") },
            {
                value: 2,
                label: proxy.$t("sellerWithdrawalOverview.withdrawalCompletionTime")
            }
        ];
        // 店铺名称/编码select数据
        const storeNameTypeSelect = [
            {
                value: "storeName",
                label: proxy.$t("sellerReconciliationCenter.storeName")
            },
            {
                value: "storeCode",
                label: proxy.$t("sellerReconciliationCenter.storeCode")
            }
        ];
        // 远程搜索刷新效果控制变量
        let loading = ref(false);
        let options = ref([]);
        let list = ref([]);
        //搜索
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);

            searchForm.sellerId = searchForm.keyValue;
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.startTime = searchForm.endTime = searchForm.sellerId = "";
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
        const tableColumn = ["withdrawNo", "memberInfo", "amount", "receivingAccountInfo", "status", "createTime", "auditUser", "auditTime"];
        // 用来统计收支金额和笔数的数据对象
        let dataCount = ref({});
        //获取列表
        const getListPage = () => {
            searchForm.sellerId = sellerId;
            sellerWithdrawalDetails(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.accountWithdraws.total;
                    let { accountWithdraws } = res.data;
                    dataCount.value = res.data;
                    tableData.value = accountWithdraws.records.map((item) => {
                        // 提现状态(数字转文字 1待审核2处理中3提现完成4已驳回5已取消)
                        for (let i in dict.value.withdrawalStatusType) {
                            if (dict.value.withdrawalStatusType[i].value == item.status) {
                                item.statusName = dict.value.withdrawalStatusType[i].name;
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
        // initData()
        // 店铺远程搜索
        const allStoreInfo = (keyWord) => {
            //   debugger
            if (!keyWord) {
                return;
            }
            getAllStoreInfo({ [searchForm.keyWord]: keyWord })
                .then((res) => {
                    list.value = res.data;
                })
                .catch((err) => {});
        };

        // 查看
        let editVisible = ref(false);
        let editRow = ref({});
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNo = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            initData();
        };
        // 查看
        const handleAddEdit = (id) => {
            editRow.value = { sellerId: id };
            editVisible.value = true;
        };
        return {
            form,
            formRef,
            confirm,
            cancel,
            dict,
            initData,
            pageNo,
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
            timeTypeSelectList,
            shortcuts,
            withdrawalStatusSelect,
            disabledDate,
            dataCount,
            storeNameTypeSelect,
            loading,
            options,
            list,
            allStoreInfo,
            handleAddEdit
        };
    }
};
</script>
