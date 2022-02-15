<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 卖家信息 -->
                    <el-form-item :label="$t('entryAudit.sellerInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" :placeholder="$t('entryAudit.keywordTips')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 注册日期 -->
                    <el-form-item :label="$t('entryAudit.registerDate')" prop="createTime">
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
                <!-- 注册平台
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('entryAudit.registerPlatform')" prop="registerFrom">
                        <el-select v-model="searchForm.registerFrom" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in fromSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('entryAudit.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable="false">
                            <el-option v-for="item in statusSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                <!-- 展开
        <BmCollapse el="#elCollapse" :isShow="false" />-->
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex mb-10" style="justify-content: flex-end">
            <div class="flex vstart">
                <!-- 导出 -->
                <el-button v-permission="'sellerAdmin_dataChangeAudit_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="entryAuditTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" :column="tableColumn">
            <!-- 卖家信息(店铺名称+店铺ID) -->
            <BmTableColumn :label="$t('entryAuditTable.storeName')" width="250" prop="storeName">
                <template #default="scope">
                    <div>{{ scope.row.storeName }}</div>
                    <div>{{ scope.row.sellerUser.id }}</div>
                </template>
            </BmTableColumn>
            <!-- 卖家身份 -->
            <BmTableColumn :label="$t('entryAuditTable.sellerType')" width="100" prop="sellerType" key="sellerType">
                <template #default="scope">{{ scope.row.sellerTypeName }}</template>
            </BmTableColumn>
            <!-- 贸易形式 -->
            <BmTableColumn :label="$t('entryAuditTable.tradeForm')" width="100" align="center" prop="tradeForm" key="tradeForm">
                <template #default="scope">{{ scope.row.tradeFormName }}</template>
            </BmTableColumn>
            <!-- 修改日期 -->
            <BmTableColumn :label="$t('entryAuditTable.updateTime')" width="160" prop="createTime"></BmTableColumn>
            <!-- 审核人 -->
            <BmTableColumn :label="$t('entryAuditTable.auditUserName')" width="160" prop="auditUserName"></BmTableColumn>
            <!-- 审核日期 -->
            <BmTableColumn :label="$t('entryAuditTable.auditTime')" width="160" prop="auditTime"></BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('entryAuditTable.status')" width="100" prop="status">
                <template #default="scope">
                    <!-- 待审核 -->
                    <span v-if="scope.row.status == 1">
                        {{ $t("status.beAudit") }}
                    </span>
                    <!-- 审核通过 -->
                    <span v-if="scope.row.status == 2">
                        {{ $t("status.auditPass") }}
                    </span>
                    <!-- 作废 -->
                    <span v-if="scope.row.status == 3">
                        {{ $t("entryAuditTable.void") }}
                    </span>
                    <!-- 审核驳回 -->
                    <span v-if="scope.row.status == 4">
                        {{ $t("status.auditRejected") }}
                    </span>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('entryAuditTable.remark')" prop="remark">
                <template #default="scope">{{ scope.row.reason }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="100" align="center">
                <template #default="scope">
                    <!-- 审核 -->
                    <el-button v-if="scope.row.status == 1" v-permission="'sellerAdmin_dataChangeAudit_audit'" @click.stop="handleDetail(scope.row)" type="text">
                        {{ $t("entryAudit.examine") }}
                    </el-button>
                    <!-- 查看 -->
                    <el-button v-else v-permission="'sellerAdmin_dataChangeAudit_look'" @click.stop="handleDetail(scope.row)" type="text">
                        {{ $t("entryAudit.look") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNo" :total="pageTotal"></BmPagination>
    </div>
    <!-- 详情和审核 -->
    <Detail v-model:visible="auditDetailVisible" :storeId="storeIds" :status="statusAudit" v-if="auditDetailVisible" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { sellerStoreFindUpdateAuditList, sellerListExport } from "@/api/store";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { exportExcel } from "@/utils/";
import { useRoute } from "vue-router";
import Detail from "./component/detail.vue";

export default {
    name: "GoodsAttribute",
    components: { Detail },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        // 使用路由
        const route = useRoute();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageNo: 1,
            pageSize: pageSize,
            keyword: "", // 查询关键字
            createTime: [], // 注册日期(包含开始和结束日期)
            registerFrom: null, // 注册平台：后台开户，pc
            status: route.query.status || "" // 店铺状态：1：审核中，2：正常营业，3：停业，4：审核驳回
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 注册平台select选择数据
        const fromSelectList = [
            {
                value: "后台开户",
                label: proxy.$t("entryAudit.backstageOpenAccount")
            },
            { value: "PC", label: "PC" }
        ];
        // 店铺状态select选择数据
        const statusSelectList = [
            { value: "1", label: proxy.$t("entryAudit.examining") },
            { value: "2", label: proxy.$t("entryAudit.openAsUsual") },
            { value: "3", label: proxy.$t("entryAudit.close") },
            { value: "4", label: proxy.$t("entryAudit.examineReject") }
        ];
        //搜索
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.registerEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.registerStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };
        // 快速筛选
        const handleSelect = (num) => {
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["storeName", "sellerType", "tradeForm", "createTime", "auditUserName", "auditTime", "status", "remark"];
        // 用来存储仅退款和退货退款信息条数的对象
        const countList = ref({
            // 仅退款条数
            refundOnly: 0,
            // 退货退款条数
            returnRefund: 0
        });

        //获取列表
        const getListPage = () => {
            sellerStoreFindUpdateAuditList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 卖家类型(数字转文字 1：个人卖家，2：专业卖家)
                        for (let i in dict.value.sellerType) {
                            if (dict.value.sellerType[i].value == item.sellerType) {
                                item.sellerTypeName = dict.value.sellerType[i].name;
                                break;
                            }
                        }
                        // 贸易形式(数字转文字 1：本地贸易，2：跨境贸易)
                        for (let i in dict.value.tradeTypeList) {
                            if (dict.value.tradeTypeList[i].value == item.tradeForm) {
                                item.tradeFormName = dict.value.tradeTypeList[i].name;
                                break;
                            }
                        }
                        // 审核状态(数字转文字 1：审核中，2：正常营业，3：停业, 4：审核驳回)
                        // for (let i in dict.value.storeStatusType) {
                        //     if (dict.value.storeStatusType[i].value == item.status) {
                        //         item.statusName = dict.value.storeStatusType[i].name;
                        //         break;
                        //     }
                        // }

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

        //详情
        let auditDetailVisible = ref(false);
        let storeIds = ref("");
        let statusAudit = ref("");
        const handleDetail = (row) => {
            statusAudit.value = row.status;
            storeIds.value = row.id;
            auditDetailVisible.value = true;
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
        // 导出excel表格
        const handleExportExcel = (val) => {
            sellerListExport(searchForm)
                .then((res) => {
                    exportExcel("StoreChangeAudit", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };

        return {
            dict,
            initData,
            pageSize,
            pageTotal,
            searchFormRef,
            handleSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,
            handleDetail,
            handleSizeChange,
            handleCurrentChange,
            countList,
            handleSelect,
            fromSelectList,
            shortcuts,
            statusSelectList,
            disabledDate,
            handleExportExcel,
            auditDetailVisible,
            storeIds,
            statusAudit
        };
    }
};
</script>
