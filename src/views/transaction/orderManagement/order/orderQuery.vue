<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-radio-group v-model="searchForm.monthSort" @change="monthSortChange" size="medium" class="mb-10">
            <!-- 三月前 近三月 -->
            <el-radio-button label="3_gt">{{ $t("orderQuery.OrdersInTheLastThreeMonths") }}</el-radio-button>
            <el-radio-button label="3_lt">{{ $t("orderQuery.OrderThreeMonthsAgo") }}</el-radio-button>
        </el-radio-group>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <!-- 订单编号 -->
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('orderQuery.orderNumber')" prop="orderSn">
                        <el-input v-model="searchForm.orderSn" clearable :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <!--快递单号  -->
                <!-- <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('orderQuery.trackingNumber')" prop="deliverySn">
                        <el-input v-model="searchForm.deliverySn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :md="12" :lg="6">
                    <!-- 会员名称-->
                    <el-form-item :label="$t('onlinePayments.memberInfo')" prop="buyerId">
                        <BmSelectRemote
                            v-model="searchForm.buyerId"
                            :remoteApi="getAllUserInfo"
                            :option="{ label: 'username', value: 'id' }"
                            keyword="keywords"
                            clearable
                            :placeholder="$t('onlinePayments.pleaseEnterTips')"
                        ></BmSelectRemote>
                    </el-form-item>
                </el-col>
                <!-- 订单状态 -->
                <el-col :md="12" :lg="6">
                    <el-form-item prop="status" :label="$t('orderQuery.orderStatus')">
                        <el-select v-model="searchForm.status" clearable :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.lable" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 售后状态 -->
                <el-col :md="12" :lg="6">
                    <el-form-item prop="returnStatus" :label="$t('orderQuery.AfterState')">
                        <el-select v-model="searchForm.returnStatus" clearable :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in aftersales" :key="index" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <!-- 商品信息 -->
                    <!-- <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.goodsInfo')" prop="goodKeyword">
                            <el-input v-model="searchForm.goodKeyword" placeholder="Title/TSIN/FNSKU/Batch No./EAN/NPU"></el-input>
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
                            <el-input v-model="searchForm.skeyword" clearable oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 下单时间 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.orderTime')" prop="_tpmTime">
                            <el-date-picker
                                v-model="searchForm._tpmTime"
                                type="datetimerange"
                                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                                :disabled-date="disabledDate"
                                clearable
                                placeholder="xxxx-xx-xx xx-xx-xx ~ xxxx-xx-xx xx-xx-xx"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- 支付状态 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="payState" :label="$t('orderQuery.stateOfPayment')">
                            <el-select v-model="searchForm.payState" clearable :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('orderQuery.unpaid')" value="2"> </el-option>
                                <el-option :label="$t('orderQuery.havePaid')" value="1"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否预售 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="isOpenPresell" :label="$t('orderQuery.WhetherToBooking')">
                            <el-select v-model="searchForm.isOpenPresell" clearable :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('orderQuery.presell')" value="1"> </el-option>
                                <el-option :label="$t('orderQuery.notPresell')" value="2"> </el-option>
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
        <div class="flex between mb-20">
            <div class="flex1">
                <div class="flex mr-30 mtb-10 fl">
                    <!-- 全选 -->
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange" class="mr-15">{{ $t("table.checkAll") }} </el-checkbox>

                    <!-- FBT FBM -->
                    <div class="ml-25">
                        <el-radio-group v-model="searchForm.deliveryType" @change="handleChangeType">
                            <el-radio label="">{{ $t("status.all") }}</el-radio>
                            <el-radio label="2">FBT</el-radio>
                            <el-radio label="1">FBM</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <!-- 快速筛选 -->
                <div class="fl">
                    {{ $t("orderQuery.fastFilter") }}:
                    <el-button @click="shortcut()" plain>{{ $t("orderQuery.all") }}</el-button>
                    <!-- 待发货 -->
                    <el-button @click="shortcut(0)" plain>{{ $t("orderQuery.waitForDelivery") }}({{ orderCountList.await_delivery_count }})</el-button>
                    <!-- 即将延迟发货 -->
                    <el-button @click="shortcut(1)" plain>{{ $t("orderQuery.shipmentWillBeDelayedSoon") }}({{ orderCountList.will_delay_good_count }})</el-button>
                    <!-- 已延迟发货 -->
                    <el-button @click="shortcut(2)" plain>{{ $t("orderQuery.delayedShipment") }}({{ orderCountList.delay_good_count }})</el-button>
                    <!-- 已发货未签收 -->
                    <el-button @click="shortcut(3)" plain>{{ $t("orderQuery.shipmentNotSigned") }}({{ orderCountList.has_delivered_not_sign }})</el-button>
                    <!-- 待推送至wms -->
                    <el-button @click="shortcut(4)" plain>{{ $t("orderQuery.waitPush") }}({{ orderCountList.await_send_wms }})</el-button>
                </div>
            </div>
            <div>
                <!-- 批量备注 批量发货 -->
                <!-- <el-button plain class="ml-15" @click="bitchRemarks">{{ $t("orderQuery.BatchNote") }}</el-button> 
                <el-button @click="batchShipments" plain class="ml-15">{{ $t("orderQuery.batchDelivery") }}</el-button>-->
                <el-button v-permission="'orderManagement_orderQuery_export'" plain class="ml-15" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <template v-if="tableList && tableList.length > 0">
            <div v-for="(item, i) in tableList" :key="i">
                <div class="flex between vcenter p-20 bg-light-grey border">
                    <div>
                        <el-checkbox v-model="checkedOrderSn" @change="handleCheckOrderSnChange" :label="item.id" :key="item.id" class="mr-15">&nbsp; </el-checkbox>
                        {{ item.deliveryType == 1 ? "FBM" : item.deliveryType == 2 ? "FBT" : "" }}
                        <span v-if="item">({{ item.items.length }})</span>
                        <span class="ml-15">{{ $t("orderQuery.orderNumber") }}:</span>
                        <span class="ml-15">
                            <text class="green">{{ item.orderSn }}</text>
                            <text v-clipboard:copy="item.orderSn" v-clipboard:success="onCopy" class="green ml-15 green cp">{{ $t("copy") }}</text>
                        </span>
                        <!--下单时间  -->
                        <span class="iblock  ml-30">{{ $t("orderQuery.orderTime") }}： {{ item.createTime }}</span>
                        <!-- 承诺发货时间 -->
                        <span v-if="item.promisedDeliveryDateTime" class="iblock ml-25"> {{ $t("orderQuery.PromisedDeliveryTime") }}： {{ item.promisedDeliveryDateTime }} </span>
                        <!-- 发货时间 -->
                        <span v-if="item.deliveryTime" class="iblock ml-15">{{ $t("orderQuery.deliveryTime") }}: {{ item.deliveryTime }}</span>
                        <!-- 付款时间 -->
                        <span v-if="item.paymentTime" class="iblock ml-15">{{ $t("orderQuery.timeOfPayment") }}: {{ item.paymentTime }}</span>
                        <!-- 完成时间 -->
                        <span v-if="item.receiveTime" class="iblock ml-15">{{ $t("orderQuery.finishTime") }}{{ item.receiveTime }}</span>
                        <!-- 订单取消时间 -->
                        <span v-if="item.cancelTime" class="iblock ml-15">{{ $t("orderQuery.OrderCancellationTime") }}: {{ item.cancelTime }}</span>
                        <!-- 即将超时发货： -->
                        <!-- <span v-if="item.deliveryTimeOutCountdown" class="iblock ml-15">{{ $t("orderQuery.TheDeliveryWillBeTimedOut") }}:{{ item.deliveryTimeOutCountdown }}</span> -->
                    </div>
                    <div>
                        <!-- 来源 -->
                        <i v-if="item.sourceType == 4" class="el-icon-monitor"></i>
                        <i v-if="item.sourceType == 1 || item.sourceType == 2 || item.sourceType == 3" class="el-icon-mobile-phone"></i>
                    </div>
                </div>

                <BmTable :data="[item]" class="mb-20" header-align="center">
                    <!-- 商品信息 -->
                    <BmTableColumn prop="date" label="" width="500px" header-align="center">
                        <template #header>
                            <!-- 商家信息 数量/价格 -->
                            <div class="flex between">
                                <div style="width:100px;text-align:left;margin-left:200px;">
                                    {{ $t("orderQuery.goodsInfo") }}
                                </div>
                                <div style="width:86px;text-align:left;">
                                    {{ $t("orderQuery.UnitPriceQuantity") }}
                                </div>
                            </div>
                        </template>
                        <template #default="scope">
                            <div :class="scope.row.items.length > 2 && item.checked ? 'default' : ''">
                                <div v-for="(ison, i) in scope.row.items" :key="i">
                                    <div class="flex mb-10" :style="i !== 0 ? 'border-top: 1px solid #ebeef5;' : ''">
                                        <div>
                                            <BmImage class="goodImg" :src="ison.goodImg" :preview-src-list="[ison.goodImg]" />
                                        </div>
                                        <div class="ml-20" style="width: 350px;text-align: left;">
                                            <div class="hidden-2 lh-12" style="height: 45px;">{{ ison.goodName }}</div>
                                            <!-- 商家编码 -->
                                            <div>
                                                {{ $t("orderQuery.MerchantCode") }}:
                                                {{ scope.row.storeCode }}
                                            </div>
                                            <div>
                                                <span>TSIN: {{ ison.skuTsin }}</span>
                                                <span style="margin-left: 100px;">{{ ison.goodAttr }}</span>
                                            </div>
                                            <div>FNSKU: {{ ison.skuFnsku }}</div>
                                        </div>
                                        <div style="width: 150px;text-align: center;">
                                            <div>{{ ison.goodPrice }}</div>
                                            <div>x{{ ison.goodQuantity }}</div>
                                        </div>
                                        <div
                                            v-if="scope.row.items.length > 2 && item.checked && i === 1"
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
                    <!-- 商品总价 -->
                    <BmTableColumn prop="productAmount" :label="$t('orderQuery.CommodityPrice')" width="100" align="center"> </BmTableColumn>
                    <!-- 交易总额 -->
                    <BmTableColumn prop="payAmount" :label="$t('orderQuery.grossMerchandiseVolume')" min-width="150px;" header-align="center" align="center">
                        <template #default="scope">
                            <div style="min-width: 150px;text-align: left;">
                                <div>{{ scope.row.payAmount }}</div>
                                <!-- 支付状态：0->未支付 1表示已经支付 -->
                                <div>{{ scope.row.payState ? $t("copingManagement.Paid") : $t("copingManagement.pendingPayment") }}</div>
                                <!-- 支付方式  1->在线支付；2->货到付款     支付渠道--0->系统支付；1->余额支付 2->UniwalletPay 3:Tingg Pay 4:Brij Pay 5: 货到付款 6: PaySwitch -->
                                <div class="light-grey">
                                    <span>
                                        {{ scope.row.paymentType === 1 ? $t("orderSetting.onlinePay") + ":" : $t("orderSetting.offlinePay") }}
                                        <span v-if="scope.row.payType">{{ $t(`orderQuery.payType[${scope.row.payType}]`) }}</span>
                                    </span>
                                    <span v-if="scope.row.paymentMethodName">-{{ scope.row.paymentMethodName }}</span>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 收货人 -->
                    <BmTableColumn prop="" :label="$t('orderQuery.consignee')" min-width="250" header-align="center">
                        <template #default="scope">
                            <div style="text-align: left;">
                                <!-- 收货人姓名 -->
                                <div>
                                    {{ $t("orderQuery.consigneeName") }}:
                                    {{ scope.row.receiverName }}
                                </div>
                                <!-- 手机号码 -->
                                <div>{{ $t("orderQuery.phone") }}: {{ scope.row.receiverPhone }}</div>
                                <!-- 收货人邮编 -->
                                <!-- <div>{{$t("orderQuery.ConsigneePostcode")}}: {{ scope.row.receiverPostCode }}</div> -->
                                <!-- 省份/区 -->
                                <div>
                                    {{ $t("orderQuery.ProvinceArea") }}:
                                    {{ scope.row.receiverProvince + scope.row.receiverRegion }}
                                </div>
                                <!-- 详细地址 -->
                                <div>
                                    {{ $t("orderQuery.detailedAddress") }}:
                                    {{ scope.row.receiverDetailAddress }}
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 买家信息 -->
                    <BmTableColumn prop="columnTime" :label="$t('orderQuery.BuyersInformation')" min-width="200px;" header-align="center">
                        <template #default="scope">
                            <div>
                                <BmImage v-if="scope.row.buyerHeadPictureUrl" :src="scope.row.buyerHeadPictureUrl" style="width: 40px;height: 40px;" />
                                <div>{{ scope.row.buyerNickname }}</div>
                            </div>
                            <div>{{ $t("goodSettingTable.remark") }}: {{ scope.row.note }}</div>
                        </template>
                    </BmTableColumn>
                    <!-- 订单/售后状态 -->
                    <BmTableColumn prop="" :label="$t('orderQuery.OrderAfterSaleStatus')" align="center" min-width="100px;" header-align="center">
                        <template #default="scope">
                            <!-- 订单支付状态：
								payType： 0->系统支付；1->余额支付 2-> UniwalletPay

								uniwalletNetwork： 
								表示UniwalletPay移动支付商网络 
								MIT Vodafone AirtelTigo

								payState: 支付状态：0->未支付 1表示已经支付

								status:
								订单状态：0->待付款；1->待发货；2->待收货；；4->已完成  5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 

								待发货：
								fbt模式  
									fbtDeliveryStatus：fbt模式发货状态：1->待推送至WMS；2->等待仓库处理；3->仓库处理中；4->已出库

								待收货
								hasSign:
									是否签收 0->待签收 1->已签收 2->拒收
							-->
                            <div>
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
                                        ? $t("platform.orderCloseForTimeout")
                                        : scope.row.status === 7
                                        ? $t("platform.orderCloseForAfterSale")
                                        : scope.row.status === 8
                                        ? $t("platform.rejectClose")
                                        : ""
                                }}
                            </div>
                            <div v-if="scope.row.deliveryType == 2 && scope.row.status != 5 && scope.row.status != 6 && scope.row.status != 7">
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
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 操作 -->
                    <BmTableColumn :label="$t('orderQuery.operation')" align="center" fixed="right" width="100px">
                        <template #default="scope">
                            <!-- 查看详情 -->
                            <el-button type="text" v-permission="'orderManagement_orderQuery_look'" @click.stop="handledetail(scope.row)">
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

    <!-- 批量发货
    <BatchShipments v-model:visible="batchShipmentsVisible" :rows="batchShipmentsRows" @change="initData()" /> -->

    <!-- 订单详情 -->
    <Detail v-model:visible="detailVisible" v-if="detailVisible" :id="detailId" @close="detailDialogCancel" />

    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form label-position="left">
            <el-form-item :label="$t('remark')">
                <el-input :placeholder="$t('pleaseEnter')" v-model="remarks" type="textarea" maxlength="500" style="width: 500px;" :rows="5" show-word-limit />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { useStore } from "vuex";
