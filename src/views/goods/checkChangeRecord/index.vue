<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('goodsList.alert')" icon="warning" class="mb-20" />

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
                        <el-select v-model="searchForm.brandId" :placeholder="$t('pleaseSelect')" clearable filterable remote :remote-method="getBrandMallList">
                            <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 店铺名称 店铺编码 店铺手机 -->
                    <el-form-item :label="$t('shop.sellerInfo')" prop="shopId">
                        <BmSelectRemote
                            v-model="searchForm.shopId"
                            :remoteApi="getSellerList"
                            :option="{ label: 'storeName', value: 'id' }"
                            keyword="keyword"
                            :placeholder="$t('shop.companyName') + ' / ' + $t('shop.name') + ' / ' + $t('shop.code') + ' / ' + $t('shop.phone')"
                        ></BmSelectRemote>
                    </el-form-item>
                </el-col>
                <!-- 商品信息 -->
                <!-- <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" :placeholder="$t('goodsList.keyword')"></el-input>
                    </el-form-item>
                </el-col> -->
                <!-- SKU商品信息 -->
                <el-col :md="12" :lg="6">
                    <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                        <template #label>
                            <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" placeholder="tsin / fnsku / UPC / sku_code"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <!-- SKU商品信息 -->
                <!-- <el-col :md="12" :lg="6">
                    <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skuKeyword">
                        <el-input v-model="searchForm.skuKeyword" placeholder="tsin / fnsku / UPC / sku_code"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :md="12" :lg="6">
                    <!-- 提审时间 -->
                    <el-form-item prop="_tmpTimeValue">
                        <template #label>
                            <el-select v-model="searchForm.timeType" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-date-picker
                            v-model="searchForm._tmpTimeValue"
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
                <!-- 展开  -->
                <BmCollapse el="#elCollapse" :isShow="false" />
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mr-10 mb-10">
                    <!-- 全部 -->
                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>

                    <!-- 待审核 -->
                    <el-radio-button label="1">
                        {{ $t("goodsList.toAudit") }}
                        ({{ statisticalTotal.total_await_check }})
                    </el-radio-button>
                    <!-- 审核通过 -->
                    <el-radio-button label="3">
                        {{ $t("goodsList.passTheAudit") }}
                        ({{ statisticalTotal.total_check_success }})
                    </el-radio-button>
                    <!-- 审核驳回 -->
                    <el-radio-button label="2">
                        {{ $t("goodsList.reviewTheRejected") }}
                        ({{ statisticalTotal.total_check_failed }})
                    </el-radio-button>
                </el-radio-group>
                <div class="fl flex vcenter">
                    <el-radio-group v-model="searchForm.deliveryType" @change="handleChangeType" class="fl ml-20 mr-20 mb-10">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio label="1">FBM</el-radio>
                        <el-radio label="2">FBT</el-radio>
                    </el-radio-group>
                    <div class="fl ml-20 mb-10">
                        <!-- 功能操作 -->
                        <span>{{ $t("status.functionalOperation") }}：</span>

                        <!-- 批量审核 -->
                        <el-button v-permission="'goods_checkChangeRecord_audit'" @click="handleBatchAudit">{{ $t("goodsList.batch") }}</el-button>
                    </div>
                </div>
            </div>

            <div class="flex vstart">
                <!-- 导出
                <el-button @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button> -->
                <!-- 表格选项 -->
                <BmTableOption table="goodsListTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            :tree-props="{ children: 'skus' }"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            :column="tableColumn"
            style="width: 100%"
        >
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('goodsListTable.status')" width="140px">
                <template #default="scope">
                    <!-- 
						spu状态：
						examineStatus： 审核状态 （1待审核 2已通过  3未通过）
						brandStatus： 品牌状态：1->正常 2->品牌待更新
						isShield： 是否屏蔽（0否 1是）
						isLaunch： 上架状态：0->下架 1->上架
						isDraft： 草稿状态：0->不是草稿 1->是草稿
						"skuCountMap": {
									"total_not_selling": 12,   不可售库存
									"total_selling": 0         可售库存
						},

						sku状态：
						isShield： 是否屏蔽（0否 1是）
						saleState：  1->可售  为空或者其他状态不可售 
					-->
                    <!-- spu -->
                    <template v-if="scope.row.skus">
                        {{ scope.row.deliveryType === 1 ? "FBM" : "FBT" }}
                        <!-- 审核状态 -->
                        <div>
                            {{ scope.row.examineStatus == 1 ? $t("status.beAudit") : scope.row.examineStatus == 2 ? $t("status.auditPass") : $t("status.auditRejected") }}
                        </div>
                    </template>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="goodsInfo" :label="$t('goodsListTable.goodsInfo')" min-width="300">
                <template #default="scope">
                    <div class="flex">
                        <div>
                            <BmImage v-if="scope.row.mainPictureUrl" :src="scope.row.mainPictureUrl" style="width:60px;height:60px" />
                            <BmImage v-if="scope.row.picture" :src="scope.row.picture" style="width:60px;height:60px" />
                        </div>
                        <div class="ml-10">
                            <div class="green">{{ scope.row.goodTitle }}</div>
                            <div v-if="scope.row.skus">{{ $t("goodsList.sellerCode") }}: {{ scope.row.shopCode }}</div>
                            <div>TSIN: {{ scope.row.tsin }}</div>
                            <div v-if="!scope.row.skus">FNSKU: {{ scope.row.fnsku }}</div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="price" :label="$t('goodsListTable.price')" align="center">
                <template #default="scope">
                    {{ scope.row.minPrice ? scope.row.minPrice + " ~ " + scope.row.maxPrice : scope.row.price }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="stockNum" :label="$t('goodsListTable.stockNum')">
                <template #default="scope">
                    <span v-if="scope.row.skus">{{ scope.row.stock }}</span>
                    <span v-else>{{ scope.row.stockNum }}</span>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="brandName" :label="$t('goodsListTable.brandName')" width="145"> </BmTableColumn>
            <BmTableColumn prop="shopName" :label="$t('goodsListTable.sellerInfo')">
                <template #default="scope"> {{ scope.row.shopName }}<br />{{ scope.row.shopCode }} </template>
            </BmTableColumn>
            <BmTableColumn prop="internationalCode" :label="$t('goodsListTable.internationalCode')">
                <template #default="scope">
                    {{ scope.row.internationalCode }}
                </template>
            </BmTableColumn>

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
            <BmTableColumn prop="examiner" :label="$t('goodsListTable.examiner')" width="145">
                <template #default="scope">
                    {{ scope.row.examiner }} <br />
                    {{ scope.row.examineTime }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="120" header-align="center" align="center" fixed="right">
                <template #default="scope">
                    <template v-if="scope.row.skus">
                        <div>
                            <el-button v-permission="'goods_checkChangeRecord_look'" @click.stop="handleDetail(scope.row)" type="text">
                                {{ $t("table.detail") }}
                            </el-button>
                        </div>

                        <!-- 审核状态 （1待审核 2已通过 3未通过） -->
                        <el-button v-permission="'goods_checkChangeRecord_audit'" v-if="scope.row.examineStatus === 1" @click.stop="handleBatchAudit(scope.row)" type="text">
                            {{ $t("table.checkGoods") }}
                        </el-button>

                        <div v-if="scope.row.examineStatus === 2">
                            {{ $t("goodsList.passTheAudit") }}
                        </div>

                        <!-- 查看驳回原因 -->
                        <el-button v-permission="'goods_checkChangeRecord_lookReject'" v-if="scope.row.examineStatus === 3" @click.stop="handleCheck(scope.row)" type="text">
                            {{ $t("table.rejectReason") }}
                        </el-button>
                    </template>

                    <div>
                        <el-button type="text" @click.stop="handlePrintBarcode(scope.row)">{{ $t("goodsListTable.printBarcode") }}</el-button>
                    </div>
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
            initData(true);
            searchCount();
        "
    />

    <!-- 查看驳回原因-->
    <Check v-model:visible="checkVisible" :row="checkSelectionRow" />

    <!-- 详情
    <Detail
        v-if="detailVisible"
        v-model:visible="detailVisible"
        :row="detailRow"
        @reloadData="initData"
    />-->

    <!-- 详情&详情对比-->
    <DetailChange
        v-if="detailChangeVisible"
        v-model:visible="detailChangeVisible"
        :row="detailRow"
        @reloadData="
            initData(true);
            searchCount();
        "
    />
    <!-- 打印条码弹窗 -->
    <PrintBarcode v-if="printVisible" v-model:visible="printVisible" :row="printData"></PrintBarcode>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import { categoryListTree, brandMallList, specModelMallExport, goodsMallExamineStatistical, findByParentId, goodsMallExamineList } from "@/api/goods";
import { getSellerList } from "@/api/store";

import Audit from "./component/audit";
import Check from "./component/check";
//import Detail from "../check/component/detail";
import DetailChange from "../checkRecord/component/detailChange";
import PrintBarcode from "../manager/component/printBarcode";
import { exportExcel } from "@/utils/";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    name: "checkChang",
    components: { Audit, Check, DetailChange, PrintBarcode },
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

        //是否带电
        const typeList = computed(() => [
            {
                name: proxy.$t("goodsListTable.isCharge"), //是否带电
                value: 0
            },
            {
                name: proxy.$t("goodsListTable.isHazardousArticle"), //是否危险品
                value: 1
            },
            {
                name: proxy.$t("goodsListTable.isContainsPowder"), //是否含有粉末
                value: 2
            },
            {
                name: proxy.$t("goodsListTable.isFluid"), //是否液体
                value: 3
            }
        ]);
        //创建时间
        const timeTypeList = computed(() => [
            {
                name: proxy.$t("goodsListTable.createTime"), //创建时间
                value: 0,
                field: "createTime"
            },
            {
                name: proxy.$t("goodsListTable.submitExamineTime"), //提审时间
                value: 1,
                field: "submitExamineTime"
            },
            {
                name: proxy.$t("goodsListTable.examineTime"), //最新修改审核时间
                value: 2,
                field: "examineTime"
            }
        ]);
        //是否预售
        const presellList = computed(() => [
            {
                name: proxy.$t("goodsList.presell"), //预售
                value: 1
            },
            {
                name: proxy.$t("goodsList.notPresell"), //非预售
                value: 0
            }
        ]);
        //状态
        const statusList = computed(() => [
            {
                name: proxy.$t("goodsList.toAudit"), //待审核
                value: 1
            },
            {
                name: proxy.$t("goodsList.reviewTheRejected"), //审核驳回
                value: 2
            },
            {
                name: proxy.$t("goodsList.passTheAudit"), //审核通过
                value: 3
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
        ]);
        // 产地国家
        let countryList = ref([]);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            categoryId: [],
            brandId: "", // 品牌id
            carriedIndex: 0, //0是否带电1是否危险品2是否含有粉末3是否液体
            carriedOk: "", //0表示否 1表示是
            countryId: "", //产国Id
            deleted: "", //是否删除 0默认没有删除 1表示已删除
            deliveryType: "", //配送类型( 1 FBM 2 FBT )
            timeType: 0, //时间类型0创建时间 1最近修改时间 2提审时间 3审核时间 4最新上架时间 5最新下架时间 6最新修改审核时间
            _tmpTimeValue: [], //临时时间值
            beginTime: "", //
            endTime: "", //
            //goodRecommended: "", //商品推荐（1 精品推荐 2新品推荐 3畅销推荐） //暂无
            goodsType: "", //商品类型（1 普通商品 2虚拟商品）
            isOpenPresell: "", //是否支持预售 0表示不支持 1表示支持
            keyword: "", //spu商品信息(Title、TSIN、搜索关键字keyword)
            shopCategoryId: "", //店铺分类ID
            shopId: "", //店铺ID
            shopCode: "", //店铺编码
            keyword: "", //sku商品信息(tsin、fnsku、UPC、商品编码sku_code、)
            status: "", //状态
            saleStatus: "", // 售卖状态
            pageNum: 1,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });
        //搜索
        const handelSearch = () => {
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1], true);
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.beginTime = "";
            searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列 //国际码(UPC),卖家信息
        const tableColumn = [
            "status",
            "goodsInfo",
            "price",
            "stockNum",
            "brandName",
            "categoryName",
            "countryName",
            "isCharge",
            "isHazardousArticle",
            "isContainsPowder",
            "isFluid",
            "shopName",
            "sellerInfo",
            "createTime",
            "internationalCode",
            "firstExamineTime",
            "submitExamineTime",
            "updateTime",
            "launchTime",
            "shelfTime",
            "examineTime",
            "examiner"
        ];
        //获取列表
        const initData = (pageFlag) => {
            if (!pageFlag) {
                searchForm.pageNum = 1;
            }

            const params = {
                ...searchForm,
                categoryId: (searchForm.categoryId && [...searchForm.categoryId].pop()) || ""
            };
            goodsMallExamineList(params, "update")
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((v) => {
                        v.last30SaleCount = v.totalLast30SaleCount; // 近30日销量
                        v.last30CommentCount = v.totalLast30CommentCount; // 近30日评论
                        return v;
                    });
                })
                .catch((err) => {});
        };
        initData();

        // 运营中心搜索统计数据type=list表示商品列表统计 type=newcheck审核商品列表 type=updatecheck更新审核列表
        let statisticalTotal = reactive({});
        const searchCount = () => {
            goodsMallExamineStatistical({ type: "type" }, "updatecheck")
                .then((res) => {
                    statisticalTotal.total_check_success = res.data.total_check_success; // 审核成功数量
                    statisticalTotal.total_check_failed = res.data.total_check_failed; // 审核失败
                    statisticalTotal.total_await_check = res.data.total_await_check; // 待审核
                })
                .catch((err) => {});
        };
        searchCount();

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
        const getBrandMallList = (query) => {
            if (query !== "") {
                brandMallList({ keyword: query, pageNum: 1, pageSize: 99999 })
                    .then((res) => {
                        brandList.value = res.data.records;
                    })
                    .catch((err) => {});
            }
        };

        // 获取地区产地
        const getFindByParentId = () => {
            findByParentId({ parentId: 0 }).then((res) => {
                console.log(res);
                countryList.value = res.data;
            });
        };
        getFindByParentId();

        //表格时间切换
        let columnTimeIndex = ref(0);
        const handleCommandColumnTime = (item) => {
            columnTimeIndex.value = item.value;
        };

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

        //查看详情
        //let detailVisible = ref(false);
        let detailRow = ref({});
        let detailChangeVisible = ref(false);
        const handleDetail = (row) => {
            detailRow.value = {
                id: row.id,
                goodsId: row.goodId,
                categoryId: row.categoryId,
                examineStatus: row.examineStatus, //审核状态
                isChange: row.examineStatus === 1 && row.editStatus === 2 ? true : false //examineStatus审核状态（1待审核 2已通过 3未通过）  editStatus=1新提交 2已变更过
            };
            detailChangeVisible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            specModelMallExport(searchForm)
                .then((res) => {
                    exportExcel("GoodsCheckChangeRecord", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };

        // 快捷筛选
        const shortcut = (val) => {
            searchForm.status = val;
            initData();
        };
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData(true);
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageSize = val;
            initData(true);
        };

        //切换状态
        const handleChangeStatus = (val) => {
            initData();
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.deliveryType = val;
            initData();
        };

        //批量审核
        let auditVisible = ref(false);
        let auditSelectionRows = ref([]);
        const handleBatchAudit = (row) => {
            if (row && row.id) {
                auditSelectionRows.value = [row];
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                const isSkus = tableSelectionRows.filter((item) => !item.skus); //是否勾选了sku
                if (isSkus.length > 0) {
                    proxy.$message.error(proxy.$t("goodsList.tip4"));
                    return;
                }
                auditSelectionRows.value = tableSelectionRows;
            }
            auditVisible.value = true;
        };

        //查看驳回原因
        let checkVisible = ref(false);
        let checkSelectionRow = ref({});
        const handleCheck = (row) => {
            checkSelectionRow.value = row;
            checkVisible.value = true;
        };
        // 条码打印弹窗显示关闭控制变量
        let printVisible = ref(false);
        // 条码打印所需数据对象
        let printData = ref({});
        // 条码打印
        const handlePrintBarcode = (row) => {
            printVisible.value = true;
            // 判断点击的是主商品还是下面的不同sku
            if (row.goodCode) {
                // 主商品
                printData.value = {
                    goodCode: row.goodCode, // 商品编码
                    tsin: row.tsin // TSIN
                };
            } else {
                // SKU
                printData.value = {
                    fnsku: row.fnsku, // FNSKU
                    tsin: row.tsin // TSIN
                };
            }
        };
        return {
            dict,
            initData,
            pageSize,
            pageTotal,
            typeList,
            timeTypeList,
            presellList,
            statusList,
            shortcuts,
            disabledDate,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            categoryList,
            brandList,
            getBrandMallList,
            tableData,
            tableColumn,
            columnTimeIndex,
            handleCommandColumnTime,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            detailChangeVisible,
            //detailVisible,
            detailRow,
            handleDetail,
            handleExportExcel,
            handleSizeChange,
            handleCurrentChange,
            statisticalTotal,
            handleChangeStatus,
            searchCount,
            countryList,
            getSellerList,
            shortcut,
            handleChangeType,
            auditVisible,
            auditSelectionRows,
            handleBatchAudit,
            checkVisible,
            checkSelectionRow,
            handleCheck,
            goodsMultiList,
            handlePrintBarcode,
            printVisible,
            printData
        };
    }
};
</script>
