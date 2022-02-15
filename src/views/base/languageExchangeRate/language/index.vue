<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <!-- 货币兑换区域 -->
        <BmAlert v-if="currencyChangeWarn" :title="$t('language.tips')" />
        <el-form ref="formRef" :inline="true" :model="currencyExchangeForm" :rules="rules">
            <el-form-item :label="$t('language.currencyExchange') + ':'" prop="num">
                <el-input v-model="currencyExchangeForm.num"></el-input>
            </el-form-item>
            <!-- 转换的货币下拉列表 -->
            <el-form-item>
                <el-select v-model="params.siteCurrency" disabled :placeholder="$t('language.dollar')" @change="currencyTypeJudge" clearable>
                    <el-option v-for="item in currencyInitData" :key="item.id" :label="item.name + item.shortName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- 要转换为的货币下拉列表 -->
            <el-form-item>
                <template #label>
                    <i class="el-icon-sort" style="transform: rotate(90deg);"></i>
                </template>
                <el-select v-model="params.otherCurrency" :placeholder="$t('language.RMB')" @change="currencyTypeJudge" clearable>
                    <el-option v-for="item in currencyInitData" :key="item.id" :label="item.name + item.shortName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <!-- 货币兑换按钮 -->
                <el-button type="primary" @click="currencyExchangeHandle">
                    {{ $t("language.change") }}
                </el-button>
            </el-form-item>
            <el-form-item class="fs-20">
                <span> {{ currencyChangeShow1 }} </span>
                <span class="ml-20"> {{ currencyChangeShow2 }} </span>
            </el-form-item>
        </el-form>
        <!-- 货币查询条件区域 -->
        <div class="currencyQuery">
            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form" :rules="searchFormRules">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 更新时间 -->
                        <el-form-item :label="$t('language.updateTime')" prop="_tmpTimeValue">
                            <el-date-picker
                                v-model="searchForm._tmpTimeValue"
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
                        <!-- 货币名称 -->
                        <el-form-item :label="$t('language.name') + '/' + $t('language.country')" prop="currencyName">
                            <el-input v-model="searchForm.currencyName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- 是否启用 -->
                        <el-form-item :label="$t('language.enableOrNot')" prop="status">
                            <el-select v-model="searchForm.status" :placeholder="$t('yes')" clearable>
                                <el-option v-for="item in currencyStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="table-search-btns">
                    <!-- 查询 -->
                    <el-button @click="handelSearch" type="primary">
                        {{ $t("search") }}
                    </el-button>
                    <!-- 重置 -->
                    <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                    <!-- 展开
          <BmCollapse el="#elCollapse" :isShow="false" />-->
                </div>
            </el-form>
        </div>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10">
                    <!-- 功能操作 -->
                    <span>{{ $t("status.functionalOperation") }}：</span>

                    <!-- 启用 -->
                    <el-button v-permission="'languageExchangeRate_language_enable'" @click="handleOpenShield(0)">
                        {{ $t("status.enable") }}
                    </el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'languageExchangeRate_language_disable'" @click="handleOpenShield(1)">
                        {{ $t("status.forbidden") }}
                    </el-button>
                    <!-- 编辑 -->
                    <el-button v-permission="'languageExchangeRate_language_edit'" @click="handleEdit">{{ $t("status.edit") }}</el-button>
                </div>
            </div>
            <div class="flex vstart">
                <!-- 表格选项 -->
                <BmTableOption table="languageTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" :column="tableColumn">
            <BmTableColumn type="selection"></BmTableColumn>
            <!-- 地区编码 -->
            <BmTableColumn prop="code" :label="$t('languageTable.code')"></BmTableColumn>
            <!-- 货币名称 -->
            <BmTableColumn prop="name" :label="$t('languageTable.name')"></BmTableColumn>
            <!-- 简写 -->
            <BmTableColumn prop="shortName" :label="$t('languageTable.shortName')"></BmTableColumn>
            <!-- 国际货币符号 -->
            <BmTableColumn prop="currency" :label="$t('languageTable.currency')"></BmTableColumn>
            <!-- 小数位 -->
            <BmTableColumn prop="decimalPlace" :label="$t('languageTable.decimalPlace')" width="145"></BmTableColumn>
            <!-- 汇率(用户自行填写)-->
            <BmTableColumn prop="rate" :label="$t('languageTable.rate')"></BmTableColumn>
            <!-- 汇率兑换公式 -->
            <BmTableColumn prop="exchangeRate" :label="$t('languageTable.exchangeRate')"></BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn prop="status" :label="$t('languageTable.status')">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 站点货币 -->
            <BmTableColumn prop="isSiteCurrency" :label="$t('languageTable.isSiteCurrency')">
                <template #default="scope">{{ scope.row.isSiteCurrencyName }}</template>
            </BmTableColumn>
            <!-- 最后修改日期 -->
            <BmTableColumn prop="updateTime" :label="$t('languageTable.updateTime')">
                <template #default="scope">
                    <span class="block">{{ scope.row.updateUser }}</span>
                    {{ scope.row.updateTimeFormat }}
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remark" :label="$t('languageTable.remark')"></BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"></BmPagination>
    </div>

    <!-- 新增编辑 -->
    <BmDialog :title="$t('status.edit')" v-model:visible="dialogVisible" :row="editRow" :confirm="confirm" :cancel="cancel" width="20vw">
        <el-form :model="currencyRateForm" ref="currencyRateFormRef" :rules="currencyRateFormRules" :label-position="left">
            <div class="ml-8 mb-20">
                <span class="fs-18">{{ $t("language.rateSet") }}</span>
                <span class="light-grey">{{ $t("language.tips3") }}</span>
            </div>
            <el-form-item :label="$t('language.name')">
                <span>: {{ currencyName }}</span>
            </el-form-item>
            <el-form-item :label="$t('language.rate')" prop="currencyRate" label-width="50px">
                <el-input v-model="currencyRateForm.currencyRate" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('remark')">
                <span>: {{ remark }}</span>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { rateFind, currencyExchange, exchangecurrencyRate, batchStart } from "@/api/base";

