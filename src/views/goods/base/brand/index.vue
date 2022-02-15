<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('brand.alert')" icon="warning" class="mb-20" />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 品牌信息 -->
                    <el-form-item :label="$t('brand.info')" prop="keyword">
                        <el-input v-model="searchForm.keyword" :placeholder="$t('brand.infoPlaceholder')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 店铺名称 -->
                    <el-form-item :label="$t('shop.name')" prop="shopId">
                        <BmSelectRemote
                            v-model="searchForm.shopId"
                            :remoteApi="getSellerList"
                            :option="{ label: 'storeName', value: 'id' }"
                            keyword="keyword"
                            :placeholder="$t('shop.companyName') + ' / ' + $t('shop.name') + ' / ' + $t('shop.code') + ' / ' + $t('shop.phone')"
                        ></BmSelectRemote>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 商标类型 -->
                    <el-form-item :label="$t('brandTable.type')" prop="type">
                        <el-select v-model="searchForm.type" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="item in dict.brandType" :key="item.value" :value="item.value" :label="item.name"> </el-option>
                        </el-select>
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
                <el-radio-group v-model="searchForm.examineStatus" @change="handleChangeStatus" class="fl mr-10 mb-10">
                    <!-- 全部 -->
                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                    <!-- 待更新 -->
                    <el-radio-button label="5">{{ $t("status.beUpdated") }}({{ statisticalTotal.total_await_update }})</el-radio-button>
                    <!-- 待审核 -->
                    <el-radio-button label="1">{{ $t("status.beAudit") }}({{ statisticalTotal.total_await_check }})</el-radio-button>
                    <!-- 审核通过 -->
                    <el-radio-button label="2">{{ $t("status.auditPass") }}({{ statisticalTotal.total_check_success }})</el-radio-button>
                    <!-- 审核驳回 -->
                    <el-radio-button label="3">{{ $t("status.auditRejected") }}({{ statisticalTotal.total_check_failed }})</el-radio-button>
                    <!-- 屏蔽中 -->
                    <el-radio-button label="4">{{ $t("status.shielding") }}({{ statisticalTotal.total_shielding }})</el-radio-button>
                    <!-- 已删除 -->
                    <el-radio-button label="6">{{ $t("status.deleted") }}({{ statisticalTotal.total_deleted }})</el-radio-button>
                </el-radio-group>
                <div class="fl">
                    <!-- 批量操作 -->
                    {{ $t("status.batchOperation") }}：
                    <el-button v-permission="'base_brand_open'" @click="handleOpenShield(2)">{{ $t("status.open") }}</el-button>
                    <el-button v-permission="'base_brand_shield'" @click="handleOpenShield(4)">{{ $t("status.shield") }}</el-button>
                    <el-button v-permission="'base_brand_audit'" @click="handleBatchAudit">{{ $t("status.batchAudit") }}</el-button>
                </div>
            </div>

            <div class="flex vstart">
                <!-- 刷新 -->
                <el-button @click="initData">{{ $t("table.refresh") }}</el-button>
                <!-- 表格选项 -->
                <BmTableOption table="brandTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" :column="tableColumn">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="type" :label="$t('brandTable.type')">
                <template #default="scope">
                    {{ scope.row.typeName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="LOGO" label="LOGO" width="75">
                <template #default="scope">
                    <BmImage :src="scope.row.logo" style="width:50px; height:50px" />
                </template>
            </BmTableColumn>
            <BmTableColumn prop="brandName" :label="$t('brandTable.brandName')">
                <template #default="scope">
                    <el-button type="text" @click.stop="handleDetail(scope.row)">{{ scope.row.brandName }}</el-button>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="registerNumber" :label="$t('brandTable.registerNumber')"> </BmTableColumn>
            <BmTableColumn prop="authEndTime" :label="$t('brandTable.authEndTime')" width="145">
                <template #default="scope">
                    {{ scope.row.type == 1 ? scope.row.registerEndTime : scope.row.authEndTime }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="examineStatus" :label="$t('brandTable.examineStatus')">
                <template #default="scope">
                    {{ scope.row.examineStatusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="updateTime" :label="$t('brandTable.updateTime')" width="145"> </BmTableColumn>
            <BmTableColumn prop="lashExamineTime" :label="$t('brandTable.lashExamineTime')" width="145"></BmTableColumn>
            <BmTableColumn prop="seller" :label="$t('brandTable.seller')">
                <template #default="scope"> {{ scope.row.shopName }} <br />{{ scope.row.shopCode }} </template>
            </BmTableColumn>
            <BmTableColumn prop="reason" :label="$t('brandTable.reason')">
                <template #default="scope" @click.stop>
                    {{ scope.row.reason }}<br />
                    <BmImage v-for="(item, index) in scope.row.imgList" :src="item" :preview-src-list="scope.row.imgList" :key="index" style="width:50px;height:50px" />
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 批量审核 -->
    <Audit
        v-model:visible="auditVisible"
        :rows="auditSelectionRows"
        @reloadData="
            initData();
            getBrandListStatistical();
        "
    />

    <!-- 详情-->
    <Detail
        v-model:visible="detailVisible"
        :row="detailRow"
        @reloadData="
            initData();
            getBrandListStatistical();
        "
    />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { brandMallList, brandListStatistical, brandBatchUpdateStatus } from "@/api/goods";
import { getSellerList } from "@/api/store";
import Audit from "./component/audit";
import Detail from "./component/detail";

export default {
    name: "GoodsBrand",
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

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            keyword: "", //商品信息
            companyName: "", //公司名称
            shopId: "", //店铺id
            shopCode: "",
            type: "", //类型（ 1自有商标 2授权商标）
            examineStatus: "", //审核状态（1待审核 2已通过 3未通过 4屏蔽中 5待更新 6已删除）
            pageNum: 1,
            pageSize: pageSize
        });
        //搜索
        const handelSearch = () => {
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);
        //表格选项的列
        const tableColumn = ["type", "LOGO", "brandName", "registerNumber", "authEndTime", "examineStatus", "updateTime", "lashExamineTime", "seller", "reason"];
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取品牌列表
        const getListPage = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }

            brandMallList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        //商标类型
                        for (let i in dict.value.brandType) {
                            if (dict.value.brandType[i].value === item.type) {
                                item.typeName = dict.value.brandType[i].name;
                                break;
                            }
                        }
                        //审核状态（1待审核 2已通过 3未通过 4屏蔽中 5待更新）
                        for (let i in dict.value.auditStatus) {
                            if (dict.value.auditStatus[i].value === item.examineStatus) {
                                item.examineStatusName = dict.value.auditStatus[i].name;
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

        // //获取店铺列表
        // let shopList = ref([]);
        // const sellerList = () => {
        //     getSellerList({ pageNo: 1, pageSize: 99999 })
        //         .then((res) => {
        //             shopList.value = res.data.records;
        //         })
        //         .catch(() => {});
        // };
        // sellerList();

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

        //获取各状态统计
        const statisticalTotal = ref({});
        const getBrandListStatistical = () => {
            brandListStatistical()
                .then((res) => {
                    statisticalTotal.value = res.data;
                })
                .catch((err) => {});
        };
        getBrandListStatistical();

        //切换状态
        const handleChangeStatus = (val) => {
            searchForm.examineStatus = val;
            initData();
        };

        //开启-屏蔽
        const handleOpenShield = (status) => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            //=2开启
            if (status == 2) {
                for (let i = 0; i < tableSelectionRows.length; i++) {
                    if (tableSelectionRows[i].examineStatus != 4) {
                        proxy.$message.error(proxy.$t("brand.tip4")); //请全部勾选审核通过状态
                        return;
                    }
                }
            }
            //=4屏蔽
            if (status == 4) {
                for (let i = 0; i < tableSelectionRows.length; i++) {
                    if (tableSelectionRows[i].examineStatus != 2) {
                        proxy.$message.error(proxy.$t("brand.tip3")); //请全部勾选屏蔽状态
                        return;
                    }
                }
            }

            proxy
                .$confirm(status == 2 ? proxy.$t("brand.tip1") : proxy.$t("brand.tip2"), {
                    type: "warning"
                })
                .then(() => {
                    const ids = tableSelectionRows.map((item) => item.id);
                    brandBatchUpdateStatus(ids, status)
                        .then((res) => {
                            initData();
                            getBrandListStatistical();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        };

        //批量审核
        let auditVisible = ref(false);
        let auditSelectionRows = ref([]);
        const handleBatchAudit = () => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            auditSelectionRows.value = tableSelectionRows;
            auditVisible.value = true;
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
            getBrandListStatistical,
            lang,
            pageFlag,
            pageSize,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            getSellerList,
            tableData,
            tableColumn,
            multipleTable,

            statisticalTotal,
            auditSelectionRows,
            handleSelectionChange,
            handleRowClick,
            handleChangeStatus,
            handleOpenShield,
            auditVisible,
            handleBatchAudit,
            detailVisible,
            detailRow,
            handleDetail,
            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
