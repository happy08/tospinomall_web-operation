<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 平台-->
                    <el-form-item :label="$t('singlePageInfoTable.platform')" prop="platform">
                        <el-select v-model="searchForm.platform" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.singalPageInfoPlatform" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态-->
                    <el-form-item :label="$t('singlePageInfoTable.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.forbiddenEnable" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 单页名称-->
                    <el-form-item :label="$t('singlePageInfoTable.name')" prop="name">
                        <el-input v-model="searchForm.name" :placeholder="$t('pleaseEnter')"></el-input>
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
                <!-- <BmCollapse el="#elCollapse" :isShow="false" /> -->
            </div>
        </el-form>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex mb-10" style="justify-content:flex-end">
            <!-- <div> -->
            <!-- 新增 -->
            <!-- <el-button type="primary" @click="handleAddEdit('add')">
                    +{{ $t('status.add') }}
                </el-button> -->
            <!-- 批量操作 -->
            <!-- <span class="mr-20">{{ $t("status.batchOperation") }}:</span> -->
            <!-- 删除 -->
            <!-- <el-button @click="handleAddEdit('del')">
                    {{ $t("status.delete") }}
                </el-button>
            </div> -->
            <div>
                <!-- 导出 -->
                <el-button v-permission="'contentManage_singlePageInfo_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="singlePageInfoTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :column="tableColumn" @row-click="handleRowClick">
            <BmTableColumn type="selection"></BmTableColumn>
            <!-- 平台 -->
            <BmTableColumn :label="$t('singlePageInfoTable.platform')" prop="platform">
                <template #default="scope">{{ scope.row.platformName }}</template>
            </BmTableColumn>
            <!-- 单页名称 -->
            <BmTableColumn :label="$t('singlePageInfoTable.name')" prop="name">
                <template #default="scope">{{ scope.row.name }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('singlePageInfoTable.status')" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 打开方式 -->
            <BmTableColumn :label="$t('singlePageInfoTable.openMode')" prop="openMode">
                <template #default="scope">{{ scope.row.openModeName }}</template>
            </BmTableColumn>
            <!-- 系统内置 -->
            <BmTableColumn :label="$t('singlePageInfoTable.systemBuilt')" prop="systemBuilt">
                <template #default="scope">{{ scope.row.systemBuiltName }}</template>
            </BmTableColumn>
            <!-- 导航链接 -->
            <BmTableColumn :label="$t('singlePageInfoTable.navLinks')" prop="navLinks">
                <template #default="scope">
                    <span>{{ scope.row.navLinks }}</span>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('singlePageInfoTable.remarks')" prop="remarks">
                <template #default="scope">{{ scope.row.remarks }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button v-permission="'contentManage_singlePageInfo_edit'" type="text" @click.stop="handleAddEdit('edit', scope.row)">{{ $t("status.edit") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"></BmPagination>
        <!-- 查看详情弹窗 -->
        <AddEdit v-if="editVisible" v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { singlePageInfoExport, singlePageInfo, delSinglePageInfo } from "@/api/operation";
import AddEdit from "./component/addEdit.vue";
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

        //分页
        let pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageNum: 1,
            pageSize: 10
        });
        //搜索
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.createStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.createStartTime = searchForm.createEndTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["platform", "name", "status", "openMode", "systemBuilt", "navLinks", "remarks"];
        //获取列表
        const getListPage = () => {
            singlePageInfo(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 平台(数字转文字 1:商城移动端 2:商城PC端 3卖家PC)
                        for (let i in dict.value.singalPageInfoPlatform) {
                            if (dict.value.singalPageInfoPlatform[i].value == item.platform) {
                                item.platformName = dict.value.singalPageInfoPlatform[i].name;
                                break;
                            }
                        }
                        // 状态(数字转文字 0禁用 1启用)
                        for (let i in dict.value.forbiddenEnable) {
                            if (dict.value.forbiddenEnable[i].value == item.status) {
                                item.statusName = dict.value.forbiddenEnable[i].name;
                                break;
                            }
                        }
                        // 窗口打开方式(数字转文字 1:新窗口)
                        for (let i in dict.value.singalPageInfoOpenMode) {
                            if (dict.value.singalPageInfoOpenMode[i].value == item.openMode) {
                                item.openModeName = dict.value.singalPageInfoOpenMode[i].name;
                                break;
                            }
                        }
                        // 系统是否内置(数字转文字 1是 0否)
                        for (let i in dict.value.yesNo) {
                            if (dict.value.yesNo[i].value == item.systemBuilt) {
                                item.systemBuiltName = dict.value.yesNo[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                })
                .catch((err) => {});
        };
        // 查看详情
        let editVisible = ref(false);
        let editRow = ref({});
        // 选中的行
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
        // 编辑/删除
        const handleAddEdit = (operate, row) => {
            // 判断操作类型
            if (operate == "edit") {
                // 编辑
                editRow.value = row;
                editRow.value.operate = operate;
                editVisible.value = true;
            } else if (operate == "add") {
                // 新增
                editRow.value = {
                    operate: operate
                };
                editVisible.value = true;
            } else {
                // 删除
                let ids = [];
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                tableSelectionRows.map((item) => {
                    ids.push(item.id);
                });
                ids = ids.join(",");
                delSinglePageInfo(ids)
                    .then(() => {})
                    .catch(() => {});
                initData();
            }
        };
        // 导出excel表格
        const handleExportExcel = (val) => {
            singlePageInfoExport(searchForm)
                .then((res) => {
                    exportExcel("SinglePage", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
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
            handleExportExcel,
            handleAddEdit,
            handleRowClick,
            handleSelectionChange,
            editVisible,
            editRow
        };
    }
};
</script>
