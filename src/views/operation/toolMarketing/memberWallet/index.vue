<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <!-- <div class="ptb-15 pl-15" style="backgroundColor:#F2F2F2">
      <span class="fs-20">
        {{ $t('memberWallet.rechargeBalance') }}
      </span>
    </div> -->

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 充值信息-->
                    <el-form-item :label="$t('memberWallet.rechargeInfo')" prop="name">
                        <el-input v-model="searchForm.name" :placeholder="$t('memberWallet.pleaseEnter')"></el-input>
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
            </div>
        </el-form>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div class="fl mb-10 mr-15">
                <!-- 新增 -->
                <el-button v-permission="'toolMarketing_memberWallet_add'" @click="handleAddEdit({ type: 1 }, 'add')" type="primary"> +{{ $t("status.add") }} </el-button>
                <!-- 启用 -->
                <el-button v-permission="'toolMarketing_memberWallet_enable'" @click="handleEnableFrozen(0, 'batch')">
                    {{ $t("status.enable") }}
                </el-button>
                <!-- 禁用 -->
                <el-button v-permission="'toolMarketing_memberWallet_disable'" @click="handleEnableFrozen(1, 'batch')">
                    {{ $t("status.forbidden") }}
                </el-button>
                <!-- 删除 -->
                <el-button v-permission="'toolMarketing_memberWallet_del'" @click="handleDelete('batch')">
                    {{ $t("status.delete") }}
                </el-button>
            </div>
            <div>
                <el-radio-group v-model="searchForm.type" @change="handleChangeCardType" class="fl mr-30">
                    <!-- 固定充值卡 -->
                    <el-radio-button :label="1">{{ $t("memberWallet.fixedRechargeCard") }}</el-radio-button>
                    <!-- 自由充值卡 -->
                    <el-radio-button :label="2">{{ $t("memberWallet.freeRechargeCard") }}</el-radio-button>
                </el-radio-group>
                <!-- 导出 -->
                <!-- <el-button @click="handleExportExcel">
                    {{ $t('table.exportExcel') }}
                </el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="memberWalletTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <!-- 固定充值卡 -->
        <BmTable v-if="searchForm.type == 1" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" :column="tableColumn">
            <!-- 多选列 -->
            <BmTableColumn type="selection"> </BmTableColumn>
            <!-- ID -->
            <BmTableColumn :label="$t('memberWalletTable.id')" prop="id">
                <template #default="scope">
                    <span class="block tc">{{ scope.row.id }}</span>
                </template>
            </BmTableColumn>
            <!-- 充值组名称 -->
            <BmTableColumn :label="$t('memberWalletTable.name')" prop="name" key="name">
                <template #default="scope">{{ scope.row.name }}</template>
            </BmTableColumn>
            <!-- 充值卡类型 -->
            <BmTableColumn :label="$t('memberWalletTable.type')" prop="type" key="type">
                <template #default="scope">{{ scope.row.typeName }}</template>
            </BmTableColumn>
            <!-- 固定充值视图 -->
            <!-- 充值金额 -->
            <BmTableColumn :label="$t('memberWalletTable.rechargeAmount')" align="center" prop="rechargeAmount" key="rechargeAmount">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.cardItems" :key="index">
                        <div v-if="index == 0" class="p-10">
                            {{ item.rechargeAmount }}
                        </div>
                        <div v-else class="p-10" style="border-top:solid 1px #e8e8e8">
                            {{ item.rechargeAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 最高充值赠送金额 -->
            <!-- <BmTableColumn
                v-if="searchForm.type == 2"
                :label="$t('memberWallet.maxAmount')"
                align="center"
                class="p-0"
                key="maxAmount"
            >
                <template #default="scope">
                    <div
                        v-for="(item, index) in scope.row.cardItems"
                        :key="index"
                    >
                        <div v-if="index == 0" class="p-10">
                            {{ item.giftAmount }}
                        </div>
                        <div
                            v-else
                            class="p-10"
                            style="border-top:solid 1px #e8e8e8"
                        >
                            {{ item.giftAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn> -->
            <!-- 增长金额 -->
            <!-- <BmTableColumn
                v-if="searchForm.type == 2"
                :label="$t('memberWallet.addAmount')"
                align="center"
                class="p-0"
                key="addAmount"
            >
                <template #default="scope">
                    <div
                        v-for="(item, index) in scope.row.cardItems"
                        :key="index"
                    >
                        <div v-if="index == 0" class="p-10">
                            {{ item.addAmount }}
                        </div>
                        <div
                            v-else
                            class="p-10"
                            style="border-top:solid 1px #e8e8e8"
                        >
                            {{ item.addAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn> -->
            <!-- 赠送金额 -->
            <BmTableColumn :label="$t('memberWalletTable.giftAmount')" align="center" class="p-0" prop="giftAmount" key="giftAmount" @selection-change="handleSelectionChange">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.cardItems" :key="index">
                        <div v-if="index == 0" class="p-10">
                            {{ item.giftAmount }}
                        </div>
                        <div v-else class="p-10" style="border-top:solid 1px #e8e8e8">
                            {{ item.giftAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 开始时间 -->
            <BmTableColumn :label="$t('memberWalletTable.termOfValidityStartTime')" prop="termOfValidityStartTime" key="termOfValidityStartTime">
                <template #default="scope">{{ scope.row.termOfValidityStartTime }}</template>
            </BmTableColumn>
            <!-- 结束日期 -->
            <BmTableColumn :label="$t('memberWalletTable.termOfValidityEndTime')" prop="termOfValidityEndTime" key="termOfValidityEndTime">
                <template #default="scope">{{ scope.row.termOfValidityEndTime }}</template>
            </BmTableColumn>
            <!-- 创建人 -->
            <BmTableColumn :label="$t('memberWalletTable.createUser')" prop="createUser" key="createUser">
                <template #default="scope">{{ scope.row.createUser }}</template>
            </BmTableColumn>
            <!-- 创建时间 -->
            <BmTableColumn :label="$t('memberWalletTable.createTime')" prop="createTime" key="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('memberWalletTable.status')" prop="status" key="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center" key="operation">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button v-permission="'toolMarketing_memberWallet_edit'" @click.stop="handleAddEdit(scope.row, 'edit')" type="text">{{ $t("status.edit") }}</el-button>
                    <!-- 启用/禁用 （0启用 1禁用）-->
                    <!-- 启用 -->
                    <el-button v-permission="'toolMarketing_memberWallet_enable'" v-if="scope.row.status == 1" @click.stop="handleEnableFrozen(0, scope.row.id)" type="text">{{
                        $t("status.enable")
                    }}</el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'toolMarketing_memberWallet_disable'" v-else-if="scope.row.status == 0" @click.stop="handleEnableFrozen(1, scope.row.id)" type="text">{{
                        $t("status.forbidden")
                    }}</el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'toolMarketing_memberWallet_del'" @click.stop="handleDelete(scope.row.id)" type="text">{{ $t("status.delete") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 自由充值卡 -->
        <BmTable v-else ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" :column="tableColumn">
            <!-- 多选列 -->
            <BmTableColumn type="selection"> </BmTableColumn>
            <!-- ID -->
            <BmTableColumn :label="$t('memberWalletTable.id')" prop="id">
                <template #default="scope">
                    <span class="block tc">{{ scope.row.id }}</span>
                </template>
            </BmTableColumn>
            <!-- 充值组名称 -->
            <BmTableColumn :label="$t('memberWalletTable.name')" prop="name" key="name">
                <template #default="scope">{{ scope.row.name }}</template>
            </BmTableColumn>
            <!-- 充值卡类型 -->
            <BmTableColumn :label="$t('memberWalletTable.type')" prop="type" key="type">
                <template #default="scope">{{ scope.row.typeName }}</template>
            </BmTableColumn>
            <!-- 固定充值视图 -->
            <!-- 充值金额 -->
            <BmTableColumn :label="$t('memberWalletTable.rechargeAmount')" align="center" prop="rechargeAmount" key="rechargeAmount">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.cardItems" :key="index">
                        <div v-if="index == 0" class="p-10">
                            {{ item.rechargeAmount }}
                        </div>
                        <div v-else class="p-10" style="border-top:solid 1px #e8e8e8">
                            {{ item.rechargeAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 最高充值赠送金额 -->
            <BmTableColumn v-if="searchForm.type == 2" :label="$t('memberWallet.maxAmount')" align="center" class="p-0" key="maxAmount">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.cardItems" :key="index">
                        <div v-if="index == 0" class="p-10">
                            {{ item.giftAmount }}
                        </div>
                        <div v-else class="p-10" style="border-top:solid 1px #e8e8e8">
                            {{ item.giftAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 增长金额 -->
            <BmTableColumn v-if="searchForm.type == 2" :label="$t('memberWallet.addAmount')" align="center" class="p-0" key="addAmount">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.cardItems" :key="index">
                        <div v-if="index == 0" class="p-10">
                            {{ item.addAmount }}
                        </div>
                        <div v-else class="p-10" style="border-top:solid 1px #e8e8e8">
                            {{ item.addAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 赠送金额 -->
            <BmTableColumn :label="$t('memberWalletTable.giftAmount')" align="center" class="p-0" prop="giftAmount" key="giftAmount">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.cardItems" :key="index">
                        <div v-if="index == 0" class="p-10">
                            {{ item.giftAmount }}
                        </div>
                        <div v-else class="p-10" style="border-top:solid 1px #e8e8e8">
                            {{ item.giftAmount }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 开始时间 -->
            <BmTableColumn :label="$t('memberWalletTable.termOfValidityStartTime')" prop="termOfValidityStartTime" key="termOfValidityStartTime">
                <template #default="scope">{{ scope.row.termOfValidityStartTime }}</template>
            </BmTableColumn>
            <!-- 结束日期 -->
            <BmTableColumn :label="$t('memberWalletTable.termOfValidityEndTime')" prop="termOfValidityEndTime" key="termOfValidityEndTime">
                <template #default="scope">{{ scope.row.termOfValidityEndTime }}</template>
            </BmTableColumn>
            <!-- 创建人 -->
            <BmTableColumn :label="$t('memberWalletTable.createUser')" prop="createUser" key="createUser">
                <template #default="scope">{{ scope.row.createUser }}</template>
            </BmTableColumn>
            <!-- 创建时间 -->
            <BmTableColumn :label="$t('memberWalletTable.createTime')" prop="createTime" key="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('memberWalletTable.status')" prop="status" key="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center" key="operation">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button v-permission="'toolMarketing_memberWallet_edit'" @click.stop="handleAddEdit(scope.row, 'edit')" type="text">{{ $t("status.edit") }}</el-button>
                    <!-- 启用/禁用 （0启用 1禁用）-->
                    <!-- 启用 -->
                    <el-button v-permission="'toolMarketing_memberWallet_enable'" v-if="scope.row.status == 1" @click.stop="handleEnableFrozen(0, scope.row.id)" type="text">{{
                        $t("status.enable")
                    }}</el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'toolMarketing_memberWallet_disable'" v-else-if="scope.row.status == 0" @click.stop="handleEnableFrozen(1, scope.row.id)" type="text">{{
                        $t("status.forbidden")
                    }}</el-button>
                    <!-- 删除 -->
                    <el-button v-permission="'toolMarketing_memberWallet_del'" @click.stop="handleDelete(scope.row.id)" type="text">{{ $t("status.delete") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"></BmPagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { getUserInfoByCondition, enableOrDisableUser } from "@/api/member";
import { memberWalletQuery, enableRechargeCard, removeRechargeCardById } from "@/api/operation";
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
            pageNum: 1,
            pageSize: pageSize,
            name: null, // 充值组名称
            type: 1 // 充值卡类型(1固定充值卡 2自由充值卡）
        });
        // 注册平台select选择数据
        const fromSelectList = [
            { value: "android", label: "android" },
            { value: "ios", label: "ios" },
            { value: "pc", label: "pc" },
            { value: "h5", label: "h5" }
        ];
        //搜索
        // 切换充值卡类型进行搜索
        const handleChangeCardType = (type) => {
            //console.log('type', type, searchForm)
            //searchForm.type = type
            initData();
        };
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.registerEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.registerStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.registerStartTime = searchForm.registerEndTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        // 快速筛选
        const handleSelect = (num) => {
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);
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
        //表格选项的列
        const tableColumn = ["id", "name", "type", "rechargeAmount", "giftAmount", "termOfValidityStartTime", "termOfValidityEndTime", "createUser", "createTime", "status"];
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }

            memberWalletQuery(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 充值卡类型(数字转文字 0启用 1禁用)
                        for (let i in dict.value.rechargeCardType) {
                            if (dict.value.rechargeCardType[i].value == item.type) {
                                item.typeName = dict.value.rechargeCardType[i].name;
                                break;
                            }
                        }
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
            pageFlag.value = false;
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        // 启用/禁用
        const handleEnableFrozen = (status, userId) => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            proxy
                .$confirm(status == 1 ? proxy.$t("memberWallet.cancelOperationTips") : proxy.$t("memberWallet.confirmOperationTips"), proxy.$t("memberWallet.confirmOperation"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "info"
                })
                .then(() => {
                    // 批量操作的id数组
                    let ids = [];
                    // 判断是批量操作还是单行操作
                    if (userId == "batch") {
                        //批量操作
                        // 循环选中的行取得ID数组
                        tableSelectionRows.map((item, index) => {
                            ids[index] = item.id;
                        });
                    } else {
                        //单行操作
                        ids[0] = userId;
                    }
                    enableRechargeCard({ status, ids })
                        .then((res) => {
                            initData();
                        })
                        .catch(() => {});
                });
        };
        // 删除
        const handleDelete = (id) => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            // 要删除行的id数组
            let ids = [];
            // 判断是批量操作还是单行操作
            if (id == "batch") {
                // 批量操作
                // 循环选中的行取得ID数组
                tableSelectionRows.map((item, index) => {
                    ids[index] = item.id;
                });
            } else {
                // 单行操作
                ids[0] = id;
            }
            ids = ids.join(",");
            proxy
                .$confirm(proxy.$t("memberWallet.deleteOperationTips"), proxy.$t("memberWallet.confirmOperation"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "info"
                })
                .then(() => {
                    // let xmlHttp = new XMLHttpRequest()
                    // xmlHttp.open('delete','ids=' + ids)
                    // xmlHttp.onreadystatechange = function () {
                    //     if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    //         console.log(xmlHttp.responseText)
                    //     }
                    // }
                    // xmlHttp.send()
                    removeRechargeCardById(ids)
                        .then((res) => {
                            initData();
                        })
                        .catch(() => {});
                });
        };
        initData();
        // 查看
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (row, type) => {
            // 判断操作类型
            if (type == "add") {
                // 新增
                editRow.value = {
                    type: row.type, // 充值卡类型
                    cardItems: [
                        {
                            addAmount: "",
                            cardId: "",
                            giftAmount: "",
                            id: "",
                            maxAmount: "",
                            minAmount: ""
                        }
                    ],
                    cardName: searchForm.type == 1 ? "fixed" : "free",
                    cardType: searchForm.type
                };
            } else {
                // 编辑
                editRow.value = { ...row, cardName: searchForm.type == 1 ? "fixed" : "free", cardType: searchForm.type };
            }
            editVisible.value = true;
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

            editVisible,
            editRow,
            handleAddEdit,
            handleSizeChange,
            handleCurrentChange,
            handleSelect,
            fromSelectList,
            handleEnableFrozen,
            handleChangeCardType,
            handleRowClick,
            handleSelectionChange,
            handleDelete
        };
    }
};
</script>
