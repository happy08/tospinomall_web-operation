<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <!-- <el-form
            :model="searchForm"
            ref="searchFormRef"
            labelPosition="top"
            class="table-search-form"
        >
            <el-row :gutter="24">
                <el-col :md="12" :lg="8">
                    <el-form-item :label="$t('permissionMenu.type')" prop="type">
                        <el-select
                            v-model="searchForm.type"
                            :placeholder="$t('pleaseSelect')"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in typeList"
                                :key="index"
                                :label="item.name"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </div>
        </el-form> -->
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                </div>
                <div class="fl mb-10 ml-15">
                    <!-- 批量操作 
                    <span>{{ $t("status.batchOperation") }}：</span>-->

                    <!-- 删除 
                    <el-button @click="handleDelete">{{ $t("status.delete") }}</el-button>
                    -->
                </div>
            </div>
            <div class="flex vstart">
                <!-- 表格选项
                <BmTableOption table="permissionMenu" :column="tableColumn" class="ml-10" /> -->
            </div>
        </div>

        <BmTable
            ref="multipleTable"
            :data="tableData"
            row-key="menuId"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :column="tableColumn"
        >
            <BmTableColumn prop="name" :label="$t('permissionMenu.name')"> </BmTableColumn>
            <BmTableColumn prop="icon" :label="$t('permissionMenu.icon')" width="90">
                <template #default="scope">
                    <i :class="scope.row.icon" class="fs-18"></i>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="sort" :label="$t('permissionMenu.sort')" width="90"> </BmTableColumn>
            <BmTableColumn prop="path" :label="$t('permissionMenu.path')" width="250"> </BmTableColumn>
            <BmTableColumn prop="type" :label="$t('permissionMenu.type')" width="110">
                <template #default="scope">
                    {{ scope.row.typeName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="keepAlive" :label="$t('permissionMenu.keepAlive')" width="90">
                <template #default="scope">
                    {{ scope.row.keepAliveName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="permission" :label="$t('permissionMenu.permission')" width="200"></BmTableColumn>

            <BmTableColumn :label="$t('table.operation')" fixed="right" width="130">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <!-- 新增 -->
                    <el-button @click.stop="handleAddEdit('add', scope.row)" type="text">
                        {{ $t("status.add") }}
                    </el-button>
                    <!-- 删除 -->
                    <el-button @click.stop="handleDelete(scope.row)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" :tableData="tableData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { menuFindByStatus, menuDelete } from "@/api/permission";
import AddEdit from "./component/addEdit";

export default {
    name: "permissionMenu",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        // //搜索条件
        // let searchFormRef = ref(null);
        // let searchForm = reactive({
        //     type: "", //类型（0启用 1禁用）
        // });
        //类型
        const typeList = computed(() => {
            return [
                {
                    name: proxy.$t("permissionMenu.leftMenu"),
                    value: "0"
                },
                {
                    name: proxy.$t("permissionMenu.button"),
                    value: "1"
                }
            ];
        });
        //是否
        const yesNo = computed(() => {
            return [
                {
                    name: proxy.$t("yes"),
                    value: "1"
                },
                {
                    name: proxy.$t("no"),
                    value: "0"
                }
            ];
        });
        // //搜索
        // const handelSearch = () => {
        //     initData();
        // };
        // //重置
        // const resetForm = () => {
        //     searchFormRef.value.resetFields();
        //     initData();
        // };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ""; //["name", "icon", "sort", "path", "type", "keepAlive", "permission"];

        //获取列表
        const getListPage = () => {
            menuFindByStatus()
                .then((res) => {
                    tableData.value = getTree(res.data.records);
                })
                .catch((err) => {});
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        function getTree(data) {
            // // 删除 所有 children,以防止多次调用
            // data.forEach(function(item) {
            //     delete item.children;
            // });

            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function(item) {
                map[item.menuId] = item;
            });

            let val = [];
            data.forEach(function(item) {
                for (let i in typeList.value) {
                    if (typeList.value[i].value == item.type) {
                        item.typeName = typeList.value[i].name;
                        break;
                    }
                }
                for (let i in yesNo.value) {
                    if (yesNo.value[i].value == item.keepAlive) {
                        item.keepAliveName = yesNo.value[i].name;
                        break;
                    }
                }
                let parent = map[item.parentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    val.push(item);
                }
            });
            return val;
        }

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

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {
                    parentId: (row && row.menuId) || -1,
                    type: "0",
                    keepAlive: "0"
                };
            } else if (type === "edit") {
                editRow.value = {
                    delFlag: row.delFlag,
                    icon: row.icon,
                    keepAlive: row.keepAlive,
                    id: row.menuId,
                    menuId: row.menuId,
                    name: row.name,
                    parentId: row.parentId,
                    path: row.path,
                    permission: row.permission,
                    sort: row.sort,
                    tenantId: row.tenantId,
                    type: row.type,
                    component: row.component,
                    ikey: row.ikey
                };
            }
            editVisible.value = true;
        };

        //删除
        const handleDelete = (row) => {
            proxy
                .$confirm(proxy.$t("permissionMenu.deleteTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    menuDelete({ menuId: row.menuId })
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                });
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        return {
            typeList,
            yesNo,
            initData,
            //searchFormRef,
            //handelSearch,
            //resetForm,
            //searchForm,
            tableData,
            tableColumn,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete,
            detailVisible,
            detailRow,
            handleDetail
        };
    }
};
</script>
