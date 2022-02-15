<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.info')" :confirm="confirm" :cancel="cancel" :width="850" top="10vh">
        <el-form ref="searchFormRef" :model="searchForm" :inline="true">
            <!-- 信息 -->
            <el-form-item :label="$t('warehouse.info')" prop="keyword">
                <el-input v-model="searchForm.keyword" placeholder="title / tsin / fnsku / upc"> </el-input>
            </el-form-item>
            <!-- 库存 -->
            <el-form-item :label="$t('goodsListTable.stockNum')" prop="hasStock">
                <el-select v-model="searchForm.hasStock" clearable :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in haveNone" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 库存 -->
            <el-form-item :label="$t('status.status')" prop="status">
                <el-select v-model="searchForm.status" clearable :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>

            <!-- 分类ID -->
            <el-form-item :label="$t('goods.selectCategory')" prop="categoryId">
                <el-select v-model="searchForm.categoryId" filterable remote clearable :placeholder="$t('pleaseSelect')" :remote-method="getCategoryList">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.cnName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 有效品牌 -->
            <el-form-item :label="$t('releaseGoods.goodsBrand')" prop="brandId">
                <el-select v-model="searchForm.brandId" filterable remote clearable :placeholder="$t('pleaseSelect')" :remote-method="getBrandListCanUse">
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 查询 -->
            <el-form-item>
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </el-form-item>
        </el-form>
        <el-tabs class="custom-tabs-green" v-model="activeName" type="card">
            <el-tab-pane name="first">
                <template #label>
                    <div class="label">{{ $t("status.all") }}</div>
                </template>
                <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" row-key="id" height="400" class="mb-20">
                    <BmTableColumn type="selection" :reserve-selection="true"> </BmTableColumn>
                    <BmTableColumn :label="$t('image')" width="70px">
                        <template #default="scope">
                            <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('warehouse.info')">
                        <template #default="scope">
                            {{ scope.row.title }}
                            <span class="green"> ({{ scope.row.skuAttr && scope.row.skuAttr.join("/") }}) </span>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="tsin" label="TSIN" width="160"> </BmTableColumn>
                    <BmTableColumn prop="fnsku" label="FNSKU" width="160"> </BmTableColumn>
                </BmTable>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
            </el-tab-pane>
            <el-tab-pane name="second" class="p-0">
                <template #label>
                    <div class="label">{{ $t("table.selected") }}（{{ tableSelectionRows.length }}）</div>
                </template>
                <BmTable :data="tableSelectionRows" height="400" class="mb-20">
                    <!-- <BmTableColumn type="selection"> </BmTableColumn> -->
                    <BmTableColumn :label="$t('image')" width="70px">
                        <template #default="scope">
                            <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('warehouse.info')">
                        <template #default="scope">
                            {{ scope.row.title }}
                            <span class="green"> ({{ scope.row.skuAttr && scope.row.skuAttr.join("/") }}) </span>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="tsin" label="TSIN" width="160"> </BmTableColumn>
                    <BmTableColumn prop="fnsku" label="FNSKU" width="160"> </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" width="80">
                        <template #default="scope">
                            <el-button @click="handleDelete(scope.$index)" type="text">
                                {{ $t("warehouse.delete") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </el-tab-pane>
        </el-tabs>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, inject, nextTick } from "vue";
import { skuSellerList } from "@/api/warehouse";
import { categoryListTree, brandListCanUse } from "@/api/goods";
import { deepClone } from "@/utils/";

export default {
    name: "ShipmentsPlanAdd",
    components: {},
    props: {
        visible: Boolean,
        rows: Array
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let activeName = ref("first");
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //有无 (1有 0无)
        const haveNone = [
            {
                name: proxy.$t("have"),
                value: 1
            },
            {
                name: proxy.$t("none"),
                value: 0
            }
        ];
        //状态
        const statusList = [
            {
                name: proxy.$t("status.inReview"),
                value: 0
            },
            {
                name: proxy.$t("status.auditPass"),
                value: 1
            },
            {
                name: proxy.$t("status.auditRejected"),
                value: 2
            },
            {
                name: proxy.$t("status.onSale"),
                value: 3
            },
            {
                name: proxy.$t("status.notSale"),
                value: 4
            }
        ];
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            keyword: "", //参数名称
            pageNum,
            pageSize
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
        //let currentPageIds = [];
        //获取商品sku列表
        const initData = () => {
            skuSellerList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records;
                    //currentPageIds = res.data.records.map((item) => item.id);

                    //选中
                    nextTick(() => {
                        toggleSelection(tableSelectionRows.value);
                    });
                })
                .catch(() => {});
        };
        initData();

        const toggleSelection = (rows) => {
            if (rows) {
                rows.forEach((row) => {
                    //if (currentPageIds.includes(row.id)) {
                    multipleTable.value.setCurrentRow(row);
                    //}
                });
            }
        };

        let tableSelectionRows = ref([]); //所有选中的
        watch(
            () => props.rows,
            (nVal) => {
                tableSelectionRows.value = deepClone(nVal);
                //选中
                nextTick(() => {
                    toggleSelection(nVal);
                });
            },
            {
                deep: true
            }
        );
        //选中的行
        const handleSelectionChange = (rows) => {
            tableSelectionRows.value = rows;
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            multipleTable.value.toggleRowSelection(row);
        };
        //删除
        const handleDelete = (index) => {
            tableSelectionRows.value.splice(index, 1);
        };

        //分类
        let categoryList = ref([]);
        const getCategoryList = (key) => {
            console.log("key", key);
            const params = {
                keyword: key,
                status: 1 //状态：1：可用 0：不可用
            };
            categoryListTree(params).then((res) => {
                categoryList.value = res.data;
            });
        };
        //品牌
        let brandList = ref([]);
        const getBrandListCanUse = (key) => {
            const params = {
                keyword: key
            };
            brandListCanUse(params).then((res) => {
                brandList.value = res.data;
            });
        };

        const confirm = () => {
            emit("change", tableSelectionRows.value);
            emit("update:visible", false);
            setTimeout(() => {
                tableSelectionRows.value = [];
                multipleTable.value.clearSelection();
            }, 500);
        };

        const cancel = () => {
            emit("update:visible", false);
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
            haveNone,
            activeName,
            searchFormRef,
            searchForm,
            handelSearch,
            resetForm,
            multipleTable,
            tableData,

            tableSelectionRows,
            tableSelectionRows,
            handleSelectionChange,
            handleRowClick,
            handleDelete,
            confirm,
            cancel,
            pageNum,
            pageTotal,
            handleSizeChange,
            handleCurrentChange,
            categoryList,
            getCategoryList,
            statusList,
            brandList,
            getBrandListCanUse
        };
    }
};
</script>
