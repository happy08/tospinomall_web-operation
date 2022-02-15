<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 入账时间 -->
                    <el-form-item :label="$t('billingDetailsTable.receivingDate')" prop="createTime">
                        <el-date-picker
                            v-model="searchForm.receivingDate"
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
                    <!-- 结算单号-->
                    <el-form-item :label="$t('billingDetailsTable.statementNo')" prop="statementNo">
                        <el-input v-model="searchForm.statementNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 关联单号-->
                    <el-form-item :label="$t('billingDetailsTable.associatedNo')" prop="associatedNo">
                        <el-input v-model="searchForm.associatedNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('status.status')" prop="billingStatus">
                        <el-select v-model="searchForm.billingStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in statusSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 收支类型 -->
                    <el-form-item :label="$t('billingDetailsTable.expensesType')" prop="expensesType">
                        <el-select v-model="searchForm.expensesType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in incomeExpendituretTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 资金流向 -->
                    <el-form-item :label="$t('billingDetails.collectPaymentType')" prop="collectPaymentType">
                        <el-select v-model="searchForm.collectPaymentType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in capitalFlowsSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 卖家信息-->
                    <el-form-item :label="$t('billingDetails.sellerInfo')" prop="sellerInfo">
                        <el-input v-model="searchForm.sellerId" :placeholder="$t('pleaseEnter')"></el-input>
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
        <!-- 收入金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>({{ $t("billingDetails.Merchant") }})({{ $t("billingDetails.incomeAmount") }})({{ $store.state.app.currencySymbol }})</div>
            <div class="fw fs-20">{{ dataCount.collectAmount }}</div>
        </div>
        <!-- 收入笔数 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>({{ $t("billingDetails.Merchant") }})({{ $t("billingDetails.numberOfIncome") }})({{ $t("billingDetails.frequency") }})</div>
            <div class="fw fs-20">{{ dataCount.collectCount }}</div>
        </div>
        <!-- 支出金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>({{ $t("billingDetails.Merchant") }})({{ $t("billingDetails.expenditureAmount") }})({{ $store.state.app.currencySymbol }})</div>
            <div class="fw fs-20">{{ dataCount.paymentAmount }}</div>
        </div>
        <!-- 支出笔数 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>({{ $t("billingDetails.Merchant") }})({{ $t("billingDetails.numberOfExpenditure") }})({{ $t("billingDetails.frequency") }})</div>
            <div class="fw fs-20">{{ dataCount.paymentCount }}</div>
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
                <BmTableOption table="billingDetailsTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 收支类型) -->
            <BmTableColumn :label="$t('billingDetailsTable.expensesType')" width="70" prop="expensesType">
                <template #default="scope">{{ scope.row.expensesTypeName }}</template>
            </BmTableColumn>
            <!-- 入账日期 -->
            <BmTableColumn :label="$t('billingDetailsTable.receivingDate')" prop="receivingDate">
                <template #default="scope">{{ scope.row.receivingDate }}</template>
            </BmTableColumn>
            <!-- 账单生成日期 -->
            <BmTableColumn :label="$t('billingDetailsTable.createTime')" prop="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 结算单号 -->
            <BmTableColumn :label="$t('billingDetailsTable.statementNo')" prop="statementNo">
                <template #default="scope">
                    <span>{{ scope.row.statementNo }}</span>
                </template>
            </BmTableColumn>
            <!-- 关联单号 -->
            <BmTableColumn :label="$t('billingDetailsTable.associatedNo')" prop="associatedNo">
                <template #default="scope">{{ scope.row.associatedNo }}</template>
            </BmTableColumn>
            <!-- 卖家信息 -->
            <BmTableColumn :label="$t('billingDetailsTable.sellerInfo')" prop="sellerInfo" align="center">
                <template #default="scope">
                    <span class="block">{{ scope.row.storeName }}</span>
                    <span>{{ scope.row.sellerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 关联单据状态 -->
            <BmTableColumn :label="$t('billingDetailsTable.associatedStatus')" width="100" align="center" prop="associatedStatus">
                <template #default="scope">{{ scope.row.associatedStatusName }}</template>
            </BmTableColumn>
            <!-- 商品金额 -->
            <BmTableColumn :label="$t('billingDetailsTable.productAmount') + '(' + $store.state.app.currencySymbol + ')'" width="100" prop="productAmount">
                <template #default="scope">{{ scope.row.productAmount }}</template>
            </BmTableColumn>
            <!-- 优惠金额 -->
            <BmTableColumn :label="$t('billingDetailsTable.discountAmount') + '(' + $store.state.app.currencySymbol + ')'" width="100" prop="discountAmount">
                <template #default="scope">{{ scope.row.discountAmount }}</template>
            </BmTableColumn>
            <!-- 增值税 -->
            <BmTableColumn :label="$t('billingDetailsTable.vat') + '(' + $store.state.app.currencySymbol + ')'" prop="vat" width="100">
                <template #default="scope">{{ scope.row.vat }}</template>
            </BmTableColumn>
            <!-- 佣金 -->
            <BmTableColumn :label="$t('billingDetailsTable.brokerage') + '(' + $store.state.app.currencySymbol + ')'" width="70" align="center" prop="brokerage">
                <template #default="scope">{{ scope.row.brokerage }}</template>
            </BmTableColumn>
            <!-- 运费 -->
            <BmTableColumn :label="$t('billingDetailsTable.freight') + '(' + $store.state.app.currencySymbol + ')'" width="70" prop="freight">
                <template #default="scope">{{ scope.row.freight }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('billingDetailsTable.billingStatus')" width="80" prop="billingStatus">
                <template #default="scope">{{ scope.row.billingStatusName }}</template>
            </BmTableColumn>
            <!-- 收支金额 -->
            <BmTableColumn :label="$t('billingDetailsTable.expensesAmount') + '(' + $store.state.app.currencySymbol + ')'" width="100" prop="expensesAmount">
                <template #default="scope">{{ scope.row.expensesAmount }}</template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('billingDetailsTable.remark')" prop="remark" width="100">
                <template #default="scope">{{ scope.row.remark }}</template>
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
import { getBillingDetails } from "@/api/finance";
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
            billingStatus: "", // 结算状态(0待结算1已结算2无需结算)
            expensesType: "", // 收支类型(1销售2退款3提现4奖励5处罚6其他)
            collectPaymentType: "" // 资金流向(1 收入 2 支出)
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 状态select选择数据
        const statusSelectList = [
            { value: "", label: proxy.$t("status.all") },
            { value: 0, label: proxy.$t("billingDetails.toBeSettled") },
            { value: 1, label: proxy.$t("billingDetails.settled") },
            { value: 2, label: proxy.$t("billingDetails.noNeedToSettle") }
        ];
        // 收支类型select选择数据
        const incomeExpendituretTypeSelect = [
            { value: "", label: proxy.$t("status.all") },
            { value: 1, label: proxy.$t("billingDetails.sale") },
            { value: 2, label: proxy.$t("billingDetails.refund") },
            { value: 3, label: proxy.$t("billingDetails.withdraw") },
            { value: 4, label: proxy.$t("billingDetails.award") },
            { value: 5, label: proxy.$t("billingDetails.punishment") },
            { value: 6, label: proxy.$t("billingDetails.other") }
        ];
        // 资金流向select数据
        const capitalFlowsSelectList = [
            { value: "", label: proxy.$t("status.all") },
            { value: 1, label: proxy.$t("billingDetails.income") },
            { value: 2, label: proxy.$t("billingDetails.expenditure") }
        ];
        //搜索
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.receivingEndDate = proxy.utils.formatStandardDate(searchForm.receivingDate && searchForm.receivingDate[1], true);
            searchForm.receivingStartDate = proxy.utils.formatStandardDate(searchForm.receivingDate && searchForm.receivingDate[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.receivingDate = searchForm.sellerId = searchForm.receivingStartDate = searchForm.receivingEndDate = "";
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
        const tableColumn = [
            "expensesType",
            "receivingDate",
            "createTime",
            "statementNo",
            "associatedNo",
            "sellerInfo",
            "associatedStatus",
            "productAmount",
            "discountAmount",
            "vat",
            "brokerage",
            "freight",
            "billingStatus",
            "expensesAmount",
            "remark"
        ];
        // 用来统计收支金额和笔数的数据对象
        let dataCount = ref({});
        //获取列表
        const getListPage = () => {
            searchForm.pageNo = pageNo.value;
            getBillingDetails(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.billingDetails.total;
                    let { billingDetails } = res.data;
                    dataCount.value = res.data;
                    tableData.value = billingDetails.records.map((item) => {
                        // 收支类型(数字转文字 0->退款 1->退款退货 2->换货)
                        for (let i in dict.value.withdrawalStatus) {
                            if (dict.value.withdrawalStatus[i].value == item.expensesType) {
                                item.expensesTypeName = dict.value.withdrawalStatus[i].name;
                                break;
                            }
                        }
                        // 结算状态(数字转文字 0待结算1已结算2无需结算)
                        for (let i in dict.value.settlementStatus) {
                            if (dict.value.settlementStatus[i].value == item.billingStatus) {
                                item.billingStatusName = dict.value.settlementStatus[i].name;
                                break;
                            }
                        }
                        //结算的订单状态和售后状态
                        if (item.associatedType == 1) {
                            // 订单状态(0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成
                            // 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8订单关闭（货到付款拒签关闭）)
                            for (let i in dict.value.settlementOrderStatus) {
                                if (dict.value.settlementOrderStatus[i].value == item.associatedStatus) {
                                    item.associatedStatusName = dict.value.settlementOrderStatus[i].name;
                                    break;
                                }
                            }
                        } else if (item.associatedType == 2) {
                            // 售后状态(数字转文字 （1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款
                            // 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品)
                            for (let i in dict.value.settlementAfterSalesStatus) {
                                if (dict.value.settlementAfterSalesStatus[i].value == item.associatedStatus) {
                                    item.associatedStatusName = dict.value.settlementAfterSalesStatus[i].name;
                                    break;
                                }
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
            statusSelectList,
            disabledDate,
            dataCount,
            capitalFlowsSelectList
        };
    }
};
</script>
