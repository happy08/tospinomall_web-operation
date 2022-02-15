<template>
    <BmDialog v-model:visible="visible" :noConfirm="true" :title="$t('table.detail')" width="80%" :cancel="detailDialogCancel">
        <div class="mb-20">
            <div class="tr">
                <!-- 打印订单详情 -->
                <el-button @click="handlePrint(1)" type="primary" plain>
                    {{ $t("orderQuery.printOrderDetail") }}
                </el-button>
                <!-- 打印购物清单 -->
                <el-button @click="handlePrint(2)" type="primary" plain>
                    {{ $t("orderQuery.printShoppingList") }}
                </el-button>
            </div>
        </div>
        <div class="wrap-container">
            <el-steps :active="active" class="custom-step m-auto mb-20" finish-status="success" style="width:80%">
                <el-step v-for="(item, i) in steps" :key="i" :title="item.title">
                    <template #description>
                        <div>
                            <div v-if="item.createTime">{{ $t("orderQuery.createTime") }}:{{ item.createTime }}</div>
                            <div v-if="item.paymentTime">{{ $t("orderQuery.paymentTime") }}:{{ item.paymentTime }}</div>
                            <div v-if="item.promisedDeliveryDateTime">{{ $t("orderQuery.promisedDeliveryDateTime") }}: {{ item.promisedDeliveryDateTime }}</div>
                            <div v-if="item.deliveryTimeOutMinute">{{ $t("orderQuery.deliveryTimeOutMinute") }}: {{ item.deliveryTimeOutMinute }}</div>
                            <div v-if="item.sendWmsTime">{{ $t("orderQuery.sendWmsTime") }}: {{ item.sendWmsTime }}</div>
                            <div v-if="item.wmsDealTime">{{ $t("orderQuery.wmsDealTime") }}: {{ item.wmsDealTime }}</div>
                            <div v-if="item.outStorageTime">{{ $t("orderQuery.outStorageTime") }}: {{ item.outStorageTime }}</div>
                            <div v-if="item.deliveryTime">{{ $t("orderQuery.deliveryTime") }}: {{ item.deliveryTime }}</div>
                            <div v-if="item.refundSuccessTime">{{ $t("orderQuery.refundSuccessTime") }}: {{ item.refundSuccessTime }}</div>
                            <div v-if="item.receiveTime">{{ $t("orderQuery.receiveTime") }}: {{ item.receiveTime }}</div>
                            <div v-if="item.cancelTime">{{ $t("orderQuery.cancelTime") }}: {{ item.cancelTime }}</div>
                            <div v-if="item.cancelTime">{{ $t("orderQuery.transactionClosingTime") }}: {{ item.cancelTime }}</div>
                            <div v-if="item.rejectTime">{{ $t("orderQuery.rejectTime") }}: {{ item.rejectTime }}</div>
                        </div>
                        <div v-if="item.hasTimeOutDelivery == 0">{{ $t("orderQuery.hasTimeOutDelivery") }}: {{ item.deliveryTimeOutCountdown }}</div>
                    </template>
                </el-step>
            </el-steps>

            <!-- 订单支付状态：
				paymentType：  1->在线支付；2->货到付款

				status:
				订单状态：0->待付款；1->待发货；2->待收货；4->已完成  5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 

				配送类型
				deliveryType：  1 FBM 2 FBT 
			-->

            <!-- 订单信息 -->
            <div class="mb-50">
                <div class="flex between">
                    <BmBaseTitle :title="$t('orderQuery.orderInfo')">
                        <template #subtitle>
                            <span>{{ $t("orderQuery.basicOrderSn") }}:{{ orderList.orderSn }}</span>
                            <span class="ml-30 green cp" v-clipboard:copy="orderList.orderSn" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t("copy") }}</span>
                        </template>
                    </BmBaseTitle>

                    <div>
                        <!-- 推送至wms  -->
                        <el-button v-if="orderList.deliveryType === 2 && orderList.status === 1" @click="handlePushWms" :disabled="pushWmsDisabled" type="primary"
                            >{{ $t("orderQuery.createTime") }}{{ $t("orderQuery.pushToWNS") }}</el-button
                        >
                        <!-- 取消订单 -->
                        <el-button v-if="orderList.paymentType === 2 && orderList.status === 1" @click="cancelOrderVisible = !cancelOrderVisible" type="primary"
                            >{{ $t("orderQuery.createTime") }}{{ $t("orderQuery.cancelOrder") }}</el-button
                        >
                    </div>
                </div>
                <BmTable border :data="orderList.items">
                    <BmTableColumn prop="goodName" :label="$t('orderQuery.goodName')" min-width="300">
                        <template #default="scope">
                            <div class="flex">
                                <div><img :src="scope.row.goodImg" /></div>
                                <div class="ml-20">
                                    <div>{{ scope.row.goodName }}</div>
                                    <div>{{ $t("platform.businessCode") }}: {{ orderList.storeCode }}</div>
                                    <div>TSIN: {{ scope.row.skuTsin }}</div>
                                    <div>FNSKU: {{ scope.row.skuFnsku }}</div>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="goodAttr" :label="$t('orderQuery.specification')" align="center"></BmTableColumn>
                    <BmTableColumn prop="goodPrice" :label="$t('orderQuery.commodityPrice')" align="center"></BmTableColumn>
                    <BmTableColumn prop="goodQuantity" :label="$t('orderQuery.goodsAmount')" align="center"></BmTableColumn>
                    <BmTableColumn prop="unit" :label="$t('stockBatch.unit')" align="center">
                        <template #default>PCS</template>
                    </BmTableColumn>
                    <BmTableColumn prop="productAmount" :label="$t('billingDetailsTable.productAmount')" align="center"></BmTableColumn>
                    <BmTableColumn prop="storeDisAmount" :label="$t('orderQuery.storeDiscounts')" align="center"></BmTableColumn>
                    <BmTableColumn prop="commission" :label="$t('orderQuery.commissionTax')">
                        <template #default="scope">
                            <div>{{ $t("billingDetailsTable.vat") }}:{{ scope.row.valueAddedTax }}</div>
                            <div>{{ $t("billingDetailsTable.brokerage") }}:{{ scope.row.commission }}</div>
                        </template>
                    </BmTableColumn>
                </BmTable>
                <div class="goodsCount">
                    <div class="flex vcenter item">
                        <span class="sum">{{ $t("orderQuery.productAmount") }}({{ $store.state.app.currencySymbol }}): {{ orderList.productAmount }} </span>
                        <span class="p-25">{{ $t("orderQuery.platformDiscountAmount") }}({{ $store.state.app.currencySymbol }}): {{ orderList.platformDisAmount }}</span>
                        <span class="p-25"> {{ $t("orderQuery.shopDiscountAmount") }}({{ $store.state.app.currencySymbol }})：</span>
                        <span>{{ orderList.storeDisAmount }} </span>
                    </div>
                    <div class="flex vcenter item">
                        <span class="p-25">{{ $t("orderQuery.buyerDeliveryFee") }}({{ $store.state.app.currencySymbol }}): {{ orderList.buyerFreightAmount }} </span>
                        <span class="p-25">{{ $t("orderQuery.merchantDeliveryFee") }}({{ $store.state.app.currencySymbol }}): {{ orderList.sellerFreightAmount }} </span>
                        <span class="p-25"
                            >{{ $t("billingDetailsTable.vat") }}({{ $store.state.app.currencySymbol }}): {{ orderList.valueAddedTax }} {{ $t("billingDetailsTable.brokerage") }} ({{
                                $store.state.app.currencySymbol
                            }})： {{ orderList.commission }}
                        </span>
                        <span class="pl-25"> {{ $t("orderQuery.merchantsReceivableAmount") }}({{ $store.state.app.currencySymbol }})：{{ orderList.sellerRealIncome }}</span>
                        <span class="ml-15">
                            <el-popover placement="top-start" :width="400" trigger="hover">
                                <template #reference>
                                    <i class="el-icon-info grey" style="font-size: 18px;"></i>
                                </template>
                                <div class="p-20">
                                    <div class="mb-20 green">{{ $t("orderQuery.merchantsReceivableAmount") }}:{{ orderList.sellerRealIncome }}</div>
                                    <div class="fw">{{ $t("orderQuery.illustrate") }}</div>
                                    <div>{{ $t("orderQuery.merchantsReceivableAmountTips") }}</div>
                                </div>
                            </el-popover>
                        </span>
                    </div>
                    <div class="flex item" style="justify-content: flex-end;">{{ $t("businessMessageSettings.orderAmount") }}: {{ orderList.payAmount }}</div>
                </div>
            </div>

            <!-- 收货信息 -->
            <div class="mb-50">
                <BmBaseTitle :title="$t('orderQuery.deliveryInformation')">
                    <!-- <template #right>
                        <el-button plain type="primary">联系买家</el-button>
                    </template> -->
                </BmBaseTitle>

                <div class="goodsInfo">
                    <div class="mb-15">{{ $t("orderQuery.receiverName") }}：{{ orderList.receiverName }} {{ orderList.receiverPhone }}</div>
                    <div class="mb-15">{{ $t("orderQuery.contactAddress") }}：{{ orderList.receiverCompleteAddress }}</div>
                    <div class="mb-15">{{ $t("memberListTable.memberInfo") }}: {{ orderList.buyerAccount }}</div>
                    <div>{{ $t("permissionUser.nickname") }}: {{ orderList.buyerNickname }}</div>
                </div>
            </div>

            <!-- 买家备注 -->
            <div class="mb-50">
                <BmBaseTitle :title="$t('orderQuery.buyerNotes')">
                    <template #subtitle>
                        <span class="orange">{{ $t("orderQuery.buyerNotesTips") }}</span>
                    </template>
                </BmBaseTitle>

                <div class="buyRemark">
                    <div v-if="orderList.note">{{ orderList.note }}</div>
                    <div v-else class="tc">{{ $t("noData") }}</div>
                </div>
            </div>

            <!-- 商家备注 -->
            <div class="mb-50">
                <BmBaseTitle :title="$t('orderQuery.merchantNotes')">
                    <template #subtitle>
                        <span class="orange">{{ $t("orderQuery.merchantNotesTips") }}</span>
                    </template>
                    <template #right>
                        <el-popover placement="left" :title="$t('orderQuery.historyRemark')" :width="500" trigger="click">
                            <template #reference>
                                <el-button type="primary" plain>{{ $t("platform.seeRemarkHistory") }}</el-button>
                            </template>
                            <div v-for="(item, i) in sellerRemarkList" :key="i" style="min-width: 400px;" class="mb-15 p-15">
                                <div style="width: 400px;">{{ item.remark }}</div>
                                <div>{{ item.createTime }}</div>
                            </div>
                        </el-popover>
                    </template>
                </BmBaseTitle>

                <div class="buyRemark">
                    <div v-if="sellerRemarkList.length > 0">{{ sellerRemarkList[0].remark }}</div>
                    <div v-else class="tc">{{ $t("noData") }}</div>
                </div>
            </div>

            <!-- 物流信息 -->
            <div class="mb-50">
                <BmBaseTitle :title="$t('platform.logisticsInfo')">
                    <template #subtitle>
                        <span class="light-grey">{{ $t("platform.orderLogisticsInfo") }}</span>
                    </template>
                </BmBaseTitle>

                <div class="flex logisticsInfo">
                    <div class="item">
                        <div class="mb-30">{{ $t("orderQuery.deliveryCompany") }}: {{ orderList.deliveryCompany }}</div>
                        <div class="mb-30">
                            <span>{{ $t("platform.trackingNumber") }}: {{ orderList.deliverySn }}</span>
                            <span class="ml-15 green cp" v-clipboard:copy="orderList.deliverySn" v-clipboard:success="onCopy" v-clipboard:error="onError"> {{ $t("copy") }}</span>
                        </div>
                        <!-- <div><el-button plain>修改物流信息</el-button></div> -->
                    </div>
                    <div class="item">
                        <!-- 显示更多物流信息 -->
                        <div v-if="logisticsInformationList.locusList && logisticsInformationList.locusList.length > 3" class="mb-30">
                            <el-popover placement="bottom" :title="$t('platform.logisticsInfo')" :width="500" trigger="click">
                                <template #reference>
                                    <div class="green cp" style="width: 200px;">{{ $t("platform.viewMoreLogisticsInformation") }}</div>
                                </template>
                                <el-timeline>
                                    <el-timeline-item v-for="(activity, index) in logisticsInformationList.locusList" :key="index" :color="activity.color" :timestamp="activity.createTime">
                                        {{ activity.context }}
                                    </el-timeline-item>
                                </el-timeline>
                            </el-popover>
                        </div>

                        <el-timeline>
                            <el-timeline-item v-for="(activity, index) in locusList" :key="index" :color="activity.color" :timestamp="activity.createTime">
                                {{ activity.context }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>

            <!-- 售后信息 -->
            <div class="mb-50">
                <BmBaseTitle :title="$t('orderQuery.afterSaleInfo')" class=" mb-15"> </BmBaseTitle>

                <BmTable border :data="orderReturnList" style="width: 100%" min-height="250">
                    <BmTableColumn prop="returnSn" :label="$t('orderQuery.refundNumber')" align="center"></BmTableColumn>
                    <BmTableColumn prop="returnAmount" :label="$t('orderQuery.refundAmount')" align="center"></BmTableColumn>
                    <BmTableColumn prop="createTime" :label="$t('orderQuery.applicationTime')" align="center"></BmTableColumn>
                    <BmTableColumn prop="" :label="$t('orderQuery.applicant')" align="center"></BmTableColumn>
                    <BmTableColumn prop="status" :label="$t('orderQuery.refundStatus')" align="center">
                        <template #default="scope">
                            <div>
                                {{
                                    scope.row.status === 1
                                        ? $t("orderQuery.afterSaleOrderStatus1")
                                        : scope.row.status === 2
                                        ? $t("orderQuery.afterSaleOrderStatus2")
                                        : scope.row.status === 3
                                        ? $t("orderQuery.afterSaleOrderStatus3")
                                        : scope.row.status === 4
                                        ? $t("orderQuery.afterSaleOrderStatus4")
                                        : scope.row.status === 5
                                        ? $t("orderQuery.afterSaleOrderStatus5")
                                        : scope.row.status === 6
                                        ? $t("orderQuery.afterSaleOrderStatus6")
                                        : scope.row.status === 7
                                        ? $t("orderQuery.afterSaleOrderStatus7")
                                        : scope.row.status === 8
                                        ? $t("orderQuery.afterSaleOrderStatus8")
                                        : "--"
                                }}
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="" :label="$t('orderQuery.refundTime')" align="center"></BmTableColumn>
                    <BmTableColumn prop="applyReason" :label="$t('orderQuery.remark')" align="center"></BmTableColumn>
                </BmTable>
            </div>

            <!-- 退货地址信息 -->
            <div class="mb-50">
                <BmBaseTitle :title="$t('orderQuery.returnAddressInformation')">
                    <!-- <template #right>
                        <el-button plain>复制</el-button>
                    </template> -->
                </BmBaseTitle>

                <div class="refund">
                    <div class="mb-20">{{ $t("entryAudit.contactName") }}: {{ returnAddress.name }}{{ returnAddress.phone }}</div>
                    <div>{{ $t("entryAudit.contactArea") }}: {{ returnAddress.address }} {{ returnAddress.detailAddress }}</div>
                </div>
            </div>

            <!-- 服务信息 -->
            <div>
                <BmBaseTitle :title="$t('orderQuery.serviceInfo')"></BmBaseTitle>
                <div class="serve">
                    <div class="mb-20" v-for="(item, i) in servicePromises" :key="i">
                        <span>{{ item.title }}:</span><span class="ml-15">{{ item.isRequired == 1 ? $t("status.support") : item.isRequired == 0 ? $t("no") : "-" }}</span>
                    </div>
                </div>
            </div>
        </div>
    </BmDialog>

    <!-- 推送至WMS -->
    <BmDialog v-model:visible="pushWmsVisible" :title="$t('orderQuery.pushToWNS')" :confirm="subPushWms" :cancel="pushWmsCancel" :width="600">
        <BmAlert :title="$t('orderQuery.pushAlert')" />

        <el-form :model="pushWmsForm" ref="pushWmsFormRef" label-width="auto">
            <!-- 订单编号 -->
            <el-form-item :label="$t('commentManagent.orderSN')">
                <div>{{ orderList.orderSn }}</div>
            </el-form-item>
            <!-- 发货仓库 -->
            <el-form-item :label="$t('orderQuery.shippingWarehouse')" prop="warehouseId" :rules="rulesCommon.isSelect">
                <el-select v-model="pushWmsForm.warehouseId" clearable :placeholder="$t('orderQuery.pleaseSelectWarehouse')">
                    <el-option v-for="(item, i) in warehouseList" :key="i" :label="item.warehouseName" :value="item.warehouseId"></el-option>
                </el-select>
            </el-form-item>
            <!-- 仓库地址 -->
            <el-form-item :label="$t('orderQuery.warehouseAddress')">
                {{ address }}
            </el-form-item>
        </el-form>
    </BmDialog>

    <!-- 取消(未发货)订单 -->
    <BmDialog v-model:visible="cancelOrderVisible" :title="$t('orderQuery.cancelUnshippedOrder')" :width="600">
        <BmDialog v-model:visible="repeatConfirmCancelOrderVisible" :width="600" append-to-body>
            <el-form label-width="auto">
                <el-form-item>
                    <span class="red">{{ $t("orderQuery.orderCloseTips3") }}：</span><span class="green">{{ orderList.orderSn }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="orderCancel">{{ $t("cancel") }}</el-button>
                    <el-button type="primary" @click="orderConfirm">{{ $t("confirm") }}</el-button>
                </div>
            </template>
        </BmDialog>
        <el-form :model="cancelOrderForm" ref="cancelOrderFormRef" label-width="auto">
            <el-form-item>
                {{ $t("orderQuery.confirmCloseOrderTips") }}：<span class="green">{{ orderList.orderSn }}</span> {{ $t("orderQuery.NS") }}？
            </el-form-item>
            <el-form-item>
                <span class="red">{{ $t("orderQuery.orderCloseTips1") }}</span>
            </el-form-item>
            <el-form-item :label="$t('orderQuery.closeReason')" prop="remark" :rules="rulesCommon.required">
                <el-input :placeholder="$t('pleaseEnter')" v-model="cancelOrderForm.remark" type="textarea" maxlength="500" :rows="5" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('orderQuery.picture')">
                <BmUpload @change="onChangeUploadImage($event)" :multiple="true" :fileList="cancelOrderForm.ImagList" :limit="8" />
            </el-form-item>
            <el-form-item> {{ $t("orderQuery.orderCloseTips2") }} </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelOrderVisible = false">{{ $t("cancel") }}</el-button>
                <el-button type="primary" @click="confirmCancelOrder">{{ $t("confirm") }}</el-button>
            </div>
        </template>
    </BmDialog>

    <!-- 打印订单详情弹窗 -->
    <PrintOrderDetail v-if="printOrderVisible" v-model:visible="printOrderVisible" :row="printData" @close="cancel" />

    <!-- 打印购物清单弹窗 -->
    <PrintShoppingList v-if="printListVisible" v-model:visible="printListVisible" :row="printData" @close="cancel" />
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, onMounted, onUnmounted } from "vue";
import { ElSteps, ElStep } from "element-plus";

import { omsorderDetail, productQueryWarehouseInfoList, orderOmsOrderSendWMS, orderOmsOrderMallCancel } from "@/api/transaction";
import { deepClone } from "@/utils/index";
import PrintOrderDetail from "./printOrderDetail";
import PrintShoppingList from "./printShoppingList";

export default {
    name: "orderDetail",
    components: { ElSteps, ElStep, PrintOrderDetail, PrintShoppingList },
    props: {
        visible: Boolean,
        id: String
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        // watch(
        //     () => props.id,
        //     (nVal) => {
        //         getDataList(props.id);
        //     }
        // );

        onMounted(() => {
            if (props.id) {
                getDataList(props.id);
            }
        });

        const deleteRow = (index, rows) => {
            rows.splice(index, 1);
        };

        let repeatConfirmCancelOrderVisible = ref(false); // 取消(未发货)订单 重复确认

        // 发货方式
        let express = ref("1");

        // 步骤条
        let active = ref();
        let steps = ref([]);

        // 订单数据信息
        let orderList = ref({});
        let orderReturnList = ref([]); // 售后服务信息
        let logisticsInformationList = ref({}); // 更多物流信息
        let locusList = ref([]); // 物流信息
        let returnAddress = ref({}); // 退货地址信息
        let servicePromises = ref([]); // 服务信息
        let sellerRemarkList = ref([]); //
        let timer; //倒计时
        const getDataList = (id) => {
            omsorderDetail(id).then((res) => {
                // 打印数据对象
                printData.value = res.data;

                orderList.value = res.data.order;
                orderReturnList.value = res.data.orderReturnList;
                logisticsInformationList.value = deepClone(res.data.logisticsInformationList);
                returnAddress.value = res.data.returnAddress;
                servicePromises.value = res.data.servicePromises;
                sellerRemarkList.value = res.data.sellerRemarkList;
                if (Object.keys(res.data.logisticsInformationList).length !== 0) {
                    res.data.logisticsInformationList.locusList.forEach((v, i) => {
                        if (i < 3) {
                            locusList.value.push({
                                context: v.context,
                                createTime: v.createTime,
                                color: "#f2f2f2"
                            });
                        }
                    });
                    locusList.value[0].color = "#0bbd87";
                    logisticsInformationList.value.locusList[0].color = "#0bbd87";
                }

                let step = [
                    {
                        title: proxy.$t("orderQuery.submitOrder"),
                        createTime: orderList.value.createTime,
                        paymentTime: "",
                        deliveryTime: "",
                        promisedDeliveryTime: "",
                        deliveryTimeOutMinute: "",
                        wmsDealTime: "",
                        sendWmsTime: "",
                        outStorageTime: "",
                        cancelTime: ""
                    },
                    {
                        title: proxy.$t("orderQuery.paymentSuccessful"),
                        paymentTime: orderList.value.paymentTime,
                        deliveryTime: "",
                        promisedDeliveryTime: "",
                        deliveryTimeOutMinute: "",
                        wmsDealTime: "",
                        sendWmsTime: "",
                        outStorageTime: "",
                        cancelTime: ""
                    },
                    {
                        title: proxy.$t("orderQuery.waitForDelivery"),
                        promisedDeliveryDateTime: orderList.value.promisedDeliveryDateTime, // 承诺发货时间
                        deliveryTimeOutMinute: orderList.value.deliveryTimeOutMinute, // 超时发货时间
                        sendWmsTime: orderList.value.sendWmsTime, // 待推送wms仓库时间
                        wmsDealTime: orderList.value.wmsDealTime, // 仓库处理时间
                        outStorageTime: orderList.value.outStorageTime, // 出库时间
                        deliveryTime: orderList.value.deliveryTime, // 已发货
                        refundSuccessTime: orderList.value.refundSuccessTime // 退款成功时间
                    },
                    {
                        title: proxy.$t("billingDetails.completed"),
                        deliveryTime: "",
                        promisedDeliveryTime: "",
                        deliveryTimeOutMinute: "",
                        wmsDealTime: "",
                        sendWmsTime: "",
                        outStorageTime: "",
                        cancelTime: "",
                        receiveTime: orderList.value.receiveTime // 已完成  确认收货时间
                    },
                    {
                        title: proxy.$t("warehouse.waitReceiving"),
                        promisedDeliveryDateTime: orderList.value.promisedDeliveryDateTime, // 承诺发货时间
                        deliveryTimeOutMinute: orderList.value.deliveryTimeOutMinute, // 超时发货时间
                        sendWmsTime: orderList.value.sendWmsTime, // 待推送wms仓库时间
                        wmsDealTime: orderList.value.wmsDealTime, // 仓库处理时间
                        outStorageTime: orderList.value.outStorageTime, // 出库时间
                        deliveryTime: orderList.value.deliveryTime // 已发货
                    },
                    {
                        title: proxy.$t("billingDetails.cancelled"),
                        createTime: "",
                        paymentTime: "",
                        deliveryTime: "",
                        promisedDeliveryTime: "",
                        deliveryTimeOutMinute: "",
                        wmsDealTime: "",
                        sendWmsTime: "",
                        outStorageTime: "",
                        cancelTime: orderList.value.cancelTime // 交易关闭 取消时间
                    },
                    {
                        title: proxy.$t("orderQuery.transactionClosingTime"),
                        createTime: "",
                        paymentTime: "",
                        deliveryTime: "",
                        promisedDeliveryTime: "",
                        deliveryTimeOutMinute: "",
                        wmsDealTime: "",
                        sendWmsTime: "",
                        outStorageTime: "",
                        cancelTime: orderList.value.cancelTime // 交易关闭 取消时间
                    },
                    {
                        title: proxy.$t("billingDetails.rejected"),
                        deliveryTime: "",
                        promisedDeliveryTime: "",
                        deliveryTimeOutMinute: "",
                        wmsDealTime: "",
                        sendWmsTime: "",
                        outStorageTime: "",
                        cancelTime: "",
                        rejectTime: orderList.value.rejectTime // 拒收时间
                    }
                ];

                let paymentType = orderList.value.paymentType; // 1->在线支付；2->货到付款
                let status = res.data.order.status;
                if (status == 0) {
                    // 待付款
                    steps.value.push(step[0], step[1], step[2], step[3]);
                    active.value = 0;
                } else if (status == 1) {
                    // 待发货,
                    if (paymentType === 1) {
                        steps.value = [step[0], step[1], step[2], step[3]];
                        active.value = 1;
                    } else {
                        steps.value = [step[0], step[2], step[3]];
                        active.value = 0;
                    }
                } else if (status == 2) {
                    // 待收货
                    if (paymentType === 1) {
                        steps.value = [step[0], step[1], step[2], step[3]];
                        active.value = 2;
                    } else {
                        steps.value = [step[0], step[2], step[3]];
                        active.value = 1;
                    }
                } else if (status == 4) {
                    // 已完成
                    if (paymentType === 1) {
                        steps.value = [step[0], step[1], step[2], step[3]];
                        active.value = 3;
                    } else {
                        steps.value = [step[0], step[2], step[3]];
                        active.value = 2;
                    }
                } else if (status == 5) {
                    // 已取消
                    steps.value = [step[0], step[5]];
                    active.value = 1;
                } else if (status == 6) {
                    // 交易关闭 超时取消
                    steps.value = [step[0], step[5]];
                    active.value = 1;
                } else if (status == 7) {
                    // 拒收
                    steps.value = [step[0], step[2], step[7]];
                    active.value = 2;
                }

                //倒计时
                if (orderList.value.deliveryTimeOutMinute > 0) {
                    timer = setInterval(() => {
                        orderList.value.deliveryTimeOutMinute--;
                        if (orderList.value.deliveryTimeOutMinute === 0) {
                            clearInterval(timer);
                            timer = null;
                        }
                    }, 1000);
                }
            });
        };

        // 推送wms数据
        let pushWmsFormRef = ref(null);
        let pushWmsDisabled = ref(false);

        // 推送wms表单
        let pushWmsForm = reactive({
            orderSn: orderList.value.orderSn,
            orderId: orderList.value.id,
            warehouseId: ""
        });

        // 查询所有仓库
        const warehouseList = ref([]);
        const getWarehouseList = () => {
            productQueryWarehouseInfoList().then((res) => {
                warehouseList.value = res.data;
            });
        };
        getWarehouseList();

        // 仓库地址
        let address = ref("");
        watch(
            () => pushWmsForm.warehouseId,
            (nVal) => {
                warehouseList.value.forEach((v) => {
                    if (v.warehouseId == nVal) {
                        address.value = v.address;
                    }
                });
            }
        );

        // 快递单号校验
        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }
        });

        // 推送至wms dialog
        let pushWmsVisible = ref(false);
        const handlePushWms = () => {
            pushWmsVisible.value = true;
        };

        // 提交 推送wms
        const subPushWms = () => {
            let form = {
                orderId: orderList.value.id,
                warehouseId: pushWmsForm.warehouseId
            };
            pushWmsFormRef.value.validate((valid) => {
                if (valid) {
                    orderOmsOrderSendWMS(form).then((res) => {
                        proxy.$message.success(res.msg);
                        pushWmsVisible.value = false;
                        pushWmsDisabled.value = true;
                    });
                } else {
                    return false;
                }
            });
        };

        // 关闭dialog
        const pushWmsCancel = () => {
            pushWmsVisible.value = false;
        };

        // 取消订单
        let cancelOrderVisible = ref(false);
        let cancelOrderFormRef = ref(null);
        let cancelOrderForm = reactive({
            remark: "",
            ImagList: [],
            orderIds: []
        });

        // 上传图片
        const onChangeUploadImage = (fileList) => {
            cancelOrderForm.ImagList = fileList;
        };

        const confirmCancelOrder = () => {
            cancelOrderFormRef.value.validate((valid) => {
                if (valid) {
                    repeatConfirmCancelOrderVisible.value = true;
                } else {
                    return false;
                }
            });
        };

        // 提交 货到付款 取消订单
        const orderConfirm = () => {
            cancelOrderForm.orderIds[0] = props.id;
            cancelOrderFormRef.value.validate((valid) => {
                if (valid) {
                    orderOmsOrderMallCancel(cancelOrderForm)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            repeatConfirmCancelOrderVisible.value = false;
                            cancelOrderVisible.value = false;
                            getDataList(props.id);
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };

        //取消订单
        const orderCancel = () => {
            repeatConfirmCancelOrderVisible.value = false;
        };

        //复制
        const onCopy = (e) => {
            proxy.$message.success(proxy.$t("copySuccess"));
        };

        //销毁
        onUnmounted(() => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        });

        // 打印订单详情弹窗显示隐藏控制变量
        let printOrderVisible = ref(false);
        // 打印购物清单弹窗显示隐藏控制变量
        let printListVisible = ref(false);
        // 打印数据对象
        let printData = ref({});
        // 打印按钮监听事件
        const handlePrint = (num) => {
            if (num == 1) {
                printOrderVisible.value = true;
            } else {
                printListVisible.value = true;
            }
        };
        // 详情弹窗关闭事件
        const detailDialogCancel = () => {
            emit("update:visible", false);
        };
        return {
            onCopy,
            deleteRow,
            getDataList,
            orderList,
            orderReturnList,
            logisticsInformationList,

            locusList,
            steps,
            active,
            returnAddress,
            pushWmsVisible,
            handlePushWms,
            pushWmsForm,
            pushWmsFormRef,
            subPushWms,
            rulesCommon,
            express,
            servicePromises,
            sellerRemarkList,
            warehouseList,
            getWarehouseList,
            address,
            pushWmsCancel,
            pushWmsDisabled,
            onChangeUploadImage,
            cancelOrderForm,
            cancelOrderFormRef,
            cancelOrderVisible,
            orderCancel,
            orderConfirm,
            printOrderVisible,
            printListVisible,
            printData,
            handlePrint,
            detailDialogCancel,
            repeatConfirmCancelOrderVisible,
            confirmCancelOrder
        };
    }
};
</script>

