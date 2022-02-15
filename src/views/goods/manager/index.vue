<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('goodsList.alert')" icon="warning" class="mb-20" />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 商品类目 -->
                    <el-form-item :label="$t('goods.category')">
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
                    <!-- 是否带电 -->
                    <el-form-item prop="carriedOk">
                        <template #label>
                            <el-select v-model="searchForm.carriedIndex" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-select v-model="searchForm.carriedOk" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in dict.yesNo" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
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
                <!-- 商品信息 -->
                <!-- <el-col :md="12" :lg="6">
                    
                    <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" :placeholder="$t('goodsList.keyword')"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :md="12" :lg="6">
                    <!-- SKU商品信息 -->
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
                    <!-- 状态 -->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 是否预售 -->
                    <el-form-item :label="$t('goodsList.isPresell')" prop="isOpenPresell">
                        <el-select v-model="searchForm.isOpenPresell" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in presellList" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 店铺名称 店铺编码 店铺手机 -->
                    <el-form-item :label="$t('shop.sellerInfo')" prop="shopId">
                        <el-select
                            v-model="searchForm.shopId"
                            :placeholder="$t('shop.companyName') + ' / ' + $t('shop.name') + ' / ' + $t('shop.code') + ' / ' + $t('shop.phone')"
                            clearable
                            filterable
                            remote
                            :remote-method="shopIdRemote"
                        >
                            <el-option v-for="item in shopList" :key="item.id" :label="item.storeName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 产地 -->
                    <el-form-item :label="$t('goodsListTable.countryName')" prop="countryId">
                        <el-select v-model="searchForm.countryId" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in countryList" :key="index" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 时间 -->
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
                    <!-- 商品类型 -->
                    <el-form-item :label="$t('goodsList.type')" prop="goodsType">
                        <el-select v-model="searchForm.goodsType" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in goodsTypellList" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
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
                <el-radio-group v-model="searchForm.saleStatus" @change="handleChangeStatus" class="fl mr-20 mb-10">
                    <!-- status: 状态
						*       运营：
						*        0商品列表：   1库存不足  2店铺下架  3平台屏蔽  4品牌待更新  5草稿  6修改待审核
						*        1新品审核：   1待审核  2审核驳回  3审核通过
						*        2商品变更：   1待审核  2审核驳回  3审核通过
						*        3回收站      1库存不足  2店铺下架  3平台屏蔽  4品牌待更新  5草稿  6修改待审核
						*
						*      卖家：
						*
						*     0商品列表：    1审核中 2审核驳回  3库存不足  4已售罄  5已下架 6平台禁止售卖（平台屏蔽）
						*     1商品审核列表： 编辑类型： 1新增 2修改
						*     2草稿箱       编辑类型： 1新增 2修改
						*     3回收站       1审核中 2审核驳回  3库存不足  4已售罄  5已下架 6平台禁止售卖
						*
						*
						*     status: 为前台传递的状态 
					-->
                    <!-- 全部 -->
                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                    <!-- 在售中 -->
                    <el-radio-button label="1"> {{ $t("status.onSale") }}({{ statisticalTotal.total_selling }}) </el-radio-button>
                    <!-- 不可售 -->
                    <el-radio-button label="0"> {{ $t("status.notSale") }}({{ statisticalTotal.total_not_selling }}) </el-radio-button>
                </el-radio-group>
                <div class="fl flex vcenter mb-10">
                    <el-radio-group v-model="searchForm.deliveryType" @change="handleChangeType">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio label="1">FBM</el-radio>
                        <el-radio label="2">FBT</el-radio>
                    </el-radio-group>
                    <div class="fl mlr-20">
                        <!-- 快速筛选 -->
                        <span>{{ $t("status.rapidCull") }}：</span>

                        <!-- 品牌待更新 -->
                        <el-button @click="shortcut(searchForm.status == 4 ? '' : 4)" :type="searchForm.status == 4 ? 'primary' : ''">
                            {{ $t("status.brandBeUpdated") }}({{ statisticalTotal.total_brand_waiting_update }})
                        </el-button>
                        <!-- 屏蔽商品 -->
                        <el-button @click="shortcut(searchForm.status == 3 ? '' : 3)" :type="searchForm.status == 3 ? 'primary' : ''">
                            {{ $t("status.goodsShielding") }}({{ statisticalTotal.total_mall_shielding }})
                        </el-button>
                    </div>
                </div>
                <div class="fl ml-20 mb-10">
                    <!-- 功能操作 -->
                    <span>{{ $t("status.functionalOperation") }}：</span>

                    <!-- 屏蔽商品 -->
                    <el-button @click="handleOpenShield(1)" v-permission="'goods_manager_shield'">
                        {{ $t("status.shieldingProducts") }}
                    </el-button>
                    <!-- 取消屏蔽商品 -->
                    <el-button @click="handleOpenShield(0)" v-permission="'goods_manager_Unblock'">
                        {{ $t("status.cancelShieldingProducts") }}
                    </el-button>
                </div>
            </div>

            <div class="flex vstart">
                <!-- 导出 -->
                <el-button v-permission="'goods_manager_export'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
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
            @row-dblclick="handleRowdblClick"
            :column="tableColumn"
            style="width: 100%"
        >
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('goodsListTable.status')" width="140px">
                <template #default="scope">
                    <!-- 
						spu状态：
						examineStatus： 审核状态 （1待审核 2已通过  3未通过）
						brandStatus： 品牌状态：AWAIT_CHECK(1, "待审核"),CHECK_SUCCESS(2, "已通过"),CHECK_FAILED(3, "未通过"),SHIELDING(4, "屏蔽中"),AWAIT_UPDATE(5, "待更新");
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
                            {{ scope.row.examineStatus == 1 ? $t("status.beAudit") : "" }}
                        </div>
                        <!-- 审核状态 -->
                        <div>{{ $t("status.onSale") }}({{ scope.row.skuCountMap.total_selling }})</div>
                        <div>{{ $t("status.notSale") }}({{ scope.row.skuCountMap.total_not_selling }})</div>
                        <!-- 品牌状态 -->
                        <div>
                            {{ scope.row.brandStatus == 5 ? $t("status.brandBeUpdated") : "" }}
                        </div>
                        <!-- 是否屏蔽
                        <div>{{ scope.row.isShield == 1 ? $t("status.shielding") : "" }}</div> -->
                        <!-- 是否草稿 -->
                        <div>{{ scope.row.isDraft == 1 ? $t("status.draft") : "" }}</div>
                    </template>
                    <!-- sku -->
                    <template v-else>
                        <!-- 已下架 -->
                        <div class="tr">
                            {{ scope.row.isDown == 1 ? `${$t("goodsList.soldOut")}(${$t("status.notSale")})` : "" }}
                        </div>
                        <!-- 库存不足 -->
                        <div class="tr">
                            {{ scope.row.stock == 0 ? `${$t("goodsList.Understock")}(${$t("status.notSale")})` : "" }}
                        </div>
                        <!-- 是否屏蔽 -->
                        <div class="tr">
                            {{ scope.row.isShield == 1 ? `${$t("status.shielding")}(${$t("status.notSale")})` : "" }}
                        </div>
                        <!-- 是否可售
                        <div class="tr">
                            {{ scope.row.saleState == 1 ? `${$t("status.onSale")}(${$t("status.onSale")})` : `${$t("status.notSale")}(${$t("status.notSale")})` }}
                        </div> -->
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
                            <div @click.stop="handleDetail(scope.row)" class="green cp">{{ scope.row.goodTitle }}</div>
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
            <BmTableColumn prop="stockNum" :label="$t('goodsListTable.stockNum')" width="120">
                <template #default="scope">
                    <!-- spu -->
                    <template v-if="scope.row.skus">
                        {{ scope.row.stock }}
                    </template>
                    <!-- sku -->
                    <template v-else>
                        <!-- FBM -->
                        <template v-if="scope.row.deliveryType === 1">
                            <div>{{ $t("goodsListTable.lockStock") }}{{ scope.row.lockStock }}</div>
                            <div>{{ $t("goodsListTable.saleStock") }}{{ scope.row.stockNum }}</div>
                        </template>
                        <!-- FBT -->
                        <template v-else>
                            <div>{{ $t("goodsListTable.lockStock") }}{{ scope.row.fbtLockStock }}</div>
                            <div>{{ $t("goodsListTable.storehouseStock") }}{{ scope.row.fbtWareNum }}</div>
                            <div>{{ $t("goodsListTable.saleStock") }}{{ scope.row.fbtStockNum }}</div>
                        </template>
                    </template>
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
            <BmTableColumn :prop="salesTypeList[columnSalesIndex].field" width="145">
                <template #header>
                    <el-dropdown @command="handleCommandcolumnSales">
                        <span>
                            {{ salesTypeList[columnSalesIndex].name }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in salesTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="90" header-align="center" align="center" fixed="right">
                <template #default="scope">
                    <el-button v-permission="'goods_manager_look'" @click.stop="handleDetail(scope.row)" type="text">
                        {{ $t("table.detail") }}
                    </el-button>
                    <el-button type="text" @click.stop="handlePrintBarcode(scope.row)">{{ $t("goodsListTable.printBarcode") }}</el-button>
                    <!-- 同步库存 spu才显示-->
                    <el-button v-if="scope.row.skus" @click.stop="handleSynchronize(scope.row)" type="text">{{ $t("repairGoods.synchronizeInventory") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 屏蔽商品 -->
    <Shield
        v-model:visible="shieldVisible"
        :shieldOption="shieldOption"
        @reloadData="
            initData();
            searchCount();
        "
    />

    <!-- 详情&详情对比-->
    <DetailChange v-if="detailChangeVisible" v-model:visible="detailChangeVisible" :row="detailRow" />
    <!-- 打印条码弹窗 -->
    <PrintBarcode v-if="printVisible" v-model:visible="printVisible" :row="printData"></PrintBarcode>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import {
    goodsMallList,
    categoryListTree,
    brandMallList,
    specModelMallListGoodsCategoryByAttrId,
    specModelMallRelationCategory,
    goodsMallListExport,
    goodsMallGetStatistical,
    findByParentId,
    synchronizeInventory
} from "@/api/goods";
import { getSellerList } from "@/api/store";

import Shield from "./component/shield";
import DetailChange from "../check/component/detailChange";
import { exportExcel } from "@/utils/";
import { dateShortcuts } from "@/utils/dateShortcuts";
import PrintBarcode from "./component/printBarcode";
export default {
    name: "GoodsManager",
    components: { Shield, DetailChange, PrintBarcode },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();
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
                name: proxy.$t("goodsListTable.updateTime"), //最近更新时修改时间
                value: 1,
                field: "updateTime"
            },
            {
                name: proxy.$t("goodsListTable.submitExamineTime"), //提审时间
                value: 2,
                field: "submitExamineTime"
            },
            // {
            //     name: proxy.$t("goodsListTable.firstExamineTime"), //首次审核时间
            //     value: 3,
            //     field: "firstExamineTime"
            // },
            {
                name: proxy.$t("goodsListTable.launchTime"), //最新/最好后上架时间
                value: 3,
                field: "launchTime"
            },
            {
                name: proxy.$t("goodsListTable.shelfTime"), //最新下架时间
                value: 4,
                field: "shelfTime"
            },
            {
                name: proxy.$t("goodsListTable.examineTime"), //最新/最后修改审核时间
                value: 5,
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
        // 商品类型
        const goodsTypellList = reactive([
            {
                name: proxy.$t("goodsListTable.commonGoods"), // 普通商品
                value: 1
            },
            {
                name: proxy.$t("goodsListTable.virtualGoods"),
                value: 2
            }
        ]);
        //状态
        const statusList = computed(() => [
            {
                name: proxy.$t("goodsList.Understock"), //库存不足
                value: 1
            },
            {
                name: proxy.$t("goodsList.storeShelves"), //店铺下架
                value: 2
            },
            {
                name: proxy.$t("goodsList.platformScreen"), //平台屏蔽
                value: 3
            },
            {
                name: proxy.$t("goodsList.brandUpdated"), //品牌待更新
                value: 4
            }
            // {
            //     name: proxy.$t("goodsList.draft"), //草稿
            //     value: 5
            // },
            // {
            //     name: proxy.$t("goodsList.modifyAudit"), //修改待审核
            //     value: 6
            // }
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
        //卖家信息
        let shopList = ref([]);
        const shopIdRemote = (query) => {
            if (query !== "") {
                getSellerList({ keyword: query, pageNo: 1, pageSize: 99999 })
                    .then((res) => {
                        shopList.value = res.data.records;
                    })
                    .catch(() => {});
            } else {
                shopList.value = [];
            }
        };

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
            searchForm.categoryId = [];
            searchForm.beginTime = "";
            searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);
        let tableData = ref([]);

        //表格选项的列
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
            "last30SaleCount",
            "saleCount",
            "last30CommentCount",
            "commentCount"
        ];
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        //获取列表
        const initData = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            const params = {
                ...searchForm,
                categoryId: (searchForm.categoryId && [...searchForm.categoryId].pop()) || ""
            };
            goodsMallList(params)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((v) => {
                        v.last30SaleCount = v.totalLast30SaleCount; // 近30日销量
                        v.last30CommentCount = v.totalLast30CommentCount; // 近30日评论
                        return v;
                    });
                })
                .catch((err) => {});
            pageFlag.value = false;
        };
        initData();

        // 运营中心搜索统计数据type=list表示商品列表统计 type=newcheck审核商品列表 type=updatecheck更新审核列表
        let statisticalTotal = reactive({
            total_brand_waiting_update: "", // 待更新
            total_mall_shielding: "", // 屏蔽中
            total_not_selling: "", // 不可售
            total_selling: "" // 在售中
        });
        const searchCount = () => {
            goodsMallGetStatistical({ type: "type" }, "list")
                .then((res) => {
                    statisticalTotal.total_brand_waiting_update = res.data.total_brand_waiting_update;
                    statisticalTotal.total_mall_shielding = res.data.total_mall_shielding;
                    statisticalTotal.total_not_selling = res.data.total_not_selling;
                    statisticalTotal.total_selling = res.data.total_selling;
                })
                .catch((err) => {});
        };
        searchCount();

        //商品类目列表
        let categoryList = ref([]);
        const getCategoryListTree = () => {
            categoryListTree({ status: 1 })
                .then((res) => {
                    categoryList.value = getTree(res.data);
                })
                .catch((err) => {});
        };
        getCategoryListTree();

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

        //表格销量切换
        const salesTypeList = computed(() => [
            {
                name: proxy.$t("goodsListTable.saleCount"), //累计销量
                value: 0,
                field: "saleCount"
            },
            {
                name: proxy.$t("goodsListTable.commentCount"), //收藏数
                value: 1,
                field: "commentCount"
            }
            // {
            //     name: proxy.$t("goodsListTable.last30SaleCount"), //近30日销量
            //     value: 2,
            //     field: "last30SaleCount"
            // },
            // {
            //     name: proxy.$t("goodsListTable.last30CommentCount"), //近30日评价
            //     value: 2,
            //     field: "last30CommentCount"
            // },
        ]);
        let columnSalesIndex = ref(0);
        const handleCommandcolumnSales = (item) => {
            columnSalesIndex.value = item.value;
        };

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

        //双击行编辑
        const handleRowdblClick = (row) => {
            // editRow.value = row;
            // editVisible.value = true;
        };

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                if (tableSelectionRows.length !== 1) {
                    proxy.$message.error(proxy.$t("table.selectOnlyOne"));
                    return;
                }
                editRow.value = tableSelectionRows[0];
            }
            editVisible.value = true;
        };

        // //删除
        // const handleDelete = () => {
        //     if (tableSelectionRows.length === 0) {
        //         proxy.$message.error(proxy.$t("table.selectLeastOne"));
        //         return;
        //     }
        //     const ids = tableSelectionRows.map((item) => item.id).join("_");
        //     specModelMallRemoveByIds(ids)
        //         .then((res) => {
        //             initData();
        //             proxy.$message.success(res.msg);
        //         })
        //         .catch((err) => {});
        // };

        //查看详情
        let detailRow = ref({});
        let detailChangeVisible = ref(false);
        const handleDetail = (row) => {
            detailRow.value = {
                goodsId: row.id,
                categoryId: row.categoryId,
                examineStatus: row.examineStatus,
                isChange: row.examineStatus === 1 && row.editStatus === 2 ? true : false //examineStatus审核状态（1待审核 2已通过 3未通过）  editStatus=1新提交 2已变更过
            };
            detailChangeVisible.value = true;
        };

        //关联类目数量
        let goodsCategoryVisible = ref(false);
        let goodsCategoryRow = ref([]); //点击的当前行
        const handleCategoryNum = (row) => {
            specModelMallListGoodsCategoryByAttrId({ specId: row.id })
                .then((res) => {
                    goodsCategoryRow.value = { ...row, ids: res.data.map((item) => item.id) };
                    goodsCategoryVisible.value = true;
                })
                .catch(() => {});
        };
        const changeGoodsCategory = (ids) => {
            specModelMallRelationCategory({ id: goodsCategoryRow.value.id, categoryIds: ids })
                .then((res) => {
                    initData();
                })
                .catch(() => {
                    initData();
                });
        };

        //属性值
        let specValuesVisible = ref(false);
        let specValuesRow = ref({});
        const handleSpecValues = (row) => {
            specValuesRow.value = row;
            specValuesVisible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            goodsMallListExport(searchForm)
                .then((res) => {
                    exportExcel("goodsList", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };

        // 快捷筛选
        const shortcut = (val) => {
            searchForm.status = val;
            initData();
        };

        //切换状态
        const handleChangeStatus = (val) => {
            searchForm.saleStatus = val;
            initData();
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.deliveryType = val;
            initData();
        };

        // 屏蔽商品 / 取消屏蔽
        let shieldVisible = ref(false);
        let shieldOption = reactive({});
        const handleOpenShield = (val) => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            //请勿同时勾选SPU和SKU，不能混选，spu才有skus
            const rows = tableSelectionRows.filter((item) => !item.skus);
            let goodType = "";
            //全部是sku
            if (rows.length === tableSelectionRows.length) {
                goodType = 1;
            } else if (rows.length === 0) {
                //全部是spu
                goodType = 0;
            }
            if (goodType === "") {
                proxy.$message.error(proxy.$t("goodsList.tip5")); //请勿同时勾选SPU和SKU
                return;
            }

            shieldOption.goodsIds = tableSelectionRows.map((item) => item.id);
            shieldOption.status = val;
            shieldOption.goodType = goodType;
            shieldVisible.value = true;
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

        // 同步库存
        const handleSynchronize = (row) => {
            proxy
                .$confirm(proxy.$t("confirmOperate"), proxy.$t("repairGoods.synchronizeInventory"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    synchronizeInventory([row.id])
                        .then((res) => {
                            proxy.$message.success(res.msg);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
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
            salesTypeList,
            columnSalesIndex,
            handleCommandcolumnSales,
            multipleTable,
            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            shieldVisible,
            shieldOption,
            handleOpenShield,
            detailRow,
            detailChangeVisible,
            handleDetail,
            goodsCategoryVisible,
            goodsCategoryRow,
            handleCategoryNum,
            changeGoodsCategory,
            handleExportExcel,
            specValuesVisible,
            specValuesRow,
            handleSpecValues,
            handleSizeChange,
            handleCurrentChange,
            statisticalTotal,
            handleChangeStatus,
            searchCount,
            goodsTypellList,
            countryList,
            shopList,
            shopIdRemote,
            shortcut,
            handleChangeType,
            goodsMultiList,
            handlePrintBarcode,
            printVisible,
            printData,
            pageFlag,
            handleSynchronize
        };
    }
};
</script>
