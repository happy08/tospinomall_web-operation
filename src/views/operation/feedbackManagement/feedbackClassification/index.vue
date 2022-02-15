<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 反馈标题 -->
                    <el-form-item :label="$t('feedbackClassification.title')" prop="title">
                        <el-input v-model="searchForm.title" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态-->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.forbiddenEnableReverse" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
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
        <div class="flex mb-10 ">
            <!-- 意见反馈分类 -->
            <div class="mr-40">
                <el-radio-group v-model="searchForm.type" @change="handleChange">
                    <!-- 会员意见反馈 -->
                    <el-radio-button :label="1">{{ $t("feedbackClassification.memberFeedback") }}</el-radio-button>
                    <!-- 卖家意见反馈 -->
                    <el-radio-button :label="2">{{ $t("feedbackClassification.sellerFeedback") }}</el-radio-button>
                </el-radio-group>
            </div>
            <!-- 新增 -->
            <el-button v-permission="'feedbackManagement_feedbackClassification_add'" type="primary" @click="handleAddEdit('add')"> +{{ $t("status.add") }} </el-button>
            <div>
                <span class="ml-30 mr-10">{{ $t("status.batchOperation") }}:</span>
                <!-- 删除 -->
                <el-button v-permission="'feedbackManagement_feedbackClassification_del'" @click="handleAddEdit('batchDel')">
                    {{ $t("status.delete") }}
                </el-button>
                <!-- 启用 -->
                <el-button v-permission="'feedbackManagement_feedbackClassification_enable'" @click="handleEnable(0)">
                    {{ $t("status.enable") }}
                </el-button>
                <!-- 禁用 -->
                <el-button v-permission="'feedbackManagement_feedbackClassification_disable'" @click="handleEnable(1)">
                    {{ $t("status.forbidden") }}
                </el-button>
            </div>
        </div>
        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :column="tableColumn" @row-click="handleRowClick">
            <BmTableColumn type="selection"></BmTableColumn>
            <!-- 序号 -->
            <BmTableColumn :label="$t('feedbackClassificationTable.id')" width="80" prop="id">
                <template #default="scope">{{ scope.row.id }}</template>
            </BmTableColumn>
            <!-- 反馈类型 -->
            <BmTableColumn :label="$t('feedbackClassificationTable.title')" prop="source">
                <template #default="scope">{{ scope.row.title }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('feedbackClassificationTable.status')" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" align="center">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button v-permission="'feedbackManagement_feedbackClassification_edit'" type="text" @click="handleAddEdit('edit', scope.row)">
                        {{ $t("status.edit") }}
                    </el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'feedbackManagement_feedbackClassification_del'" type="text" @click="handleAddEdit('del', scope.row)">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 分页 -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
        <!-- 新增/编辑弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { feedbackClassificationList, delFeedbackClassification, batchEnableFeedbackClassification } from "@/api/operation";
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
            pageSize: pageSize,
            pageNum: pageNum,
            type: 1 // 类型 1:会员意见反馈 2:卖家意见反馈
        });
        //搜索
        const handleSearch = () => {
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };
        // 查看详情
        let editVisible = ref(false);
        let editRow = ref({});
        // 新增/编辑/删除
        const handleAddEdit = (operate, row) => {
            // 判断操作类型
            if (operate == "add") {
                // 新增
                editRow.value = {
                    operate: "add",
                    type: searchForm.type
                };
                editVisible.value = true;
            } else if (operate == "edit") {
                // 编辑
                editRow.value = row;
                editRow.value.operate = "edit";
                editVisible.value = true;
            } else if (operate == "batchDel") {
                // 批量删除
                let ids = [];
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                tableSelectionRows.map((item) => {
                    ids.push(item.id);
                });
                ids = ids.join(",");
                delFeedbackClassification(ids)
                    .then(() => {
                        initData();
                    })
                    .catch(() => {});
            } else {
                // 单个删除
                let ids = row.id;
                delFeedbackClassification(ids)
                    .then(() => {
                        initData();
                    })
                    .catch(() => {});
            }
        };
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
        const multipleTable = ref(null);
        // 批量启用禁用
        const handleEnable = (status) => {
            let ids = [];
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            tableSelectionRows.map((item) => {
                ids.push(item.id);
            });
            ids = ids.join(",");
            batchEnableFeedbackClassification({
                ids,
                status
            })
                .then(() => {
                    initData();
                })
                .catch(() => {});
        };

        let tableData = ref([]);
        //获取列表
        const getListPage = () => {
            feedbackClassificationList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 状态(数字转文字 0启用 1禁用)
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value == item.status) {
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
        initData();
        // 反馈分类类型切换
        const handleChange = () => {
            initData();
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
            handleSearch,
            resetForm,
            searchForm,
            tableData,

            handleSizeChange,
            handleCurrentChange,
            handleAddEdit,
            editVisible,
            editRow,
            multipleTable,
            handleChange,
            handleRowClick,
            handleSelectionChange,
            handleEnable
        };
    }
};
</script>
