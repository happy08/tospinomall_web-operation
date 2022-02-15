<template>
    <BmDialog v-model:visible="visible" :title="$t('storeDesign.customLink')" :confirm="confirm" :cancel="cancel" :width="1000">
        <el-tabs class="custom-tabs-green" v-model="tabActiveName" type="card">
            <!-- 商品链接 -->
            <el-tab-pane name="first">
                <template #label>
                    <div class="label">{{ $t("storeDesign.goodsLink") }}</div>
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
                        <div @click="handleSelectGoods(item)" class="goods-item flex mb-10 p-5 border round-4 fs-12" :class="{ current: item.current }">
                            <div class="img">
                                <BmImage :src="item.mainPictureUrl" fit="cover" style="width:100%;height:100%" />
                            </div>
                            <div class="ml-10">
                                <div class="hidden-2 lh-12" style="height:28px">
                                    {{ item.goodTitle }}
                                </div>
                                <!-- <div>TSIN：{{ item.tsin }}</div> -->
                                <div>{{ $store.state.app.currencySymbol }}{{ item.minPrice }}</div>
                            </div>
                            <i class="el-icon-check"></i>
                        </div>
                    </el-col>
                </el-row>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
            </el-tab-pane>

            <!-- 自定义链接 -->
            <el-tab-pane name="second">
                <template #label>
                    <div class="label">{{ $t("storeDesign.customLink") }}</div>
                </template>
                <el-form label-width="auto">
                    <el-form-item :label="$t('storeDesign.linkType')">
                        <el-select v-model="linkTypeValue" @change="changeLinkType" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in linkTypeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>

                    <!-- linkTypeValue链接类型（1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接） -->
                    <el-form-item :label="$t('storeDesign.link')">
                        <el-cascader-panel v-if="linkTypeValue === 1" v-model="linkTypeSelected" :options="navCategoryList" :props="{ multiple: true, label: 'name', value: 'id' }"></el-cascader-panel>

                        <el-cascader-panel
                            v-if="linkTypeValue === 2"
                            v-model="linkTypeSelected"
                            :options="navCategoryListBack"
                            :props="{ multiple: true, label: 'cnName', value: 'id' }"
                        ></el-cascader-panel>

                        <el-select v-if="linkTypeValue === 3" v-model="linkTypeSelected" multiple :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                        </el-select>

                        <el-checkbox-group v-if="linkTypeValue === 4 || linkTypeValue === 5" v-model="linkTypeSelected">
                            <el-checkbox v-for="item in countryList" :key="item.code" :label="item.code">{{ item.name }}</el-checkbox>
                        </el-checkbox-group>

                        <el-input v-if="linkTypeValue === 6" v-model="linkTypeSelected" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </BmDialog>
</template>

<script>
import { getCurrentInstance, inject, reactive, ref, watch } from "vue";
import { goodsMallLaunchList, navCategoryListTree, brandMallListCanUse, baseAreaFindByParentId } from "@/api/storeDesign";
import { categoryListTree } from "@/api/goods";

