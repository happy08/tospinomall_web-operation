<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('brand.alert')" icon="warning" class="mb-20" />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 类目信息 -->
                    <el-form-item :label="$t('goods.categoryInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <!-- 虚拟商品
                <el-col :md="12" :lg="6">
                    <el-form-item
                        :label="$t('goodsCategoryTable.virtualStatus')"
                        prop="virtualStatus"
                    >
                        <el-select
                            v-model="searchForm.virtualStatus"
                            :placeholder="$t('pleaseSelect')"
                            clearable
                        >
                            <el-option
                                v-for="item in dict.allowOrNot"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="item in dict.forbiddenEnable" :key="item.value" :value="item.value" :label="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- </el-row>
					<el-row
						v-if="dynamicColumn && dynamicColumn.length > 0"
						id="elCollapse"
						:gutter="24"
						class="h-0 hidden"> -->
                <el-col v-for="(item, index) in dynamicColumnSearch" :key="index" :prop="item.identity" :md="12" :lg="6">
                    <el-form-item :label="item.title" :prop="item.identity">
                        <el-select v-if="item.ruleType == 2" v-model="searchForm[item.identity]" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(value, index) in item.valueMap" :key="index" :value="index" :label="value"> </el-option>
                        </el-select>
                        <el-input v-else v-model="searchForm[item.identity]" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开
                <BmCollapse
                    v-if="dynamicColumn && dynamicColumn.length > 0"
                    el="#elCollapse"
                    :isShow="false"
                />  -->
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button v-permission="'base_category_addClassification'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus" class="mr-15">
                        {{ $t("goods.addOneCategory") }}
                    </el-button>
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作 -->
                    {{ $t("status.batchOperation") }}：
                    <el-button v-permission="'base_category_enable'" @click="handleEnableForbidden(1)">
                        {{ $t("status.enable") }}
                    </el-button>
                    <el-button v-permission="'base_category_disable'" @click="handleEnableForbidden(0)">
                        {{ $t("status.forbidden") }}
                    </el-button>
                    <el-button v-permission="'base_category_del'" @click="handleDelete">{{ $t("status.delete") }}</el-button>
                </div>
            </div>

            <div class="flex vstart">
                <!-- 导出
                <el-button>{{ $t("table.exportExcel") }}</el-button> -->
                <!-- 表格选项
                <BmTableOption table="goodsCategoryTable" :column="tableColumn" class="ml-10" /> -->
            </div>
        </div>

        <BmTable
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            :tree-props="{ children: 'children' }"
            lazy
            :load="load"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            @row-dblclick="handleRowdblClick"
            :column="tableColumn"
        >
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="cnName" :label="$t('goodsCategoryTable.cnName')" min-width="160"></BmTableColumn>
            <!-- <BmTableColumn prop="virtualStatus" :label="$t('goodsCategoryTable.virtualStatus')">  </BmTableColumn>-->
            <BmTableColumn prop="totalGoodNum" :label="$t('goodsCategoryTable.totalGoodNum')"> </BmTableColumn>
            <BmTableColumn v-for="(item, index) in dynamicColumn" :key="index" :prop="item.identity" :label="item.title">
                <template #default="scope">
                    <span v-if="scope.row.goodsCategoryConfigVoMap && scope.row.goodsCategoryConfigVoMap[item.identity]">
                        {{ scope.row.goodsCategoryConfigVoMap[item.identity].valueStr || scope.row.goodsCategoryConfigVoMap[item.identity].value }}
                    </span>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('goodsCategoryTable.status')">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="sort" :label="$t('goodsCategoryTable.sort')"> </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="220" fixed="right">
                <template #default="scope">
                    <!-- 启用 -->
                    <el-button v-permission="'base_category_enable'" v-if="scope.row.status == 0" @click="handleEnableForbidden(1, scope.row)" type="text" class="mr-5">
                        {{ $t("status.enable") }}
                    </el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'base_category_disable'" v-else @click="handleEnableForbidden(0, scope.row)" type="text" class="mr-5">
                        {{ $t("status.forbidden") }}
                    </el-button>

                    <el-dropdown>
                        <span class="mlr-10 green"> {{ $t("status.edit") }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-permission="'base_category_edit'" @click="handleAddEdit('edit', scope.row)">
                                    {{ $t("status.edit") }}
                                </el-dropdown-item>
                                <el-dropdown-item v-permission="'base_category_add'" @click="handleAddEdit('add', scope.row)">
                                    {{ $t("status.add") }}
                                </el-dropdown-item>
                                <el-dropdown-item v-permission="'base_category_del'" @click="handleDelete(scope.row)">
                                    {{ $t("status.delete") }}
                                </el-dropdown-item>
                                <el-dropdown-item v-permission="'base_category_asc'">{{ $t("status.ascending") }}</el-dropdown-item>
                                <el-dropdown-item v-permission="'base_category_desc'">{{ $t("status.descending") }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- 关联设置 -->
                    <el-button v-permission="'base_category_relationSet'" @click.stop="handleRelevance(scope.row)" type="text">
                        {{ $t("goodsCategory.associate") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <!-- <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination> -->
    </div>

    <!-- 新增编辑 v-if="editVisible"-->
    <AddEdit v-model:visible="editVisible" :row="editRow" :categoryId="categoryId" @reloadData="initData" />

    <!-- 关联设置-->
    <suspense>
        <async-relevance v-model:visible="relevanceVisible" :row="relevanceRow" @reloadData="initData" />
    </suspense>

    <!-- <Relevance v-model:visible="relevanceVisible" :row="relevanceRow" @reloadData="initData" /> -->
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, nextTick } from "vue";
import { useStore } from "vuex";
//import { useI18n } from "vue-i18n";
import { categoryBatchUpdateStatus, categoryBatchDelete, categoryConfigListAll, categoryListByParentId } from "@/api/goods";
import asyncRelevance from "./component/relevance";
import AddEdit from "./component/addEdit";

export default {
    name: "GoodsCategory",
    components: { AddEdit, asyncRelevance },
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
            keyword: "", //商品信息
            configParams: "", //动态搜索参数 `id_值,1_2`,
            pageNum: pageNum,
            pageSize: pageSize,
            parentId: ""
        });
        //搜索
        const handelSearch = () => {
            //组装动态搜索参数
            const keys = Object.keys(searchForm);
            const values = Object.values(searchForm);
            let arr = [];
            dynamicColumnSearch.value.forEach((item) => {
                keys.forEach((kitem, index) => {
                    if (item.identity === kitem && values[index]) {
                        arr.push(`${item.id}_${values[index]}`);
                    }
                });
            });
            const configParams = arr.join(",");
            getListPage(configParams);
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);
        //表格选项的列
        const tableColumn = null;
        //ref(["cnName", "virtualStatus", "totalGoodNum", "status", "sort"]);

        //获取table动态列
        let dynamicColumn = ref([]);
        const getCategoryConfigListAll = () => {
            categoryConfigListAll()
                .then((res) => {
                    dynamicColumn.value = res.data;

                    // //增加动态列到[表格选项]
                    // const identity = res.data.map((item) => item.identity);
                    // tableColumn.value.splice(3, 0, identity);
                    // tableColumn.value = tableColumn.value.flat(Infinity);
                })
                .catch((err) => {});
        };
        const dynamicColumnSearch = computed(() => {
            return dynamicColumn.value.filter((item) => {
                return item.isSearch === 1;
            });
        });
        getCategoryConfigListAll();

        //获取列表
        const getListPage = (configParams) => {
            const params = { ...searchForm };
            if (configParams) {
                params.configParams = configParams;
            }
            categoryListByParentId(params)
                .then((res) => {
                    tableData.value = res.map((item) => {
                        for (let i in dict.value.forbiddenEnable) {
                            if (dict.value.forbiddenEnable[i].value === item.status) {
                                item.statusName = dict.value.forbiddenEnable[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                })
                .catch((err) => {});
        };
        // table Tree懒加载方法
        const load = (tree, treeNode, resolve) => {
            categoryListByParentId({ parentId: tree.id })
                .then((res) => {
                    nextTick(() => {
                        res = res.map((item) => {
                            for (let i in dict.value.forbiddenEnable) {
                                if (dict.value.forbiddenEnable[i].value === item.status) {
                                    item.statusName = dict.value.forbiddenEnable[i].name;
                                    break;
                                }
                            }
                            return item;
                        });
                        resolve(res);
                    });
                })
                .catch(() => {});
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
            console.log("tableSelectionRows", tableSelectionRows);
        };

        //点击单行-选择
        const handleRowClick = (row) => {
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
        let categoryId = ref("");
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {
                    parentId: (row && row.id) || "0"
                };
                categoryId.value = (row && row.id) || "";
            } else if (type === "edit") {
                if (row) {
                    editRow.value = row;
                } else {
                    if (tableSelectionRows.length !== 1) {
                        proxy.$message.error(proxy.$t("table.selectOnlyOne"));
                        return;
                    }
                    editRow.value = tableSelectionRows[0];
                }
                categoryId.value = editRow.value.id;
            }
            editVisible.value = true;
        };

        //启用-禁用
        const handleEnableForbidden = (status, row) => {
            let params = {
                status: status
            };
            if (row && row.id) {
                params.ids = row.id;
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                const ids = tableSelectionRows.map((item) => item.id);
                params.ids = ids.join(",");
            }
            proxy
                .$confirm(proxy.$t("goodsCategoryTable.tip1"), proxy.$t("goodsList.examineConfirm"), {
                    type: "warning"
                })
                .then(() => {
                    categoryBatchUpdateStatus(params)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        };

        //批量删除
        const handleDelete = (row) => {
            let ids = "";
            if (row && row.id) {
                ids = row.id;
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                ids = tableSelectionRows.map((item) => item.id);
                ids.join("_");
            }
            proxy
                .$confirm(proxy.$t("goodsCategoryTable.tip1"), proxy.$t("goodsList.examineConfirm"), {
                    type: "warning"
                })
                .then(() => {
                    categoryBatchDelete(ids)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        };

        //关联设置
        let relevanceVisible = ref(false);
        let relevanceRow = ref({});
        const handleRelevance = (row) => {
            relevanceRow.value = row;
            relevanceVisible.value = true;
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
            dynamicColumn,
            dynamicColumnSearch,
            initData,
            lang,
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
            handleEnableForbidden,
            handleDelete,
            editVisible,
            editRow,
            categoryId,
            handleRowdblClick,
            handleAddEdit,
            relevanceVisible,
            relevanceRow,
            handleRelevance,
            handleSizeChange,
            handleCurrentChange,
            dynamicColumn,
            load
        };
    }
};
</script>
