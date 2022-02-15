<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 卖家信息-->
                    <el-form-item :label="$t('accountsReceivable.sellerInfo')" prop="sellerId">
                        <el-input v-model="searchForm.sellerId" :placeholder="$t('onlinePayments.id')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 收款账户-->
                    <el-form-item :label="$t('accountsReceivable.accountKeyword')" prop="accountKeyword">
                        <el-input v-model="searchForm.accountKeyword" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 最后变更日期 -->
                    <el-form-item :label="$t('accountsReceivable.updateTime')" prop="createTime">
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
        <div class="flex mb-10" style="justify-content: flex-end">
            <div class="flex">
                <!-- 导出 -->
                <!-- <el-button @click="handleExportExcel">
          {{ $t('table.exportExcel') }}
        </el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="accountsReceivableTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 卖家/店铺信息) -->
            <BmTableColumn :label="$t('accountsReceivableTable.sellerOrStoreInfo')" width="200" align="center" prop="sellerOrStoreInfo">
                <template #default="scope">
                    <!-- 卖家店铺名称 -->
                    <span class="block">{{ scope.row.storeName }}</span>
                    <!-- 卖家店铺ID -->
                    <span class="block">{{ scope.row.sellerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 当前收款账户信息 -->
            <BmTableColumn :label="$t('accountsReceivableTable.currentReceivingAccountInfo')" prop="currentReceivingAccountInfo">
                <template #default="scope">
                    <!-- payonner -->
                    <div v-if="scope.row.type == 1" class="flex between">
                        <div style="width:300px">
                            <!-- Payonner账户 -->
                            <span class="block">{{ $t("accountsReceivableTable.payonnerAccount") }}: {{ scope.row.payoneerAccount }}</span>
                        </div>
                        <div style="width:300px">
                            <!-- 联系人 -->
                            <span class="block">{{ $t("accountsReceivableTable.holder") }}: {{ scope.row.holder }}</span>
                            <!-- 邮箱 -->
                            <span class="block">{{ $t("accountsReceivableTable.payoneerEmail") }}: {{ scope.row.payoneerEmail }}</span>
                        </div>
                    </div>
                    <!-- 银行卡转账 -->
                    <div v-else-if="scope.row.type == 2" class="flex between">
                        <div style="width:300px">
                            <!-- 银行 -->
                            <span class="block">{{ $t("accountsReceivable.bank") }}: {{ scope.row.openingBank }}</span>
                            <!-- 银行卡号 -->
                            <span class="block">{{ $t("accountsReceivableTable.bankCard") }}: {{ scope.row.bankCard }}</span>
                        </div>
                        <div style="width:300px">
                            <!-- 持卡人 -->
                            <span class="block">{{ $t("accountsReceivable.holder") }}: {{ scope.row.holder }}</span>
                            <!-- 银行卡预留手机号 -->
                            <span class="block">{{ $t("accountsReceivable.phone") }}: {{ scope.row.phone }}</span>
                        </div>
                        <div style="width:450px">
                            <!-- 开户行支行 -->
                            <span class="block">{{ $t("accountsReceivableTable.openingBank") }}: {{ scope.row.openingBank }}</span>
                            <!-- 开户行支行地址 -->
                            <span class="block">{{ $t("accountsReceivableTable.openingBankLocation") }}: {{ scope.row.openingBankLocation }}</span>
                        </div>
                        <div style="width:300px">
                            <!-- 开户许可证 -->
                            <span>{{ $t("accountsReceivableTable.licencePic") }}:</span>
                            <span v-for="(item, index) in scope.row.licencePicList" :key="index">
                                <BmImage :src="item" style="width:50px; height:50px" />
                            </span>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 最后变更日期 -->
            <BmTableColumn :label="$t('accountsReceivableTable.updateTime')" width="200" prop="updateTime">
                <template #default="scope">{{ scope.row.updateTime }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                <template #default="scope">
                    <!-- 查看变更记录 -->
                    <el-button v-permission="'sellerFunds_accountsReceivable_look'" @click.stop="handleAddedit(scope.row.id)" type="text">{{ $t("accountsReceivable.viewChangeHistory") }}</el-button>
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
import { documentTypeList, getSellerAccountList, getSellerAccountChangeList } from "@/api/finance";
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
            pageSize: pageSize,
            pageNum: pageNum,
            createTime: [],
            sellerId: null, // 卖家ID
            accountKeyword: null, // 收款账户
            updateStartTime: null, // 最后变更时间，开始时间
            updateEndTime: null // 最后变更时间，结束时间
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
            searchForm.updateStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            searchForm.updateEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.updateStartTime = searchForm.updateEndTime = "";
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
        const tableColumn = ["sellerOrStoreInfo", "currentReceivingAccountInfo", "updateTime"];
        //获取列表
        const getListPage = () => {
            searchForm.pageNum = pageNum.value;
            delete searchForm.createTime;
            getSellerAccountList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 退单类型(数字转文字 0->退款 1->退款退货 2->换货)
                        // for (let i in dict.value.chargebackType) {
                        //   if (dict.value.chargebackType[i].value == item.type) {
                        //     item.typeName = dict.value.chargebackType[i].name
                        //     break
                        //   }
                        // }
                        item.licencePicList = item.licencePic.split(",");
                        // 解决字符串第一个字符是‘，’的问题
                        if (item.licencePicList[0] == "") {
                            item.licencePicList.splice(0, 1);
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
        // 退款
        const handleAddedit = (id) => {
            getSellerAccountChangeList({ accountId: id })
                .then((res) => {
                    editRow.value = res.data;
                    editRow.value = res.data.map((item) => {
                        //   银行卡类型(数字转文字 1Payoneer，2银行借记卡，3银行信用卡)
                        for (let i in dict.value.paymentMethod) {
                            if (dict.value.paymentMethod[i].value == item.type) {
                                item.typeName = dict.value.paymentMethod[i].name;
                                break;
                            }
                        }
                        //   payoneer账号状态(数字转文字 0未激活1已激活)
                        for (let i in dict.value.payoneerStatus) {
                            if (dict.value.payoneerStatus[i].value == item.payoneerStatus) {
                                item.payoneerStatusName = dict.value.payoneerStatus[i].name;
                                break;
                            }
                        }
                        item.licencePicList = item.licencePic.split(",");
                        return item;
                    });
                })
                .catch(() => {});
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
            disabledDate,
            handleAddedit
        };
    }
};
</script>
