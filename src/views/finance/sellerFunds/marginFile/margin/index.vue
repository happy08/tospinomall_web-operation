<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form mt-10">
            <el-row :gutter="24">
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
                <el-col :md="12" :lg="6">
                    <!-- 单号信息-->
                    <el-form-item :label="$t('margin.orderInfo')" prop="transactionNo">
                        <el-input v-model="searchForm.transactionNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item prop="createTime">
                        <!-- 日期类型 -->
                        <template #label>
                            <el-select v-model="searchForm.timeType">
                                <el-option v-for="item in dateTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                <template #append>
                                    <el-input></el-input>
                                </template>
                            </el-select>
                        </template>
                        <!-- 申请日期 -->
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
        <div class="flex mb-10 between">
            <div>
                <el-radio-group v-model="searchForm.businessType" @change="handleChangeCardType">
                    <!-- 全部 -->
                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                    <!-- 提现 -->
                    <el-radio-button :label="2">{{ $t("margin.withdraw") }}</el-radio-button>
                    <!-- 充值 -->
                    <el-radio-button :label="1">{{ $t("margin.recharge") }}</el-radio-button>
                    <!-- 扣款 -->
                    <el-radio-button :label="3">{{ $t("margin.deduction") }}</el-radio-button>
                    <!-- 汇入 -->
                    <el-radio-button :label="4">{{ $t("margin.sendIncome") }}</el-radio-button>
                </el-radio-group>
                <!-- 快速筛选 -->
                <span class="mlr-30">{{ $t("status.rapidCull") }}:</span>
                <el-radio-group v-model="fastChooseButtonValue">
                    <!-- 待审核数量 -->
                    <el-radio-button @click="handleSelect(2)" :label="1">{{ $t("status.beAudit") }}({{ dataCount.waitAuditCount }})</el-radio-button>
                    <!-- 待转账数量 -->
                    <el-radio-button @click="handleSelect(3)" :label="2">{{ $t("margin.waitGoriCount") }}({{ dataCount.waitGoriCount }})</el-radio-button>
                    <!-- 充值待确认数量 -->
                    <el-radio-button @click="handleSelect(6)" :label="3">{{ $t("margin.rechargeWaitAuditCount") }}({{ dataCount.rechargeWaitAuditCount }})</el-radio-button>
                </el-radio-group>
                <!-- 充值/扣款 -->
                <el-button v-permission="'marginFile_margin_rechargeDeduction'" @click="handleAddEdit(0)" :label="4" type="primary" plain class="ml-30">
                    {{ $t("margin.rechargeDeduction") }}
                </el-button>
            </div>
            <div class="flex">
                <!-- 导出 -->
                <el-button v-permission="'marginFile_margin_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="marginTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 交易单号 -->
            <BmTableColumn :label="$t('marginTable.transactionNo')" prop="transactionNo">
                <template #default="scope">{{ scope.row.transactionNo }}</template>
            </BmTableColumn>
            <!-- 资金账户 -->
            <BmTableColumn :label="$t('marginTable.capitalAccount')" prop="capitalAccount">
                <template #default="scope">
                    <span>{{ scope.row.capitalAccountName }}</span>
                </template>
            </BmTableColumn>
            <!-- 卖家信息 -->
            <BmTableColumn :label="$t('marginTable.memberInfo')" align="center" prop="memberInfo">
                <template #default="scope"
                    ><span class="block">{{ scope.row.storeName }}</span>
                    <span class="block">{{ scope.row.storeCode }}</span>
                </template>
            </BmTableColumn>
            <!-- 卖家类型 -->
            <BmTableColumn :label="$t('marginTable.sellerType')" prop="sellerType">
                <template #default="scope">{{ scope.row.sellerTypeName }}</template>
            </BmTableColumn>
            <!-- 业务类型 -->
            <BmTableColumn :label="$t('marginTable.businessType')" prop="businessType">
                <template #default="scope">{{ scope.row.businessTypeName }}</template>
            </BmTableColumn>
            <!-- 金额 -->
            <BmTableColumn :label="$t('marginTable.amount') + '(' + $store.state.app.currencySymbol + ')'" prop="amount">
                <template #default="scope">
                    <span>{{ scope.row.amount }}</span>
                </template>
            </BmTableColumn>
            <!-- 支付渠道 -->
            <BmTableColumn :label="$t('marginTable.payChannel')" prop="payChannel">
                <template #default="scope">{{ scope.row.payChannelName }}</template>
            </BmTableColumn>
            <!-- 交易状态 -->
            <BmTableColumn :label="$t('marginTable.transactionStatus')" prop="transactionStatus">
                <template #default="scope">
                    {{ scope.row.businessTypeName + scope.row.transactionStatusName }}
                </template>
            </BmTableColumn>
            <!-- 创建时间 -->
            <BmTableColumn :label="$t('marginTable.createTime')" prop="createTime">
                <template #default="scope">
                    {{ scope.row.createTime }}
                </template>
            </BmTableColumn>
            <!-- 完成时间 -->
            <BmTableColumn :label="$t('marginTable.completionTime')" prop="completionTime">
                <template #default="scope">
                    {{ scope.row.completionTime }}
                </template>
            </BmTableColumn>
            <!-- 交易说明 -->
            <BmTableColumn :label="$t('marginTable.transactionExplain')" prop="transactionExplain">
                <template #default="scope">
                    {{ scope.row.transactionExplain }}
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('marginTable.remark')" prop="remark">
                <template #default="scope">
                    {{ scope.row.remark }}
                </template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" align="center">
                <template #default="scope">
                    <!--充值处理：业务类型为充值，且交易状态为充值待确认-->
                    <el-button
                        v-permission="'marginFile_margin_rechargeProcessing'"
                        v-if="scope.row.businessType == 1 && scope.row.transactionStatus == 6"
                        @click.stop="handleAddEdit(1, scope.row)"
                        type="text"
                        >{{ $t("margin.rechargeProcessing") }}</el-button
                    >
                    <!--扣款审核：业务类型为扣款，且交易状态为扣款待审核-->
                    <el-button
                        v-permission="'marginFile_margin_deductionReview'"
                        v-if="scope.row.businessType == 3 && scope.row.transactionStatus == 2"
                        @click.stop="handleAddEdit(2, scope.row)"
                        type="text"
                        >{{ $t("margin.deductionReview") }}</el-button
                    >
                    <!--扣款处理：业务类型为扣款，且交易状态为扣款待处理-->
                    <el-button
                        v-permission="'marginFile_margin_deductionProcessing'"
                        v-if="scope.row.businessType == 3 && scope.row.transactionStatus == 3"
                        @click.stop="handleAddEdit(4, scope.row)"
                        type="text"
                        >{{ $t("margin.deductionProcessing") }}</el-button
                    >
                    <!--提现审核：业务类型为提现，且交易状态为提现待审核-->
                    <el-button
                        v-permission="'marginFile_margin_withdrawReview'"
                        v-if="scope.row.businessType == 2 && scope.row.transactionStatus == 2"
                        @click.stop="handleAddEdit(2, scope.row.id)"
                        type="text"
                        >{{ $t("margin.withdrawalReview") }}</el-button
                    >
                    <!--查看驳回详情：业务类型为提现，且交易状态为提现驳回-->
                    <el-button v-permission="'marginFile_margin_look'" v-if="scope.row.businessType == 2 && scope.row.transactionStatus == 5" @click.stop="handleAddEdit(5, scope.row)" type="text">{{
                        $t("margin.lookRejectDetail")
                    }}</el-button>
                    <!--提现处理：业务类型为提现，且交易状态为提现待处理--->
                    <el-button
                        v-permission="'marginFile_margin_withdrawProcessing'"
                        v-if="scope.row.businessType == 2 && scope.row.transactionStatus == 3"
                        @click.stop="handleAddEdit(3, scope.row)"
                        type="text"
                        >{{ $t("margin.withdrawalProcessing") }}</el-button
                    >
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"></BmPagination>
        <!-- 订单操作弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { manifestManagementList, marginList, getAllStoreInfo } from "@/api/finance";
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
        let pageSize = 10,
            pageTotal = ref(0);
        // 待审核与带转账
        const handleChangeCardType = () => {
            searchForm.transactionStatus = "";
            initData();
        };
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: pageSize,
            pageNum: 1,
            sellerId: null, // 卖家ID
            timeType: 1, // 时间类型（1：申请日期，2：审核日期）
            createTime: [],
            businessType: "", // 业务类型(1充值2提现3扣款4汇入)
            transactionStatus: "", // 交易状态(2待审核3待转账,6充值待确认)
            keyWord: "storeName"
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 日期类型select选择数据
        const dateTypeSelect = [
            { value: 1, label: proxy.$t("withdrawalManagement.applyDate") },
            { value: 2, label: proxy.$t("withdrawalManagement.auditTime") }
            //   { value: 3, label: proxy.$t('withdrawalManagement.pushTime') },
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
            searchForm.endTime = searchForm.startTime = searchForm.sellerId = searchForm.transactionStatus = fastChooseButtonValue.value = "";
            searchFormRef.value.resetFields();
            initData();
        };
        // 快速筛选按钮值
        let fastChooseButtonValue = ref(0);
        // 快速筛选
        const handleSelect = (type) => {
            searchForm.transactionStatus = type;
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = [
            "transactionNo",
            "capitalAccount",
            "memberInfo",
            "sellerType",
            "businessType",
            "amount",
            "payChannel",
            "transactionStatus",
            "createTime",
            "completionTime",
            "transactionExplain",
            "remark"
        ];
        // 待审核和待转账数量统计对象
        const dataCount = reactive({
            waitAuditCount: 0, // 待审核数量
            waitGoriCount: 0, // 待转账数量
            rechargeWaitAuditCount: 0 // 充值待确认数量
        });
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }

            marginList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.securityAmountRecords.total;
                    dataCount.waitAuditCount = res.data.waitAuditCount;
                    dataCount.waitGoriCount = res.data.waitGoriCount;
                    dataCount.rechargeWaitAuditCount = res.data.rechargeWaitAuditCount;
                    tableData.value = res.data.securityAmountRecords.records.map((item) => {
                        // 资金账户（1:店铺保证金）
                        for (let i in dict.value.fundAccount) {
                            if (dict.value.fundAccount[i].value == item.capitalAccount) {
                                item.capitalAccountName = dict.value.fundAccount[i].name;
                                break;
                            }
                        }
                        // 业务类型(数字转文字 1充值2提现3扣款4汇入)
                        for (let i in dict.value.businessType) {
                            if (dict.value.businessType[i].value == item.businessType) {
                                item.businessTypeName = dict.value.businessType[i].name;
                                break;
                            }
                        }
                        // 支付渠道(数字转文字 1银行汇款2货款账户3系统充值4系统扣款)
                        for (let i in dict.value.payChannelType) {
                            if (dict.value.payChannelType[i].value == item.payChannel) {
                                item.payChannelName = dict.value.payChannelType[i].name;
                                break;
                            }
                        }
                        // 交易状态(1充值成功2待审核3待处理4提现完成5提现驳回6待确认)
                        for (let i in dict.value.transactionStatusType) {
                            if (dict.value.transactionStatusType[i].value == item.transactionStatus) {
                                item.transactionStatusName = dict.value.transactionStatusType[i].name;
                                break;
                            }
                        }
                        // 卖家类型(数字转文字 1：个人卖家，2：专业卖家)
                        for (let i in dict.value.sellerType) {
                            if (dict.value.sellerType[i].value == item.sellerType) {
                                item.sellerTypeName = dict.value.sellerType[i].name;
                                break;
                            }
                        }
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
        // 订单操作(审核、转账、查看详情)
        const handleAddEdit = (num, row) => {
            // 判断操作类型（0：充值扣款，1:充值处理，2：提现审核，3：提现处理，4.扣款处理, 5：查看驳回详情，）
            if (num == 0) {
                // 充值扣款
                editRow.value = {
                    num
                };
            } else if (num == 1) {
                // 充值处理
                editRow.value = {
                    id: row.id,
                    amount: row.amount,
                    picUrl: row.voucherUrl,
                    remark: row.remark,
                    num
                };
            } else if (num == 2) {
                // 提现审核
                editRow.value = {
                    ...row,
                    num
                };
            } else if (num == 3 || num == 4) {
                // 提现、扣款处理
                editRow.value = row;
                editRow.value.num = num;
            } else if (num == 5) {
                // 查看驳回详情
                editRow.value = row;
                editRow.value.num = num;
            }
            editVisible.value = true;
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

        return {
            dict,
            initData,
            pageFlag,
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
            dateTypeSelect,
            shortcuts,
            disabledDate,
            lookVisible,
            sellerId,
            handleAddEdit,
            handleChangeCardType,
            dataCount,
            storeNameTypeSelect,
            loading,
            options,
            list,
            allStoreInfo,
            fastChooseButtonValue
        };
    }
};
</script>
