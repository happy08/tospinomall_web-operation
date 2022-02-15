<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 退货出库单号 -->
                    <el-form-item :label="$t('returns.backReturnSn')" prop="backReturnSn">
                        <el-input v-model="searchForm.backReturnSn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 商品信息 -->
                    <el-form-item :label="$t('warehouse.info')" prop="goodKeyword">
                        <el-input v-model="searchForm.goodKeyword" placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('returns.deliveryTime')" prop="_timeType">
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
                    <!-- 全选 -->
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange" class="fl mr-15 mt-10 lh-1">{{ $t("table.checkAll") }} </el-checkbox>

                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mlr-20 mtb-10">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio v-for="item in dict.returnsStatus" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                    </el-radio-group>
                    <div class="fl">
                        <!-- 批量审核 -->
                        <el-button v-permission="'replenishManage_returns_audit'" @click="handleAudit" type="primary" plain>
                            {{ $t("table.checkGoods") }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="flex vstart">
                <!-- 导出 -->
                <el-button v-permission="'replenishManage_returns_export'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
                <!-- 表格选项 -->
                <BmTableOption table="returns" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <template v-if="tableData && tableData.length > 0">
            <div v-for="item in tableData" :key="item.id">
                <div class="p-15 border bg-light-grey">
                    <el-checkbox v-model="checkedOrderSn" @change="handleCheckOrderSnChange" :label="item.id" :key="item.id" :disabled="item.status !== 1" class="mr-15">
                        {{ $t("returns.backDeliverySn") }}：{{ item.backReturnSn }}
                    </el-checkbox>
                    <!-- 复制 -->
                    <span class="ml-30 green cp" v-clipboard:copy="item.backReturnSn" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
                    <span v-if="item.backDeliverySn" class="plr-30"> {{ $t("returns.backReturnSn") }}：{{ item.backDeliverySn }} </span>
                </div>

                <BmTable ref="multipleTable" :data="[item]" :column="tableColumn" class="mb-20">
                    <BmTableColumn :label="$t('status.status')">
                        <template #default="scope">
                            {{ scope.row.returnsStatusName }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="returnWareAddress" :label="$t('returns.returnWare')"> </BmTableColumn>
                    <BmTableColumn prop="returnGoodNum" :label="$t('returns.returnGoodNum')"> </BmTableColumn>
                    <BmTableColumn prop="returnSkuNum" :label="$t('returns.returnSkuNum')"> </BmTableColumn>
                    <BmTableColumn prop="returnTotalNum" :label="$t('returns.returnTotalNum')"></BmTableColumn>
                    <BmTableColumn prop="returnWeight" :label="$t('returns.returnWeight')" width="145"> </BmTableColumn>
                    <BmTableColumn prop="returnBulk" :label="$t('returns.returnBulk')"></BmTableColumn>
                    <BmTableColumn prop="deliveryTime" :label="$t('returns.deliveryTime')"></BmTableColumn>
                    <BmTableColumn prop="sellerNote" :label="$t('returns.note')"> </BmTableColumn>

                    <BmTableColumn :label="$t('table.operation')" fixed="right" width="120" align="center">
                        <template #default="scope">
                            <!-- 详情 -->
                            <el-button v-permission="'replenishManage_returns_look'" @click.stop="handleDetail(scope.row)" type="text">
                                {{ $t("table.detail") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else />

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <!-- 查看详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" />

    <!-- 审核 -->
    <Audit v-model:visible="auditVisible" :row="auditRow" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { returnProductMallListPage, returnProductMallCheck, returnProductExport } from "@/api/warehouse";
import { dateShortcuts } from "@/utils/dateShortcuts";
import Audit from "./component/audit";
import Detail from "./component/detail";
import { exportExcel } from "@/utils/";
export default {
    name: "warehouseReturns",
    components: { Audit, Detail },
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

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

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

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            backReturnSn: "",
            goodKeyword: "",
            _timeType: [],
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
        const tableColumn = ["returnWareAddress", "returnGoodNum", "returnSkuNum", "returnTotalNum", "returnWeight", "returnBulk", "deliveryTime", "sellerNote"];
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        let checkedOrderSnList = [];
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            returnProductMallListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.returnsStatus) {
                            if (dict.value.returnsStatus[i].value === item.status) {
                                item.returnsStatusName = dict.value.returnsStatus[i].name;
                                break;
                            }
                        }
                        //全选的值   status 状态：0->草稿；1->审核中 2->审核驳回 3->待出库 4->退货协商中；5->退货出库完成
                        if (item.status === 1) {
                            checkedOrderSnList.push(item.id);
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

        //全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);
        // 已选订单号
        let checkedOrderSn = ref([]);
        // 全选
        const handleCheckAllChange = (val) => {
            checkedOrderSn.value = val ? checkedOrderSnList : [];
            isIndeterminate.value = false;
        };
        // 单选表格
        const handleCheckOrderSnChange = () => {
            checkedAll.value = checkedOrderSn.value.length === checkedOrderSnList.length;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < checkedOrderSnList.length;
        };

        //表格时间切换
        let columnTimeIndex = ref(1);
        const handleCommandColumnTime = (item) => {
            columnTimeIndex.value = item.value;
        };

        //批量审核
        let auditVisible = ref(false);
        let auditRow = reactive({});
        const handleAudit = () => {
            if (checkedOrderSn.value.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            auditRow.ids = checkedOrderSn.value;
            auditVisible.value = true;
        };

        //编辑
        let editVisible = ref(false);

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
            pageFlag.value = true;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };
        // 复制成功监听事件
        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        // 复制失败监听事件
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };
        // 导出Excel
        const handleExportExcel = (val) => {
            returnProductExport(searchForm)
                .then((res) => {
                    exportExcel("ReplenishmentAndReturn", res);
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
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            handleChangeStatus,
            checkedAll,
            isIndeterminate,
            checkedOrderSn,
            handleCheckAllChange,
            handleCheckOrderSnChange,
            tableData,
            columnTimeIndex,
            handleCommandColumnTime,
            tableColumn,
            multipleTable,
            detailVisible,
            detailRow,
            handleDetail,
            editVisible,
            auditVisible,
            auditRow,
            handleAudit,
            handleSizeChange,
            handleCurrentChange,
            onCopy,
            onError,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>