export default {
    name: "language",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        //要转换的货币列表 [{'name':['m','r'],v:7},{'r,m':0.5},]
        const currencyList = computed(() => [
            {
                name: proxy.$t("language.dollar"),
                value: 0
            }
        ]);
        //被转换的货币列表
        const toCurrencyList = computed(() => [
            {
                name: proxy.$t("language.RMB"),
                value: 0
            },
            {
                name: proxy.$t("language.dollar"),
                value: 1
            }
        ]);
        //分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            codeOrName: "", //名称
            currencyName: "", // 货币名称(国家)
            status: "",
            _tmpTimeValue: [], // 更新时间
            pageNo: 1,
            pageSize: 10
        });
        //搜索
        // 汇率查询请求参数
        const exchangeRateParams = reactive({});
        const handelSearch = () => {
            exchangeRateParams.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1], true);
            exchangeRateParams.name = searchForm.currencyName;
            exchangeRateParams.startTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0], true);
            exchangeRateParams.status = searchForm.status;
            getListPage(exchangeRateParams);
        };
        //重置
        const resetForm = () => {
            exchangeRateParams.endTime = exchangeRateParams.startTime = "";
            exchangeRateParams.status = "";
            exchangeRateParams.name = "";
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["code", "name", "shortName", "currency", "decimalPlace", "rate", "exchangeRate", "status", "isSiteCurrency", "updateTime", "remark"];
        // 用户汇率填写表单验证规则
        const currencyRateFormRules = {
            currencyRate: [{ required: true, message: proxy.$t("required"), trigger: "blur" }]
        };
        //获取列表
        const getListPage = () => {
            exchangeRateParams.pageNo = searchForm.pageNo;
            exchangeRateParams.pageSize = searchForm.pageSize;
            rateFind(exchangeRateParams)
                .then((res) => {
                    // 是否站点货币(把数字转换为字符)
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.yesNo) {
                            if (dict.value.yesNo[i].value === item.isSiteCurrency) {
                                item.isSiteCurrencyName = dict.value.yesNo[i].name;
                                // 获取站点货币相关信息并进行初始赋值
                                if (item.isSiteCurrency == 1) {
                                    currencyChangeShow1.value = 1 + item.shortName + "=" + 1 + item.shortName;
                                    params.siteCurrency = item.id;
                                    params.otherCurrency = item.id;
                                }
                                break;
                            }
                        }
                        // for (let i in dict.value.haveNone) {
                        //     if (dict.value.haveNone[i].value === item.isUnit) {
                        //         item.isUnitName = dict.value.haveNone[i].name;
                        //         break;
                        //     }
                        // }
                        //  是否启用(把数字转换为字符)
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value === item.status) {
                                item.statusName = dict.value.forbiddenEnableReverse[i].name;
                                break;
                            }
                        }
                        // for (let i in dict.value.goodsModeList) {
                        //     if (dict.value.goodsModeList[i].value === item.mode) {
                        //         item.modeName = dict.value.goodsModeList[i].name;
                        //         break;
                        //     }
                        // }
                        // 格式化日期格式
                        item.updateTimeFormat = proxy.utils.formatStandardDate(item.updateTime, true);
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

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            if (index > -1) {
                tableSelectionRows.push(row);
            } else {
                tableSelectionRows.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
        };

        //开启-屏蔽
        const handleOpenShield = (status) => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            const ids = tableSelectionRows.map((item) => item.id);
            const params = {
                ids: ids,
                status: status
            };
            console.log(params);
            batchStart(params)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
            getListPage();
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

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
        // 货币兑换表单
        const currencyExchangeForm = reactive({
            //转换的货币种类
            changeCurrency: "",
            // 要转换为的货币种类
            toChangeCurrency: "人民币RMB",
            // 转换后的货币值1
            changedNum1: 7.0115,
            // 转换后的货币值2cu
            changedNum2: 0.1426,
            num: 1
        });
        // 货币查询条件表单
        const currencyQueryForm = reactive({
            // 结束时间
            endTime: "",
            // 货币名称
            name: "",
            // 开始时间
            startTime: "",
            // 是否启用(状态)
            status: "是"
        });
        // 货币转换表单验证规则
        const rules = {
            num: [{ required: true, message: proxy.$t("required"), trigger: "blur" }]
        };
        // 初始默认数据列表
        let currencyInitData = ref([]);
        // 获取初始默认数据
        const getInitData = () => {
            rateFind()
                .then((res) => {
                    currencyInitData.value = res.data.records;
                    currencyInitData.value.some((item) => {
                        if (item.isSiteCurrency) {
                            currencyExchangeForm.changeCurrency = item.name + item.shortName;
                            return;
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            // 将默认站点货币赋值给要转换的货币
        };
        // 调用方法，得到初始数据
        getInitData();
        // 货币兑换查询参数
        const params = reactive({
            num: 1,
            otherCurrency: 3
        });
        // 控制货币选择提示信息对话框的显示与隐藏
        let currencyChangeWarn = ref(false);
        // 判断转换货币与被转换货币是否相同，如果相同，提示错误
        const currencyTypeJudge = () => {
            if (params.otherCurrency === params.siteCurrency) {
                currencyChangeWarn.value = true;
            } else {
                currencyChangeWarn.value = false;
            }
        };
        // 转换货币数量
        let currentNum = ref(1);
        let formRef = ref(1);
        // 货币转换显示值1
        let currencyChangeShow1 = ref("");
        // 货币转换显示值2
        let currencyChangeShow2 = ref("");
        // 点击按钮，进行货币兑换
        const currencyExchangeHandle = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    params.num = currencyExchangeForm.num;
                    currentNum.value = params.num;
                    currencyExchange(params)
                        .then((res) => {
                            // 改变转换按钮后的货币显示种类
                            // 利用对应的id从res取值
                            // currencyExchangeForm.changedNum2 = res.data[params.siteCurrency].toFixed(2);
                            // currencyExchangeForm.changedNum1 = res.data[params.otherCurrency].toFixed(2);
                            currencyChangeShow1.value = res.data.value1;
                            currencyChangeShow2.value = res.data.value2;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    // 改变货币转换网页显示值
                    currencyInitData.value.forEach((item) => {
                        if (item.id === params.siteCurrency) {
                            currencyExchangeForm.changeCurrency = item.name + item.shortName;
                            return;
                        }
                        if (item.id === params.otherCurrency) {
                            currencyExchangeForm.toChangeCurrency = item.name + item.shortName;
                            return;
                        }
                    });
                } else {
                    return false;
                }
            });
        };
        // 货币查询条件选择(货币名称，国家)
        const currencyNameCountry = ref([
            {
                label: "货币名称",
                value: 1
            },
            {
                label: "国家",
                value: 2
            }
        ]);
        // 货币查询条件选择(状态)
        const currencyStatusList = ref([
            {
                label: "是",
                value: 0
            },
            {
                label: "否",
                value: 1
            }
        ]);
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 用户自行设置的汇率
        let currencyRateForm = reactive({
            currencyRate: ""
        });
        // 控制汇率设置对话框的显示与隐藏
        let dialogVisible = ref(false);
        let currencyName = ref("");
        let remark = ref("");
        // 点击按钮，编辑用户汇率
        const handleEdit = (row) => {
            // 站点货币不可编辑
            // 判断选择项中是否有站点货币
            if (tableSelectionRows[0].isSiteCurrency) {
                proxy.$message.warning(proxy.$t("language.tips2"));
                return;
            }
            // 首先判断用户选择条数，>1则return
            if (tableSelectionRows.length !== 1) {
                proxy.$message.error(proxy.$t("table.selectOnlyOne"));
                return;
            }
            currencyRateForm.currencyRate = tableSelectionRows[0].rate;
            currencyName.value = tableSelectionRows[0].name;
            remark.value = tableSelectionRows[0].remark;
            dialogVisible.value = true;
        };
        // 点击按钮，编辑汇率
        const confirm = async () => {
            dialogVisible.value = true;
            // 将用户填写汇率赋值给当前选中行rate
            tableSelectionRows[0].rate = currencyRateForm.currencyRate;
            // 发起修改汇率网络请求
            delete tableSelectionRows[0].createTime;
            delete tableSelectionRows[0].updateTime;
            exchangecurrencyRate(tableSelectionRows[0])
                .then((res) => {
                    getListPage();
                    // 重现调用货币兑换接口，更新信息
                    currencyExchangeHandle();
                    dialogVisible.value = false;
                })
                .catch((err) => {});
            // 关闭汇率设置对话框
            dialogVisible.value = false;
        };
        // 用户设置汇率对话框取消事件
        const cancel = () => {
            dialogVisible.value = false;
        };
        return {
            dict,
            initData,
            pageNo,
            pageSize,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            handleOpenShield,
            detailVisible,
            detailRow,
            handleDetail,
            handleSizeChange,
            handleCurrentChange,
            currencyExchangeForm,
            currencyQueryForm,
            formRef,
            currencyExchangeHandle,
            getInitData,
            currencyInitData,
            params,
            currencyTypeJudge,
            currencyChangeWarn,
            currencyNameCountry,
            currencyStatusList,
            shortcuts,
            exchangeRateParams,
            handleEdit,
            currentNum,
            confirm,
            cancel,
            dialogVisible,
            rules,
            currencyRateForm,
            currencyRateFormRules,
            disabledDate,
            currencyName,
            remark,
            currencyChangeShow1,
            currencyChangeShow2
        };
    }
};
</script>
