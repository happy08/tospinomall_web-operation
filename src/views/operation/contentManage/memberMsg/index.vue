<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
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
                    <!-- 发布时间 -->
                    <el-form-item :label="$t('contentMsg.sendTime')" prop="sendTime">
                        <el-date-picker
                            v-model="searchForm.sendTime"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
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
                    <!-- 平台 -->
                    <el-form-item :label="$t('contentMsg.receivePlatform')" prop="receivePlatform">
                        <el-select v-model="searchForm.receivePlatform" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in receivePlatformList" :key="index" :label="item" :value="index"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 创建人 -->
                    <el-form-item :label="$t('contentManage.createUser')" prop="createUser">
                        <BmSelectRemote v-model="searchForm.createUser" :remoteApi="userFindByStatus" :option="{ label: 'account', value: 'id' }"> </BmSelectRemote>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 更新人 -->
                    <el-form-item :label="$t('contentManage.updateUser')" prop="updateUser">
                        <BmSelectRemote v-model="searchForm.updateUser" :remoteApi="userFindByStatus" :option="{ label: 'account', value: 'id' }"> </BmSelectRemote>
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
            <el-button v-permission="'contentManage_memberMsg_addClassification'" @click="handleAddEditNav('add')" type="primary" plain icon="el-icon-plus" class="w-100 mb-20">
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
                            <span> ({{ data.msgCount }}) </span>
                        </div>
                        <div class="flex1" style="flex: 0 0 20px">
                            <el-button v-permission="'contentManage_memberMsg_editClassification'" @click.stop="handleAddEditNav('edit', data)" icon="el-icon-edit" type="text"></el-button>
                            <el-button
                                v-permission="'contentManage_memberMsg_delClassification'"
                                v-if="data.msgCount <= 0"
                                @click.stop="handleDeleteNav(data, node)"
                                icon="el-icon-delete"
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
                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mr-20 mb-10">
                        <!-- 全部 -->
                        <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                        <el-radio-button v-for="(item, index) in statusList" :key="index" :label="index">{{ item }}</el-radio-button>
                    </el-radio-group>

                    <div class="fl mb-10 mr-15">
                        <!-- 新增 -->
                        <el-button v-permission="'contentManage_memberMsg_add'" @click="handleAddEdit('add')" type="primary" plain icon="el-icon-plus">
                            {{ $t("status.add") }}
                        </el-button>
                    </div>
                    <div class="fl mb-10">
                        <!-- 批量操作 -->
                        <span>{{ $t("status.batchOperation") }}：</span>

                        <!-- 发布 -->
                        <el-button v-permission="'contentManage_memberMsg_release'" @click="handlePublish">
                            {{ $t("contentMsg.publish") }}
                        </el-button>

                        <!-- 删除 -->
                        <el-button v-permission="'contentManage_memberMsg_del'" @click="handleDelete">{{ $t("status.delete") }}</el-button>
                    </div>
                </div>

                <div class="flex vstart">
                    <!-- 导出 -->
                    <el-button v-permission="'contentManage_memberMsg_export'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
                </div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick">
                <BmTableColumn type="selection"> </BmTableColumn>
                <BmTableColumn prop="status" :label="$t('status.status')" width="100px">
                    <template #default="scope">
                        {{ scope.row.statusName }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="releaseType" :label="$t('contentMsg.releaseType')" width="150px">
                    <template #default="scope">
                        {{ scope.row.releaseTypeName }}
                        <div v-if="scope.row.releaseType == 2">{{ scope.row.setTime }}</div>
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="title" :label="$t('contentManage.title')"> </BmTableColumn>
                <BmTableColumn prop="categoryName" :label="$t('contentManage.categoryName')" width="160px"> </BmTableColumn>
                <BmTableColumn prop="receivePlatform" :label="$t('contentMsg.receivePlatform')" width="180px">
                    <template #default="scope">
                        {{ scope.row.receivePlatformName.join(" , ") }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="sendTime" :label="$t('contentMsg.sendTime')" width="160px"> </BmTableColumn>
                <BmTableColumn prop="createTime" :label="$t('createTime')" width="160px">
                    <template #default="scope">
                        {{ scope.row.createUserName }}<br />
                        {{ scope.row.createTime }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="updateTime" :label="$t('updateTime')" width="160px">
                    <template #default="scope">
                        {{ scope.row.updateUserName }}<br />
                        {{ scope.row.updateTime }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="readCount" :label="$t('contentMsg.readCount')" width="100px"> </BmTableColumn>

                <BmTableColumn :label="$t('table.operation')" fixed="right" width="160px">
                    <template #default="scope">
                        <!-- 编辑 -->
                        <el-button v-permission="'contentManage_memberMsg_edit'" v-if="scope.row.status == 0" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                            {{ $t("status.edit") }}
                        </el-button>
                        <!-- 删除 -->
                        <el-button v-permission="'contentManage_memberMsg_de'" v-if="scope.row.status == 0" @click.stop="handleDelete(scope.row)" type="text">
                            {{ $t("status.delete") }}
                        </el-button>
                        <!-- 发布 (0未发布 1已发布 3已作废 )-->
                        <el-button v-permission="'contentManage_memberMsg_release'" v-if="scope.row.status == 0" @click.stop="handlePublish(scope.row)" type="text">
                            {{ $t("contentMsg.publish") }}
                        </el-button>
                        <!-- 查看 -->
                        <el-button v-permission="'contentManage_memberMsg_look'" v-if="scope.row.status != 0" @click.stop="handleDetail(scope.row)" type="text">
                            {{ $t("table.detail") }}
                        </el-button>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
        </div>
        <div class="clear"></div>
    </div>

    <!-- 新增编辑导航类别 -->
    <AddMsgNav v-model:visible="navVisible" :row="navRow" @reloadData="onChangeNav" />

    <!-- 新增编辑 -->
    <AddEdit
        v-model:visible="editVisible"
        :row="editRow"
        :treeData="navDataList"
        @reloadData="
            initData();
            getMsgCategoryMallFindList();
        "
    />

    <!-- 详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" :treeData="navDataList" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { msgCategoryMallFindList, messagePushMallFindPage, msgCategoryMallRemoveById, messagePushMallRemoveMsgByIds, messagePushMallPushMsg, feedbackMessageExport } from "@/api/operation";
import { userFindByStatus } from "@/api/permission";
import AddEdit from "./component/addEdit";
import Detail from "./component/detail";
import AddMsgNav from "../component/addMsgNav";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { exportExcel } from "@/utils/";

export default {
    name: "memberMsg",
    components: { AddEdit, Detail, AddMsgNav },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        const mainType = 1; //类别 1会员消息推送分类 2卖家消息推送分类

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //状态
        const statusList = computed(() => {
            return {
                0: proxy.$t("contentMsg.unpublished"), //未发布
                1: proxy.$t("contentMsg.released"), //已发布
                2: proxy.$t("contentMsg.drafts"), //草稿
                3: proxy.$t("contentMsg.voided") //已作废
            };
        });
        //发布方式
        const releaseTypeList = computed(() => {
            return {
                1: proxy.$t("contentMsg.publish"),
                2: proxy.$t("contentMsg.timing"),
                3: proxy.$t("contentMsg.drafts")
            };
        });
        //接收平台
        const receivePlatformList = computed(() => {
            return {
                1: "Android",
                2: "IOS",
                3: "H5",
                4: "PC"
            };
        });
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            createTime: [],
            sendTime: [],
            title: "",
            categoryId: "", //分类
            status: "", //状态（0未发布 1已发布 3已作废）
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
            searchForm.createStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.sendStartTime = proxy.utils.formatStandardDate(searchForm.sendTime && searchForm.sendTime[0], true);
            searchForm.sendEndTime = proxy.utils.formatStandardDate(searchForm.sendTime && searchForm.sendTime[1], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.createStartTime = "";
            searchForm.createEndTime = "";
            searchForm.sendStartTime = "";
            searchForm.sendEndTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        //切换状态
        const handleChangeStatus = (val) => {
            initData();
        };

        //获取导航类别列表
        let navDataList = ref([]);
        const getMsgCategoryMallFindList = () => {
            msgCategoryMallFindList({ type: mainType })
                .then((res) => {
                    navDataList.value = res.data;
                })
                .catch((err) => {});
        };
        getMsgCategoryMallFindList();

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
            getMsgCategoryMallFindList();
        };
        //删除导航类别
        const handleDeleteNav = (data, node) => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), "", {
                    type: "warning"
                })
                .then(() => {
                    msgCategoryMallRemoveById(data.id)
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
            messagePushMallFindPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        item.receivePlatform = item.receivePlatform.split(",");
                        item.objectType = item.objectType + "";
                        item.releaseType = item.releaseType + "";
                        item.statusName = statusList.value[item.status];
                        item.releaseTypeName = releaseTypeList.value[item.releaseType];
                        item.receivePlatformName = item.receivePlatform.map((item) => receivePlatformList.value[item]);
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
                    receivePlatform: [],
                    objectType: "1",
                    objectIds: "",
                    releaseType: "1",
                    status: "0"
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
                .$confirm(proxy.$t("confirmDelete"), "", {
                    type: "warning"
                })
                .then(() => {
                    messagePushMallRemoveMsgByIds(ids)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        };

        //发布
        const handlePublish = (row) => {
            let ids = "";
            if (row && row.id) {
                ids = [row.id];
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                const isRelease = tableSelectionRows.filter((item) => item.status != 0); //只能勾选未发布
                if (isRelease.length > 0) {
                    proxy.$message.error(proxy.$t("contentManage.tips"));
                    return;
                }
                ids = tableSelectionRows.map((item) => item.id);
            }

            messagePushMallPushMsg(ids)
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
            detailRow.value = {
                ...row,
                objectIds: (row.objectIds && row.objectIds.split(",")) || []
            };
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

        // 导出excel表格
        const handleExportExcel = (val) => {
            const params = {
                ...searchForm,
                type: 2,
                pageNum: null,
                pageSize: null
            };
            feedbackMessageExport(params)
                .then((res) => {
                    exportExcel("MemberMessage", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };

        return {
            userFindByStatus,
            statusList,
            receivePlatformList,
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
            handleChangeStatus,
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
            handlePublish,
            detailVisible,
            detailRow,
            handleDetail,
            handleSizeChange,
            handleCurrentChange,
            handleExportExcel
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
