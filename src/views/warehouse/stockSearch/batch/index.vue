<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 商品类目 -->
                    <el-form-item :label="$t('goods.category')" prop="categoryId">
                        <el-cascader
                            v-model="searchForm.categoryId"
                            :options="categoryList"
                            :props="{ checkStrictly: false, value: 'id', label: 'cnName' }"
                            clearable
                            filterable
                            :show-all-levels="false"
                        ></el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 品牌 -->
                    <el-form-item :label="$t('goodsListTable.brandName')" prop="brandId">
                        <el-select v-model="searchForm.brandId" :placeholder="$t('pleaseSelect')" filterable remote reserve-keyword clearable :remote-method="getBrandMallList">
                            <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 批次信息 -->
                    <el-form-item :label="$t('stockBatch.batchNo')" prop="batchNo">
                        <el-input v-model="searchForm.batchNo" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 供货单号 -->
                    <el-form-item :label="$t('stockBatch.backSn')" prop="backSn">
                        <el-input v-model="searchForm.backSn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 商品信息 -->
                    <el-form-item :label="$t('warehouse.info')" prop="keyword">
                        <el-input v-model="searchForm.keyword" placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 仓库 -->
                    <el-form-item :label="$t('stockSearch.warehouse')" prop="warehouseId">
                        <el-select v-model="searchForm.warehouseId" :placeholder="$t('pleaseSelect')" filterable clearable>
                            <el-option v-for="(item, index) in warehouseList" :key="index" :label="item.warehouseName" :value="item.warehouseId"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

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
            <div class="fl mb-10 mr-20"></div>

            <div class="flex vstart">
                <!-- 导出 -->
                <el-button v-permission="'stockSearch_batch_export'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
                <!-- 表格选项 -->
                <BmTableOption table="stockBatch" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable :data="tableData" :column="tableColumn" class="mb-20">
            <BmTableColumn prop="batchNo" :label="$t('stockBatch.batchNo')"> </BmTableColumn>
            <BmTableColumn prop="backSn" :label="$t('stockBatch.backSn')"> </BmTableColumn>
            <BmTableColumn prop="picture" :label="$t('stockBatch.picture')" width="75px">
                <template #default="scope">
                    <BmImage :src="scope.row.picture" style="width:50px;height:50px" :key="scope.row.picture" />
                </template>
            </BmTableColumn>
            <BmTableColumn prop="title" :label="$t('stockBatch.title')" width="250px">
                <template #default="scope"> {{ scope.row.title }} <br />{{ scope.row.tsin }} </template>
            </BmTableColumn>
            <BmTableColumn prop="categoryPath" :label="$t('stockBatch.categoryPath')" width="160"> </BmTableColumn>
            <BmTableColumn prop="brandName" :label="$t('stockBatch.brandName')" width="90px"> </BmTableColumn>
            <BmTableColumn prop="attr" :label="$t('stockBatch.attr')" width="70px">
                <template #default="scope">
                    <span v-for="(item, index) in scope.row.attr" :key="index"> <span v-if="index !== 0">/</span> {{ item }} </span>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="unit" :label="$t('stockBatch.unit')" width="70px"></BmTableColumn>
            <BmTableColumn prop="internationalCode" :label="$t('stockBatch.internationalCode')" width="150px"></BmTableColumn>
            <BmTableColumn prop="fnsku" :label="$t('stockBatch.fnsku')" width="100px"></BmTableColumn>

            <BmTableColumn prop="putStorageNum" :label="$t('stockBatch.putStorageNum')"></BmTableColumn>
            <BmTableColumn prop="warehouseName" :label="$t('stockBatch.warehouseName')"></BmTableColumn>
            <!-- 销售退货入库数 正品/次品-->
            <BmTableColumn prop="batchStock" :label="$t('stockBatch.batchStock')">
                <template #header>
                    {{ $t("stockBatch.batchStock") }}<br />
                    {{ $t("stockBatch.batchStockNum") }}
                </template>
                <template #default="scope">
                    {{ scope.row.batchNoGoodNum * 1 + scope.row.batchNoBadNum * 1 }}
                    <br />
                    {{ scope.row.batchNoGoodNum }} / {{ scope.row.batchNoBadNum }}
                </template>
            </BmTableColumn>
            <!-- fbt锁的库存数量 -->
            <BmTableColumn prop="validDay" :label="$t('stockBatch.validDay')"></BmTableColumn>
            <BmTableColumn prop="validStartTime" :label="$t('stockBatch.validStartTime')" width="150px"></BmTableColumn>
            <BmTableColumn prop="validEndTime" :label="$t('stockBatch.validEndTime')" width="150px"></BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { warehouseInfolist, wareStockBatchno, warehouseSkuExport } from "@/api/warehouse";
import { categoryListTree, brandMallList } from "@/api/goods";
import { exportExcel } from "@/utils/";
export default {
    name: "warehouseStockBatch",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

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
            categoryId: [],
            batchNo: "",
            backSn: "",
            keyword: "",
            pageNum: pageNum,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });
        //搜索
        const handelSearch = () => {
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };
        const handleChangeStatus = (val) => {
            searchForm.status = val;
            initData();
        };

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = [
            "batchNo",
            "backSn",
            "picture",
            "title",
            "categoryPath",
            "brandName",
            "attr",
            "unit",
            "internationalCode",
            "fnsku",
            "putStorageNum",
            "warehouseName",
            "batchStock",
            "validDay",
            "validStartTime",
            "validEndTime"
        ];

        //获取列表
        const getListPage = () => {
            const params = {
                ...searchForm,
                categoryId: (searchForm.categoryId && [...searchForm.categoryId].pop()) || ""
            };
            wareStockBatchno(params)
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
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        //仓库列表
        let warehouseList = ref([]);
        const getWarehouseInfolist = () => {
            warehouseInfolist({ status: 1 })
                .then((res) => {
                    warehouseList.value = res.data;
                })
                .catch((err) => {});
        };
        getWarehouseInfolist();
        //商品类目列表
        let categoryList = ref([]);
        const getCategoryListTree = () => {
            categoryListTree({ status: 1 })
                .then((res) => {
                    categoryList.value = res.data;
                })
                .catch((err) => {});
        };
        getCategoryListTree();
        //品牌列表
        let brandList = ref([]);
        const getBrandMallList = (keyword) => {
            brandMallList({ keyword: keyword })
                .then((res) => {
                    brandList.value = res.data.records;
                })
                .catch((err) => {});
        };
        //getBrandMallList();

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
        // 导出Excel
        const handleExportExcel = (val) => {
            warehouseSkuExport(searchForm)
                .then((res) => {
                    exportExcel("BatchInventory", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            dict,
            initData,
            pageNum,
            pageSize,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            handleChangeStatus,
            tableData,
            tableColumn,

            warehouseList,
            categoryList,
            brandList,
            getBrandMallList,
            handleSizeChange,
            handleCurrentChange,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>
