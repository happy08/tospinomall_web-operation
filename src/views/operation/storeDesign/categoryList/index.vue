<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('createTime')" prop="createTime">
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
                    <el-form-item :label="$t('mallCategory.createUser')" prop="createUser">
                        <el-input v-model="searchForm.createUser" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('mallCategory.updateUser')" prop="updateUser">
                        <el-input v-model="searchForm.updateUser" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in statusList" :key="index" :label="item" :value="index"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('updateTime')" prop="updateTime">
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
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开 -->
                <BmCollapse el="#elCollapse" :isShow="false" />
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button v-permission="'storeDesign_categoryList_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                </div>
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" column="">
            <BmTableColumn prop="clientType" :label="$t('mallCategory.clientType')" width="80px">
                <template #default="scope">
                    {{ scope.row.clientType === 1 ? "APP+H5" : "PC" }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="name" :label="$t('mallCategory.name')"> </BmTableColumn>
            <BmTableColumn prop="note" :label="$t('mallCategory.note')"></BmTableColumn>
            <BmTableColumn :label="$t('mallCategory.status')" width="80px">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('mallCategory.createTime')">
                <template #default="scope"> {{ scope.row.createUser }}<br />{{ scope.row.createTime }} </template>
            </BmTableColumn>
            <BmTableColumn prop="updateTime" :label="$t('mallCategory.updateTime')">
                <template #default="scope"> {{ scope.row.updateUser }}<br />{{ scope.row.updateTime }} </template>
            </BmTableColumn>
            <BmTableColumn prop="msort" :label="$t('mallCategory.msort')"> </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="180px">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button v-permission="'storeDesign_categoryList_edit'" @click="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <!-- 复制 -->
                    <el-button v-permission="'storeDesign_categoryList_edit'" @click="handleCopy(scope.row)" type="text">
                        {{ $t("copy") }}
                    </el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'storeDesign_categoryList_disable'" v-if="scope.row.status === 1" @click="handleOpenShield(0, scope.row)" type="text">
                        {{ $t("status.forbidden") }}
                    </el-button>
                    <!-- 模板装修 -->
                    <el-button v-permission="'storeDesign_categoryList_furnish'" @click="handleFitment(scope.row)" type="text">
                        {{ $t("mallCategory.fitment") }}
                    </el-button>
                    <!-- 立即发布 -->
                    <el-button v-permission="'storeDesign_categoryList_release'" v-if="scope.row.status === 0" @click="handleOpenShield(1, scope.row)" type="text">
                        {{ $t("storeDesign.publish") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />

    <!-- 模板装修 -->
    <Fitment v-model:visible="fitmentVisible" :row="fitmentRow" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { categoryStyleList, storeStylesRemoveId, categoryStyleClone, categoryStyleUpdateStatus } from "@/api/storeDesign";
import AddEdit from "./component/addEdit";
import Fitment from "./component/fitment";
import { dateShortcuts } from "@/utils/dateShortcuts";

export default {
    name: "categoryListIndex",
    components: { AddEdit, Fitment },
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
        const statusList = computed(() => {
            return {
                0: proxy.$t("status.draft"),
                1: proxy.$t("status.released")
            };
        });

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            createTime: [],
            updateTime: []
            //clientType: 1, //页面类型 1->APP+H5 2->PC
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        const handelSearch = (type) => {
            searchForm.beginCreateTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            searchForm.endCreateTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.beginUpdateTime = proxy.utils.formatStandardDate(searchForm.updateTime && searchForm.updateTime[0], true);
            searchForm.endUpdateTime = proxy.utils.formatStandardDate(searchForm.updateTime && searchForm.updateTime[1], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.beginCreateTime = "";
            searchForm.endCreateTime = "";
            searchForm.beginUpdateTime = "";
            searchForm.endUpdateTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //获取列表
        const getListPage = () => {
            categoryStyleList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        item.statusName = statusList.value[item.status];
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

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {
                    status: 0
                };
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //复制
        const handleCopy = (row) => {
            proxy
                .$confirm(proxy.$t("confirmOperate"), {
                    type: "warning"
                })
                .then(() => {
                    categoryStyleClone({ id: row.id })
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        };

        //装修
        let fitmentVisible = ref(false);
        let fitmentRow = ref({});
        const handleFitment = (row) => {
            fitmentRow.value = {
                id: row.id,
                navStyleId: row.id
            };
            fitmentVisible.value = true;
        };

        //启用禁用
        const handleOpenShield = (status, row) => {
            proxy
                .$confirm(status == 1 ? proxy.$t("confirmPublish") : proxy.$t("confirmForbidden"), {
                    type: "warning"
                })
                .then(() => {
                    categoryStyleUpdateStatus({ id: row.id, status: status })
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        };

        //删除
        const handleDelete = () => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            const ids = tableSelectionRows.map((item) => item.id).join("_");
            storeStylesRemoveId(ids)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
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
            pageNum,
            pageSize,
            pageTotal,
            statusList,
            initData,
            searchFormRef,
            searchForm,
            shortcuts,
            disabledDate,
            handelSearch,
            resetForm,
            tableData,
            multipleTable,

            editVisible,
            editRow,
            handleAddEdit,
            handleCopy,
            fitmentVisible,
            fitmentRow,
            handleFitment,
            handleOpenShield,
            handleDelete,

            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
