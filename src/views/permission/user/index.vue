<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="8">
                    <!-- 状态 -->
                    <el-form-item :label="$t('permissionUser.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in forbiddenEnable" :key="index" :label="item" :value="index"> </el-option>
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
                <div class="fl mb-10 mr-15">
                    <!-- 新增 -->
                    <el-button @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作 -->
                    <span>{{ $t("status.batchOperation") }}：</span>

                    <!-- 启用 -->
                    <el-button @click="handleOpenShield(1)">{{ $t("status.enable") }}</el-button>
                    <!-- 禁用 -->
                    <el-button @click="handleOpenShield(0)">{{ $t("status.forbidden") }}</el-button>
                </div>
            </div>
            <div class="flex vstart"></div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('permissionUser.status')" width="120">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template> </BmTableColumn
            ><BmTableColumn prop="account" :label="$t('permissionUser.account')"> </BmTableColumn>

            <BmTableColumn prop="roles" :label="$t('permissionUser.roles')">
                <template #default="scope">
                    <span v-for="(item, index) in scope.row.roles" :key="item.roleId"> <span v-if="index !== 0"> /</span> {{ item.roleName }} </span>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="phone" :label="$t('permissionUser.phone')"> </BmTableColumn>
            <BmTableColumn prop="remark" :label="$t('permissionUser.remark')"> </BmTableColumn>

            <BmTableColumn prop="categoryNum" :label="$t('table.operation')" width="100">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { userFindByStatus, userBatchCloseUser, userBatchOpenUser } from "@/api/permission";
import AddEdit from "./component/addEdit";

export default {
    name: "permissionUser",
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
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            //status: null, //状态（0启用 1禁用）
            pageNo: pageNo,
            pageSize: pageSize
        });
        //状态
        const forbiddenEnable = computed(() => {
            return {
                0: proxy.$t("status.enable"),
                1: proxy.$t("status.forbidden")
            };
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

        //获取列表
        const getListPage = () => {
            userFindByStatus(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        item.statusName = forbiddenEnable.value[item.status];
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

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //批量启用禁用
        const handleOpenShield = (type) => {
            let ids = "";

            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            ids = tableSelectionRows.map((item) => item.id);

            let api = userBatchCloseUser;
            if (type === 1) {
                api = userBatchOpenUser;
            }
            api(ids)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
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

        return {
            dict,
            forbiddenEnable,
            initData,
            pageNo,
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
            editVisible,
            editRow,
            handleAddEdit,
            handleOpenShield,
            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
