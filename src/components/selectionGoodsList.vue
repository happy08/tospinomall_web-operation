<template>
    <!-- 选择商品spu -->
    <BmDialog v-model:visible="visible" :title="$t('storeDesign.selectGoods')" :confirm="confirm" :cancel="cancel" :width="800">
        <el-tabs class="custom-tabs-green" v-model="tabActiveName" type="card">
            <!-- 商品 -->
            <el-tab-pane name="first">
                <template #label>
                    <div class="label">{{ $t("storeDesign.goods") }}</div>
                </template>

                <el-form :model="searchForm" :inline="true" label-width="auto">
                    <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" placeholder="Title / TSIN"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="handleSearch" icon="el-icon-search" type="primary"></el-button>
                        <el-button @click="handleReloadData" icon="el-icon-refresh"></el-button>
                    </el-form-item>
                </el-form>
                <el-row :gutter="10" class="goods-content custom-scrollbar">
                    <el-col v-for="(item, index) in goodsList" :key="index" :span="12">
                        <div @click="handleSelectGoods(item)" class="goods-item flex mb-10 p-5 border round-4 cp fs-12" :class="{ current: item.current }">
                            <div class="img">
                                <BmImage :src="item.mainPictureUrl" fit="cover" style="width:100%;height:100%" />
                            </div>
                            <div class="ml-10" style="width:220px">
                                <div class="hidden-1 lh-12" style="height:20px">{{ item.goodTitle }}</div>
                                <div class="hidden-1 lh-12" style="height:20px">TSIN：{{ item.tsin }}</div>
                                <div>{{ $store.state.app.currencySymbol }}{{ item.minPrice }}</div>
                            </div>
                            <i class="el-icon-check"></i>
                        </div>
                    </el-col>
                </el-row>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
            </el-tab-pane>

            <!-- 已选择 -->
            <el-tab-pane name="second">
                <template #label>
                    <div class="label">
                        {{ $t("selectedN", { num: curGoodsList.length || 0 }) }}
                    </div>
                </template>

                <el-row :gutter="10" class="goods-content custom-scrollbar">
                    <el-col v-for="(item, index) in curGoodsList" :key="index" :span="12">
                        <div @click="handleDelGoods(item, index)" class="current goods-item flex mb-10 p-5 border cp round-4">
                            <div class="img">
                                <BmImage :src="item.mainPictureUrl" fit="cover" style="width:100%;height:100%" />
                            </div>
                            <div class="ml-10" style="width:220px">
                                <div class="hidden-1 lh-12" style="height:20px">{{ item.goodTitle }}</div>
                                <div class="hidden-1 lh-12" style="height:20px">TSIN：{{ item.tsin }}</div>
                                <div>{{ $store.state.app.currencySymbol }}{{ item.minPrice }}</div>
                            </div>
                            <i class="el-icon-check"></i>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </BmDialog>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { goodsMallLaunchList } from "@/api/storeDesign";
import { deepClone } from "@/utils/";

export default {
    name: "selectionGoodsList",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        rows: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //tab
        let tabActiveName = ref("first");

        //搜索
        let searchForm = reactive({
            keyword: "",
            pageNum,
            pageSize
        });
        const handleSearch = () => {
            getGoodsMallList();
        };
        const handleReloadData = () => {
            getGoodsMallList();
        };

        //选择商品
        let curGoodsList = ref([]); //选中商品集合
        let curGoodsIds = []; //选中商品集合ids
        watch(
            () => props.rows,
            (nVal) => {
                curGoodsList.value = deepClone(props.rows);
                curGoodsIds = curGoodsList.value.map((item) => item.id);

                //选中
                goodsList.value.forEach((item) => {
                    if (curGoodsIds.indexOf(item.id) !== -1) {
                        item.current = true;
                    }
                });
            }
            // { deep: true }
        );

        //商品列表
        let goodsList = ref([]);
        const getGoodsMallList = () => {
            goodsMallLaunchList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    goodsList.value = res.data.records;

                    //选中
                    goodsList.value.forEach((item) => {
                        if (curGoodsIds.indexOf(item.id) !== -1) {
                            item.current = true;
                        }
                    });
                })
                .catch((err) => {});
        };
        getGoodsMallList();

        //选中商品
        const handleSelectGoods = (item) => {
            item.current = !item.current;

            const index = curGoodsList.value.findIndex((citem) => citem.id === item.id);
            if (index === -1) {
                curGoodsList.value.push(item);
            } else {
                curGoodsList.value.splice(index, 1);
            }
            curGoodsIds = curGoodsList.value.map((item) => item.id);
        };

        //删除选中商品
        const handleDelGoods = (item, index) => {
            curGoodsList.value.splice(index, 1);
            curGoodsIds = curGoodsList.value.map((item) => item.id);
            goodsList.value.forEach((gitem) => {
                if (gitem.id === item.id) {
                    gitem.current = false;
                }
            });
        };
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            getGoodsMallList();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            getGoodsMallList();
        };

        const confirm = () => {
            emit("change", curGoodsList.value);
            emit("update:visible", false);
        };

        const cancel = () => {
            emit("update:visible", false);
        };
        return {
            tabActiveName,
            searchForm,
            handleSearch,
            handleReloadData,
            goodsList,
            handleSelectGoods,
            handleDelGoods,
            pageNum,
            pageSize,
            pageTotal,
            handleCurrentChange,
            handleSizeChange,
            curGoodsList,

            confirm,
            cancel
        };
    }
};
</script>
<style lang="scss" scoped>
.goods-content {
    max-height: 375px;
    overflow: auto;

    .goods-item {
        position: relative;
        .el-icon-check {
            position: absolute;
            bottom: -1px;
            right: -1px;
            padding: 4px 2px 2px;
            font-size: 12px;
            background-color: #42b7ae;
            color: #ffffff;
            border-radius: 20px 0 4px 0;
            opacity: 0;
        }

        &.current {
            border-color: #42b7ae;
            .el-icon-check {
                opacity: 1;
            }
        }
        .img {
            flex: 0 0 50px;
            width: 50px;
            height: 50px;
        }
    }
}
</style>
