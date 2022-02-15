<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 单据生成日期 -->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.invoicesCreateTime')" prop="invoicesCreateTime">
                        <el-date-picker
                            v-model="searchForm.invoicesCreateTime"
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
                    <!-- 单据支付日期 -->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.invoicesPayTime')" prop="invoicesPayTime">
                        <el-date-picker
                            v-model="searchForm.invoicesPayTime"
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
                    <!-- 交易单号-->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.tradeNo')" prop="tradeNo">
                        <el-input v-model="searchForm.tradeNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.rechargeStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 单据类型 -->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.type')" prop="type">
                        <el-select v-model="searchForm.type" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.orderType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 平台 -->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.platformType')" prop="platformType">
                        <el-select v-model="searchForm.platformType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.rechargePlatform" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 会员信息-->
                    <el-form-item :label="$t('incomeExpenditureDetailsTable.memberInfo')" prop="buyerId">
                        <el-input v-model="searchForm.buyerId" :placeholder="$t('onlinePayments.id')"></el-input>
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
                {{ $t("incomeExpenditureDetailsTable.receivableAmount") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20" v-if="dataCount">{{ dataCount.receivableAmount }}</div>
            <div class="fw fs-20" v-else>0</div>
        </div>
        <!-- 差额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("incomeExpenditureDetailsTable.differenceAmount") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20" v-if="dataCount">{{ dataCount.differenceAmount }}</div>
            <div class="fw fs-20" v-else>0</div>
        </div>
        <!-- 实收/支金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>
                {{ $t("incomeExpenditureDetailsTable.realAmount") }}
                ({{ $store.state.app.currencySymbol }})
            </div>
            <div class="fw fs-20" v-if="dataCount">{{ dataCount.realAmount }}</div>
            <div class="fw fs-20" v-else>0</div>
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
                <BmTableOption table="incomeExpenditureDetailsTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 类型 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.type')" align="center" prop="type">
                <template #default="scope">
                    {{ scope.row.typeName }}
                </template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.status')" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 会员信息 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.memberInfo')" prop="memberInfo" align="center">
                <template #default="scope">
                    <span class="block"> {{ scope.row.userName }} </span>
                    <span> {{ scope.row.buyerId }} </span>
                </template>
            </BmTableColumn>
            <!-- 交易单号 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.tradeNo')" prop="tradeNo">
                <template #default="scope">
                    <span>{{ scope.row.tradeNo }}</span>
                </template>
            </BmTableColumn>
            <!-- 商户单号 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.merchantNumber')" prop="merchantNumber">
                <template #default="scope">{{ scope.row.merchantNumber }}</template>
            </BmTableColumn>
            <!-- 应收/支金额 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.receivableAmount') + '(' + $store.state.app.currencySymbol + ')'" prop="receivableAmount">
                <template #default="scope">
                    <span>{{ scope.row.receivableAmount }}</span>
                </template>
            </BmTableColumn>
            <!-- 差额 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.differenceAmount') + '(' + $store.state.app.currencySymbol + ')'" prop="differenceAmount">
                <template #default="scope">{{ scope.row.differenceAmount }}</template>
            </BmTableColumn>
            <!-- 实收/支金额 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.realAmount') + '(' + $store.state.app.currencySymbol + ')'" prop="realAmount">
                <template #default="scope">{{ scope.row.realAmount }}</template>
            </BmTableColumn>
            <!-- 交易凭证/流水号 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.voucherPictrue') + '/' + $t('incomeExpenditureDetailsTable.serialNo')" prop="serialNo">
                <template #default="scope">
                    <span v-if="scope.row.serialNo">{{ scope.row.serialNo }}</span>
                    <span v-else>
                        <BmImage :src="scope.row.voucherPictrueList[0]" fit="cover" :preview-src-list="scope.row.voucherPictrueList" style="width:50px;height:50px" />
                    </span>
                </template>
            </BmTableColumn>
            <!-- 平台-->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.platformType')" prop="platformType">
                <template #default="scope">{{ scope.row.platformTypeName }}</template>
            </BmTableColumn>
            <!-- 单据支付日期 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.invoicesPayTime')" prop="invoicesPayTime">
                <template #default="scope">{{ scope.row.invoicesPayTime }}</template>
            </BmTableColumn>
            <!-- 单据生成日期 -->
            <BmTableColumn :label="$t('incomeExpenditureDetailsTable.invoicesCreateTime')" prop="invoicesCreateTime">
                <template #default="scope">{{ scope.row.invoicesCreateTime }}</template>
            </BmTableColumn>
            <!-- 创建人 -->
            <BmTableColumn :label="$t('memberWalletTable.createUser')" prop="createUser">
                <template #default="scope">
                    <!-- 1钱包充值 2订单消费 3订单退款 -->
                    <div v-show="scope.row.type == 1">{{ scope.row.createUser }}</div>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { getIncomeAndExpensesList, incomeExpensesCollect } from "@/api/finance";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    name: "GoodsAttribute",
    components: {},
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
            invoicesPayTime: [], // 单据支付时间
            invoicesCreateTime: [] // 单据生成时间
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        //搜索
        const handleSearch = () => {
            // 单据生成日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.invoicesCreateEndTime = proxy.utils.formatStandardDate(searchForm.invoicesCreateTime && searchForm.invoicesCreateTime[1], true);
            searchForm.invoicesCreateStartTime = proxy.utils.formatStandardDate(searchForm.invoicesCreateTime && searchForm.invoicesCreateTime[0], true);
            // 单据支付时间
            searchForm.payEndTime = proxy.utils.formatStandardDate(searchForm.invoicesPayTime && searchForm.invoicesPayTime[1], true);
            searchForm.payStartTime = proxy.utils.formatStandardDate(searchForm.invoicesPayTime && searchForm.invoicesPayTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.payStartTime = searchForm.payEndTime = "";
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
            "type",
            "status",
            "memberInfo",
            "tradeNo",
            "merchantNumber",
            "receivableAmount",
            "differenceAmount",
            "realAmount",
            "voucherPictrue",
            "serialNo",
            "platformType",
            "invoicesPayTime",
            "invoicesCreateTime",
            "createUser"
        ];
        // 用来应收/差额/实收的数据对象
        let dataCount = ref({});
        //获取列表
        const getListPage = () => {
            searchForm.pageNum = pageNum.value;
            incomeExpensesCollect(searchForm)
                .then((res) => {
                    dataCount.value = res.data;
                })
                .catch(() => {});
            getIncomeAndExpensesList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 类型(数字转文字 1钱包充值 2订单消费 3订单退款)
                        for (let i in dict.value.orderType) {
                            if (dict.value.orderType[i].value == item.type) {
                                item.typeName = dict.value.orderType[i].name;
                                break;
                            }
                        }
                        // 状态(数字转文字 0失败 1成功 2待支付 3已取消)
                        for (let i in dict.value.rechargeStatus) {
                            if (dict.value.rechargeStatus[i].value == item.status) {
                                item.statusName = dict.value.rechargeStatus[i].name;
                                break;
                            }
                        }
                        // 平台(数字转文字 1:android，2:iOS ，3::H5，4:web 5: 运营平台)
                        for (let i in dict.value.rechargePlatform) {
                            if (dict.value.rechargePlatform[i].value == item.platformType) {
                                item.platformTypeName = dict.value.rechargePlatform[i].name;
                                break;
                            }
                        }
                        // 将图片从字符串转为数组
                        item.voucherPictrueList = (item.voucherPictrue && item.voucherPictrue.split(",")) || [];
                        return item;
                    });
                })
                .catch((err) => {
                    tableData.value = [];
                });
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
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

            handleSizeChange,
            handleCurrentChange,
            handleSelect,
            shortcuts,
            disabledDate,
            dataCount
        };
    }
};
</script>