import { orderOmsorderSellerList, omsorderSellerBatchListCount, getDictByType, orderSearchExport } from "@/api/transaction";
import { getAllUserInfo } from "@/api/finance";
import Detail from "./component/detail";
// import BatchShipments from "./component/batchShipments";
import { useRoute } from "vue-router";
import { exportExcel } from "@/utils/";
export default {
    components: { Detail },
    name: "orderQuery",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        // 使用路由
        const route = useRoute();
        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            getDictType();
            initData();
        });

        //分页
        let pageTotal = ref(0);

        // table数据
        let tableList = ref([]);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        // 订单状态
        let orderStatusList = computed(() => [
            {
                lable: proxy.$t("orderQuery.waitPayment"), // 待付款
                value: 0
            },
            {
                lable: proxy.$t("orderQuery.waitForDelivery"), // 待发货
                value: 1
            },
            {
                lable: proxy.$t("orderQuery.waitReceiving"), // 待收货
                value: 2
            },
            // {
            //     lable: proxy.$t("orderQuery.waitingEvaluation"), // 待评价
            //     value: 3
            // },
            {
                lable: proxy.$t("orderQuery.fulfill"), // 已完成
                value: 4
            },
            {
                lable: proxy.$t("orderQuery.canceled"), // 已取消
                value: 5
            },
            {
                lable: proxy.$t("orderQuery.timeoutCancel"), // 超时取消
                value: 6
            },
            {
                lable: proxy.$t("orderQuery.hasRejected"), // 无效订单
                value: 7
            },
            {
                lable: proxy.$t("orderQuery.other"), // 其他
                value: 8
            },
            {
                lable: proxy.$t("orderQuery.haveEvaluation"), // 已评价
                value: 9
            },
            {
                lable: proxy.$t("orderQuery.remainEvaluated"), // 待评价
                value: 10
            },
            {
                lable: proxy.$t("orderQuery.haveBeenSigned"), // 已签收
                value: 11
            }
        ]);

        // 售后状态
        let aftersales = computed(() => [
            // {
            //     lable: proxy.$t("orderQuery.normalOrder"), //正常订单
            //     value: 0
            // },
            // {
            //     lable: proxy.$t("orderQuery.afterSaleProcessing"), // 售后处理中
            //     value: 1
            // },
            // {
            //     lable: proxy.$t("orderQuery.aRefundOf"), // 退款中
            //     value: 2
            // },
            // {
            //     lable: proxy.$t("orderQuery.refundSuccess"), // 退款成功
            //     value: 3
            // },
            // {
            //     lable: proxy.$t("orderQuery.afterComplete"), // 售后完成
            //     value: 4
            // },
            // {
            //     lable: proxy.$t("orderQuery.cancelAfterSale"), // 售后取消
            //     value: 5
            // }
            {
                label: proxy.$t("orderQuery.normalOrder"), //正常订单
                value: 0
            },
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
            // {
            //     name: "UPC", //upc
            //     value: 2
            // },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        //数据字典
        const getDictType = () => {
            // 获取 评价 审核状态
            getDictByType("evaluate_approve_status")
                .then((res) => {
                    aftersales.value = res.data;
                })
                .catch((err) => {});
        };
        // getDictType();

        //搜索
        let searchFormRef = ref(null);
        let searchForm = reactive({
            monthSort: "3_gt",
            _tpmTime: [],
            beginTime: "", //开始时间
            buyerId: "", //买家ID
            deliverySn: "", //运费单关键字
            deliveryType: "", //配送类型( 1 FBM 2 FBT )
            endTime: "", //结束时间
            goodKeyword: "", //商品关键字
            isPresale: "", //是否预售0->不是预售1->是预售
            orderSn: "", //订单关键字
            payState: "", //支付状态
            returnStatus: "", //售后状态：0->正常订单 1->售后处理中 2->售后完成 3->售后驳回
            status: "", //订单状态：0->待付款；1->待发货；2->待收货；3->待评价；4->已完成 5->已取消；6->超时取消；7->无效订单；8->已拒收
            storeId: "", //店铺ID
            timeType: "", //->下单时间 2->发货时间 3->出库日期
            deliveryType: "", //贸易类型：1->国内贸易；2->跨境贸易
            fastStatus: route.query.fastStatus || "",
            pageNum: 1,
            pageSize: 10,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });
        // 获取订单统计
        let orderCountList = reactive({
            await_delivery_count: 0,
            has_delivered_not_sign: 0,
            delay_good_count: 0,
            will_delay_good_count: 0
        });
        const orderCount = () => {
            omsorderSellerBatchListCount(searchForm).then((res) => {
                orderCountList.await_delivery_count = res.data.await_delivery_count; // 待发货
                orderCountList.has_delivered_not_sign = res.data.has_delivered_not_sign; // 已发货未签收
                orderCountList.delay_good_count = res.data.delay_good_count; // 已延迟发货
                orderCountList.will_delay_good_count = res.data.will_delay_good_count; // 即将延迟发货
                // 带推送至WMS await_send_wms
                orderCountList.await_send_wms = res.data.await_send_wms;
            });
        };
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        // 获取数据
        let checkedOrderSnList = [];
        const getTableData = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            orderOmsorderSellerList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableList.value = res.data.records;
                    checkedOrderSnList = res.data.records.map((item) => item.id);
                    tableList.value.forEach((v) => (v.checked = true));
                })
                .catch((err) => {});
            pageFlag.value = false;
        };

        //初始化
        const initData = () => {
            // 获取快速筛选统计栏数据
            orderCount();
            getTableData();
        };
        initData();
        //搜索
        const handelSearch = () => {
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1], true);
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

        orderCount();

        // 快捷筛选
        const shortcut = (val) => {
            searchForm.fastStatus = val;
            initData();
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.deliveryType = val;
            orderCount();
            initData();
        };

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
        // 单选表格订单号
        const handleCheckOrderSnChange = (value) => {
            console.log(value);
            checkedAll.value = checkedOrderSn.value.length === searchForm.pageSize;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < searchForm.pageSize;
        };
        //分页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            pageFlag.value = true;
            initData();
            content.scrollIntoView();
        };
        //分页
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };

        let visible = ref(false);
        let title = ref(proxy.$t("orderQuery.editRemarkInBulk"));
        let remarks = ref("");

        // 批量修改备注
        const confirm = () => {
            // if(checkedOrderSn.value.length === 0) {
            //     proxy.$message.error(proxy.$t("table.selectLeastOne"));
            //     return;
            // }
            // if(remarks.value) {
            //     omsorderSellerBatchRemark({ remark: remarks.value, orderIds: checkedOrderSn.value }).then(res=> {
            //          proxy.$message.success(res.msg);
            //         visible.value = false;
            //     })
            // } else {
            //     proxy.$message.error(proxy.$t("pleaseEnter"))
            //     return
            // }
        };

        const cancel = () => {
            visible.value = false;
        };

        // 批量备注
        const bitchRemarks = () => {
            if (checkedOrderSn.value.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            visible.value = true;
        };

        // // 批量发货
        // let batchShipmentsVisible = ref(false);
        // let batchShipmentsRows = ref([]);
        // const batchShipments = () => {
        //     let flag = true;
        //     if (checkedOrderSn.value.length === 0) {
        //         proxy.$message.error(proxy.$t("table.selectLeastOne"));
        //         return;
        //     }
        //     let checkedRows = [];
        //     tableList.value.forEach((v) => {
        //         if (checkedOrderSn.value.includes(v.id)) {
        //             // 支持发货的订单状态
        //             if (v.status != 1) {
        //                 proxy.$message.error(proxy.$t("orderQuery.ordersCannotDelivered", { order: v.orderSn }));
        //                 flag = false;
        //             }
        //             // FBM 不支持平台发货
        //             if (v.deliveryType == 1) {
        //                 proxy.$message.error(proxy.$t("orderQuery.FBTPlatformDelivery"));
        //                 flag = false;
        //             }
        //             checkedRows.push({
        //                 orderSn: v.orderSn,
        //                 receiverName: v.receiverName,
        //                 receiverPhone: v.receiverPhone,
        //                 receiverCompleteAddress: v.receiverCompleteAddress,
        //                 deliverySn: "",
        //                 status: v.status,
        //                 orderId: v.id
        //             });
        //         }
        //     });

        //     if (flag) {
        //         batchShipmentsRows.value = checkedRows;
        //         batchShipmentsVisible.value = true;
        //     } else {
        //         return;
        //     }
        // };

        // 三个月前切换
        const monthSortChange = (e) => {
            initData();
        };
        // 详情页
        let detailVisible = ref(false);
        let detailId = ref("");
        const handledetail = (row) => {
            detailVisible.value = true;
            detailId.value = row.id;
            //router.push({ path: "/transaction/orderManagement/orderDetail", query: { id: e.id } });
        };
        // 查看详情弹窗关闭事件
        const detailDialogCancel = () => {
            detailVisible.value = false;
        };
        //复制成功
        const onCopy = (e) => {
            proxy.$message.success(proxy.$t("copySuccess"));
        };

        // 展开
        const unfold = (items) => {
            items.checked = !items.checked;
        };
        // 导出excel表格
        const handleExportExcel = (val) => {
            orderSearchExport(searchForm)
                .then((res) => {
                    exportExcel("Orders", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            initData,
            visible,
            title,
            confirm,
            cancel,
            remarks,
            bitchRemarks,
            // batchShipments,
            // batchShipmentsRows,
            // batchShipmentsVisible,
            orderCountList,
            pageTotal,
            disabledDate,
            shortcuts,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableList,
            handleSizeChange,
            handleCurrentChange,
            checkedAll,
            isIndeterminate,
            handleCheckAllChange,
            monthSortChange,
            orderStatusList,
            aftersales,
            shortcut,
            handleChangeType,
            detailVisible,
            detailId,
            handledetail,
            checkedOrderSn,
            handleCheckOrderSnChange,
            onCopy,
            unfold,
            getAllUserInfo,
            detailDialogCancel,
            handleExportExcel,
            goodsMultiList,
            pageFlag
        };
    }
};
</script>

<style lang="scss" scoped>
.title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
}

.title::before {
    content: "";
    display: block;
    width: 2px;
    height: 16px;
    background: #42b7ae;
    margin-right: 5px;
}

.dialog-footer {
    position: relative;
    bottom: 0px;
}

.goodImg {
    width: 59px;
    height: 59px;
}
.default {
    height: 250px;
    overflow: hidden;
}
</style>
