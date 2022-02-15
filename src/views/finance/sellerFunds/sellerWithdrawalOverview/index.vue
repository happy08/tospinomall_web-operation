<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 账单结算时间/提现完成时间 -->
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
                    <el-form-item prop="keyValue">
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
    <div class="flex between vcenter bg-white p-25">
        <!-- 累计总收益 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerWithdrawalOverview.collectSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.collectSum }}</div>
        </div>
        <!-- 累计提现金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerWithdrawalOverview.withdrawSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.withdrawSum }}</div>
        </div>
        <!-- 可提现总额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerWithdrawalOverview.withdrawableSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.withdrawableSum }}</div>
        </div>
        <!-- 累计提现次数 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerWithdrawalOverview.withdrawCount") }}
            </div>
            <div class="fw fs-20">{{ dataCount.withdrawCount }}</div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex mb-10" style="justify-content: flex-end">
            <div class="flex">
                <!-- 导出 -->
                <!-- <el-button @click="handleExportExcel">
          {{ $t('table.exportExcel') }}
        </el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="sellerWithdrawalOverviewTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :column="tableColumn">
            <!-- 卖家信息 -->
            <BmTableColumn :label="$t('sellerWithdrawalOverviewTable.memberInfo')" align="center" prop="memberInfo">
                <template #default="scope">
                    <span class="block">{{ scope.row.storeName }}</span>
                    <span class="block">{{ scope.row.sellerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 累计总收益 -->
            <BmTableColumn :label="$t('sellerWithdrawalOverviewTable.collectSum') + '(' + $store.state.app.currencySymbol + ')'" prop="collectSum">
                <template #default="scope">
                    <span>{{ scope.row.collectSum }}</span>
                </template>
            </BmTableColumn>
            <!-- 累计提现金额 -->
            <BmTableColumn :label="$t('sellerWithdrawalOverviewTable.withdrawSum') + '(' + $store.state.app.currencySymbol + ')'" prop="withdrawSum">
                <template #default="scope">
                    <span>{{ scope.row.withdrawSum }}</span>
                </template>
            </BmTableColumn>
            <!-- 可提现余额 -->
            <BmTableColumn :label="$t('sellerWithdrawalOverviewTable.withdrawableAmount') + '(' + $store.state.app.currencySymbol + ')'" prop="withdrawableAmount">
                <template #default="scope">{{ scope.row.withdrawableAmount }}</template>
            </BmTableColumn>
            <!-- 提现总次数(成功) -->
            <BmTableColumn :label="$t('sellerWithdrawalOverviewTable.withdrawSuccessCount')" prop="withdrawSuccessCount">
                <template #default="scope">{{ scope.row.withdrawSuccessCount }}</template>
            </BmTableColumn>
            <!-- 待审核数据 -->
            <BmTableColumn :label="$t('sellerWithdrawalOverviewTable.waitAuditCount')" prop="waitAuditCount">
                <template #default="scope">{{ scope.row.waitAuditCount }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')">
                <template #default="scope">
                    <!-- 查看明细 -->
                    <el-button v-permission="'sellerFunds_sellerWithdrawalOverview_look'" type="text" @click="handleAddEdit(scope.row.sellerId)">{{
                        $t("sellerWithdrawalOverview.lookDetail")
                    }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"></BmPagination>
        <!-- 查看弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { getReconciliationCenter, getAllStoreInfo, sellerWithdrawalDetail } from "@/api/finance";
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
            timeType: 1 // 时间类型(1：账单结算时间，2：提现完成时间)
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 来源select选择数据
        const sourceSelectList = [
            { value: "", label: proxy.$t("billingDetails.sale") },
            { value: 1, label: proxy.$t("billingDetails.toBeSettled") },
            { value: 2, label: proxy.$t("billingDetails.refund") },
            { value: 3, label: proxy.$t("billingDetails.withdraw") },
            { value: 4, label: proxy.$t("billingDetails.award") },
            { value: 5, label: proxy.$t("billingDetails.punishment") },
            { value: 6, label: proxy.$t("billingDetails.other") }
        ];
        // 时间类型select选择数据
        const timeTypeSelectList = [
            {
                value: 1,
                label: proxy.$t("sellerWithdrawalOverview.settlementTime")
            },
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
        const tableColumn = ["memberInfo", "collectSum", "withdrawSum", "withdrawableAmount", "withdrawSuccessCount", "waitAuditCount"];
        // 用来统计收支金额和笔数的数据对象
        let dataCount = ref({});
        //获取列表
        const getListPage = () => {
            sellerWithdrawalDetail(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.list.total;
                    let { list } = res.data;
                    dataCount.value = res.data;
                    tableData.value = list.records.map((item) => {
                        // 来源(数字转文字 1销售2退款3提现4奖励5处罚6其他)
                        for (let i in dict.value.withdrawalStatus) {
                            if (dict.value.withdrawalStatus[i].value == item.expensesType) {
                                item.expensesTypeName = dict.value.withdrawalStatus[i].name;
                                break;
                            }
                        }
                        // 收支类型(数字转文字 1 收入 2 支出)
                        for (let i in dict.value.incomeExpenditureType) {
                            if (dict.value.incomeExpenditureType[i].value == item.collectPaymentType) {
                                item.collectPaymentTypeName = dict.value.incomeExpenditureType[i].name;
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
            sourceSelectList,
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
