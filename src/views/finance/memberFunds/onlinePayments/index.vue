<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 支付时间 -->
                    <el-form-item :label="$t('onlinePayments.paymentTime')" prop="paymentTime">
                        <el-date-picker
                            v-model="searchForm.paymentTime"
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
                    <!-- 单据编号-->
                    <el-form-item :label="$t('onlinePaymentTable.receiptsNum')" prop="receiptsNum">
                        <el-input v-model="searchForm.receiptsNum" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 关联订单-->
                    <el-form-item :label="$t('onlinePayments.associatedOrderNo')" prop="associatedOrderNo">
                        <el-input v-model="searchForm.associatedOrderNo" :placeholder="$t('pleaseEnter')"></el-input>
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
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 支付方式 -->
                    <el-form-item :label="$t('onlinePaymentTable.paymentType')" prop="paymentType">
                        <el-select v-model="searchForm.paymentType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item,key) in 8" :key="key" :label="$t(`orderQuery.payType[${key}]`)" :value="key"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 会员名称-->
                    <el-form-item :label="$t('onlinePayments.memberInfo')" prop="memberInfo">
                        <BmSelectRemote
                            v-model="searchForm.buyerId"
                            :remoteApi="getAllUserInfo"
                            :option="{ label: 'username', value: 'id' }"
                            keyword="keywords"
                            :placeholder="$t('onlinePayments.pleaseEnterTips')"
                        ></BmSelectRemote>
                    </el-form-item>
                </el-col>
                <!-- <el-col :md="12" :lg="6">
                    会员名称
                    <el-form-item :label="$t('onlinePayments.userName')" prop="userName">
                        <el-input v-model="searchForm.userName" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    会员编码
                    <el-form-item :label="$t('onlinePayments.buyerId')" prop="buyerId">
                        <el-input v-model="searchForm.buyerId" :placeholder="$t('onlinePayments.id')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    会员手机号
                    <el-form-item :label="$t('onlinePayments.phone')" prop="phone">
                        <el-input v-model="searchForm.phone" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col> -->
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

    <div class="p-25 bg-white round-4">
        <div class="flex mb-10 between">
            <div>
                <!-- <el-button v-permission="'memberFunds_onlinePayments_add'" @click.stop="handleAddEdit('topAdd')" type="primary">{{ $t("onlinePayments.addOnlinePay") }}</el-button> -->
                <!-- 未支付 -->
                <el-button @click="handleNoPay()">{{ $t("onlinePayments.pendingPayment") }} ({{ pendingPaymentCount }})</el-button>
            </div>
            <div class="flex">
                <!-- 导出 -->
                <!-- <el-button @click="handleExportExcel">
          {{ $t('table.exportExcel') }}
        </el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="onlinePaymentTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" :column="tableColumn">
            <!-- 状态（0未支付1支付成功2支付失败） -->
            <BmTableColumn :label="$t('onlinePaymentTable.status')" prop="status" width="100px">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 支付方式(支付方式 0, "系统支付" 1, "余额支付" 2, "UniwalletPay支付" 3, "TINGG支付" 4, "brij 支付" 5, "货到付款签收支付" 6, "paySwitch 支付) -->
            <BmTableColumn :label="$t('onlinePaymentTable.paymentType')" prop="paymentType" width="100px">
                <template #default="scope">
                    <div v-if="scope.row.paymentType">
                        {{ $t(`orderQuery.payType[${scope.row.paymentType}]`) }}
                        <span v-if="scope.row.platformPayTypeName">-{{ scope.row.platformPayTypeName }}</span>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 单据编号 -->
            <BmTableColumn :label="$t('onlinePaymentTable.receiptsNum')" prop="receiptsNum">
                <template #default="scope">{{ scope.row.receiptsNum }}</template>
            </BmTableColumn>
            <!-- 关联订单号 -->
            <BmTableColumn :label="$t('onlinePaymentTable.associatedOrderNo')" prop="associatedOrderNo">
                <template #default="scope">{{ scope.row.associatedOrderNo }}</template>
            </BmTableColumn>
            <!-- 会员信息(userName+id) -->
            <BmTableColumn :label="$t('onlinePaymentTable.memberInfo')" align="center" prop="memberInfo">
                <template #default="scope">
                    <span class="block">{{ scope.row.userName }}</span>
                    <span>{{ scope.row.buyerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 订单应收金额 -->
            <BmTableColumn :label="$t('onlinePaymentTable.orderReceivableAmount') + $store.state.app.currencySymbol" prop="orderReceivableAmount">
                <template #default="scope">{{ scope.row.orderReceivableAmount }}</template>
            </BmTableColumn>
            <!-- 订单优惠金额 -->
            <BmTableColumn :label="$t('onlinePaymentTable.orderDiscountsAmount') + $store.state.app.currencySymbol" prop="orderDiscountsAmount">
                <template #default="scope">{{ scope.row.orderDiscountsAmount }}</template>
            </BmTableColumn>
            <!-- 订单实收金额 -->
            <BmTableColumn :label="$t('onlinePaymentTable.orderReceiptsAmount') + $store.state.app.currencySymbol" prop="orderReceiptsAmount">
                <template #default="scope">{{ scope.row.orderReceiptsAmount }}</template>
            </BmTableColumn>
            <!-- 交易凭证 -->
            <BmTableColumn :label="$t('onlinePaymentTable.transactionVoucher')" prop="transactionVoucher">
                <template #default="scope">{{ scope.row.transactionVoucher }}</template>
            </BmTableColumn>
            <!-- 订单来源 -->
            <BmTableColumn :label="$t('onlinePaymentTable.orderSource')" prop="orderSource" width="100px">
                <template #default="scope">{{ scope.row.orderSourceName }}</template>
            </BmTableColumn>
            <!-- 支付日期 -->
            <BmTableColumn :label="$t('onlinePaymentTable.paymentTime')" prop="paymentTime">
                <template #default="scope">{{ scope.row.paymentTime }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="240" align="center">
                <template #default="scope">
                    <!-- 只有货到付款(paymentType=5)且未支付(status=0)的订单才有付款按钮 -->
                    <!-- 付款 -->
                    <el-button v-permission="'memberFunds_onlinePayments_add'" v-if="scope.row.status == 0 && scope.row.paymentType == 5" @click.stop="handleAddEdit('pay', scope.row)" type="text">{{
                        $t("onlinePayments.payment")
                    }}</el-button>
                    <!-- 手动支付标记 manualPayTag (0:否;1:是;) -->
                    <!-- 只有货到付款(paymentType=5)且(支付成功(status=1))的订单才有修改按钮 -->
                    <!-- 修改 -->
                    <el-button v-permission="'memberFunds_onlinePayments_edit'" type="text" v-if="scope.row.status == 1 && scope.row.paymentType == 5" @click.stop="handleAddEdit('edit', scope.row)">{{
                        $t("onlinePayments.update")
                    }}</el-button>
                    <!-- 只有货到付款或手动支付的才有查看记录 -->
                    <!-- 查看变更记录 -->
                    <el-button v-permission="'memberFunds_onlinePayments_look'" type="text" v-if="scope.row.paymentType == 5" @click.stop="handleAddEdit('look', scope.row)">{{
                        $t("onlinePayments.viewChangeHistory")
                    }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
        <!-- 新增/编辑/查看弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { documentTypeList, onlinePay, getAllUserInfo, getNoPayNum } from "@/api/finance";
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
            paymentTime: [],
            receiptsNum: null, // 单据编号
            associatedOrderNo: null, // 关联订单
            status: null, // 状态
            paymentType: null, // 支付方式(1余额支付，2MTN)
            userName: null, // 会员名称
            buyerId: null, // 会员编码
            phone: null // 会员手机号
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 状态select选择数据
        const statusSelectList = computed(() => [
            { value: "", label: proxy.$t("status.all") },
            { value: "0", label: proxy.$t("onlinePayments.pendingPayment") },
            { value: "1", label: proxy.$t("onlinePayments.paid") },
            { value: "2", label: proxy.$t("onlinePayments.paymentFailed") }
        ]);
        //搜索
        const handleSearch = () => {
            searchForm.pageNum = pageNum.value;
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.registerEndTime = proxy.utils.formatStandardDate(searchForm.paymentTime && searchForm.paymentTime[1], true);
            searchForm.registerStartTime = proxy.utils.formatStandardDate(searchForm.paymentTime && searchForm.paymentTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.buyerId = searchForm.registerStartTime = searchForm.registerEndTime = "";
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
            "status",
            "paymentType",
            "receiptsNum",
            "associatedOrderNo",
            "memberInfo",
            "orderReceivableAmount",
            "orderDiscountsAmount",
            "orderReceiptsAmount",
            "transactionVoucher",
            "orderSource",
            "orderSource"
        ];
        // 未支付统计变量
        let pendingPaymentCount = ref(0);
        //获取列表
        const getListPage = () => {
            // 未支付数量
            getNoPayNum().then((res) => (pendingPaymentCount.value = res.data));

            searchForm.pageNum = pageNum.value;
            onlinePay(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 支付状态(数字转文字 0未支付1支付成功2支付失败)
                        for (let i in dict.value.chargebackStatus) {
                            if (dict.value.payStatus[i].value == item.status) {
                                item.statusName = dict.value.payStatus[i].name;
                                break;
                            }
                        }
                        // 订单来源(数字转文字 1:运营平台，2:安卓，3:iOS ，4::H5，5:web商城)
                        for (let i in dict.value.financePlatform) {
                            if (dict.value.financePlatform[i].value == item.orderSource) {
                                item.orderSourceName = dict.value.financePlatform[i].name;
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
        // 未支付按钮监听事件
        const handleNoPay = () => {
            searchForm.buyerId = searchForm.registerStartTime = searchForm.registerEndTime = "";
            searchFormRef.value.resetFields();
            searchForm.status = 0;
            getListPage();
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
        // 操作按钮点击类型(新增add、修改edit、查看look)
        const updateType = ref("");
        // 新增/修改/查询
        const handleAddEdit = (type, row) => {
            if (type == "look") {
                editRow.value = {
                    associatedOrderNo: row.associatedOrderNo,
                    paymentId: row.id
                };
            } else {
                if (type != "topAdd") {
                    editRow.value = row;
                } else {
                    editRow.value = {};
                }
            }
            editRow.value.action = type;
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
            shortcuts,
            statusSelectList,
            disabledDate,
            lookVisible,
            sellerId,
            handleAddEdit,
            pendingPaymentCount,
            getAllUserInfo,
            handleNoPay
        };
    }
};
</script>
