<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 名称 -->
                    <el-form-item :label="$t('memberFreightTable.tempName')" prop="tempName">
                        <el-input v-model="searchForm.tempName" :placeholder="$t('memberFreightTable.tempName')" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 操作日期 -->
                    <el-form-item :label="$t('memberFreightTable.updateTime')" prop="_tmpTimeValue">
                        <el-date-picker
                            v-model="searchForm._tmpTimeValue"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                        >
                        </el-date-picker>
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
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button v-permission="'logistics_memberFreight_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                    <!-- 编辑
                    <el-button @click="handleAddEdit('edit')" class="mr-15">
                        {{ $t("status.edit") }}
                    </el-button> -->
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作
                    <span>{{ $t("status.batchOperation") }}：</span> -->

                    <!-- 启用 
                    <el-button @click="handleOpenShield(1)">{{ $t("status.enable") }}</el-button>-->
                    <!-- 禁用 
                    <el-button @click="handleOpenShield(0)">{{ $t("status.forbidden") }}</el-button>-->
                    <!-- 删除
                    <el-button @click="handleDelete">{{ $t("status.delete") }}</el-button> -->
                </div>
            </div>
            <div class="flex vstart">
                <!-- 表格选项 -->
                <BmTableOption table="memberFreightTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="tempName" :label="$t('memberFreightTable.tempName')"> </BmTableColumn>
            <!-- 贸易形式 -->
            <BmTableColumn prop="tradeType" :label="$t('memberFreightTable.tradeType')">
                <span class="block">{{ $t("sellerFreight.localTrade") }}</span>
                <span class="block">{{ $t("sellerFreight.crossBorderTrade") }}</span>
            </BmTableColumn>
            <!-- 商品配送形式 -->
            <BmTableColumn prop="freightType" :label="$t('memberFreightTable.freightType')">
                <span>FBT</span>
            </BmTableColumn>
            <!-- 运输方式 -->
            <BmTableColumn prop="sendType" :label="$t('memberFreightTable.sendType')">
                <span>{{ $t("sellerFreight.landCarriage") }}</span>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('memberFreightTable.status')" width="120"
                ><template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('memberFreightTable.createTime')" width="155"></BmTableColumn>
            <BmTableColumn prop="updateTime" :label="$t('memberFreightTable.updateTime')" width="155"></BmTableColumn>
            <!-- 计费方式 -->
            <BmTableColumn prop="valuationMethod" :label="$t('memberFreightTable.valuationMethod')" width="120">{{ $t("memberShippingTemplate.billedByWeight") }} </BmTableColumn>
            <BmTableColumn prop="deliverAddr" :label="$t('memberFreightTable.deliverAddr')" width="120"> </BmTableColumn>
            <BmTableColumn prop="tempDesc" :label="$t('memberFreightTable.tempDesc')"> </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="150" fixed="right">
                <template #default="scope">
                    <!-- 启用禁用 -->
                    <el-button v-permission="'logistics_memberFreight_disable'" v-if="scope.row.status === 0" @click.stop="handleOpenShield(1, scope.row)" type="text">
                        {{ $t("status.forbidden") }}
                    </el-button>
                    <el-button v-permission="'logistics_memberFreight_enable'" v-else @click.stop="handleOpenShield(0, scope.row)" type="text">
                        {{ $t("status.enable") }}
                    </el-button>
                    <!-- 编辑 -->
                    <el-button v-permission="'logistics_memberFreight_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'logistics_memberFreight_del'" @click.stop="handleDelete(scope.row)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 分页 -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
    </div>
    <!-- 新增编辑 -->
    <AddEdit v-if="editVisible" v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { logisticsBuyerFindByConditions, logisticsBuyerDelete, logisticsBuyerUpdateStatus } from "@/api/base";
import { dateShortcuts } from "@/utils/dateShortcuts";
import AddEdit from "./component/addEdit";

export default {
    name: "BaseMemberFreight",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //状态
        const statusList = computed(() => [
            {
                name: proxy.$t("status.enable"),
                value: 0
            },
            {
                name: proxy.$t("status.forbidden"),
                value: 1
            }
        ]);
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: pageSize,
            pageNum: pageNum,
            tempName: "", //名称
            _tmpTimeValue: []
        });
        //搜索
        const handelSearch = () => {
            if (searchForm._tmpTimeValue.length > 0) {
                searchForm.startTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0], true);
                searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1], true);
            }
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.startTime = searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["tempName", "tradeType", "freightType", "sendType", "status", "createTime", "updateTime", "valuationMethod", "deliverAddr", "tempDesc"];

        //获取列表
        const getListPage = () => {
            logisticsBuyerFindByConditions(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value === item.status) {
                                item.statusName = dict.value.forbiddenEnableReverse[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.sendTypeList) {
                            if (dict.value.sendTypeList[i].value === item.sendType) {
                                item.sendTypeName = dict.value.sendTypeList[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.tradeTypeList) {
                            if (dict.value.tradeTypeList[i].value === item.tradeType) {
                                item.tradeTypeName = dict.value.tradeTypeList[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.deliverTypeList) {
                            if (dict.value.deliverTypeList[i].value === item.deliverType) {
                                item.deliverTypeName = dict.value.deliverTypeList[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.freightTypeList) {
                            if (dict.value.freightTypeList[i].value === item.freightType) {
                                item.freightTypeName = dict.value.freightTypeList[i].name;
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
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //删除
        const handleDelete = (row) => {
            proxy
                .$confirm(proxy.$t("warehouse.deleteTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    logisticsBuyerDelete(row.id)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                });
        };

        //开启-屏蔽
        const handleOpenShield = (status, row) => {
            const params = {
                id: row.id,
                status: status
            };
            logisticsBuyerUpdateStatus(params)
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
            shortcuts,
            disabledDate,
            searchFormRef,
            handelSearch,
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
            handleOpenShield,
            detailVisible,
            detailRow,
            handleDetail,
            pageNum,
            pageSize,
            pageTotal,
            handleCurrentChange,
            handleSizeChange
        };
    }
};
</script>