export default {
    name: "selectionLinkUrl",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        config: Object
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const isMobile = inject("isMobile");

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

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

        //商品列表
        let goodsList = ref([]);
        const getGoodsMallList = () => {
            goodsMallLaunchList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    goodsList.value = res.data.records;

                    //imageLinkType=0是商品，选中商品
                    if (props.config.imageLinkType === 0) {
                        for (let i = 0, length = goodsList.value.length; i < length; i++) {
                            if (props.config.goodsId === goodsList.value[i].id) {
                                curGoods.value = goodsList.value[i];
                                goodsList.value[i].current = true;
                            } else {
                                goodsList.value[i].current = false;
                            }
                        }
                    }
                })
                .catch((err) => {});
        };
        //getGoodsMallList();

        //选择商品
        let curGoods = ref({});
        const handleSelectGoods = (item) => {
            if (item.current === true) {
                item.current = false;
                curGoods.value = {};
                return;
            }
            for (let i = 0, length = goodsList.value.length; i < length; i++) {
                goodsList.value[i].current = false;
            }
            curGoods.value = item;
            item.current = true;
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

        //切换链接类型
        let linkTypeValue = ref(1); //选中的类型
        let linkTypeSelected = ref(""); //选中的值
        let linkTypeList = ref([
            {
                value: 1,
                name: proxy.$t("storeDesign.frontCategory")
            },
            {
                value: 2,
                name: proxy.$t("storeDesign.backCategory")
            },
            {
                value: 3,
                name: proxy.$t("storeDesign.brind")
            },
            {
                value: 4,
                name: "FBT"
            },
            {
                value: 5,
                name: "FBM"
            },
            {
                value: 6,
                name: proxy.$t("storeDesign.outLink")
            }
        ]);
        const changeLinkType = (val) => {
            linkTypeSelected.value = [];
            switch (val) {
                case 1:
                    getNavCategoryListTree();
                    break;
                case 2:
                    getCategoryListTree();
                    break;
                case 3:
                    getBrandMallListCanUse();
                    break;
                case 4:
                    getBaseAreaFindByParentId();
                    break;
                case 5:
                    getBaseAreaFindByParentId();
                    break;
                case 6:
                    break;
                default:
                    break;
            }
        };

        //前端分类 分页查询商城分类导航
        let navCategoryList = ref([]);
        const getNavCategoryListTree = () => {
            //1=APP端 2=PC端
            navCategoryListTree(isMobile ? 1 : 2)
                .then((res) => {
                    navCategoryList.value = filterNavCategory(res.data);
                })
                .catch((err) => {});
        };

        //后端分类 分页查询商城分类导航
        let navCategoryListBack = ref([]);
        const getCategoryListTree = () => {
            //状态stauts：1：可用 0：不可用
            categoryListTree({ stauts: 1 })
                .then((res) => {
                    navCategoryListBack.value = getTree(res.data);
                })
                .catch((err) => {});
        };

        function getTree(data) {
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function(item) {
                map[item.id] = item;
            });

            let val = [];
            data.forEach(function(item) {
                let parent = map[item.parentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    val.push(item);
                }
            });
            return val;
        }

        //品牌列表
        let brandList = ref([]);
        const getBrandMallListCanUse = () => {
            brandMallListCanUse()
                .then((res) => {
                    brandList.value = res.data;
                })
                .catch((err) => {});
        };
        // getBrandMallListCanUse();

        //获取原产国/地区列表
        let countryList = ref([]);
        const getBaseAreaFindByParentId = () => {
            baseAreaFindByParentId()
                .then((res) => {
                    countryList.value = res.data;
                })
                .catch((err) => {});
        };
        // getBaseAreaFindByParentId();

        const filterNavCategory = (data) => {
            return data.map((item) => {
                if (item.children) {
                    if (item.children.length === 0) {
                        item.children = "";
                    } else {
                        filterNavCategory(item.children);
                    }
                }
                return item;
            });
        };

        //tab
        let tabActiveName = ref("first");
        watch(tabActiveName, (nVal) => {
            if (nVal === "first" && goodsList.value.length === 0) {
                linkTypeValue.value = 0; //选中的类型
                getGoodsMallList();
            } else if (nVal === "second" && navCategoryList.value.length === 0) {
                linkTypeValue.value = 1; //选中的类型
                getNavCategoryListTree();
            }
        });

        //默认选中值 链接类型imageLinkType（-1未选择链接，0商品，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
        if (props.config.imageLinkType != 0 && props.config.imageLinkType != -1) {
            changeLinkType(props.config.imageLinkType);
            tabActiveName.value = "second";
            linkTypeValue.value = props.config.imageLinkType; //选中的类型
            switch (props.config.imageLinkType) {
                case 1:
                    linkTypeSelected.value = props.config.frontMenuIds; //选中的值
                    break;
                case 2:
                    linkTypeSelected.value = props.config.serverMenuIds;
                    break;
                case 3:
                    linkTypeSelected.value = props.config.brandIds;
                    break;
                case 4:
                    linkTypeSelected.value = props.config.fbtCountrys;
                    break;
                case 5:
                    linkTypeSelected.value = props.config.fbmCountrys;
                    break;
                case 6:
                    linkTypeSelected.value = props.config.outerLink;
                    break;
                default:
                    break;
            }
        } else {
            getGoodsMallList();
            tabActiveName.value = "first";
            linkTypeValue.value = props.config.imageLinkType; //选中的类型
        }

        const confirm = () => {
            //商品链接
            if (tabActiveName.value === "first") {
                //0:商品链接
                props.config.imageLinkType = 0;
                props.config.goodsId = curGoods.value.id || "";
                props.config.imageLinkTypeName = proxy.$t("storeDesign.goodsLink");

                for (let i = 0, length = goodsList.value.length; i < length; i++) {
                    goodsList.value[i].current = false;
                }
                //自定义链接
            } else if (tabActiveName.value === "second") {
                if ((!Array.isArray(linkTypeSelected.value) && linkTypeSelected.value !== "") || (Array.isArray(linkTypeSelected.value) && linkTypeSelected.value.length !== 0)) {
                    props.config.imageLinkType = linkTypeValue.value;

                    //链接类型（1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
                    switch (linkTypeValue.value) {
                        case 1:
                            props.config.frontMenuIds = linkTypeSelected.value;
                            props.config.imageLinkTypeName = proxy.$t("storeDesign.frontCategory");
                            break;
                        case 2:
                            props.config.serverMenuIds = linkTypeSelected.value;
                            props.config.imageLinkTypeName = proxy.$t("storeDesign.backCategory");
                            break;
                        case 3:
                            props.config.brandIds = linkTypeSelected.value;
                            props.config.imageLinkTypeName = proxy.$t("storeDesign.brind");
                            break;
                        case 4:
                            props.config.fbtCountrys = linkTypeSelected.value;
                            props.config.imageLinkTypeName = "FBT";
                            break;
                        case 5:
                            props.config.fbmCountrys = linkTypeSelected.value;
                            props.config.imageLinkTypeName = "FBM";
                            break;
                        case 6:
                            props.config.outerLink = linkTypeSelected.value;
                            props.config.imageLinkTypeName = proxy.$t("storeDesign.outLink");
                            break;
                        default:
                            break;
                    }
                    linkTypeSelected.value = [];
                }
            }
            console.log("props.config", props.config);
            //return;
            tabActiveName.value = "first";

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
            pageNum,
            pageSize,
            pageTotal,
            handleCurrentChange,
            handleSizeChange,

            linkTypeValue,
            linkTypeSelected,
            linkTypeList,
            changeLinkType,

            navCategoryList,
            navCategoryListBack,
            brandList,
            countryList,

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
