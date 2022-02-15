<template>
    <BmDialog v-model:visible="visible" :title="$t('mallCategory.categoryRelevance')" :confirm="confirm" :cancel="cancel" :width="700">
        <el-tabs class="custom-tabs-green" v-model="tabActiveName" type="card">
            <!-- 商品 -->
            <el-tab-pane name="2">
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
                            <div class="ml-10">
                                <div class="hidden-2 lh-12" style="height:28px">{{ item.current }}{{ item.id }}{{ item.goodTitle }}</div>
                                <div>{{ $store.state.app.currencySymbol }}{{ item.minPrice }}</div>
                            </div>
                            <i class="el-icon-check"></i>
                        </div>
                    </el-col>
                </el-row>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
            </el-tab-pane>

            <!-- 已选择 -->
            <el-tab-pane name="1">
                <template #label>
                    <div class="label">
                        {{ $t("mallCategory.bindCategory") }}
                    </div>
                </template>
                <el-cascader
                    v-model="categoryIds"
                    :options="categoryList"
                    :props="{ multiple: true, value: 'id', label: 'cnName' }"
                    clearable
                    filterable
                    :show-all-levels="false"
                    size="small"
                ></el-cascader>
                <!-- 
                    选中商品
                    <el-row :gutter="10" class="goods-content custom-scrollbar">
                    <el-col v-for="(item, index) in curGoodsList" :key="index" :span="12">
                        <div
                            @click="handleDelGoods(item, index)"
                            class="current goods-item flex mb-10 p-5 border cp round-4"
                        >
                            <div class="img">
                                <BmImage
                                    :src="item.mainPictureUrl"
                                    fit="cover"
                                    style="width:100%;height:100%"
                                />
                            </div>
                            <div class="ml-10">
                                <div class="hidden-2 lh-12" style="height:28px">
                                    {{ item.goodTitle }}
                                </div>
                                <div>{{ $store.state.app.currencySymbol }}{{ item.minPrice }}</div>
                            </div>
                            <i class="el-icon-check"></i>
                        </div>
                    </el-col>
                </el-row> -->
            </el-tab-pane>
        </el-tabs>
    </BmDialog>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { goodsMallLaunchList } from "@/api/storeDesign";
import { categoryListTree } from "@/api/goods";
export default {
    name: "selectionGoodsList",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        row: {
            type: Object,
            default() {
                return {};
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
        let tabActiveName = ref("1");

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
        //let linkIds = [];
        watch(
            () => props.row,
            () => {
                console.log("linkType", props.row);
                // linkIds = props.row.linkIds;
                tabActiveName.value = props.row.linkType + "" || "2";

                // //linkType=1->关联后台分类 2->关联商品ID
                // if (props.row.linkType == 2) {
                //     goodsList.value.forEach((item) => {
                //         if (linkIds.indexOf(item.id) !== -1) {
                //             item.current = true;
                //         }
                //     });
                // }
            }
            // { immediate: true, deep: true }
        );

        //商品列表
        let goodsList = ref([]);
        const getGoodsMallList = () => {
            goodsMallLaunchList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    goodsList.value = res.data.records;
                })
                .catch((err) => {});
        };
        getGoodsMallList();
        //商品后台类目列表
        let categoryIds = ref([]); //选中的值
        let categoryList = ref([]);
        const getCategoryListTree = () => {
            categoryListTree({ status: 1 })
                .then((res) => {
                    categoryList.value = res.data;
                })
                .catch((err) => {});
        };
        getCategoryListTree();
        // //后台类目只能选择最后一级
        // function getTree(data) {
        //     data.forEach((item) => {
        //         if (item.children && item.children.length > 0) {
        //             item.disabled = true;
        //             getTree(item.children);
        //         }
        //     });
        //     return data;
        // }

        //选中商品
        const handleSelectGoods = (item) => {
            item.current = !item.current;

            const index = curGoodsList.value.findIndex((citem) => citem.id === item.id);
            if (index === -1) {
                curGoodsList.value.push(item);
            } else {
                curGoodsList.value.splice(index, 1);
            }
        };

        //删除选中商品
        const handleDelGoods = (item, index) => {
            curGoodsList.value.splice(index, 1);
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
            //linkType=1->关联后台分类 2->关联商品ID
            props.row.linkType = tabActiveName.value * 1;
            if (tabActiveName.value == 1) {
                let arr = [];
                categoryIds.value.forEach((item) => {
                    arr.push(item[item.length - 1]); //最后一个id
                });
                props.row.linkIds = arr;
                categoryIds.value = [];
            } else if (tabActiveName.value == 2) {
                props.row.linkIds = curGoodsList.value.map((item) => item.id);
                curGoodsList.value = [];
                goodsList.value.forEach((item) => {
                    item.current = false;
                });
            }
            //return;
            //emit("change", curGoodsList.value);
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
            categoryIds,
            categoryList,

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
