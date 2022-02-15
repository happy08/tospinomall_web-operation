<template>
    <!-- 贸易类型选择按钮 -->
    <div class="top-search-form">
        <BmBreadcrumb />
        <div>
            <el-radio-group v-model="searchForm.storeType" @change="handleChangeCardType">
                <!-- 出口贸易 -->
                <el-radio-button :label="2">{{ $t("withdrawalManagement.crossborderTrade") }}</el-radio-button>
                <!-- 国内贸易 -->
                <el-radio-button :label="1">{{ $t("withdrawalManagement.localTrade") }}</el-radio-button>
            </el-radio-group>
        </div>
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
                        <el-select v-model="searchForm.sellerId" filterable remote reserve-keyword :placeholder="$t('pleaseEnter')" :remote-method="allStoreInfo" :loading="loading">
                            <el-option v-for="item in list" :key="item.userId" :label="searchForm.keyWord == 'storeName' ? item.storeName : item.storeCode" :value="item.userId"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 单号信息-->
                    <el-form-item :label="$t('withdrawalManagement.withdrawNo')" prop="withdrawNo">
                        <el-input v-model="searchForm.withdrawNo" :placeholder="$t('pleaseEnter')"></el-input>
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
                <el-radio-group v-model="searchForm.status" @change="handleChangeCardType">
                    <!-- 全部 -->
                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                    <!-- 待审核 -->
                    <el-radio-button :label="1">{{ $t("withdrawalManagement.pendingReview") }}</el-radio-button>
                    <!-- 处理中 -->
                    <el-radio-button :label="2">{{ $t("withdrawalManagement.processing") }}</el-radio-button>
                    <!-- 提现完成 -->
                    <el-radio-button :label="3">{{ $t("withdrawalManagement.withdrawalCompleted") }}</el-radio-button>
                    <!-- 已驳回 -->
                    <el-radio-button :label="4">{{ $t("withdrawalManagement.rejected") }}</el-radio-button>
                    <!-- 已取消 -->
                    <el-radio-button :label="5">{{ $t("withdrawalManagement.cancelled") }}</el-radio-button>
                </el-radio-group>
                <!-- 快速筛选 -->
                <span class="mlr-30">{{ $t("status.rapidCull") }}:</span>
                <!-- 待推送数量 -->
                <el-button @click="handleSelect('push')">{{ $t("withdrawalManagement.waitPushCount") }}({{ tableData.waitPushCount }})</el-button>
                <!-- 待转账数量 -->
                <el-button @click="handleSelect('transfer')">{{ $t("withdrawalManagement.waitTransferAccountCount") }}({{ tableData.waitTransferAccountCount }})</el-button>
            </div>
            <div class="flex">
                <!-- 导出 -->
                <el-button v-permission="'sellerFunds_withdrawalManagement_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="withdrawalManagementTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 提现单号 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.withdrawNo')" prop="withdrawNo">
                <template #default="scope">{{ scope.row.withdrawNo }}</template>
            </BmTableColumn>
            <!-- 卖家信息 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.sellerInfo')" prop="sellerInfo" align="center">
                <template #default="scope">
                    <span class="iblock">{{ scope.row.storeName }}</span>
                    <span>{{ scope.row.sellerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 申请提现金额 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.amount')" prop="amount" align="center">
                <template #default="scope">{{ scope.row.amount }} {{ $store.state.app.currencySymbol }}</template>
            </BmTableColumn>
            <!-- ----- -->
            <!-- 提现货币 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.currency')" prop="currency" align="center">
                <template #default="scope">{{ scope.row.currency }}</template>
            </BmTableColumn>
            <!-- 汇率 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.rate')" prop="rate" align="center">
                <template #default="scope">{{ scope.row.rate }}</template>
            </BmTableColumn>
            <!-- 提现货币金额 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.currenyAmount')" prop="currenyAmount" align="center">
                <template #default="scope">{{ scope.row.currenyAmount }}</template>
            </BmTableColumn>
            <!-- ------------ -->
            <!-- 提现账户类型 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.type')" prop="type">
                <template #default="scope">{{ scope.row.typeName }}</template>
            </BmTableColumn>
            <!-- 收款账户 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.creditedAccount')" align="center" prop="creditedAccount">
                <template #default="scope">
                    <span>{{ scope.row.creditedAccount }}</span>
                </template>
            </BmTableColumn>
            <!-- 申请时间 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.createTime')" prop="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.status')" width="100" align="center" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 流水号 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.serialNo')" align="center" prop="serialNo">
                <template #default="scope">
                    <span class="iblock">{{ scope.row.serialNo }}</span>
                    <span class="iblock">{{ scope.row.updateTime }}</span>
                </template>
            </BmTableColumn>
            <!-- 审核人 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.auditUser')" align="center" prop="auditUser">
                <template #default="scope">
                    <span class="iblock">{{ scope.row.auditUser }}</span>
                    <span class="iblock">{{ scope.row.auditTime }}</span>
                </template>
            </BmTableColumn>
            <!-- 推送人 -->
            <BmTableColumn :label="$t('withdrawalManagementTable.pushUser')" align="center" prop="pushUser">
                <template #default="scope">
                    <span class="iblock">{{ scope.row.pushUser }}</span>
                    <span class="iblock">{{ scope.row.pushTime }}</span>
                </template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" align="center">
                <template #default="scope">
                    <!-- 状态为待审核的订单才有审核和驳回选项 -->
                    <!--审核-->
                    <el-button v-permission="'sellerFunds_withdrawalManagement_audit'" v-if="scope.row.status == 1" @click.stop="handleAddEdit(scope.row.id, 'audit')" type="text">{{
                        $t("status.audit")
                    }}</el-button>
                    <!--驳回-->
                    <!-- <el-button
            v-if="scope.row.status == 1"
            @click.stop="handleAddEdit(scope.row.id)"
            type="text"
            >{{ $t('status.reject') }}</el-button
          > -->
                    <!-- 状态为处理中的订单，且提现账户类型为银行转账的才有转账选项 -->
                    <!--转账-->
                    <el-button
                        v-permission="'sellerFunds_withdrawalManagement_transfer'"
                        v-if="scope.row.status == 2 && scope.row.typeNum == 2"
                        @click.stop="handleAddEdit(scope.row, 'transfer')"
                        type="text"
                        >{{ $t("withdrawalManagement.transfer") }}</el-button
                    >
                    <!-- 状态为处理中的订单，且提现账户类型为推送至Payonner的才有推送至Payonner选项 -->
                    <!--推送至Payonner-->
                    <el-button
                        v-permission="'sellerFunds_withdrawalManagement_push'"
                        v-if="scope.row.status == 2 && scope.row.typeNum == 1"
                        @click.stop="handleAddEdit(scope.row.id, 'payonner', scope.row)"
                        type="text"
                        >{{ $t("withdrawalManagement.pushToPayoneer") }}</el-button
                    >
                    <!-- 提现完成的订单才有查看转账详情选项 -->
                    <!--查看转账详情-->
                    <el-button v-permission="'sellerFunds_withdrawalManagement_look'" v-if="scope.row.status == 3" @click.stop="handleAddEdit(scope.row, 'viewTransfer')" type="text">{{
                        $t("withdrawalManagement.viewTransferDetails")
                    }}</el-button>
                    <!-- 只有已驳回的订单才有查看驳回原因选项 -->
                    <!--查看驳回原因-->
                    <el-button v-permission="'sellerFunds_withdrawalManagement_lookReject'" v-if="scope.row.status == 4" @click.stop="handleAddEdit(scope.row, 'viewDismissal')" type="text">{{
                        $t("withdrawalManagement.viewReasonForRejection")
                    }}</el-button>
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
import { documentTypeList, manifestManagementList, manifestManagementListExport, getAllStoreInfo } from "@/api/finance";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { exportExcel } from "@/utils/";
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
        console.log("213", 0 || (2 && 3));
        //分页
        let pageSize = 10,
            pageTotal = ref(0);
        // 出口贸易与国内贸易切换
        const handleChangeCardType = () => {
            searchForm.inHandStatus = "";
            initData();
        };
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: pageSize,
            pageNum: 1,
            storeType: 1, // 店铺贸易类型，1：国内贸易，2：出口贸易
            sellerId: null, // 卖家ID
            withdrawNo: null, // 提现单号
            timeType: 1, // 时间类型（1：申请日期，2：审核日期，3：推送日期）
            createTime: [],
            status: "", // 提现订单状态（1待审核2处理中3提现完成4已驳回5已取消）
            inHandStatus: null, // 快速筛选，处理中状态，1：待推送，2：待审核,
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
            { value: 2, label: proxy.$t("withdrawalManagement.auditTime") },
            { value: 3, label: proxy.$t("withdrawalManagement.pushTime") }
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
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.sellerId = searchForm.endTime = searchForm.startTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        // 快速筛选
        const handleSelect = (type) => {
            // 必须是处理中的订单才能进行进入统计
            searchForm.status = "";
            if (type == "push") {
                // 推送筛选
                searchForm.inHandStatus = 1;
            } else {
                // 转帐筛选
                searchForm.inHandStatus = 2;
            }
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["withdrawNo", "sellerInfo", "amount", "currency", "rate", "currenyAmount", "type", "creditedAccount", "createTime", "status", "serialNo", "auditUser", "pushUser"];
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }

            manifestManagementList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.accountWithdraws.total;
                    tableData.value = res.data.accountWithdraws.records.map((item) => {
                        // 提现账户类型(数字转文字 1.Payoneer，2.银行卡账户，3.保证金)
                        for (let i in dict.value.withdrawalAccountType) {
                            if (dict.value.withdrawalAccountType[i].value == item.type) {
                                item.typeName = dict.value.withdrawalAccountType[i].name;
                                break;
                            }
                        }
                        // 提现状态(数字转文字 1待审核2处理中3提现完成4已驳回5已取消)
                        for (let i in dict.value.withdrawalStatusType) {
                            if (dict.value.withdrawalStatusType[i].value == item.status) {
                                item.statusName = dict.value.withdrawalStatusType[i].name;
                                break;
                            }
                        }
                        item.typeNum = item.type;
                        return item;
                    });
                    // 待推送数量
                    tableData.value.waitPushCount = res.data.waitPushCount;
                    // 待转账数量
                    tableData.value.waitTransferAccountCount = res.data.waitTransferAccountCount;
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
        const handleAddEdit = (row, type, trueRow) => {
            // 判断操作类型
            if (type == "audit") {
                // 审核操作
                editRow.value = {
                    id: row,
                    type: type
                };
            } else if (type == "transfer") {
                // 转账操作
                editRow.value = row;
                editRow.value.accountType = row.type;
                editRow.value.type = "transfer";
            } else if (type == "payonner") {
                // 推送至Payoneer
                editRow.value = {
                    id: row,
                    trueRow,
                    type: "payoneer"
                };
            } else if (type == "viewTransfer") {
                // 查看转账详情
                editRow.value = row;
                editRow.value.accountType = row.type;
                editRow.value.type = "viewTransfer";
            } else if (type == "viewDismissal") {
                // 查看驳回原因
                editRow.value = row;
                editRow.value.type = "viewDismissal";
            }
            editVisible.value = true;
            console.log(type, "000");
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
        // 导出excel表格
        const handleExportExcel = (val) => {
            manifestManagementListExport(searchForm)
                .then((res) => {
                    exportExcel("WithdrawalManagement", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
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
            handleExportExcel,
            storeNameTypeSelect,
            loading,
            options,
            list,
            allStoreInfo
        };
    }
};
</script>
