<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
                    <el-form-item :label="$t('sellerReconciliationCenterTable.createTime')" prop="createTime">
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
                    <!-- 来源 -->
                    <el-form-item :label="$t('sellerReconciliationCenterTable.expensesType')" prop="expensesType">
                        <el-select v-model="searchForm.expensesType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in sourceSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 类型 -->
                    <el-form-item :label="$t('sellerReconciliationCenterTable.collectPaymentType')" prop="collectPaymentType">
                        <el-select v-model="searchForm.collectPaymentType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in incomeExpendituretTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
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
                        <el-select v-model="searchForm.keyValue" filterable remote reserve-keyword :placeholder="$t('pleaseEnter')" :remote-method="allStoreInfo" :loading="loading" clearable="false">
                            <el-option v-for="item in list" :key="item.userId" :label="item.papersName" :value="item.userId"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 流水号-->
                    <el-form-item :label="$t('sellerReconciliationCenterTable.serialNumber')" prop="serialNumber">
                        <el-input v-model="searchForm.serialNumber" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 关联单号-->
                    <el-form-item :label="$t('sellerReconciliationCenterTable.associatedNo')" prop="associatedNo">
                        <el-input v-model="searchForm.associatedNo" :placeholder="$t('pleaseEnter')"></el-input>
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
                <BmCollapse el="#elCollapse" :isShow="false" />
            </div>
        </el-form>
    </div>
    <!-- 统计显示区域 -->
    <div class="flex between vcenter bg-white p-25">
        <!-- 订单金额总计 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerReconciliationCenter.orderAmountSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.orderAmountSum }}</div>
        </div>
        <!-- 售后退款总计 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerReconciliationCenter.returnOrderAmountSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.returnOrderAmountSum }}</div>
        </div>
        <!-- 其它费用总计 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerReconciliationCenter.otherAmountSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.otherAmountSum }}</div>
        </div>
        <!-- 已提现总金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("sellerReconciliationCenter.withdrawAmountSum") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20">{{ dataCount.withdrawAmountSum }}</div>
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
                <BmTableOption table="sellerReconciliationCenterTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 卖家信息 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.memberInfo')" align="center" prop="memberInfo">
                <template #default="scope">
                    <span class="block">{{ scope.row.storeName }}</span>
                    <span class="block">{{ scope.row.sellerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 来源 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.expensesType')" prop="expensesType">
                <template #default="scope">{{ scope.row.expensesTypeName }}</template>
            </BmTableColumn>
            <!-- 类型 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.collectPaymentType')" prop="collectPaymentType">
                <template #default="scope">{{ scope.row.collectPaymentTypeName }}</template>
            </BmTableColumn>
            <!-- 流水号 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.serialNumber')" prop="serialNumber">
                <template #default="scope">
                    <span>{{ scope.row.serialNumber }}</span>
                </template>
            </BmTableColumn>
            <!-- 关联单号 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.associatedNo')" prop="associatedNo">
                <template #default="scope">{{ scope.row.associatedNo }}</template>
            </BmTableColumn>
            <!-- 交易金额 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.transactionAmount') + '(' + $store.state.app.currencySymbol + ')'" prop="transactionAmount">
                <template #default="scope">
                    <span>{{ scope.row.transactionAmount }}</span>
                </template>
            </BmTableColumn>
            <!-- 交易后余额 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.postTransactionBalance') + '(' + $store.state.app.currencySymbol + ')'" prop="postTransactionBalance">
                <template #default="scope">{{ scope.row.postTransactionBalance }}</template>
            </BmTableColumn>
            <!-- 创建时间 -->
            <BmTableColumn :label="$t('sellerReconciliationCenterTable.createTime')" prop="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"></BmPagination>
        <!-- 退款弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { getReconciliationCenter, getAllStoreInfo } from "@/api/finance";
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
            keyWord: "storeName"
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
        // 收支类型select选择数据
        const incomeExpendituretTypeSelect = [
            { value: "", label: proxy.$t("status.all") },
            { value: 1, label: proxy.$t("billingDetails.income") },
            { value: 2, label: proxy.$t("billingDetails.expenditure") }
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
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.createStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);

            searchForm.sellerId = searchForm.keyValue;
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.createStartTime = searchForm.createEndTime = searchForm.sellerId = "";
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
        const tableColumn = ["memberInfo", "expensesType", "collectPaymentType", "serialNumber", "associatedNo", "transactionAmount", "postTransactionBalance", "createTime"];
        // 用来统计收支金额和笔数的数据对象
        let dataCount = ref({});
        //获取列表
        const getListPage = () => {
            searchForm.pageNo = pageNo.value;
            getReconciliationCenter(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.bills.total;
                    let { bills } = res.data;
                    dataCount.value = res.data;
                    tableData.value = bills.records.map((item) => {
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
            incomeExpendituretTypeSelect,
            shortcuts,
            sourceSelectList,
            disabledDate,
            dataCount,
            storeNameTypeSelect,
            loading,
            options,
            list,
            allStoreInfo
        };
    }
};
</script>
