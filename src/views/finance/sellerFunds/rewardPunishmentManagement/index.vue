<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 创建日期 -->
                    <el-form-item :label="$t('rewardPunishmentManagementTable.createTime')" prop="createTime">
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
                    <!-- 店铺名称/编码-->
                    <el-form-item prop="keyValue">
                        <template #label>
                            <el-select v-model="searchForm.keyWord">
                                <el-option v-for="item in storeNameTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </template>
                        <el-select v-model="searchForm.sellerId" filterable remote reserve-keyword :placeholder="$t('pleaseEnter')" :remote-method="allStoreInfo" :loading="loading">
                            <el-option v-for="item in list" :key="item.userId" :label="searchForm.keyWord == 'storeName' ? item.storeName : item.storeCode" :value="item.userId"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 关联单号-->
                    <el-form-item :label="$t('rewardPunishmentManagementTable.associatedNo')" prop="associatedNo">
                        <el-input v-model="searchForm.associatedNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 赏罚类型 -->
                    <el-form-item :label="$t('rewardPunishmentManagementTable.rewardType')" prop="rewardType">
                        <el-select v-model="searchForm.rewardType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in rewardPunishmentTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <!-- <el-form-item :label="$t('status.status')" prop="status">
            <el-select
              v-model="searchForm.status"
              :placeholder="$t('pleaseSelect')"
            >
              <el-option
                v-for="item in statusSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 单据编号-->
                    <el-form-item :label="$t('rewardPunishmentManagementTable.receiptNum')" prop="receiptNum">
                        <el-input v-model="searchForm.receiptNum" :placeholder="$t('pleaseEnter')"></el-input>
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
                <BmCollapse el="#elCollapse" :isShow="false" />
            </div>
        </el-form>
    </div>
    <!-- 统计显示区域 -->
    <div class="flex between vcenter bg-white p-25">
        <!-- 奖励金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>{{ $t("rewardPunishmentManagement.rewardAmount") }}({{ $store.state.app.currencySymbol }})</div>
            <div class="fw fs-20">{{ dataCount.rewardAmount }}</div>
        </div>
        <!-- 奖励笔数 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>{{ $t("rewardPunishmentManagement.rewardCount") }}({{ $t("billingDetails.frequency") }})</div>
            <div class="fw fs-20">{{ dataCount.rewardCount }}</div>
        </div>
        <!-- 处罚金额 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>{{ $t("rewardPunishmentManagement.punishAmount") }}({{ $store.state.app.currencySymbol }})</div>
            <div class="fw fs-20">{{ dataCount.punishAmount }}</div>
        </div>
        <!-- 处罚笔数 -->
        <div class="border round-4 tc p-20" style="width:340px;height:100px">
            <div>{{ $t("rewardPunishmentManagement.punishCount") }}({{ $t("billingDetails.frequency") }})</div>
            <div class="fw fs-20">{{ dataCount.punishCount }}</div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex mb-10 between">
            <div>
                <el-radio-group v-model="searchForm.status" @change="handleChangeStatus">
                    <!-- 全部 -->
                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                    <!-- 待审核 -->
                    <el-radio-button :label="0">{{ $t("rewardPunishmentManagement.pendingReview") }}</el-radio-button>
                    <!-- 已审核 -->
                    <el-radio-button :label="1">{{ $t("rewardPunishmentManagement.audited") }}</el-radio-button>
                    <!-- 已作废 -->
                    <el-radio-button :label="2">{{ $t("rewardPunishmentManagement.void") }}</el-radio-button>
                </el-radio-group>
                <!-- 添加 -->
                <el-button v-permission="'sellerFunds_rewardPunishmentManagement_add'" @click="handleAddEdit({}, 'add')" class="ml-30">+{{ $t("status.add") }}</el-button>
            </div>
            <div class="flex">
                <!-- 表格选项 -->
                <BmTableOption table="rewardPunishmentManagementTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :column="tableColumn">
            <!-- 赏罚类型) -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.rewardType')" prop="rewardType">
                <template #default="scope">{{ scope.row.rewardTypeName }}</template>
            </BmTableColumn>
            <!-- 单据编号 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.receiptNum')" prop="receiptNum">
                <template #default="scope">{{ scope.row.receiptNum }}</template>
            </BmTableColumn>
            <!-- 关联单号 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.associatedNo')" width="200" prop="associatedNo">
                <template #default="scope">
                    <!-- <span v-for="(item, index) in scope.row.associatedNo2" :key="item">
            {{ index }}+ {{ item }}
          </span> -->

                    <!-- 提现 -->
                    <span class="block">{{ $t("rewardPunishmentManagement.withdraw") }}: {{ scope.row.associatedNo2["3"] }}</span>
                    <!-- 订单 -->
                    <span class="block">{{ $t("rewardPunishmentManagement.order") }}: {{ scope.row.associatedNo2[1] }}</span>
                    <!-- 售后 -->
                    <span class="block">{{ $t("rewardPunishmentManagement.afterSale") }}: {{ scope.row.associatedNo2[2] }}</span>
                </template>
            </BmTableColumn>
            <!-- 卖家信息 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.sellerInfo')" align="center" prop="sellerInfo">
                <template #default="scope">
                    <span class="block">{{ scope.row.storeName }}</span>
                    <span class="block">{{ scope.row.sellerId }}</span>
                </template>
            </BmTableColumn>
            <!-- 金额 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.amount') + '(' + $store.state.app.currencySymbol + ')'" prop="amount">
                <template #default="scope">{{ scope.row.rewardType == 2 ? "-" : "" }}{{ scope.row.amount }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.status')" align="center" prop="status">
                <template #default="scope">
                    <span class="block">{{ scope.row.statusName }}</span>
                    <el-button v-permission="'sellerFunds_rewardPunishmentManagement_lookDetail'" v-if="scope.row.status != 0" type="text" @click="handleAddEdit(scope.row, 'detail')">{{
                        $t("rewardPunishmentManagement.lookAuditDetail")
                    }}</el-button>
                </template>
            </BmTableColumn>
            <!-- 创建日期 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.createTime')" prop="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 审核日期 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.approvalDate')" prop="approvalDate">
                <template #default="scope">{{ scope.row.approvalDate }}</template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn :label="$t('rewardPunishmentManagementTable.remark')" prop="remark">
                <template #default="scope">{{ scope.row.remark }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                <template #default="scope">
                    <!-- 处理 -->
                    <el-button v-permission="'sellerFunds_rewardPunishmentManagement_audit'" v-if="scope.row.status == 0" @click.stop="handleAddEdit(scope.row, 'deal')" type="text">
                        {{ $t("rewardPunishmentManagement.deal") }}
                    </el-button>
                    <!-- 编辑
                    <el-button v-permission="'sellerFunds_rewardPunishmentManagement_edit'" v-if="scope.row.status == 1" @click.stop="handleAddEdit(scope.row, 'edit')" type="text">{{
                        $t("status.edit")
                    }}</el-button> -->
                    <!-- 查看 -->
                    <el-button v-permission="'sellerFunds_rewardPunishmentManagement_look'" @click.stop="handleAddEdit(scope.row, 'look')" type="text">
                        {{ $t("rewardPunishmentManagement.look") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNo" :total="pageTotal"></BmPagination>
        <!-- 新增/编辑弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
        <!-- 查看弹窗 -->
        <Look v-model:visible="lookVisible" :row="editRow" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import AddEdit from "./component/addEdit";
import Look from "./component/look";
import { getBillingDetails, rewardPunishmentList, getAllStoreInfo } from "@/api/finance";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    name: "GoodsAttribute",
    components: { AddEdit, Look },
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
            pageSize: pageSize,
            pageNo: 1,
            createTime: [],
            status: "", // 赏罚状态(0待审核1已审核2已作废)
            rewardType: "", // 赏罚类型(1奖励2处罚)
            keyWord: "storeName"
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 状态select选择数据
        const statusSelectList = [
            { value: "", label: proxy.$t("status.all") },
            {
                value: 0,
                label: proxy.$t("rewardPunishmentManagement.pendingReview")
            },
            { value: 1, label: proxy.$t("rewardPunishmentManagement.audited") },
            { value: 2, label: proxy.$t("rewardPunishmentManagement.void") }
        ];
        // 赏罚select数据
        const rewardPunishmentTypeSelect = [
            { value: "", label: proxy.$t("status.all") },
            { value: 1, label: proxy.$t("rewardPunishmentManagement.award") },
            {
                value: 2,
                label: proxy.$t("rewardPunishmentManagement.Punishment")
            }
        ];
        // 店铺名称/编码select数据
        const storeNameTypeSelect = [
            {
                value: "storeName",
                label: proxy.$t("sellerReconciliationCenter.storeName")
            },
            {
                value: "storeCode",
                label: proxy.$t("sellerReconciliationCenter.storeCode")
            }
        ];
        // 远程搜索刷新效果控制变量
        let loading = ref(false);
        let options = ref([]);
        let list = ref([]);
        // 店铺远程搜索
        const allStoreInfo = (keyWord) => {
            //   debugger
            if (!keyWord) {
                return;
            }
            getAllStoreInfo({ [searchForm.keyWord]: keyWord })
                .then((res) => {
                    list.value = res.data;
                })
                .catch((err) => {});
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
            searchForm.sellerId = searchForm.createStartTime = searchForm.createEndTime = "";
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
        const tableColumn = ["rewardType", "receiptNum", "associatedNo", "sellerInfo", "amount", "status", "createTime", "approvalDate", "remark"];
        // 用来统计收支金额和笔数的数据对象
        let dataCount = ref({});
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }

            rewardPunishmentList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.rewardManagements.total;
                    let { rewardManagements } = res.data;
                    dataCount.value = res.data;
                    tableData.value = rewardManagements.records.map((item) => {
                        // 图片url字符串转数组
                        item.voucherPic = (item.voucherPic && item.voucherPic.split(",")) || [];
                        item.approvalPic = (item.approvalPic && item.approvalPic.split(",")) || [];
                        // 关联单号josn字符串转对象
                        item.associatedNo2 = eval("(" + item.associatedNo + ")");

                        // 赏罚类型(数字转文字 1奖励2处罚)
                        for (let i in dict.value.rewardPunishmentType) {
                            if (dict.value.rewardPunishmentType[i].value == item.rewardType) {
                                item.rewardTypeName = dict.value.rewardPunishmentType[i].name;
                                break;
                            }
                        }
                        // 赏罚状态(数字转文字 0待审核1已审核2已作废)
                        for (let i in dict.value.rewardPunishmentStatus) {
                            if (dict.value.rewardPunishmentStatus[i].value == item.status) {
                                item.statusName = dict.value.rewardPunishmentStatus[i].name;
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
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNo = val;
            pageFlag.value = true;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            initData();
        };
        // 状态快速筛选(待审核、已审核、已作废)
        const handleChangeStatus = () => {
            initData();
        };
        // 新增编辑弹窗控制变量
        let editVisible = ref(false);
        // 查看弹窗控制变量
        let lookVisible = ref(false);
        let editRow = ref({});
        // 处理/编辑/查看
        const handleAddEdit = (row, type) => {
            // 判断操作类型
            if (type == "deal") {
                // 处理
                editRow.value = {
                    id: row.id,
                    type
                };
            } else if (type == "edit") {
                // 编辑
                editRow.value = row;
                editRow.value.type = "edit";
            } else if (type == "add") {
                // 添加
                editRow.value = {};
                editRow.value.type = "add";
            } else if (type == "detail") {
                // 添加
                editRow.value = row;
                editRow.value.type = "detail";
                lookVisible.value = true;
                return;
            } else {
                // 查看
                editRow.value = row;
                editRow.value.type = "look";
                lookVisible.value = true;
                return;
            }
            editVisible.value = true;
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
            handleSizeChange,
            handleCurrentChange,
            handleSelect,
            rewardPunishmentTypeSelect,
            shortcuts,
            statusSelectList,
            disabledDate,
            dataCount,
            handleAddEdit,
            handleChangeStatus,
            lookVisible,
            storeNameTypeSelect,
            loading,
            options,
            list,
            allStoreInfo
        };
    }
};
</script>
