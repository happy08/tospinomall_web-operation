<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 原因类型 -->
                    <el-form-item :label="$t('afterSalesReasonSetting.causeType')" prop="title">
                        <el-input v-model="searchForm.title" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handleSearch" type="primary">{{ $t("search") }}</el-button>
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
                <!-- 快速筛选区域 -->
                <div class="fl mb-10">
                    <!-- 快速筛选 -->
                    <span>{{ $t("status.rapidCull") }}：</span>

                    <!-- 仅退款 -->
                    <el-button @click="handleSelect(0)">{{ $t("afterSalesReasonSetting.refundOnly") + "(" + countList.refundOnly + ")" }}</el-button>
                    <!-- 退货退款 -->
                    <el-button @click="handleSelect(1)">{{ $t("afterSalesReasonSetting.returnRefund") + "(" + countList.returnRefund + ")" }}</el-button>
                </div>
                <!-- 功能操作区域 -->
                <div class="fl mb-10 ml-50">
                    <span>{{ $t("status.functionalOperation") }}：</span>
                    <!-- 新增 -->
                    <el-button v-permission="'transactionSetting_afterSalesServiceSetting_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                    <!-- 编辑 -->
                    <!-- <el-button @click="handleAddEdit('edit')" class="mr-15">
                        {{ $t("status.edit") }}
                    </el-button> -->
                </div>
            </div>
            <div class="flex vstart">
                <!-- 导出 -->
                <!-- <el-button @click="handleExportExcel">{{
          $t("table.exportExcel")
        }}</el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="afterSalesReasonSettingTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <BmTableColumn prop="goodsStatus" :label="$t('afterSalesReasonSettingTable.goodsStatus')" width="150">
                <template #default="scope">
                    {{ scope.row.goodsStatusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="applyType" :label="$t('afterSalesReasonSettingTable.applyType')" width="150">
                <template #default="scope">
                    {{ scope.row.applyTypeName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="applyReason" :label="$t('afterSalesReasonSettingTable.applyReason')"> </BmTableColumn>
            <BmTableColumn prop="sort" :label="$t('afterSalesReasonSettingTable.sort')" width="60">
                <template #default="scope">
                    {{ scope.row.sort }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('afterSalesReasonSettingTable.status')" width="80" align="center">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('afterSalesReasonSettingTable.create')" width="180" align="center">
                <template #default="scope">
                    <span class="block">{{ scope.row.createUser }}</span>
                    <span class="block">{{ scope.row.createTime }}</span>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('afterSalesReasonSettingTable.lastChange')" width="180" align="center">
                <template #default="scope">
                    <span class="block">{{ scope.row.updateUser }}</span>
                    <span class="block">{{ scope.row.updateTime }}</span>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="150" align="center" fixed="right">
                <template #default="scope">
                    <el-button v-permission="'transactionSetting_afterSalesServiceSetting_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <el-button v-permission="'transactionSetting_afterSalesServiceSetting_del'" @click.stop="handleDelete(scope.row)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { attributeRemoveByIds, attributeUpdateEnableDisableByIds, attributeUpdateById } from "@/api/goods";
import { getOrderReason, delOrderReason } from "@/api/base";
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
        let pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            title: "", //参数名称
            status: "", //状态（0启用 1禁用）
            pageNum: 1,
            orderType: 1,
            pageSize: pageSize
        });
        //搜索
        const handleSearch = () => {
            params.value.applyReason = searchForm.title;
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            params.value.applyReason = "";
            params.value.applyType = "";
            initData();
        };
        // 快速筛选
        const handleSelect = (num) => {
            searchForm.applyType = num;
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["goodsStatus", "applyType", "applyReason", "sort", "status", "create", "lastChange"];
        // 用来存储仅退款和退货退款信息条数的对象
        const countList = ref({
            // 仅退款条数
            refundOnly: 0,
            // 退货退款条数
            returnRefund: 0
        });
        const params = ref({ orderType: 1 });
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            // 重置仅退款和退货退款信息统计条数
            countList.value.refundOnly = 0;
            countList.value.returnRefund = 0;

            getOrderReason(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        if (item.applyType == 0) {
                            countList.value.refundOnly++;
                        } else {
                            countList.value.returnRefund++;
                        }
                        // 货物状态转换(数字转文字：0.未收到货 1.已收到货)
                        for (let i in dict.value.goodsStatus) {
                            if (dict.value.goodsStatus[i].value === item.goodsStatus) {
                                item.goodsStatusName = dict.value.goodsStatus[i].name;
                                break;
                            }
                        }

                        // 售后类型转换(数字转文字：0：仅退款，1：退货退款)
                        for (let i in dict.value.afterSaleType) {
                            if (dict.value.afterSaleType[i].value === item.applyType) {
                                item.applyTypeName = dict.value.afterSaleType[i].name;
                                break;
                            }
                        }
                        // 启用禁用转换(数字转文字：0启用 1禁用)
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value === item.status) {
                                item.statusName = dict.value.forbiddenEnableReverse[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                })
                .catch((err) => {});
            pageFlag.value = false;
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
            console.log(params.value);
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
            console.log("row", row);
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
            searchForm.pageNum = val;
            pageFlag.value = true;
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
            pageFlag,
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
            params,
            handleSelect
        };
    }
};
</script>
