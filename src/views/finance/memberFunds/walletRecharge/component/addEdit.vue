<template>
    <BmDialog
        v-model:visible="visible"
        :title="form.type == 'recharge' ? $t('walletRecharge.recharge') : $t('walletRecharge.incomeAndExpenditureDetails')"
        :showFooter="form.type == 'recharge' ? true : false"
        :confirm="confirm"
        :cancel="cancel"
        :width="form.type == 'recharge' ? '800px' : '80vw'"
    >
        <!-- 钱包充值视窗区域 -->
        <div v-if="form.type == 'recharge'">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <!-- 会员昵称
                <el-form-item v-if="memberInfoSelectVisible" :label="$t('walletRecharge.userName')" prop="userName">
                    <BmSelectRemote
                        v-model="form.userName"
                        @change="memberInfoSelectChange(form.userName, 1)"
                        filterable
                        :remoteApi="getAllUserInfo"
                        keyword="userInfo"
                        :option="{ label: 'nickname', value: 'nickname' }"
                    >
                    </BmSelectRemote>
                </el-form-item>
                <el-form-item v-else :label="$t('walletRecharge.userName')" prop="userName">
                    <span>{{ form.userName }}</span>
                </el-form-item> -->
                <!-- 会员账号  @change="memberInfoSelectChange(form.buyerId, 2)"-->
                <el-form-item v-if="memberInfoSelectVisible" :label="$t('walletRecharge.buyerId')" prop="buyerId">
                    <BmSelectRemote v-model="form.buyerId" filterable :remoteApi="getAllUserInfo" keyword="keywords" :option="{ label: 'phone', value: 'id' }"> </BmSelectRemote>
                </el-form-item>
                <el-form-item v-else :label="$t('walletRecharge.buyerId')" prop="buyerId">
                    <span>{{ form.account }}</span>
                </el-form-item>
                <!-- 充值货币 -->
                <el-form-item :label="$t('walletRecharge.rechargeCurrency')" prop="rechargeCurrency">
                    <span>{{ $store.state.app.currencySymbol }}</span>
                </el-form-item>
                <!-- 充值金额 -->
                <el-form-item :label="$t('walletRecharge.amount')" prop="amount">
                    <el-input v-model="form.amount" type="number" :min="0" :placeholder="$t('pleaseEnter')">
                        <template #append>
                            <span>{{ $store.state.app.currencySymbol }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 赠送金额 -->
                <el-form-item :label="$t('walletRecharge.giveAmount')" prop="giveAmount">
                    <el-input v-model="form.giftAmount" type="number" :min="0" :placeholder="$t('pleaseEnter')">
                        <template #append>
                            <span>{{ $store.state.app.currencySymbol }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 总金额 -->
                <el-form-item :label="$t('walletRecharge.allAmount')" prop="allAmount">
                    <span>{{ allAmount }}</span>
                </el-form-item>
                <!-- 交易凭证 -->
                <el-form-item :label="$t('walletRecharge.transactionVoucher')" prop="transactionVoucher">
                    <el-input v-model="form.transactionVoucher" :placeholder="$t('pleaseEnter')"></el-input>
                </el-form-item>
                <!-- 上传凭证 -->
                <el-form-item :label="$t('walletRecharge.voucherPic')" prop="voucherPic">
                    <BmUpload @change="onChangeUpload($event)" :fileList="form.voucherPic" :multiple="true" :limit="8" />
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('walletRecharge.remark')" prop="remark">
                    <el-input v-model="form.remark" type="textarea" maxlength="255" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </div>
        <!-- 收支明细视窗区域 -->
        <div v-else>
            <!-- 收支差额区域 -->
            <div class="flex fs-20 tc">
                <!-- 应收/支金额 -->
                <div class="flex1 border mlr-10 p-15 round-4 bg-light-grey">
                    {{ $t("incomeExpenditureDetailsTable.receivableAmount") }}:
                    {{ amountSummary.receivableAmount }}
                </div>
                <!-- 差额 -->
                <div class="flex1 border mlr-10 p-15 round-4 bg-light-grey">
                    {{ $t("incomeExpenditureDetailsTable.differenceAmount") }}:
                    {{ amountSummary.differenceAmount }}
                </div>
                <!-- 实收/支金额 -->
                <div class="flex1 border mlr-10 p-15 round-4 bg-light-grey">
                    {{ $t("incomeExpenditureDetailsTable.realAmount") }}:
                    {{ amountSummary.realAmount }}
                </div>
            </div>
            <!-- 搜索条件区域 -->
            <div class="top-search-form">
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
                                    <el-option v-for="item in statusSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="elCollapse2" class="h-0 hidden" :gutter="24">
                        <el-col :md="12" :lg="6">
                            <!-- 单据类型 -->
                            <el-form-item :label="$t('incomeExpenditureDetailsTable.type')" prop="type">
                                <el-select v-model="searchForm.type" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="item in orderTypeSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :lg="6">
                            <!-- 平台 -->
                            <el-form-item :label="$t('incomeExpenditureDetailsTable.platformType')" prop="platformType">
                                <el-select v-model="searchForm.platformType" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="item in platformSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                        <BmCollapse el="#elCollapse2" :isShow="false" />
                    </div>
                </el-form>
            </div>
            <div class="bg-white round-4">
                <div class="flex mb-10" style="justify-content:flex-end">
                    <div class="flex">
                        <!-- 导出 -->
                        <el-button @click="handleExportExcel">
                            {{ $t("table.exportExcel") }}
                        </el-button>
                        <!-- 表格选项 
							<BmTableOption
							table="incomeExpenditureDetailsTable"
							:column="tableColumn"
							class="ml-10"
							/>-->
                    </div>
                </div>
                <BmTable ref="multipleTable" :data="tableData" :column="tableColumn">
                    <!-- 类型 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.status')" prop="type">
                        <template #default="scope">{{ scope.row.typeName }}</template>
                    </BmTableColumn>
                    <!-- 状态(0失败 1成功 2待支付 3已取消) -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.status')" prop="status">
                        <template #default="scope">{{ scope.row.statusName }}</template>
                    </BmTableColumn>
                    <!-- 会员信息(userName+buyerId) -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.memberInfo')" prop="memberInfo" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.userName }}</span>
                            <span>{{ scope.row.buyerId }}</span>
                        </template>
                    </BmTableColumn>
                    <!-- 交易单号 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.tradeNo')" prop="tradeNo">
                        <template #default="scope">{{ scope.row.tradeNo }}</template>
                    </BmTableColumn>
                    <!-- 商户单号 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.merchantNumber')" prop="merchantNumber">
                        <template #default="scope">
                            <span>{{ scope.row.merchantNumber }}</span>
                        </template>
                    </BmTableColumn>
                    <!-- 应收/支金额 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.receivableAmount') + $store.state.app.currencySymbol" prop="receivableAmount">
                        <template #default="scope">{{ scope.row.receivableAmount }}</template>
                    </BmTableColumn>
                    <!-- 差额 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.differenceAmount') + $store.state.app.currencySymbol" prop="differenceAmount">
                        <template #default="scope">{{ scope.row.differenceAmount }}</template>
                    </BmTableColumn>
                    <!-- 实收/支金额 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.realAmount') + $store.state.app.currencySymbol" prop="realAmount">
                        <template #default="scope">{{ scope.row.realAmount }}</template>
                    </BmTableColumn>
                    <!-- 交易凭证 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.voucherPictrue')" prop="voucherPictrue">
                        <template #default="scope">
                            <!-- <span v-if="scope.row.voucherPictrue">
                <el-button type="text" @click="imgVisible = true">{{
                  $t('incomeExpenditureDetails.viewCredentials')
                }}</el-button>
              </span> -->
                            <div v-if="scope.row.srcList.length !== 0">
                                <BmImage style="width: 60px; height: 60px" :src="scope.row.srcList[0]" :preview-src-list="scope.row.srcList" />
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 流水号 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.serialNo')" prop="serialNo">
                        <template #default="scope">
                            {{ scope.row.serialNo }}
                        </template>
                    </BmTableColumn>
                    <!-- 平台 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.platformType')" prop="platformType">
                        <template #default="scope">{{ scope.row.platformTypeName }}</template>
                    </BmTableColumn>
                    <!-- 支付方式(支付方式 0, "系统支付" 1, "余额支付" 2, "UniwalletPay支付" 3, "TINGG支付" 4, "brij 支付" 5, "货到付款签收支付" 6, "paySwitch 支付) -->
                    <BmTableColumn :label="$t('onlinePaymentTable.paymentType')" prop="payType" width="100px">
                        <template #default="scope">
                            <div v-if="scope.row.paymentType">
                                {{ $t(`orderQuery.payType[${scope.row.payType}]`) }} <span v-if="scope.row.platformPayTypeName">-{{ scope.row.platformPayTypeName }}</span>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 单据支付日期 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.invoicesPayTime')" prop="invoicesPayTime">
                        <template #default="scope">{{ scope.row.invoicesPayTime }}</template>
                    </BmTableColumn>
                    <!-- 单据生成日期 -->
                    <BmTableColumn :label="$t('incomeExpenditureDetailsTable.invoicesCreateTime')" prop="invoicesCreateTime">
                        <template #default="scope">{{ scope.row.invoicesCreateTime }}</template>
                    </BmTableColumn>
                </BmTable>
                <!-- 翻页区域 -->
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
                <div class="demo-image__preview" v-if="imgVisible">
                    <BmImage style="width: 200px; height: 200px" :src="tableData.value.srcList[0]" :preview-src-list="tableData.value.srcList" />
                </div>
            </div>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { rechargeWalletBalance, getIncomeAndExpensesList, incomeExpensesCollect } from "@/api/finance";
import { getAllUserInfo } from "@/api/finance";
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
        watch(
            () => props.row,
            (nVal) => {
                form.value = { ...props.row, voucherPic: [] };
                // 根据传过来的type类型，进行下一步操作
                if (form.value.type == "detail") {
                    // 根据id请求收支列表
                    searchForm.buyerId = form.value.buyerId;
                    getListPage(searchForm);
                } else {
                    if (!form.value.buyerId) {
                        memberInfoSelectVisible.value = true;
                        // 获取所有的会员id信息
                        // getAllUserInfo()
                        //     .then((res) => {
                        //         memberInfoObj.value = res.data.records;
                        //         memberInfoSelectVisible.value = true;
                        //     })
                        //     .catch(() => {});
                    }
                }
            }
        );
        const allAmount = computed(() => {
            // 隐式转换(字符串转数字)
            return form.value.amount - 0 + (form.value.giftAmount - 0) || 0;
        });
        const rules = {
            amount: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            giftAmount: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            transactionVoucher: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        // 所有的会员id和昵称信息对象
        let memberInfoObj = ref({});
        // 充值会员昵称和id select选择框显示隐藏变量
        let memberInfoSelectVisible = ref(false);
        // // 会员信息select框选择变化的监听事件
        // const memberInfoSelectChange = (info, num) => {
        //     getAllUserInfo({ userInfo: info }).then((res) => {
        //         if (num == 1) {
        //             form.value.buyerId = res.data.records[0].id;
        //         } else {
        //             form.value.userName = res.data.records[0].nickname;
        //         }
        //     });
        // };
        // 支付方式slelect数据
        const paymentMethodSelect = [
            {
                value: 1,
                label: proxy.$t("copingManagement.cash")
            },
            {
                value: 2,
                label: "MTN"
            }
        ];
        //上传图片
        const onChangeUpload = (fileList) => {
            form.value.voucherPic = fileList; //.map((item) => item.url);
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    // 退款网络请求
                    const voucherPic = form.value.voucherPic.map((item) => item.url).join(",");
                    const params = {
                        ...form.value,
                        voucherPic: voucherPic
                    };

                    rechargeWalletBalance(params)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false, form.value.type);
                            formRef.value.resetFields();
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            if (form.value.type == "detail") {
                searchFormRef.value.resetFields();
                emit("update:visible", false);
                return;
            }
            formRef.value.resetFields();
            emit("update:visible", false);
        };
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);
        // ------收支明细
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: 10,
            pageNum: pageNum,
            invoicesCreateTime: [], // 单据生成日期
            invoicesPayTime: [], // 单据支付日期
            tradeNo: null, // 交易单号
            status: null, // 状态
            type: null, // 单据类型
            platformType: null, // 平台
            buyerId: null // 会员信息(id)
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
            { value: 0, label: proxy.$t("incomeExpenditureDetails.fail") },
            { value: 1, label: proxy.$t("incomeExpenditureDetails.success") },
            { value: 2, label: proxy.$t("incomeExpenditureDetails.toBePaid") },
            { value: 3, label: proxy.$t("incomeExpenditureDetails.cancelled") }
        ];
        // 单据类型select选择数据
        const orderTypeSelectList = [
            { value: "", label: proxy.$t("status.all") },
            {
                value: 1,
                label: proxy.$t("incomeExpenditureDetails.walletRecharge")
            },
            {
                value: 2,
                label: proxy.$t("incomeExpenditureDetails.orderConsumption")
            },
            {
                value: 3,
                label: proxy.$t("incomeExpenditureDetails.orderRefund")
            }
        ];
        // 平台select选择数据
        const platformSelectList = [
            { value: "", label: proxy.$t("status.all") },
            {
                value: 1,
                label: proxy.$t("incomeExpenditureDetails.operatingPlatform")
            },
            { value: 2, label: proxy.$t("incomeExpenditureDetails.Android") },
            { value: 3, label: "ios" },
            { value: 4, label: "H5" },
            { value: 5, label: proxy.$t("incomeExpenditureDetails.webMall") }
        ];
        const multipleTable = ref(null);
        // 表单读取显示效果控制

        //表格选项的列
        const tableColumn = "";
        // [
        //   'type',
        //   'status',
        //   'memberInfo',
        //   'tradeNo',
        //   'memberInfo',
        //   'merchantNumber',
        //   'receivableAmount',
        //   'differenceAmount',
        //   'voucherPictrue',
        //   'serialNo',
        //   'platformType',
        //   'invoicesPayTime',
        //   'invoicesCreateTime',
        // ]
        // table数据对象
        let tableData = ref([]);
        // 控制凭证图片显示开关
        let imgVisible = ref(false);
        // 图片数据对象
        let srcList = ref({});
        // 金额汇总数据对象
        const amountSummary = ref({});
        // 数据读取
        const getListPage = (obj) => {
            // 运营-收入支出列表-金额汇总
            incomeExpensesCollect(obj).then((res) => {
                amountSummary.value = res.data;
            });
            // 运营-收入支出列表-分页查询
            getIncomeAndExpensesList(obj)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // // 单据类型(数字转文字 1钱包充值 2订单消费 3订单退款)
                        for (let i in dict.value.orderType) {
                            if (dict.value.orderType[i].value == item.type) {
                                item.typeName = dict.value.orderType[i].name;
                                break;
                            }
                        }
                        // 钱包充值状态(数字转文字 0失败 1成功 2待支付 3已取消)
                        for (let i in dict.value.rechargeStatus) {
                            if (dict.value.rechargeStatus[i].value == item.status) {
                                item.statusName = dict.value.rechargeStatus[i].name;
                                break;
                            }
                        }
                        // 充值平台(数字转文字 1:运营平台，2:安卓，3:iOS ，4::H5，5:web商城)
                        for (let i in dict.value.financePlatform) {
                            if (dict.value.financePlatform[i].value == item.platformType) {
                                item.platformTypeName = dict.value.financePlatform[i].name;
                                break;
                            }
                        }
                        if (item.voucherPictrue !== "") {
                            item.srcList = item.voucherPictrue.split(",");
                        } else {
                            item.srcList = [];
                        }
                        return item;
                    });
                })
                .catch(() => {});
        };
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            searchForm.buyerId = form.value.buyerId;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            searchForm.buyerId = form.value.buyerId;
            initData();
        };
        const initData = () => {
            getListPage(searchForm);
        };
        // 搜索
        const handleSearch = () => {
            searchForm.pageNum = pageNum.value;
            // 将DatePicker日期选择器中的时间转换为标准时间
            // 单据生成日期
            searchForm.invoicesCreateEndTime = proxy.utils.formatStandardDate(searchForm.invoicesCreateTime && searchForm.invoicesCreateTime[1], true);
            searchForm.invoicesCreateStartTime = proxy.utils.formatStandardDate(searchForm.invoicesCreateTime && searchForm.invoicesCreateTime[0], true);
            // 单据支付日期
            searchForm.invoicesPayEndTime = proxy.utils.formatStandardDate(searchForm.invoicesPayTime && searchForm.invoicesPayTime[1], true);
            searchForm.invoicesPayStartTime = proxy.utils.formatStandardDate(searchForm.invoicesPayTime && searchForm.invoicesPayTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            // 清空搜索时间
            searchForm.invoicesCreateEndTime = searchForm.invoicesCreateStartTime = searchForm.invoicesPayEndTime = searchForm.invoicesPayStartTime = "";
            searchFormRef.value.resetFields();
            // 加上查询的会员ID
            searchForm.buyerId = form.value.buyerId;
            initData();
        };
        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            onChangeUpload,
            paymentMethodSelect,
            allAmount,
            searchFormRef,
            searchForm,
            shortcuts,
            disabledDate,
            statusSelectList,
            orderTypeSelectList,
            platformSelectList,
            pageNum,
            pageSize,
            pageTotal,
            getListPage,

            multipleTable,
            tableColumn,
            tableData,
            handleCurrentChange,
            handleSizeChange,
            initData,
            handleSearch,
            imgVisible,
            srcList,
            resetForm,
            amountSummary,
            memberInfoObj,
            memberInfoSelectVisible,
            // memberInfoSelectChange,
            getAllUserInfo
        };
    }
};
</script>
