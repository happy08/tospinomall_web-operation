<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 名称 -->
                    <el-form-item :label="$t('specTable.cnSpecName')" prop="cnSpecName">
                        <el-input v-model="searchForm.cnSpecName" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('specTable.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in forbiddenEnable" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 卖家自定义参数值 -->
                    <el-form-item :label="$t('specTable.isEdit')" prop="isEdit">
                        <el-select v-model="searchForm.isEdit" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in dict.supportOrNot" :key="index" :label="item.name" :value="item.value"> </el-option>
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
                    <el-button v-permission="'base_spec_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                    <!-- 编辑 -->
                    <el-button v-permission="'base_spec_edit'" @click="handleAddEdit('edit')" class="mr-15">
                        {{ $t("status.edit") }}
                    </el-button>
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作 -->
                    <span>{{ $t("status.batchOperation") }}：</span>

                    <!-- 启用 -->
                    <el-button v-permission="'base_spec_enable'" @click="handleOpenShield(0)">{{ $t("status.enable") }}</el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'base_spec_disable'" @click="handleOpenShield(1)">{{ $t("status.forbidden") }}</el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'base_spec_export'" @click="handleDelete">{{ $t("status.delete") }}</el-button>
                </div>
            </div>

            <div class="flex vstart">
                <!-- 导出 -->
                <el-button v-permission="''" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
                <!-- 表格选项 -->
                <BmTableOption table="specTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="cnSpecName" :label="$t('specTable.cnSpecName')"> </BmTableColumn>
            <BmTableColumn prop="categoryNum" :label="$t('specTable.categoryNum')">
                <template #default="scope">
                    <el-button @click.stop="handleCategoryNum(scope.row)" type="text">
                        {{ scope.row.categoryNum }}
                    </el-button>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="goodsNum" :label="$t('specTable.goodsNum')"></BmTableColumn>
            <BmTableColumn prop="useCount" :label="$t('specTable.useCount')"> </BmTableColumn>
            <BmTableColumn prop="isEdit" :label="$t('specTable.isEdit')" width="145"
                ><template #default="scope">
                    {{ scope.row.isEditName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="isPicture" :label="$t('specTable.isPicture')" width="100"
                ><template #default="scope">
                    {{ scope.row.isPictureName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="isSellerUploadPicture" :label="$t('specTable.isSellerUploadPicture')" width="100"
                ><template #default="scope">
                    {{ scope.row.isSellerUploadPictureName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('specTable.status')">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="specValues" :label="$t('specTable.specValues')">
                <template #default="scope">
                    <el-button v-if="scope.row.specValues" @click="handleSpecValues(scope.row)" type="text">
                        {{ scope.row.specValues ? scope.row.specValues : "+" }}
                    </el-button>
                    <el-button v-else @click="handleSpecValues(scope.row)" icon="el-icon-plus" type="text"> </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />

    <!-- 商品分类树 -->
    <GoodsCategory v-model:visible="goodsCategoryVisible" :ids="goodsCategoryRow.ids" @change="changeGoodsCategory" />

    <!-- 属性值 -->
    <SpecValues v-model:visible="specValuesVisible" :row="specValuesRow" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import {
    specModelListPage,
    specModelMallRemoveByIds,
    specModelMallUpdateEnableDisableByIds,
    specModelMallListGoodsCategoryByAttrId,
    specModelMallRelationCategory,
    specModelMallExport
} from "@/api/goods";
import AddEdit from "./component/addEdit";
import SpecValues from "./specValues";
import GoodsCategory from "@/components/goodsCategory";
import { exportExcel } from "@/utils/";

export default {
    name: "GoodsSpec",
    components: { AddEdit, SpecValues, GoodsCategory },
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

        //状态
        const forbiddenEnable = computed(() => {
            return [
                {
                    name: proxy.$t("status.enable"),
                    value: 0
                },
                {
                    name: proxy.$t("status.forbidden"),
                    value: 1
                }
            ];
        });

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            // keyword: "", //名称
            // status: "", //状态（0启用 1禁用）
            // isEdit: "", //卖家自定义参数值
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
        const tableColumn = ["cnSpecName", "categoryNum", "goodsNum", "useCount", "isEdit", "isPicture", "isSellerUploadPicture", "status", "specValues"];

        //获取列表
        const getListPage = () => {
            specModelListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.supportOrNot) {
                            if (dict.value.supportOrNot[i].value === item.isEdit) {
                                item.isEditName = dict.value.supportOrNot[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.haveNone) {
                            if (dict.value.haveNone[i].value === item.isPicture) {
                                item.isPictureName = dict.value.haveNone[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.supportOrNot) {
                            if (dict.value.supportOrNot[i].value === item.isSellerUploadPicture) {
                                item.isSellerUploadPictureName = dict.value.supportOrNot[i].name;
                                break;
                            }
                        }
                        for (let i in forbiddenEnable.value) {
                            if (forbiddenEnable.value[i].value === item.status) {
                                item.statusName = forbiddenEnable.value[i].name;
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
            proxy
                .$confirm(proxy.$t("specTable.tip1"), proxy.$t("goodsList.examineConfirm"), {
                    type: "warning"
                })
                .then(() => {
                    specModelMallRemoveByIds(ids)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
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
            proxy
                .$confirm(proxy.$t("specTable.tip1"), proxy.$t("goodsList.examineConfirm"), {
                    type: "warning"
                })
                .then(() => {
                    specModelMallUpdateEnableDisableByIds(params)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        };

        //关联类目数量
        let goodsCategoryVisible = ref(false);
        let goodsCategoryRow = ref([]); //点击的当前行
        const handleCategoryNum = (row) => {
            specModelMallListGoodsCategoryByAttrId({ specId: row.id })
                .then((res) => {
                    goodsCategoryRow.value = { ...row, ids: res.data.map((item) => item.id) };
                    goodsCategoryVisible.value = true;
                })
                .catch(() => {});
        };
        const changeGoodsCategory = (ids) => {
            specModelMallRelationCategory({ id: goodsCategoryRow.value.id, categoryIds: ids })
                .then((res) => {
                    initData();
                })
                .catch(() => {
                    initData();
                });
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
            specModelMallExport(searchForm)
                .then((res) => {
                    exportExcel("PropertyManager", res);
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

        return {
            dict,
            forbiddenEnable,
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
            goodsCategoryVisible,
            goodsCategoryRow,
            handleCategoryNum,
            changeGoodsCategory,
            handleExportExcel,
            specValuesVisible,
            specValuesRow,
            handleSpecValues,
            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
