<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('warehouse.alert')" icon="warning" class="mb-20" />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 发/补货单号 -->
                    <el-form-item :label="$t('warehouse.odd')" prop="backSn">
                        <el-input v-model="searchForm.backSn" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 商品信息 -->
                    <el-form-item :label="$t('warehouse.info')" prop="goodKeyword">
                        <el-input v-model="searchForm.goodKeyword" placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
                    <el-form-item :label="$t('areaTable.updateTime')" prop="_timeType">
                        <template #label>
                            <el-select v-model="searchForm.timeType" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-date-picker
                            v-model="searchForm._timeType"
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

                <el-col :md="12" :lg="6">
                    <!-- 头程物流 -->
                    <el-form-item :label="$t('warehouse.logistics')" prop="firstExpress">
                        <el-select v-model="searchForm.firstExpress" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option :label="$t('warehouse.tospinoLogistics')" :value="0"> </el-option>
                            <el-option :label="$t('warehouse.TPL')" :value="1"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- SKU商品信息 -->
                    <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                        <template #label>
                            <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 商品标题 -->
                    <el-form-item :label="$t('releaseGoods.commodityTitle')" prop="titleKeyword">
                        <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
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
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10 mr-20">
                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mlr-20 mtb-10">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio v-for="item in dict.shippingStatus" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="flex vstart">
                <!-- 导出 -->
                <el-button v-permission="'replenishManage_list_export'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
                <!-- 表格选项 -->
                <BmTableOption table="warehouseTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <template v-if="tableData && tableData.length > 0">
            <div v-for="item in tableData" :key="item.id">
                <div class="flex between p-15 border bg-light-grey">
                    <div>
                        {{ $t("warehouse.odd") }}：{{ item.backSn }}
                        <span class="plr-30">{{ $t("warehouseTable.createTime") }}：{{ item.createTime }}</span>
                        <span v-if="item.deliverTime">{{ $t("warehouseTable.deliverTime") }}：{{ item.deliverTime }}</span>
                    </div>
                    <!-- 超标箱数 -->
                    <span v-if="item.excessiveBoxnum" class="red pr-20">{{ $t("warehouseTable.OverweightContainerNum") }}: {{ item.excessiveBoxnum }}</span>
                </div>
                <BmTable ref="multipleTable" :data="[item]" @selection-change="handleSelectionChange" :column="tableColumn" class="mb-20">
                    <!-- <BmTableColumn type="selection"> </BmTableColumn> -->
                    <BmTableColumn prop="status" :label="$t('warehouseTable.status')">
                        <template #default="scope">
                            {{ scope.row.shippingStatusName }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="receiveWareAddress" :label="$t('warehouseTable.receiveWareAddress')" show-overflow-tooltip> </BmTableColumn>
                    <BmTableColumn prop="totalBoxnum" :label="$t('warehouseTable.totalBoxnum')"> </BmTableColumn>
                    <BmTableColumn prop="realTotalNum" :label="$t('warehouseTable.realTotalNum')"> </BmTableColumn>
                    <BmTableColumn prop="totalWeight" :label="$t('warehouseTable.totalWeight')" width="145"> </BmTableColumn>
                    <BmTableColumn prop="realTotalWeight" :label="$t('warehouseTable.realTotalWeight')"> </BmTableColumn>
                    <BmTableColumn prop="totalBulk" :label="$t('warehouseTable.totalBulk')"></BmTableColumn>
                    <BmTableColumn prop="realTotalBulk" :label="$t('warehouseTable.realTotalBulk')"> </BmTableColumn>
                    <BmTableColumn :prop="timeTypeList[columnTimeIndex].field" width="145">
                        <template #header>
                            <el-dropdown @command="handleCommandColumnTime">
                                <span>
                                    {{ timeTypeList[columnTimeIndex].name }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item v-for="item in timeTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="firstExpress" :label="$t('warehouseTable.firstExpress')">
                        <template #default="scope">
                            {{ scope.row.firstExpress == 0 ? $t("warehouse.tospinoLogistics") : $t("warehouse.TPL") }}
                            <br />
                            {{ scope.row.deliverySn }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="note" :label="$t('warehouseTable.note')" show-overflow-tooltip> </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                        <template #default="scope">
                            <!--status 0->草稿 1->审核中 2->待发货 3->待收货 4->在运营中心 5->入仓完成 6->驳回 7->拒收 -->
                            <el-button v-permission="'replenishManage_list_audit'" v-if="scope.row.status === 1" @click.stop="handleAudit(scope.row)" type="text">
                                {{ $t("status.audit") }}
                            </el-button>
                            <!-- 详情 -->
                            <el-button v-permission="'replenishManage_list_look'" @click.stop="handleDetail(scope.row)" type="text">
                                {{ $t("table.detail") }}
                            </el-button>
                            <el-button v-permission="'replenishManage_list_lookLog'" @click.stop="handleOperateHistory(scope.row)" type="text">
                                {{ $t("warehouse.operateHistory") }}
                            </el-button>
                            <!-- 查看入库明细 -->
                            <el-button v-if="scope.row.status == 5" v-permission="'replenishManage_list_lookInbound'" @click.stop="handleInboundDetail(scope.row)" type="text">
                                {{ $t("warehouse.viewInboundDetails") }}
                            </el-button>
                            <!-- 同步入库 -->
                            <el-button v-if="scope.row.status == 3" v-permission="'replenishManage_list_syncInbound'" @click.stop="handleSyncInbound(scope.row)" type="text">
                                {{ $t("warehouse.syncInbound") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else />

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <!-- 审核 -->
    <Audit v-model:visible="auditVisible" :row="auditRows" @reloadData="initData" />

    <!-- 查看详情 -->
    <Detail v-if="detailVisible" v-model:visible="detailVisible" :row="detailRow" />

    <!-- 查看入库明细 -->
    <InboundDetail v-model:visible="inboundDetailVisible" :row="inboundDetailRow" />

    <!-- 查看操作日志 -->
    <History v-model:visible="historyVisible" :row="historyRow" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { productMallListPage, productMallWareInfoSync, productMallListExport } from "@/api/warehouse";
import { dateShortcuts } from "@/utils/dateShortcuts";
import Audit from "./component/audit";
import Detail from "./component/detail";
import InboundDetail from "./component/inboundDetail";
import History from "./component/history";
import { exportExcel } from "@/utils/";
export default {
    name: "warehouseShipmentsPlan",
    components: { Audit, Detail, InboundDetail, History },
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

        //时间类型 0创建时间 1提审时间 2发货时间 3入库时间 4签收时间 5最后提审时间 6最新审核时间
        const timeTypeList = computed(() => [
            {
                name: proxy.$t("warehouseTable.createTime"), //创建时间
                value: 0,
                field: "createTime"
            },
            {
                name: proxy.$t("warehouseTable.firstSubmitExamineTime"), //提审时间
                value: 1,
                field: "firstSubmitExamineTime"
            },
            {
                name: proxy.$t("warehouseTable.deliverTime"), //发货时间
                value: 2,
                field: "deliverTime"
            },
            {
                name: proxy.$t("warehouseTable.putInstorgeTime"), //入库时间
                value: 3,
                field: "putInstorgeTime"
            },
            {
                name: proxy.$t("warehouseTable.signTime"), //签收时间
                value: 4,
                field: "signTime"
            },
            {
                name: proxy.$t("warehouseTable.submitExamineTime"), //最后提审时间
                value: 5,
                field: "submitExamineTime"
            },
            {
                name: proxy.$t("warehouseTable.examineTime"), //最后审核时间
                value: 6,
                field: "examineTime"
            }
        ]);

        // 0tsin  1fnsku 2upc 3商品编码 4 商品标题 搜索
        const goodsMultiList = computed(() => [
            {
                name: "Tsin", //tsin
                value: 0
            },
            {
                name: "Fnsku", //fnsku
                value: 1
            },
            {
                name: "UPC", //upc
                value: 2
            },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            backSn: "",
            goodKeyword: "",
            _timeType: [],
            timeType: 0,
            firstExpress: "",
            pageNum: 1,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        //搜索
        const handelSearch = () => {
            searchForm.startTime = (searchForm._timeType && searchForm._timeType[0]) || "";
            searchForm.endTime = (searchForm._timeType && searchForm._timeType[1]) || "";
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.startTime = searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        const handleChangeStatus = (val) => {
            searchForm.status = val;
            initData();
        };

        const multipleTable = ref(null);
        let tableData = ref([]);

        //表格选项的列
        const tableColumn = [
            "status",
            "receiveWareAddress",
            "totalBoxnum",
            "realTotalNum",
            "totalWeight",
            "realTotalWeight",
            "totalBulk",
            "realTotalBulk",
            "createTime",
            "deliverTime",
            "firstSubmitExamineTime",
            "putInstorgeTime",
            "submitExamineTime",
            "examineTime",
            "signTime",
            "firstExpress",
            "note"
        ];
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            productMallListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.shippingStatus) {
                            if (dict.value.shippingStatus[i].value === item.status) {
                                item.shippingStatusName = dict.value.shippingStatus[i].name;
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

        //表格时间切换
        let columnTimeIndex = ref(1);
        const handleCommandColumnTime = (item) => {
            columnTimeIndex.value = item.value;
        };

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        //审核
        let auditVisible = ref(false);
        let auditRows = ref([]);
        const handleAudit = (row) => {
            if (row && row.id) {
                auditRows.value = row;
                auditVisible.value = true;
            }
        };

        let historyVisible = ref(false);
        let historyRow = ref({});
        const handleOperateHistory = (row) => {
            historyVisible.value = true;
            historyRow.value = row;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        //查看入库明细
        let inboundDetailVisible = ref(false);
        let inboundDetailRow = ref({});
        const handleInboundDetail = (row) => {
            inboundDetailRow.value = row;
            inboundDetailVisible.value = true;
        };

        const handleSyncInbound = (row) => {
            productMallWareInfoSync(row.id)
                .then((res) => {
                    initData();
                    proxy.$message.success("Successful");
                })
                .catch((err) => {});
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
        // 导出Excel
        const handleExportExcel = (val) => {
            productMallListExport(searchForm)
                .then((res) => {
                    exportExcel("SendReplenishmentList", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            dict,
            initData,
            shortcuts,
            disabledDate,
            pageFlag,
            pageSize,
            pageTotal,
            timeTypeList,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            handleChangeStatus,
            tableData,
            columnTimeIndex,
            handleCommandColumnTime,
            tableColumn,
            multipleTable,
            handleSelectionChange,
            auditVisible,
            auditRows,
            handleAudit,
            detailVisible,
            detailRow,
            handleDetail,
            inboundDetailVisible,
            inboundDetailRow,
            handleInboundDetail,
            handleSyncInbound,
            historyVisible,
            historyRow,
            handleOperateHistory,
            handleSizeChange,
            handleCurrentChange,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>
