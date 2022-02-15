<template>
    <!-- 店铺列表 -->
    <BmDialog v-model:visible="visible" :title="$t('permissionUser.memberList')" :confirm="confirm" :cancel="cancel" :width="1000" top="10vh">
        <el-form ref="searchFormRef" :model="searchForm" :inline="true" label-width="60px">
            <el-form-item prop="keywords">
                <el-input v-model="searchForm.keywords" :placeholder="$t('permissionUser.keywordInfo')"> </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handelSearch" type="primary">
                    {{ $t("search") }}
                </el-button>
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </el-form-item>
        </el-form>

        <el-tabs class="custom-tabs-green" v-model="activeName" type="card">
            <el-tab-pane name="first">
                <template #label>
                    <div class="label">{{ $t("status.all") }}</div>
                </template>
                <el-checkbox-group v-model="tableSelectionIds">
                    <BmTable :data="tableData" @row-click="handleRowClick" height="380" class="mb-20">
                        <BmTableColumn width="50px">
                            <template #default="scope">
                                <el-checkbox @click.stop @change="changeCheckbox($event, scope.row)" :label="scope.row.id">
                                    &nbsp;
                                </el-checkbox>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="nickname" :label="$t('permissionUser.nickname')"> </BmTableColumn>
                        <BmTableColumn prop="account" :label="$t('permissionUser.account')"> </BmTableColumn>
                        <BmTableColumn prop="phone" :label="$t('mberListTable.phone')">
                            <template #default="scope"> +{{ scope.row.phonePrefix }} {{ scope.row.phone }} </template>
                        </BmTableColumn>
                        <BmTableColumn prop="email" :label="$t('mberListTable.email')"> </BmTableColumn>
                    </BmTable>
                </el-checkbox-group>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"> </BmPagination>
            </el-tab-pane>
            <el-tab-pane name="second" class="p-0">
                <!-- 已选 -->
                <template #label>
                    <div class="label">{{ $t("table.selected") }}（{{ tableSelectionRows.length }}）</div>
                </template>
                <BmTable :data="tableSelectionRows" row-key="id" height="400" class="mb-20">
                    <BmTableColumn prop="nickname" :label="$t('permissionUser.nickname')"> </BmTableColumn>
                    <BmTableColumn prop="account" :label="$t('permissionUser.account')"> </BmTableColumn>
                    <BmTableColumn prop="phone" :label="$t('permissionUser.phone')">
                        <template #default="scope"> +{{ scope.row.phonePrefix }} {{ scope.row.phone }} </template>
                    </BmTableColumn>
                    <BmTableColumn prop="email" :label="$t('mberListTable.email')"> </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" width="80px">
                        <template #default="scope">
                            <el-button @click="handleDelete(scope.row)" type="text">
                                {{ $t("status.delete") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </el-tab-pane>
        </el-tabs>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { sellerStoreFindByConditions } from "@/api/permission";

export default {
    name: "selectionMemberList",
    components: {},
    props: {
        visible: Boolean,
        ids: [String, Array]
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        let activeName = ref("first");
        //分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageNo,
            pageSize
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

        let tableData = ref([]);
        //let currentPageIds = [];
        //获取会员列表
        const initData = () => {
            sellerStoreFindByConditions(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records;
                })
                .catch(() => {});
        };
        initData();

        let tableSelectionRows = ref([]); //所有选中的
        let tableSelectionIds = ref([]); //所有选中的ids

        watch(
            () => props.ids,
            (nVal) => {
                const ids = Array.isArray(nVal) || !nVal ? nVal || [] : nVal.split(",");
                tableSelectionIds.value = ids;
                if (nVal && nVal.length > 0) {
                    sellerStoreFindByConditions({ ids: ids })
                        .then((res) => {
                            tableSelectionRows.value = res.data.records;
                        })
                        .catch((err) => {});
                }
            }
        );

        //点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.value.findIndex((item) => item.id === row.id);
            if (index === -1) {
                tableSelectionRows.value.push(row);
                tableSelectionIds.value.push(row.id);
            } else {
                tableSelectionRows.value.splice(index, 1);
                tableSelectionIds.value.splice(index, 1);
            }
        };

        //切换单个Checkbox
        const changeCheckbox = (val, row) => {
            if (val === true) {
                tableSelectionRows.value.push(row);
            } else {
                const index = tableSelectionRows.value.findIndex((item) => item.id === row.id);
                tableSelectionRows.value.splice(index, 1);
            }
        };

        //删除
        const handleDelete = (row) => {
            const index = tableSelectionRows.value.findIndex((item) => item.id === row.id);
            tableSelectionRows.value.splice(index, 1);
            tableSelectionIds.value.splice(index, 1);
        };

        const confirm = () => {
            emit("change", tableSelectionIds.value, tableSelectionRows.value);
            emit("update:visible", false);
            setTimeout(() => {
                tableSelectionIds.value = [];
                tableSelectionRows.value = [];
            }, 500);
        };

        const cancel = () => {
            emit("update:visible", false);
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
            activeName,
            searchFormRef,
            searchForm,
            handelSearch,
            resetForm,
            tableData,

            tableSelectionRows,
            tableSelectionIds,
            handleRowClick,
            changeCheckbox,
            handleDelete,
            confirm,
            cancel,
            pageNo,
            pageTotal,
            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
