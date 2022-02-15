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
                    <el-form-item :label="$t('copingManagement.memberInfo')" prop="buyerId">
                        <!-- <el-input v-model="searchForm.buyerId" :placeholder="$t('onlinePayments.id')"></el-input> -->
                        <BmSelectRemote
                            v-model="searchForm.buyerId"
                            :remoteApi="getAllUserInfo"
                            :option="{ label: 'phone', value: 'id' }"
                            keyword="keywords"
                            :placeholder="$t('onlinePayments.pleaseEnterTips')"
                        ></BmSelectRemote>
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
                <!-- 后台充值 -->
                <el-button @click.stop="handleAddEdit({}, 'recharge')" type="primary">+{{ $t("walletRecharge.backgroundRecharge") }}</el-button>
            </div>
            <div class="flex">
                <!-- 导出 -->
                <!-- <el-button @click="handleExportExcel">
                    {{ $t('table.exportExcel') }}
                </el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="walletRechargeTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 会员信息(userName+buyerId) -->
            <BmTableColumn :label="$t('walletRechargeTable.memberInfo')" prop="memberInfo" width="200">
                <template #default="scope">
                    <div>{{ scope.row.userName }}</div>
                    <div>id：{{ scope.row.buyerId }}</div>
                    <div>phone：{{ scope.row.buyerPhone }}</div>
                </template>
            </BmTableColumn>
            <!-- 钱包余额 -->
            <BmTableColumn :label="$t('walletRechargeTable.amount')" prop="amount">
                <template #default="scope">{{ scope.row.amount }}</template>
            </BmTableColumn>
            <!-- 总充值金额 -->
            <BmTableColumn :label="$t('walletRechargeTable.rechargeAmount')" prop="rechargeAmount">
                <template #default="scope">{{ scope.row.rechargeAmount }}</template>
            </BmTableColumn>
            <!-- 总赠送金额 -->
            <BmTableColumn :label="$t('walletRechargeTable.giveAmount')" prop="giveAmount">
                <template #default="scope">
                    {{ scope.row.giveAmount }}
                </template>
            </BmTableColumn>
            <!-- 总消费金额 -->
            <BmTableColumn :label="$t('walletRechargeTable.realAmount')" prop="realAmount">
                <template #default="scope">{{ scope.row.realAmount }}</template>
            </BmTableColumn>
            <!-- 充值次数 -->
            <BmTableColumn :label="$t('walletRechargeTable.rechargeCount')" prop="rechargeCount">
                <template #default="scope">{{ scope.row.rechargeCount }}</template>
            </BmTableColumn>
            <!-- 充值成功次数 -->
            <BmTableColumn :label="$t('walletRechargeTable.rechargeSuccessCount')" width="100" align="center" prop="rechargeSuccessCount">
                <template #default="scope">{{ scope.row.rechargeSuccessCount }}</template>
            </BmTableColumn>
            <!-- 充值失败次数 -->
            <BmTableColumn :label="$t('walletRechargeTable.rechargeFailCount')" prop="rechargeFailCount">
                <template #default="scope">{{ scope.row.rechargeFailCount }}</template>
            </BmTableColumn>
            <!-- 总消费次数 -->
            <BmTableColumn :label="$t('walletRechargeTable.realCount')" prop="realCount">
                <template #default="scope">{{ scope.row.realCount }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="190" align="center">
                <template #default="scope">
                    <!-- 后台充值 -->
                    <el-button v-permission="'memberFunds_walletRecharge_recharge'" @click.stop="handleAddEdit(scope.row, 'recharge')" type="text">{{
                        $t("walletRecharge.backgroundRecharge")
                    }}</el-button>
                    <!-- 收支明细 -->
                    <el-button v-permission="'memberFunds_walletRecharge_look'" @click.stop="handleAddEdit(scope.row, 'detail')" type="text">{{
                        $t("walletRecharge.incomeAndExpenditureDetails")
                    }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 分页区域 -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
        <!-- 后台充值/收支明细 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" @update:visible="editVisible = false" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { getAllUserInfo, getWalletRechargeList } from "@/api/finance";
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
            buyerId: null // 会员id
            //rechargeStartTime: null, // 钱包充值开始日期
            //rechargeEndTime: null, //钱包充值结束日期
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        //搜索
        const handleSearch = () => {
            searchForm.pageNum = pageNum.value;
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.rechargeEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.rechargeStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            // 手动重置查询时间
            searchForm.rechargeStartTime = searchForm.rechargeEndTime = "";
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
        const tableColumn = ["memberInfo", "amount", "rechargeAmount", "giveAmount", "realAmount", "rechargeCount", "rechargeSuccessCount", "rechargeFailCount", "realCount"];
        //获取列表
        const getListPage = () => {
            searchForm.pageNum = pageNum.value;
            getWalletRechargeList(searchForm)
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
        // 后台充值/收支明细
        const handleAddEdit = (row, type) => {
            if (!row.userName) {
                editRow.value = {
                    userName: "",
                    buyerId: row.buyerId,
                    type: type
                };
            } else {
                editRow.value = {
                    userName: row.userName,
                    buyerId: row.buyerId,
                    type: type
                };
            }
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
            getAllUserInfo,
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
            disabledDate,
            lookVisible,
            sellerId,
            handleAddEdit
        };
    }
};
</script>
