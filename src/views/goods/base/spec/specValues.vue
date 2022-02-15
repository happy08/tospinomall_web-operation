<template>
    <!-- 属性值 -->
    <BmDialog v-model:visible="visible" :title="$t('specValues.title') + ' - ' + row.cnSpecName || row.enSpecName" :before-close="beforeClose" :showFooter="false" width="80%">
        <div class="top-search-form ptb-0">
            <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" />

            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 名称 -->
                        <el-form-item :label="$t('specValuesTable.cnName')" prop="cnName">
                            <el-input v-model="searchForm.cnName" :placeholder="$t('pleaseEnter')" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- 状态 -->
                        <el-form-item :label="$t('specValuesTable.status')" prop="status">
                            <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                                <el-option v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="table-search-btns">
                    <!-- 查询 -->
                    <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                    <!-- 重置 -->
                    <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                </div>
            </el-form>
        </div>

        <div class="p-25 bg-white round-4">
            <div class="flex between mb-10">
                <div>
                    <div class="fl mb-10">
                        <!-- 新增 -->
                        <el-button @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                            {{ $t("status.add") }}
                        </el-button>
                        <!-- 编辑 -->
                        <el-button @click="handleAddEdit('edit')" class="mr-15">
                            {{ $t("status.edit") }}
                        </el-button>
                    </div>
                    <div class="fl mb-10">
                        <!-- 批量操作 -->
                        <span>{{ $t("status.batchOperation") }}：</span>

                        <!-- 启用 -->
                        <el-button @click="handleOpenShield(0)">{{ $t("status.enable") }}</el-button>
                        <!-- 禁用 -->
                        <el-button @click="handleOpenShield(1)">{{ $t("status.forbidden") }}</el-button>
                        <!-- 删除 -->
                        <el-button @click="handleDelete">{{ $t("status.delete") }}</el-button>
                    </div>
                </div>

                <div class="flex vstart">
                    <!-- 导出 -->
                    <el-button @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
                </div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick">
                <BmTableColumn type="selection"></BmTableColumn>
                <BmTableColumn v-if="row.isPicture == 0" prop="picture" :label="$t('specValuesTable.picture')" width="75">
                    <template #default="scope">
                        <BmImage :src="scope.row.picture" style="width:50px; height:50px" />
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="cnName" :label="$t('specValuesTable.cnName')"></BmTableColumn>
                <BmTableColumn prop="fbmFoodsNum" :label="$t('specValuesTable.fbmFoodsNum')"> </BmTableColumn>
                <BmTableColumn prop="fbtFoodsNum" :label="$t('specValuesTable.fbtFoodsNum')"> </BmTableColumn>
                <BmTableColumn prop="useCount" :label="$t('specValuesTable.useCount')"> </BmTableColumn>
                <BmTableColumn prop="status" :label="$t('specValuesTable.status')">
                    <template #default="scope">
                        {{ scope.row.statusName }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="remarks" :label="$t('specValuesTable.remarks')"> </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
        </div>

        <!-- 新增 -->
        <AddEditSpecValues v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { specsValueModelListPage, specsValueModelRemoveByIds, specsValueModelUpdateEnableDisableByIds, specsValueModelExport } from "@/api/goods";
import AddEditSpecValues from "./component/addEditSpecValues";
import { exportExcel } from "@/utils/";

export default {
    name: "GoodsSpecValue",
    components: { AddEditSpecValues },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],

    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            keyword: "", //名称
            status: "", //状态（0启用 1禁用）
            pageNum: pageNum,
            pageSize: pageSize
        });

        watch(
            () => props.row.id,
            (nVal) => {
                console.log("props.row", props.row);
                searchForm.specId = nVal;
                initData();
            }
        );

        //搜索
        const handelSearch = () => {
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //获取列表
        const getListPage = () => {
            specsValueModelListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value === item.status) {
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

        //双击行编辑
        const handleRowdblClick = (row) => {
            editRow.value = { ...row, isPicture: props.row.isPicture };
            editVisible.value = true;
        };

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type) => {
            if (type === "add") {
                editRow.value = { specId: props.row.id, isPicture: props.row.isPicture };
            } else if (type === "edit") {
                if (tableSelectionRows.length !== 1) {
                    proxy.$message.error(proxy.$t("table.selectOnlyOne"));
                    return;
                }
                editRow.value = { ...tableSelectionRows[0], isPicture: props.row.isPicture };
            }
            editVisible.value = true;
        };

        //删除
        const handleDelete = () => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            const ids = tableSelectionRows.map((item) => item.id).join("_");
            specsValueModelRemoveByIds(ids)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
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
            specsValueModelUpdateEnableDisableByIds(params)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        //属性值
        let specValuesVisible = ref(false);
        let specValuesRow = ref({});
        const handleSpecValues = (row) => {
            specValuesRow.value = row;
            specValuesVisible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            specsValueModelExport(searchForm)
                .then((res) => {
                    exportExcel("PropertyValueManager", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
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

        const beforeClose = () => {
            emit("reloadData");
            emit("update:visible", false);
        };

        return {
            dict,
            initData,
            pageNum,
            pageSize,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableData,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete,
            handleOpenShield,
            specValuesVisible,
            specValuesRow,
            handleSpecValues,
            handleSizeChange,
            handleExportExcel,
            handleCurrentChange,
            beforeClose
        };
    }
};
</script>

<style lang="scss">
.custom {
    .el-dialog__body {
        padding: 0;
    }
}
</style>
