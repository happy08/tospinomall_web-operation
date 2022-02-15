<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
                    <el-form-item :label="$t('copingManagement.createTime')" prop="createTime">
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
                    <!-- 标题 -->
                    <el-form-item :label="$t('contentManage.title')" prop="title">
                        <el-input v-model="searchForm.title" :placeholder="$t('contentManage.title')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 创建人 -->
                    <el-form-item :label="$t('contentManage.createUser')" prop="createUser">
                        <el-input v-model="searchForm.createUser" :placeholder="$t('contentManage.createUser')" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 更新人 -->
                    <el-form-item :label="$t('contentManage.updateUser')" prop="updateUser">
                        <el-input v-model="searchForm.updateUser" :placeholder="$t('contentManage.updateUser')" clearable></el-input>
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
        <div class="w-200 fl">
            <!-- 新增一级分类 -->
            <el-button v-permission="'contentManage_helpCenter_addClassification'" @click="handleAddEditNav('add')" type="primary" plain icon="el-icon-plus" class="w-100 mb-20">
                {{ $t("mallCategory.addOneCategory") }}
            </el-button>

            <el-tree
                :data="navDataList"
                :props="{
                    children: 'children',
                    label: 'categoryName'
                }"
                :highlight-current="true"
            >
                <template #default="{ data,node }">
                    <div @click="handleChangeNav(data)" class="flex flex1 between vcenter">
                        <div class="flex1 mr-10">
                            {{ data.categoryName }}
                            <span v-if="data.count && data.count > 0"> ({{ data.count }}) </span>
                        </div>
                        <div class="flex1" style="flex: 0 0 40px">
                            <el-button
                                v-permission="'contentManage_helpCenter_delClassification'"
                                :disabled="data.count > 0 || data.children.length > 0"
                                @click.stop="handleDeleteNav(data, node)"
                                icon="el-icon-minus"
                                type="text"
                            ></el-button>
                            <el-button
                                v-permission="'contentManage_helpCenter_addClassification'"
                                :disabled="node.level === 2"
                                @click.stop="handleAddEditNav('add', data)"
                                icon="el-icon-plus"
                                type="text"
                            ></el-button>
                        </div>
                    </div>
                </template>
            </el-tree>
        </div>
        <div style="margin-left:220px">
            <div class="flex between mb-10">
                <div>
                    <div class="fl mb-10 mr-15">
                        <!-- 新增 -->
                        <el-button v-permission="'contentManage_helpCenter_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                            {{ $t("status.add") }}
                        </el-button>
                    </div>
                    <div class="fl mb-10">
                        <!-- 批量操作 -->
                        <span>{{ $t("status.batchOperation") }}：</span>

                        <!-- 启用 -->
                        <el-button v-permission="'contentManage_helpCenter_enable'" @click="handleOpenShield(1)">
                            {{ $t("status.enable") }}
                        </el-button>
                        <!-- 禁用 -->
                        <el-button v-permission="'contentManage_helpCenter_disable'" @click="handleOpenShield(0)">
                            {{ $t("status.forbidden") }}
                        </el-button>
                        <!-- 删除 -->
                        <el-button v-permission="'contentManage_helpCenter_del'" @click="handleDelete">{{ $t("status.delete") }}</el-button>
                    </div>
                </div>
                <div class="flex vstart"></div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick">
                <BmTableColumn type="selection"> </BmTableColumn>
                <BmTableColumn prop="status" :label="$t('status.status')" width="100px">
                    <template #default="scope">
                        {{ scope.row.statusName }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="title" :label="$t('contentManage.title')"> </BmTableColumn>
                <BmTableColumn prop="categoryName" :label="$t('contentManage.categoryName')"> </BmTableColumn>
                <BmTableColumn prop="createTime" :label="$t('createTime')">
                    <template #default="scope">
                        {{ scope.row.createUser }}<br />
                        {{ scope.row.createTime }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="updateTime" :label="$t('updateTime')">
                    <template #default="scope">
                        {{ scope.row.updateUser }}<br />
                        {{ scope.row.updateTime }}
                    </template>
                </BmTableColumn>

                <BmTableColumn :label="$t('table.operation')">
                    <template #default="scope">
                        <!-- 编辑 -->
                        <el-button v-permission="'contentManage_helpCenter_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                            {{ $t("status.edit") }}
                        </el-button>
                        <!-- 删除 -->
                        <el-button v-permission="'contentManage_helpCenter_del'" @click.stop="handleDelete(scope.row)" type="text">
                            {{ $t("status.delete") }}
                        </el-button>
                        <!-- 启用 -->
                        <el-button v-permission="'contentManage_helpCenter_enable'" v-if="scope.row.status === 0" @click.stop="handleOpenShield(1, scope.row)" type="text">
                            {{ $t("status.enable") }}
                        </el-button>
                        <!-- 禁用 -->
                        <el-button v-permission="'contentManage_helpCenter_disable'" v-if="scope.row.status === 1" @click.stop="handleOpenShield(0, scope.row)" type="text">
                            {{ $t("status.forbidden") }}
                        </el-button>
                        <!-- 详情 -->
                        <el-button v-permission="'contentManage_helpCenter_look'" @click.stop="handleDetail(scope.row)" type="text">
                            {{ $t("table.detail") }}
                        </el-button>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
        </div>
        <div class="clear"></div>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" :treeData="navDataList" @reloadData="initData" />

    <!-- 详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" :treeData="navDataList" />

    <!-- 新增编辑导航类别 -->
    <AddContentNav v-model:visible="navVisible" :row="navRow" @reloadData="onChangeNav" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { toolCategoryMallFindList, sellerRulesHelpMallFindPage, toolCategoryMallRemoveById, sellerRulesHelpMallRemoveByIds, sellerRulesHelpMallEnableDisable } from "@/api/operation";
import AddEdit from "./component/addEdit";
import Detail from "./component/detail";
import AddContentNav from "../component/addContentNav";
import { dateShortcuts } from "@/utils/dateShortcuts";

export default {
    name: "ruleCenter",
    components: { AddEdit, Detail, AddContentNav },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        const mainType = 3; //类型 1视频分类 2规则中心 3帮助中心

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            createTime: [],
            title: "",
            categoryId: "", //分类
            status: "", //状态（0启用 1禁用）
            type: mainType,
            pageNum: pageNum,
            pageSize: pageSize
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        //搜索
        const handelSearch = () => {
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        //获取导航类别列表
        let navDataList = ref([]);
        const getToolCategoryMallFindList = () => {
            toolCategoryMallFindList({ type: mainType })
                .then((res) => {
                    navDataList.value = res.data;
                })
                .catch((err) => {});
        };
        getToolCategoryMallFindList();

        //新增编辑导航类别
        let navVisible = ref(false);
        let navRow = ref({});
        const handleAddEditNav = (type, row) => {
            if (type === "add") {
                navRow.value = {
                    id: "",
                    parentId: (row && row.id) || 0,
                    categoryName: "",
                    type: mainType,
                    parentName: (row && row.categoryName) || ""
                };
            } else if (type === "edit") {
                navRow.value = row;
            }
            navVisible.value = true;
        };
        //新增插入导航类别
        const onChangeNav = () => {
            getToolCategoryMallFindList();
        };
        //删除导航类别
        const handleDeleteNav = (data, node) => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), "", {
                    type: "warning"
                })
                .then(() => {
                    toolCategoryMallRemoveById(data.id)
                        .then((res) => {
                            let dataList = [];
                            if (node.parent.level === 0) {
                                dataList = node.parent.data;
                            } else {
                                dataList = node.parent.data.children;
                            }
                            const index = dataList.findIndex((item) => item.id === data.id);
                            dataList.splice(index, 1);
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        };

        //切换一级导航
        const handleChangeNav = (item) => {
            if (item.children && item.children.length > 0) {
                return;
            }
            searchForm.categoryId = item.id;
            initData();
        };

        //表格选项的列
        const multipleTable = ref(null);

        let tableData = ref([]);
        //获取列表
        const getListPage = () => {
            sellerRulesHelpMallFindPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
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
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {
                    categoryId: searchForm.categoryId,
                    type: mainType,
                    content: ""
                };
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //删除
        const handleDelete = (row) => {
            let ids = "";
            if (row && row.id) {
                ids = [row.id];
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                ids = tableSelectionRows.map((item) => item.id).join(",");
            }
            proxy
                .$confirm(proxy.$t("confirmDelete"), {
                    type: "warning"
                })
                .then(() => {
                    sellerRulesHelpMallRemoveByIds(ids)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        };

        //启用禁用
        const handleOpenShield = (status, row) => {
            let ids = "";
            if (row && row.id) {
                ids = [row.id];
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                ids = tableSelectionRows.map((item) => item.id);
            }
            const params = {
                ids: ids.join(","),
                status: status
            };
            sellerRulesHelpMallEnableDisable(params)
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
            shortcuts,
            disabledDate,

            handelSearch,
            resetForm,
            searchForm,
            tableData,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,

            navDataList,
            navVisible,
            navRow,
            onChangeNav,
            handleDeleteNav,
            handleChangeNav,

            handleAddEditNav,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete,
            handleOpenShield,
            detailVisible,
            detailRow,
            handleDetail,
            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
<style lang="scss" scoped>
.w-200 {
    width: 200px;
}
.nav-one {
    margin: 5px 0;
    padding: 2px 5px;
    &:hover,
    &.active {
        background-color: #f7f7f7;
    }
}
</style>
