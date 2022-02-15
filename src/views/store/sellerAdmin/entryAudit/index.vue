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
                <el-button v-permission="'sellerAdmin_sellerList_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="entryAuditTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- 卖家信息(店铺名称+店铺ID) -->
            <BmTableColumn :label="$t('entryAuditTable.storeName')" width="170" prop="storeName">
                <template #default="scope">
                    <span class="block tc">{{ scope.row.storeName }}</span>
                    <span class="block tc">{{ scope.row.sellerUser.id }}</span>
                </template>
            </BmTableColumn>
            <!-- 账户 -->
            <BmTableColumn :label="$t('entryAuditTable.account')" width="130" prop="account">
                <template #default="scope">{{ scope.row.sellerUser.account }}</template>
            </BmTableColumn>
            <!-- 手机号 -->
            <BmTableColumn :label="$t('entryAuditTable.phone')" width="120" prop="phone" key="phone">
                <template #default="scope">{{ scope.row.sellerUser.phonePrefix }} {{ scope.row.sellerUser.phone }}</template>
            </BmTableColumn>
            <!-- 邮箱 -->
            <BmTableColumn :label="$t('entryAuditTable.email')" width="160" prop="email" key="email">
                <template #default="scope">{{ scope.row.sellerUser.email }}</template>
            </BmTableColumn>
            <!-- 卖家身份 -->
            <BmTableColumn :label="$t('entryAuditTable.sellerType')" width="80" prop="sellerType" key="sellerType">
                <template #default="scope">{{ scope.row.sellerTypeName }}</template>
            </BmTableColumn>
            <!-- 注册平台 -->
            <BmTableColumn :label="$t('entryAuditTable.registerFrom')" width="80" prop="registerFrom" key="registerFrom">
                <template #default="scope">{{ scope.row.sellerUser.registerFrom }}</template>
            </BmTableColumn>
            <!-- 入驻类型 -->
            <BmTableColumn :label="$t('entryAuditTable.enterType')" width="60" prop="enterType" key="enterType">
                <template #default="scope">{{ scope.row.enterTypeName }}</template>
            </BmTableColumn>
            <!-- 贸易形式 -->
            <BmTableColumn :label="$t('entryAuditTable.tradeForm')" width="80" align="center" prop="tradeForm" key="tradeForm">
                <template #default="scope">{{ scope.row.tradeFormName }}</template>
            </BmTableColumn>
            <!-- 注册日期 -->
            <BmTableColumn :label="$t('entryAuditTable.createTime')" width="160" prop="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 审核日期 -->
            <BmTableColumn :label="$t('entryAuditTable.auditTime')" width="160" prop="auditTime">
                <template #default="scope">
                    <span class="block tc">{{ scope.row.auditUserName }}</span>
                    <span class="block tc">{{ scope.row.auditTime }}</span>
                </template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('entryAuditTable.status')" width="80" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('entryAuditTable.remark')" prop="remark">
                <template #default="scope">{{ scope.row.reason }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                <template #default="scope">
                    <!-- 审核 -->
                    <!-- 对应关系 id-storeId userId-sellerId -->
                    <el-button v-permission="'sellerAdmin_sellerList_audit'" v-if="scope.row.status == 1" @click.stop="handleAddEdit(scope.row.userId, scope.row.id, 'audit')" type="text">{{
                        $t("entryAudit.examine")
                    }}</el-button>
                    <!-- 查看 -->
                    <el-button v-permission="'sellerAdmin_sellerList_look'" @click.stop="handleAddEdit(scope.row.userId, scope.row.id, 'look')" type="text">{{ $t("entryAudit.look") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"></BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" :selectData="fromSelectList" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { attributeUpdateById } from "@/api/goods";
import { getOrderReason, delOrderReason } from "@/api/base";
import { getSellerList, getSellerInfoByID, sellerListExport } from "@/api/store";
import { dateShortcuts } from "@/utils/dateShortcuts";
import AddEdit from "./component/addEdit";
import { exportExcel } from "@/utils/";
import { useRoute } from "vue-router";
export default {
    name: "GoodsAttribute",
    components: { AddEdit },
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
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageNo: pageNo,
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
        const tableColumn = ["storeName", "account", "phone", "email", "sellerType", "registerFrom", "enterType", "tradeForm", "createTime", "auditTime", "status", "remark"];
        // 用来存储仅退款和退货退款信息条数的对象
        const countList = ref({
            // 仅退款条数
            refundOnly: 0,
            // 退货退款条数
            returnRefund: 0
        });
        //获取列表
        const getListPage = () => {
            getSellerList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    //tableData.value = res.data;
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
                        // 审核状态(数字转文字 1：审核中，2：正常营业，3：停业)
                        for (let i in dict.value.storeStatusType) {
                            if (dict.value.storeStatusType[i].value == item.status) {
                                item.statusName = dict.value.storeStatusType[i].name;
                                break;
                            }
                        }
                        // 入驻类型(数字转文字 1：新注册，2：站点开通)
                        for (let i in dict.value.enterType) {
                            if (dict.value.enterType[i].value == item.enterType) {
                                item.enterTypeName = dict.value.enterType[i].name;
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
        //双击行编辑
        const handleRowdblClick = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };
        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (sellerId, storeId, updateType) => {
            getSellerInfoByID({ sellerId: sellerId, storeId: storeId })
                .then((res) => {
                    let data = res.data;
                    data.updateType = updateType;
                    //卖家类型(数字转文字 1：个人卖家，2：专业卖家)
                    for (let i in dict.value.sellerType) {
                        if (dict.value.sellerType[i].value == data.sellerType) {
                            data.sellerTypeName = dict.value.sellerType[i].name;
                            break;
                        }
                    }

                    // 贸易形式(数字转文字 1：本地贸易，2：跨境贸易)
                    for (let i in dict.value.tradeTypeList) {
                        if (dict.value.tradeTypeList[i].value == data.tradeForm) {
                            data.tradeFormName = dict.value.tradeTypeList[i].name;
                            break;
                        }
                    }
                    // 审核状态(数字转文字 1：审核中，2：正常营业，3：停业)
                    for (let i in dict.value.storeStatusType) {
                        if (dict.value.storeStatusType[i].value == data.status) {
                            data.statusName = dict.value.storeStatusType[i].name;
                            break;
                        }
                    }
                    // 入驻类型(数字转文字 1：新注册，2：站点开通)
                    for (let i in dict.value.enterType) {
                        if (dict.value.enterType[i].value == data.enterType) {
                            data.enterTypeName = dict.value.enterType[i].name;
                            break;
                        }
                    }
                    // 店铺类型(数字转文字 1.普通店铺)
                    for (let i in dict.value.storeType) {
                        if (dict.value.storeType[i].value == data.storeType) {
                            data.storeTypeName = dict.value.storeType[i].name;
                            break;
                        }
                    }
                    // 身份证类型(数字转文字 1：中国大陆身份证，2：ID证件)
                    for (let i in dict.value.idCardType) {
                        if (dict.value.idCardType[i].value == data.papersType) {
                            data.papersTypeName = dict.value.idCardType[i].name;
                            break;
                        }
                    }
                    //   // 主营类目，数组转字符串
                    if (data.mainBusinessTypeNames.length <= 1) {
                        data.mainBusinessTypeName = data.mainBusinessTypeNames.join("");
                    } else {
                        data.mainBusinessTypeName = data.mainBusinessTypeNames.join(",");
                    }
                    // 首先判断是个人卖家还是专业卖家
                    if (data.sellerType !== "1") {
                        // 公司登记状态字段( 根据营业期限判断)
                        if (data.umsSellerCompany.expiredIsForever) {
                            // 如果expiredIsForever字段有值，公司登记状态为'在营'
                            data.umsSellerCompany.companyStatus = proxy.$t("entryAudit.inBusiness");
                        } else {
                            let now = new Date().getTime();
                            // 当前时间毫秒数
                            // data中的法定代表人证件有效期毫秒数
                            let dataTime = new Date(data.papersExpired).getTime();
                            if (dataTime > now) {
                                data.umsSellerCompany.companyStatus = proxy.$t("entryAudit.inBusiness");
                            } else {
                                data.umsSellerCompany.companyStatus = proxy.$t("entryAudit.businessSuspended");
                            }
                        }
                    }
                    //debugger
                    editRow.value = data;

                    editVisible.value = true;
                })
                .catch((err) => {
                    //proxy.$message.error(err.msg)
                });
        };
        //删除
        const handleDelete = (row) => {
            delOrderReason(row.id, 1)
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

        //修改关联类目
        const changeGoodsMode = (row) => {
            attributeUpdateById(row)
                .then((res) => {
                    proxy.$message.success(res.msg);
                })
                .catch(() => {
                    initData();
                });
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
                    exportExcel("SettledAudit", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            dict,
            initData,
            pageNo,
            pageSize,
            pageTotal,
            searchFormRef,
            handleSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,

            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete,
            detailVisible,
            detailRow,
            handleDetail,
            changeGoodsMode,
            handleSizeChange,
            handleCurrentChange,
            countList,
            handleSelect,
            fromSelectList,
            shortcuts,
            statusSelectList,
            disabledDate,
            handleExportExcel
        };
    }
};
</script>
