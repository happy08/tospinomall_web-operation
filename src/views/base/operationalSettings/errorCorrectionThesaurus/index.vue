<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert
            :title="$t('filterWords.filterWordsTips')"
            icon="warning"
            class="mb-20"
        /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form mt-10">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 添加时间-->
                    <el-form-item :label="$t('filterWordsTable.createTime')" prop="createTime">
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
                    <!-- 更新时间-->
                    <el-form-item :label="$t('filterWordsTable.updateTime')" prop="updateTime">
                        <el-date-picker
                            v-model="searchForm.updateTime"
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
                    <!-- 状态-->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status">
                            <el-option v-for="item in statusSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 敏感词 -->
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('filterWords.name')" prop="name">
                        <el-input v-model="searchForm.name" :placeholder="$t('pleaseEnter')"> </el-input>
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
                <!-- 新增 -->
                <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_add'" type="primary" @click="handleAddEdit('add')">+{{ $t("status.add") }}</el-button>
                <!-- 功能操作 -->
                <span class="mlr-30">{{ $t("status.functionalOperation") }}:</span>
                <!-- 批量删除 -->
                <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_del'" @click="handleAddEdit('allDelete')">{{ $t("filterWords.batchDeletion") }}</el-button>
                <!-- 批量禁用 -->
                <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_disable'" @click="handleAddEdit('allDisable')">{{ $t("filterWords.batchDisable") }}</el-button>
                <!-- 批量启用 -->
                <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_enable'" @click="handleAddEdit('allEnable')">{{ $t("filterWords.batchEnable") }}</el-button>
            </div>
            <div class="flex">
                <!-- 导出 -->
                <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="errorWordsTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <BmTableColumn type="selection"> </BmTableColumn>
            <!-- 过滤词名称 -->
            <BmTableColumn :label="$t('errorWordsTable.name')" prop="name">
                <template #default="scope">{{ scope.row.name }}</template>
            </BmTableColumn>
            <!-- 替换内容 -->
            <BmTableColumn :label="$t('errorWordsTable.replaceName')" prop="replaceName">
                <template #default="scope">{{ scope.row.replaceName }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('errorWordsTable.status')" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 添加时间 -->
            <BmTableColumn :label="$t('errorWordsTable.createTime')" prop="createTime">
                <template #default="scope">
                    {{ scope.row.createTime }}
                </template>
            </BmTableColumn>
            <!-- 更新时间 -->
            <BmTableColumn :label="$t('errorWordsTable.updateTime')" prop="updateTime">
                <template #default="scope">
                    {{ scope.row.updateTime }}
                </template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" align="center">
                <template #default="scope">
                    <!--启用-->
                    <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_enable'" v-if="scope.row.status == 1" @click.stop="handleAddEdit('enable', scope.row)" type="text">{{
                        $t("status.enable")
                    }}</el-button>
                    <!--禁用-->
                    <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_disable'" v-if="scope.row.status == 0" @click.stop="handleAddEdit('disable', scope.row)" type="text">{{
                        $t("status.forbidden")
                    }}</el-button>
                    <!-- 编辑 -->
                    <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">{{ $t("status.edit") }}</el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'operationalSettings_errorCorrectionThesaurus_del'" @click.stop="handleAddEdit('delete', scope.row)" type="text">{{ $t("status.delete") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
        <!-- 订单操作弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import { errorCorrectionThesaurus, enableAllErrorCorrectionThesaurus, deleteAllErrorCorrectionThesaurus } from "@/api/base";
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
            status: null, // 状态 0启用,1禁用,
            createTime: [],
            updateTime: [],
            name: null // 敏感词
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 日期类型select选择数据
        const statusSelectList = [
            { value: "", label: proxy.$t("status.all") },
            { value: 0, label: proxy.$t("status.enable") },
            { value: 1, label: proxy.$t("status.forbidden") }
        ];

        //搜索
        const handleSearch = () => {
            searchForm.pageNum = pageNum.value;
            // 将DatePicker日期选择器中的时间转换为标准时间
            // 添加时间
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            // 更新时间
            searchForm.updateEndTime = proxy.utils.formatStandardDate(searchForm.updateTime && searchForm.updateTime[1], true);
            searchForm.updateStartTime = proxy.utils.formatStandardDate(searchForm.updateTime && searchForm.updateTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.endTime = searchForm.startTime = searchForm.updateEndTime = searchForm.updateStartTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);
        //表格选项的列
        const tableColumn = ["name", "replaceName", "status", "createTime", "updateTime"];
        // 选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
            console.log(tableSelectionRows);
        };
        // 点击单行-选择
        const handleRowClick = (row) => {
            multipleTable.value.toggleRowSelection(row);
        };
        //双击行编辑
        const handleRowdblClick = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };
        //获取列表
        const getListPage = () => {
            searchForm.pageNum = pageNum.value;
            errorCorrectionThesaurus(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 状态(数字转文字 1 启用 2 禁用)
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value == item.status) {
                                item.statusName = dict.value.forbiddenEnableReverse[i].name;
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
        // 查看
        let editVisible = ref(false);
        let editRow = ref({});
        // 操作(启用、禁用、编辑、删除)
        const handleAddEdit = (type, row) => {
            // 判断操作类型
            let ids = [];
            let names = [];
            let replaceNames = [];
            // 禁用
            if (type == "allDisable" || type == "disable") {
                switch (type) {
                    case "allDisable": // 批量禁用
                        tableSelectionRows.map((item) => {
                            ids.push(item.id);
                            names.push(item.name);
                            replaceNames.push(item.replaceName);
                        });
                        ids = ids.join(",");
                        names = names.join(",");
                        replaceNames = replaceNames.join(",");
                        break;
                    default:
                        // 单个禁用
                        ids = row.id;
                        names = row.name;
                        replaceNames = row.replaceName;
                }
                enableAllErrorCorrectionThesaurus({
                    ids: ids,
                    names,
                    replaceNames,
                    status: 1
                })
                    .then((res) => {
                        initData();
                    })
                    .catch(() => {});
            } else if (type == "allEnable" || type == "enable") {
                // 启用
                switch (type) {
                    case "allEnable": // 批量启用
                        tableSelectionRows.map((item) => {
                            ids.push(item.id);
                            names.push(item.name);
                            replaceNames.push(item.replaceName);
                        });
                        ids = ids.join(",");
                        names = names.join(",");
                        replaceNames = replaceNames.join(",");
                        break;
                    default:
                        // 单个启用
                        ids = row.id;
                        names = row.name;
                        replaceNames = row.replaceName;
                }
                enableAllErrorCorrectionThesaurus({
                    ids: ids,
                    names,
                    replaceNames,
                    status: 0
                })
                    .then((res) => {
                        initData();
                    })
                    .catch(() => {});
            } else if (type == "allDelete" || type == "delete") {
                // 删除
                switch (type) {
                    case "allDelete": // 批量删除
                        tableSelectionRows.map((item) => {
                            ids.push(item.id);
                            names.push(item.name);
                            replaceNames.push(item.replaceName);
                        });
                        ids = ids.join(",");
                        names = names.join(",");
                        replaceNames = replaceNames.join(",");
                        break;
                    default:
                        // 单个删除
                        ids = row.id;
                        names = row.name;
                        replaceNames = row.replaceName;
                }
                deleteAllErrorCorrectionThesaurus({
                    ids,
                    names
                })
                    .then((res) => {
                        initData();
                    })
                    .catch(() => {});
            } else if (type == "add") {
                editRow.value = {
                    type: type
                };
                editVisible.value = true;
            } else {
                // 编辑
                editRow.value = row;
                editVisible.value = true;
            }
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
            statusSelectList,
            shortcuts,
            disabledDate,
            handleAddEdit,
            handleRowClick,
            handleRowdblClick,
            tableSelectionRows,
            handleSelectionChange
        };
    }
};
</script>
