<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 提交时间 -->
                    <el-form-item :label="$t('sellerFeedbackListTable.createTime')" prop="createTime">
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
                    <!-- 类型-->
                    <el-form-item :label="$t('sellerFeedbackListTable.feedbackCategoryName')" prop="feedbackCategoryId">
                        <el-select v-model="searchForm.feedbackCategoryId" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in feedbackTypeList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 卖家-->
                    <el-form-item :label="$t('sellerFeedbackList.userId')" prop="userId">
                        <el-select v-model="searchForm.userId" filterable remote reserve-keyword :placeholder="$t('pleaseEnter')" :remote-method="allStoreInfo" :loading="loading">
                            <el-option v-for="item in sellersInfoList" :key="item.userId" :label="item.papersName" :value="item.userId"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 来源 -->
                    <el-form-item :label="$t('sellerFeedbackListTable.source')" prop="source">
                        <el-select v-model="searchForm.source" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dict.feedbackMessageSource" :key="item.value" :label="item.name" :value="item.value"></el-option>
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
        <div class="flex mb-10 between">
            <!-- 功能操作 -->
            <div>
                <span class="mr-20">{{ $t("status.functionalOperation") }}:</span>
                <!-- 标记已读 -->
                <el-button v-permission="'feedbackManagement_sellerFeedbackList_read'" @click="handleRead">
                    {{ $t("memberFeedbackList.markAsRead") }}
                </el-button>
            </div>
            <div>
                <!-- 导出 -->
                <el-button v-permission="'feedbackManagement_sellerFeedbackList_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="sellerFeedbackListTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :column="tableColumn" @row-click="handleRowClick">
            <BmTableColumn type="selection"></BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.status')" width="80" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 来源 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.source')" prop="source" width="80px">
                <template #default="scope">{{ scope.row.sourceName }}</template>
            </BmTableColumn>
            <!-- 反馈类型 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.feedbackCategoryName')" prop="feedbackCategoryName">
                <template #default="scope">{{ scope.row.feedbackCategoryName }}</template>
            </BmTableColumn>
            <!-- 反馈内容 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.content')" prop="content" width="300px">
                <template #default="scope">
                    <span class="block">{{ scope.row.content }}</span>
                    <span>
                        <BmImage v-for="(item, index) in scope.row.imgUrls" :src="item" :key="index" fit="cover" :preview-src-list="scope.row.imgUrls" style="width:50px;height:50px" class="mr-10" />
                    </span>
                </template>
            </BmTableColumn>
            <!-- 页面链接 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.pageHref')" prop="pageHref">
                <template #default="scope">{{ scope.row.pageHref }}</template>
            </BmTableColumn>
            <!-- 手机 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.phone')" prop="phone">
                <template #default="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </BmTableColumn>
            <!-- 邮箱 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.mailbox')" prop="mailbox">
                <template #default="scope">{{ scope.row.mailbox }}</template>
            </BmTableColumn>
            <!-- 创建时间 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.createTime')" prop="createTime">
                <template #default="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </BmTableColumn>
            <!-- 用户信息 -->
            <BmTableColumn :label="$t('sellerFeedbackListTable.userInfo')" prop="userInfo" align="center">
                <template #default="scope">
                    <span class="block">{{ scope.row.userId }}</span>
                    <span>{{ scope.row.userInfo }}</span>
                </template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')">
                <template #default="scope">
                    <el-button v-permission="'feedbackManagement_sellerFeedbackList_look'" type="text" @click.stop="handleAddEdit(scope.row)">{{ $t("table.detail") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 分页 -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pages" :total="pageTotal"></BmPagination>
        <!-- 查看详情弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { feedbackMessage, feedbackClassification, feedbackMessageExport, feedbackMessageChangeRead } from "@/api/operation";
import { getAllStoreInfo } from "@/api/finance";
import AddEdit from "./component/addEdit.vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { exportExcel } from "@/utils/";
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
        let pages = ref(1),
            size = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            size: size,
            pages: pages,
            createTime: [],
            type: 2 // 类型 1会员反馈消息 2卖家反馈消息
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        //搜索
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.createStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.createStartTime = searchForm.createEndTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["status", "source", "feedbackCategoryName", "content", "pageHref", "phone", "mailbox", "createTime", "userInfo"];
        // 获取反馈类型(只在进页面的时候调一次接口)
        let feedbackTypeList = ref([]);
        feedbackClassification({ type: 2 })
            .then((res) => {
                feedbackTypeList.value = res.data;
            })
            .catch(() => {});
        let sellersInfoList = ref([]);
        // 卖家远程搜索
        const allStoreInfo = (keyWord) => {
            if (!keyWord) {
                return;
            }
            getAllStoreInfo({ storeName: keyWord })
                .then((res) => {
                    sellersInfoList.value = res.data;
                })
                .catch((err) => {});
        };
        //获取列表
        const getListPage = () => {
            searchForm.pages = pages.value;
            feedbackMessage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 状态(数字转文字 0：未读 1：已读)
                        for (let i in dict.value.feedbackMessageStatus) {
                            if (dict.value.feedbackMessageStatus[i].value == item.status) {
                                item.statusName = dict.value.feedbackMessageStatus[i].name;
                                break;
                            }
                        }
                        // 来源(数字转文字 1:Android，2:IOS，3:H5，4:PC)
                        for (let i in dict.value.feedbackMessageSource) {
                            if (dict.value.feedbackMessageSource[i].value == item.source) {
                                item.sourceName = dict.value.feedbackMessageSource[i].name;
                                break;
                            }
                        }
                        item.imgUrls = (item.imgUrls && item.imgUrls.split(",")) || [];
                        return item;
                    });
                })
                .catch((err) => {});
        };
        // 查看详情
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (row) => {
            editRow.value = row;
            editVisible.value = true;
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
        // 标为已读
        const handleRead = () => {
            let ids = [];
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            tableSelectionRows.map((item) => {
                ids.push(item.id);
            });
            ids = ids.join(",");
            feedbackMessageChangeRead({ ids: ids })
                .then(() => {})
                .catch(() => {});
            initData();
        };
        // 导出excel表格
        const handleExportExcel = (val) => {
            feedbackMessageExport(searchForm)
                .then((res) => {
                    exportExcel("SellerFeedbackList", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pages = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pages = 1;
            searchForm.size = val;
            initData();
        };
        return {
            dict,
            initData,
            pages,
            size,
            pageTotal,
            searchFormRef,
            handleSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,

            handleSizeChange,
            handleCurrentChange,
            shortcuts,
            disabledDate,
            feedbackTypeList,
            sellersInfoList,
            allStoreInfo,
            handleExportExcel,
            handleAddEdit,
            editVisible,
            editRow,
            handleSelectionChange,
            handleRowClick,
            handleRead
        };
    }
};
</script>
