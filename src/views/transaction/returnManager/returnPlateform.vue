<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('commentManagent.orderSN')" prop="orderSn">
                        <el-input clearable v-model="searchForm.orderSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('orderQuery.afterSaleSn')" prop="returnSn">
                        <el-input clearable v-model="searchForm.returnSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="orderStatus" :label="$t('orderQuery.orderStatus')">
                        <el-select clearable v-model="searchForm.orderStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.lable" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="returnStatus" :label="$t('orderQuery.AfterState')">
                        <el-select clearable v-model="searchForm.returnStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <!-- <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.goodsInfo')" prop="goodKeyword">
                            <el-input clearable v-model="searchForm.goodKeyword" placeholder="Title/TSIN/FNSKU/Batch No./EAN/NPU"></el-input>
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
                            <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.returnWaybillNumber')" prop="deliverySn">
                            <el-input clearable v-model="searchForm.deliverySn" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.returnReason')" prop="applyReason">
                            <el-select clearable v-model="searchForm.applyReason" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, i) in refundList" :key="i" :label="item.applyReason" :value="item.applyReason"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('afterSalesReasonSettingTable.applyType')" prop="returnType">
                            <el-select clearable v-model="searchForm.returnType" :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('platform.onlyRefund')" value="0"> </el-option>
                                <el-option :label="$t('platform.refundReturn')" value="1"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <!-- 手机号 -->
                    <!-- <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('permissionUser.phone')" prop="phone">
                            <el-input clearable v-model="searchForm.phone" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="_tpmTime" :label="$t('createTime')">
                            <el-date-picker
                                clearable
                                v-model="searchForm._tpmTime"
                                @change="changeDate"
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
                        <el-form-item :label="$t('evaluationComplaintManagement.sellerInfo')" prop="sellerId">
                            <el-select v-model="searchForm.sellerId" :placeholder="$t('pleaseSelect')" filterable remote reserve-keyword clearable :remote-method="getStoreList">
                                <el-option v-for="(item, index) in storeList" :key="index" :label="item.storeName" :value="item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('sellerFeedbackListTable.userInfo')" prop="buyerId">
                            <el-select v-model="searchForm.buyerId" :placeholder="$t('pleaseSelect')" filterable remote reserve-keyword clearable :remote-method="getBuyerList">
                                <el-option v-for="(item, index) in buyerList" :key="index" :label="item.account" :value="item.id"> </el-option>
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
            </div>

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
        <div class="flex between vcenter mb-20" style="flex-wrap: wrap;">
            <div class="flex vcenter">
                <!-- 全选 -->
                <!-- <el-checkbox
                    :indeterminate="isIndeterminate"
                    v-model="checkedAll"
                    @change="handleCheckAllChange"
                    class="mr-15"
                >{{ $t("table.checkAll") }}
                </el-checkbox> -->
                <el-radio-group v-model="searchForm.orderType" @change="handleChangeType" class="ml-25">
                    <el-radio label="">{{ $t("status.all") }}</el-radio>
                    <el-radio label="2">FBT</el-radio>
                    <el-radio label="1">FBM</el-radio>
                </el-radio-group>
                <div class="ml-40 flex vcenter">
                    <div>{{ $t("orderQuery.quicklyScreenAfterSalesOrders") }}:</div>
                    <el-button class="ml-20" @click="shortcut(1)" plain>{{ $t("orderQuery.waitDelivery") }}({{ applyWaitHandleCount }})</el-button>
                    <el-button @click="shortcut(3)" plain>{{ $t("orderQuery.imminentDelayShipment") }}({{ returnGoodsWaitHandleCount }})</el-button>
                </div>
            </div>
            <div class="flex vcenter">
                <span class="mr-10 ml-30">{{ $t("orderQuery.utilities") }}:</span>
                <el-button v-permission="'returnManager_returnPlateform_batchAgreeRefund'" plain @click="bitchDeliver">{{ $t("orderQuery.batchAgreeToRefundAmount") }}</el-button>
                <el-button v-permission="'returnManager_returnPlateform_batchAgreeReturn'" plain @click="bitchSales">{{ $t("orderQuery.batchAgreeToRefundGoods") }}</el-button>
                <el-button v-permission="'returnManager_returnPlateform_export'" plain class="ml-15" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <!-- 12 -->
        <template v-if="tableList && tableList.length > 0">
            <div v-for="(item, i) in tableList" :key="i">
                <div class="flex between vcenter p-20 bg-light-grey border">
                    <div>
                        <el-checkbox v-model="checkedOrderSn" @change="handleSelectionChange($event, item.id)" :label="item.id" :key="item.id" class="mr-15">&nbsp; </el-checkbox>
                        {{ item.orderType == 1 ? "FBM" : item.orderType == 2 ? "FBT" : "" }}<span v-if="item">({{ item.orderReturnItems.length }})</span>
                        <span class="ml-15">{{ $t("orderQuery.afterSaleSn") }}:</span
                        ><span class="ml-15"
                            ><text class="green">{{ item.returnSn }}</text>

                            <text v-clipboard:copy="item.returnSn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-15 green cp">{{ $t("copy") }}</text></span
                        >
                        <!--申请时间  -->
                        <span class="iblock  ml-30">{{ $t("orderQuery.applicationTime") }}： {{ item.createTime }}</span>
                        <!-- 关联订单编号 -->
                        <span v-if="item.orderSn" class="iblock ml-25">{{ $t("orderQuery.connectOrderSn") }}：{{ item.orderSn }}</span>
                        <!-- 卖家信息 -->
                        <span class="iblock ml-25"
                            >{{ $t("goodsListTable.sellerInfo") }}：<span class="mr-10">{{ item.storeName }} </span>{{ item.storeCode }}</span
                        >
                    </div>
                    <div>
                        <span
                            ><i v-if="item.sourceType == 4" class="el-icon-monitor"></i><i v-if="item.sourceType == 1 || item.sourceType == 2 || item.sourceType == 3" class="el-icon-mobile-phone"></i
                        ></span>
                    </div>
                </div>
                <BmTable :data="[item]" class="mb-20" header-align="center">
                    <!-- <BmTableColumn type="selection"></BmTableColumn> -->
                    <!-- 商品信息 -->
                    <BmTableColumn prop="date" label="" min-width="600" header-align="center">
                        <template #header>
                            <!-- 商家信息 数量/价格 -->
                            <div class="flex between">
                                <div style="margin-left:200px;">
                                    {{ $t("orderQuery.goodsInfo") }}
                                </div>
                                <div>
                                    {{ $t("orderQuery.UnitPriceQuantity") }}
                                </div>
                            </div>
                        </template>
                        <template #default="scope">
                            <div :class="scope.row.orderReturnItems.length > 2 && item.checked ? 'default' : ''">
                                <div v-for="(ison, i) in scope.row.orderReturnItems" :key="i">
                                    <div class="flex between mb-10" :style="i !== 0 ? 'border-top: 1px solid #ebeef5;' : ''">
                                        <div>
                                            <BmImage class="goodImg" :src="ison.productImage" :preview-src-list="[ison.productImage]" />
                                        </div>
                                        <div class="flex1 ml-20" style="text-align: left;">
                                            <div class="font-flow">{{ ison.productName }}</div>
                                            <!-- 商家编码 -->
                                            <div>
                                                {{ $t("orderQuery.MerchantCode") }}:
                                                {{ scope.row.storeCode }}
                                            </div>
                                            <div>
                                                <span>TSIN: {{ ison.skuTsin }}</span
                                                ><span style="margin-left: 100px;">{{ ison.goodAttr }}</span>
                                            </div>
                                            <div>FNSKU: {{ ison.skuFnsku }}</div>
                                        </div>
                                        <div class="flex center">
                                            <div>{{ ison.productPrice }}</div>
                                            <div>x {{ ison.returnQuantity }}</div>
                                        </div>
                                        <div
                                            v-if="scope.row.orderReturnItems.length > 2 && item.checked && i === 1"
                                            class="green cp"
                                            style="position: absolute;bottom: 20px;right: 0;"
                                            @click="item.checked = !item.checked"
                                        >
                                            {{ $t("orderQuery.more") }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 交易金额 -->
                    <BmTableColumn prop="payAmount" :label="$t('sellerReconciliationCenterTable.transactionAmount') + $store.state.app.currencySymbol" width="100" align="center"> </BmTableColumn>
                    <!-- 退款金额 -->
                    <BmTableColumn prop="returnAmount" :label="$t('orderQuery.refundAmount') + $store.state.app.currencySymbol" min-width="150" header-align="center" align="center"> </BmTableColumn>
                    <!-- 买家信息 -->
                    <BmTableColumn prop="columnTime" :label="$t('orderQuery.BuyersInformation')" align="center" min-width="200" header-align="center">
                        <template #default="scope">
                            <span class="block">{{ scope.row.memberId }}</span>
                            <span class="block">{{ scope.row.memberName }}</span>
                        </template>
                    </BmTableColumn>
                    <!-- 订单状态 -->
                    <BmTableColumn prop="orderStatus" :label="$t('orderQuery.orderStatus')" align="center" min-width="100" header-align="center">
                        <template #default="scope">
                            {{ scope.row.orderStatusName }}
                        </template>
                    </BmTableColumn>
                    <!-- 售后状态 -->
                    <BmTableColumn prop="status" :label="$t('orderQuery.AfterState')" align="center" min-width="100" header-align="center">
                        <template #default="scope">
                            {{ scope.row.statusName }}
                        </template>
                    </BmTableColumn>
                    <!-- 订单/售后状态
                    <BmTableColumn prop="" :label="$t('orderQuery.OrderAfterSaleStatus')" align="center" min-width="100" header-align="center">
                        <template #default="scope"> -->
                    <!-- 待付款 待发货 待收货 待评价  已完成 已取消 超时未付款 无效订单 已拒收-->
                    <!-- <div>
                                {{
                                    scope.row.status === 0
                                        ? $t("orderQuery.waitPayment")
                                        : scope.row.status === 1
                                        ? $t("orderQuery.waitForDelivery")
                                        : scope.row.status === 2
                                        ? $t("orderQuery.waitReceiving")
                                        : scope.row.status === 3
                                        ? $t("orderQuery.waitingEvaluation")
                                        : scope.row.status === 4
                                        ? $t("orderQuery.fulfill")
                                        : scope.row.status === 5
                                        ? $t("orderQuery.canceled")
                                        : scope.row.status === 6
                                        ? $t("orderQuery.timeoutCancel")
                                        : scope.row.status === 7
                                        ? $t("orderQuery.invalidOrders")
                                        : scope.row.status === 8
                                        ? $t("orderQuery.hasRejected")
                                        : ""
                                }}
                            </div>
                            <div v-if="scope.row.deliveryType == 2">
                                {{
                                    scope.row.fbtDeliveryStatus == 1
                                        ? $t("orderQuery.WMS")
                                        : scope.row.fbtDeliveryStatus == 2
                                        ? $t("orderQuery.WaitingForWarehouseProcessing")
                                        : scope.row.fbtDeliveryStatus == 3
                                        ? $t("orderQuery.WarehouseProcessing")
                                        : scope.row.fbtDeliveryStatus == 4
                                        ? $t("orderQuery.HaveOutbound")
                                        : ""
                                }}
                            </div>
                            <div v-if="scope.row.status === 2">
                                {{
                                    scope.row.hasSign == 0
                                        ? $t("orderQuery.ToSignForIt")
                                        : scope.row.hasSign == 1
                                        ? $t("orderQuery.haveBeenSigned")
                                        : scope.row.hasSign == 2
                                        ? $t("orderQuery.refuseReceiveGoods")
                                        : ""
                                }}
                            </div> -->
                    <!-- </template>
                    </BmTableColumn> -->
                    <!-- 操作 -->
                    <BmTableColumn prop="" :label="$t('orderQuery.operation')" align="center" header-align="center" fixed="right">
                        <template #default="scope">
                            <!-- 查看详情 -->
                            <el-button v-permission="'returnManager_returnPlateform_look'" type="text" @click="checkDetail(scope.row)">
                                {{ $t("orderQuery.SeeDetails") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else :text="$t('noData')" />
        <!-- /12 -->

        <!-- </div> -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form label-position="left">
            <el-form-item>
                {{ $t("orderQuery.areYouSureToRefundAmountTheBuyer") }}
            </el-form-item>
        </el-form>
    </BmDialog>
    <BmDialog v-model:visible="visible_2" :title="title_2" :confirm="confirm_2" :cancel="cancel_2" :width="600">
        <el-form label-position="left">
            <el-form-item>
                {{ $t("orderQuery.areYouSureToRefundGoodsTheBuyer") }}
            </el-form-item>
        </el-form>
    </BmDialog>
    <!-- 查看详情弹窗 -->
    <AddEdit v-model:visible="detailVisible" v-if="detailVisible" :row="editRow" @reloadData="initData()" />
    <!-- 打印退货单 -->
    <PrintReturnOrder v-if="printVisible" v-model:visible="printVisible" :row="printData" @close="cancel" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import {
    orderReturnListPage,
    OrderFindByConditions,
    orderOrderReturnReturn,
    orderBatchAgreeReturnGoods,
    adminSellerFindByConditionsNoPage,
    adminBuyerFindByConditions,
    orderReturnExport,
    getAfterSaleOrderNum
} from "@/api/transaction";
import { useStore } from "vuex";
import PrintReturnOrder from "./component/printReturnOrder";
import dayjs from "dayjs";
import AddEdit from "./component/addEdit";
import { exportExcel } from "@/utils/";
import { useRoute } from "vue-router";
export default {
    name: "returnPlateform",
    components: { PrintReturnOrder, AddEdit },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典
        // 使用路由
        const route = useRoute();
        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //搜索
        let searchFormRef = ref(null);

        let radio = ref(3);

        let typeName = ref(proxy.$t("goodsListTable.isCharge"));

        let visible = ref(false);
        let visible_2 = ref(false);
        let title = ref(proxy.$t("orderQuery.batchAgreeToRefundAmount"));
        let title_2 = ref(proxy.$t("orderQuery.batchAgreeToRefundGoods"));
        const handleCommand = (item) => {
            typeName.value = item.name;
        };

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        // 订单状态
        let orderStatusList = computed(() => [
            {
                lable: proxy.$t("orderQuery.waitPayment"), // 待付款
                value: 0
            },
            {
                lable: proxy.$t("warehouse.waitDelivery"), // 待发货
                value: 1
            },
            {
                lable: proxy.$t("orderQuery.waitReceiving"), // 待收货
                value: 2
            },
            {
                lable: proxy.$t("orderQuery.waitingEvaluation"), // 待评价
                value: 3
            },
            {
                lable: proxy.$t("orderQuery.fulfill"), // 已完成
                value: 4
            },
            {
                lable: proxy.$t("orderQuery.canceled"), // 已取消
                value: 5
            },
            {
                lable: proxy.$t("platform.orderCloseForTimeout"), // 订单关闭（超时关闭）
                value: 6
            },
            {
                lable: proxy.$t("platform.orderCloseForAfterSale"), // 订单关闭 (售后关闭)
                value: 7
            },
            {
                lable: proxy.$t("orderQuery.other"), // 其他
                value: 8
            }
        ]);

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));
        const timeType = computed(() => [
            {
                name: proxy.$t("createTime"), //创建时间
                value: "createTime"
            },
            {
                name: proxy.$t("updateTime"), //更新时间
                value: "updateTime"
            },
            {
                name: proxy.$t("auditTime"), //审核时间
                value: "auditTime"
            },
            {
                name: proxy.$t("putawayTime"), //上架时间
                value: "putawayTime"
            },
            {
                name: proxy.$t("soldoutTime"), //下架时间
                value: "soldoutTime"
            }
        ]);

        // 卖家店铺列表
        let storeList = ref([]);
        const getStoreList = (keyword) => {
            adminSellerFindByConditionsNoPage({ storeCode: keyword })
                .then((res) => {
                    storeList.value = res.data;
                })
                .catch((err) => {});
        };
        // getStoreList()

        // 用户信息列表
        let buyerList = ref([]);
        const getBuyerList = (val) => {
            adminBuyerFindByConditions({ userInfo: val }).then((res) => {
                buyerList.value = res.data.records;
            });
        };
        // getBuyerList()

        // 售后状态
        let returnTypeList = computed(() => [
            {
                label: proxy.$t("platform.MOProcessed"), // 商家/运营待处理
                value: 1
            },
            {
                label: proxy.$t("platform.backDoor"), // 待自行寄回/待上门
                value: 2
            },
            {
                label: proxy.$t("platform.MOReceived"), // 商家/运营待收货
                value: 3
            },
            {
                label: proxy.$t("platform.forrefund"), // 待退款
                value: 4
            },
            {
                label: proxy.$t("platform.refundSuccess"), // 退款成功
                value: 5
            },
            {
                label: proxy.$t("platform.CloseAfterSalesOrder"), // 关闭售后订单
                value: 6
            },
            {
                label: proxy.$t("platform.MOReApp"), // 商家/运营驳回申请
                value: 7
            },
            {
                label: proxy.$t("platform.MORefuseAcceptReturn"), // 商家/运营拒收退货商品
                value: 8
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

        let searchForm = reactive({
            _tpmTime: [],
            applyReason: "", // 退款原因
            beginTime: "", // 开始时间
            buyerId: "", // 会员id 会员信息
            deliverySn: "", // 退运单号
            endTime: "", //	结束时间
            goodKeyword: "", //	商品信息
            orderSn: "", //	订单编号
            orderStatus: "", //	订单状态：0->待付款；1->待发货；2->待收货；3->待评价；4->已完成 5->已取消；6->超时取消；7->无效订单；8->已拒收
            orderType: route.query.orderType || "", // 订单类型1->FBM订单 2->FBT订单
            pageSize: "", // pageSize,示例值(10)
            phone: "", // 手机号
            returnSn: "", //	售后编号
            returnStatus: route.query.returnStatus * 1 || "", // 售后状态（1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品）
            returnType: route.query.returnType || "", // 售后类型(是否支持预售( 0否 1是))
            sellerId: "", // 卖家Id	query	false  卖家信息 编码/code
            storeId: "",
            pageNum: 1,
            pageSize: pageSize,
            info: "",
            sellerInfo: "",
            vipInfo: "",
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        // 获取数据
        let tableList = ref([]);
        let checkedOrderSnList = [];
        let applyWaitHandleCount = ref("");
        let returnGoodsWaitHandleCount = ref("");
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        const gettableData = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            // 获取退款申请待处理和已退货待处理数量
            getAfterSaleOrderNum(searchForm).then((res) => {
                applyWaitHandleCount.value = res.data.pendingCount;
                returnGoodsWaitHandleCount.value = res.data.receivedCount;
            });
            orderReturnListPage(searchForm)
                .then((res) => {
                    tableList.value = res.data.records.map((item) => {
                        // 订单状态(数字转文字 0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成
                        // 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他)
                        for (let i in dict.value.afterSaleOrderStatus) {
                            if (dict.value.afterSaleOrderStatus[i].value == item.orderStatus) {
                                item.orderStatusName = dict.value.afterSaleOrderStatus[i].name;
                            }
                        }
                        // 售后状态(数字转文字 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款
                        // 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品)
                        for (let i in dict.value.settlementAfterSalesStatus) {
                            if (dict.value.settlementAfterSalesStatus[i].value == item.status) {
                                item.statusName = dict.value.settlementAfterSalesStatus[i].name;
                            }
                        }
                        return item;
                    });
                    pageTotal.value = Number(res.data.total);
                    //checkedOrderSnList = res.data.records.map(item=>item.id);
                    tableList.value.forEach((v) => (v.checked = true));
                })
                .catch((err) => {});
            pageFlag.value = false;
        };

        //初始化
        const initData = () => {
            gettableData();
        };
        initData();

        // 搜索
        const handelSearch = () => {
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1], true);
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            gettableData();
        };

        // 重置
        const resetForm = () => {
            searchForm.sellerId = searchForm.beginTime = searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.orderType = val;
            initData();
        };

        // 退款原因
        let refundList = ref([]);
        debugger
        const refundReason = () => {
            OrderFindByConditions({ orderType: 1 }).then((res) => {
                refundList.value = res.data.records;
            });
        };
        refundReason();

        // 快捷筛选
        const shortcut = (val) => {
            searchForm.returnStatus = val;
            initData();
        };

        let returnListCount = ref({});

        // 售后订单统计
        const orderReturnListCount = () => {
            // orderOrderReturnListCount().then(res => {
            //     returnListCount.value = res.data
            // })
        };
        orderReturnListCount();

        // 时间类型
        const handleCommandTimeType = (item) => {
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        const changeDate = (val) => {};

        //表格时间切换
        let columnTime = ref("createTime");
        let columnTimeName = ref(proxy.$t("createTime"));
        const handleCommandColumnTime = (item) => {
            columnTime.value = item.value;
            columnTimeName.value = item.name;
        };

        //当前页
        let currentPage = ref(1);
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

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            alert("Failed to copy texts");
        };

        // 全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);

        //全选表行
        const multipleTable = ref([]);

        // 已选订单号
        let checkedOrderSn = ref([]);

        // 全选
        const handleCheckAllChange = (val) => {
            checkedOrderSn.value = val ? checkedOrderSnList : [];
            isIndeterminate.value = false;
        };
        // 单选表格
        const handleCheckOrderSnChange = (value) => {
            console.log(value);
            checkedAll.value = checkedOrderSn.value.length === pageSize;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < pageSize;
        };

        // 选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (flag, id) => {
            if (flag) {
                tableSelectionRows.push(id);
            } else {
                tableSelectionRows.some((item, index) => {
                    if (item == id) {
                        tableSelectionRows.splice(index, 1);
                        return;
                    }
                });
            }
            // tableSelectionRows = rows;
            console.log("tableSelectionRows", tableSelectionRows);
        };

        // 批量退款 单选退款
        let ids = [];
        const bitchDeliver = (val) => {
            if (val.id) {
                ids.push(val.id);
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    ids = tableSelectionRows.map((v) => {
                        return v;
                    });
                }
            }
            visible.value = true;
        };

        // 批量退款
        const confirm = () => {
            orderOrderReturnReturn(ids).then((res) => {
                if (res.code === 0) {
                    visible.value = false;
                    proxy.$message.success(res.msg);
                }
            });
        };

        // 批量退货
        let salasId = [];
        const bitchSales = (val) => {
            // if(tableSelectionRows.length == 0) {
            //     proxy.$message.error(proxy.$t("table.selectLeastOne"));
            //     return;
            // }
            // visible_2.value = true;

            if (val.id) {
                salasId.push(val.id);
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    salasId = tableSelectionRows.map((v) => v.id);
                }
            }
            visible_2.value = true;
        };

        // 确认退货
        const confirm_2 = () => {
            let id = tableSelectionRows.map((v) => v.id);
            orderBatchAgreeReturnGoods((ids = salasId)).then((res) => {
                if (res.code === 0) {
                    visible_2.value = false;
                    proxy.$message.success(res.msg);
                    initData();
                }
            });
        };

        const cancel = () => {
            visible.value = false;
        };

        const cancel_2 = () => {
            visible_2.value = false;
        };
        // 查看详情数据载体对象
        let editRow = ref({});
        // 查看详情弹窗显示隐藏控制变量
        let detailVisible = ref(false);
        const checkDetail = (row) => {
            // router.push({
            //     path: "/transaction/returnManager/platformDetail",
            //     query: { id: row.id }
            // });
            editRow.value = {
                id: row.id
            };
            detailVisible.value = true;
        };
        //---------------------打印---------------------------
        // 打印弹窗显示隐藏控制变量
        let printVisible = ref(false);
        // 打印数据对象
        let printData = ref({});
        // 打印按钮监听事件
        const handlePrint = (row) => {
            printData.value = row;
            printVisible.value = true;
        };
        const handleExportExcel = (val) => {
            orderReturnExport(searchForm)
                .then((res) => {
                    exportExcel("ReturnManager", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            dict,
            searchFormRef,
            searchForm,
            handelSearch,
            resetForm,
            handleCommand,
            handleCommandTimeType,
            shortcuts,
            disabledDate,
            typeName,
            changeDate,
            timeTypeValue,
            timeTypeName,
            timeType,
            isIndeterminate,
            checkedAll,
            handleCheckAllChange,
            currentPage,
            handleSizeChange,
            tableList,
            radio,
            handleCurrentChange,
            columnTime,
            columnTimeName,
            handleCommandColumnTime,
            multipleTable,
            onCopy,
            onError,
            returnTypeList,
            orderStatusList,
            pageNum,
            pageSize,
            pageTotal,
            checkedOrderSn,
            handleCheckAllChange,
            handleChangeType,
            handleCheckOrderSnChange,
            refundList,
            shortcut,
            visible,
            visible_2,
            title,
            title_2,
            bitchDeliver,
            cancel,
            confirm,
            cancel_2,
            confirm_2,
            bitchSales,
            returnListCount,
            checkDetail,
            handleSelectionChange,
            returnGoodsWaitHandleCount,
            applyWaitHandleCount,
            getStoreList,
            storeList,
            getBuyerList,
            buyerList,
            printVisible,
            printData,
            handlePrint,
            detailVisible,
            editRow,
            handleExportExcel,
            goodsMultiList,
            pageFlag
        };
    }
};
</script>

<style lang="scss" scoped>
.content-wrap {
    //头部搜索栏
    .table-search-form {
        position: relative;
        padding-right: 240px;
        .table-search-btns {
            display: flex;
            justify-content: space-between;
            position: absolute;
            bottom: 15px;
            right: 0;
        }
    }
}

.table_title {
    border: 1px solid #edebed;
    border-bottom: none;
    height: 54px;
    padding: 20px 25px 20px 25px;
}
img {
    width: 59px;
    height: 59px;
}
.goodImg {
    width: 59px;
    height: 59px;
}
.default {
    height: 150px;
    overflow: hidden;
}
</style>
