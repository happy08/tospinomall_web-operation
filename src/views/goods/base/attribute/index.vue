<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 参数名称 -->
                    <el-form-item :label="$t('attributeTable.title')" prop="title">
                        <el-input v-model="searchForm.title" :placeholder="$t('attributeTable.title')" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('attributeTable.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开
                <BmCollapse el="#elCollapse" :isShow="false" />  -->
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button v-permission="'base_attribute_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                    <!-- 编辑 -->
                    <el-button v-permission="'base_attribute_edit'" @click="handleAddEdit('edit')" class="mr-15">
                        {{ $t("status.edit") }}
                    </el-button>
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作 -->
                    <span>{{ $t("status.batchOperation") }}：</span>

                    <!-- 启用 -->
                    <el-button v-permission="'base_attribute_enable'" @click="handleOpenShield(1)">{{ $t("status.enable") }}</el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'base_attribute_disable'" @click="handleOpenShield(0)">{{ $t("status.forbidden") }}</el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'base_attribute_del'" @click="handleDelete">{{ $t("status.delete") }}</el-button>
                </div>
            </div>
            <div class="flex vstart">
                <!-- 表格选项 -->
                <BmTableOption table="attributeTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="title" :label="$t('attributeTable.title')"> </BmTableColumn>
            <BmTableColumn prop="mode" :label="$t('attributeTable.mode')" :width="180">
                <template #default="scope">
                    <el-select v-model="scope.row.mode" @change="changeGoodsMode(scope.row)" :placeholder="$t('pleaseSelect')">
                        <el-option v-for="(item, index) in dict.goodsModeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="limitLenght" :label="$t('attributeTable.limitLenght')"> </BmTableColumn>
            <BmTableColumn prop="isUnit" :label="$t('attributeTable.isUnit')">
                <template #default="scope">
                    {{ scope.row.isUnitName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="isRequired" :label="$t('attributeTable.isRequired')" width="145"
                ><template #default="scope">
                    {{ scope.row.isRequiredName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('attributeTable.status')">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="categoryNum" :label="$t('attributeTable.categoryNum')"></BmTableColumn>
            <BmTableColumn prop="paramValue" :label="$t('attributeTable.paramValue')"> </BmTableColumn>
            <!-- <BmTableColumn prop="categoryNum" :label="$t('table.operation')">
                操作
            </BmTableColumn> -->
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { attributeListPage, attributeRemoveByIds, attributeUpdateById, attributeUpdateEnableDisableByIds } from "@/api/goods";
import AddEdit from "./component/addEdit";

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
            title: "", //参数名称
            status: "", //状态（0启用 1禁用）
            pageNum: pageNum,
            pageSize: pageSize
        });
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

        //表格选项的列
        const tableColumn = ["title", "mode", "limitLenght", "isUnit", "isRequired", "status", "categoryNum", "paramValue"];

        //获取列表
        const getListPage = () => {
            attributeListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.yesNo) {
                            if (dict.value.yesNo[i].value === item.isRequired) {
                                item.isRequiredName = dict.value.yesNo[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.haveNone) {
                            if (dict.value.haveNone[i].value === item.isUnit) {
                                item.isUnitName = dict.value.haveNone[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.forbiddenEnable) {
                            if (dict.value.forbiddenEnable[i].value === item.status) {
                                item.statusName = dict.value.forbiddenEnable[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.goodsModeList) {
                            if (dict.value.goodsModeList[i].value === item.mode) {
                                item.modeName = dict.value.goodsModeList[i].name;
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
            editRow.value = row;
            editVisible.value = true;
        };

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                if (tableSelectionRows.length !== 1) {
                    proxy.$message.error(proxy.$t("table.selectOnlyOne"));
                    return;
                }
                editRow.value = tableSelectionRows[0];
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
            attributeRemoveByIds(ids)
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
            attributeUpdateEnableDisableByIds(params)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        //修改关联类目
        const changeGoodsMode = (row) => {
            console.log("row", row);
            attributeUpdateById(row)
                .then((res) => {
                    proxy.$message.success(res.msg);
                })
                .catch(() => {
                    initData();
                });
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
            handelSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete,
            handleOpenShield,
            detailVisible,
            detailRow,
            handleDetail,
            changeGoodsMode,
            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