<style lang="scss" scoped>
.wrap-container {
    // .title {
    //     font-size: 16px;
    //     font-family: PingFangSC-Semibold, PingFang SC;
    //     font-weight: 600;
    //     color: #333333;
    //     line-height: 22px;
    // }
    // .title::before {
    //     content: "";
    //     display: block;
    //     width: 2px;
    //     height: 16px;
    //     background: #42b7ae;
    //     margin-right: 5px;
    // }

    .order-num {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
    }

    .goodsCount {
        width: 100%;
        border: 1px solid #ededed;

        .item {
            justify-content: flex-end;
            height: 57px;
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 17px;
            padding-right: 59px;
        }

        .item:nth-child(1) {
            border-bottom: 1px solid #ededed;
        }

        .sum {
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 17px;
        }
    }

    .goodsInfo {
        width: 100%;
        border: 1px solid #ededed;
        padding: 24px 17px 24px 17px;
    }

    .buyRemark {
        width: 100%;
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
    }

    .logisticsInfo {
        min-height: 255px;
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
        .item {
            width: 50%;
        }
        .item:nth-child(2) {
            padding-left: 60px;
            border-left: 1px solid #ededed;
        }
    }

    .refund {
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
    }

    .serve {
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
    }
}
img {
    width: 59px;
    height: 59px;
}
.dialog_tips {
    border: 1px solid #ffe58f;
    background-color: #fffbe6;
    width: 656px;
    height: 80px;
    border-radius: 2px;
    padding: 6px 0px 16px 14px;
    margin-bottom: 10px;
}
</style>
