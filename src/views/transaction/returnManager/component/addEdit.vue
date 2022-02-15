<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('orderQuery.SeeDetails')" :confirm="confirm" :cancel="cancel" width="80vw" :showFooter="false">
        <div class="plr-15">
            <!-- <BmBreadcrumb /> -->
            <div class="flex vcenter rejectTips mb-10">
                <span>
                    <svg class="icon" aria-hidden="true" style="width: 15px;height: 16px;">
                        <use xlink:href="#iconicon-test"></use>
                    </svg>
                </span>
                <span class="ml-15">{{ $t("platform.KPITips") }}</span>
            </div>
        </div>

        <div class="content p-15 flex">
            <div class="left">
                <div class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.orderInfo") }}</div>
                    </div>
                </div>
                <!-- 订单信息 -->
                <div class="left-item mb-20 bg-light-fa">
                    <div class="order_time">
                        <div class="mb-15">{{ $t("platform.orderSn") }}:&#8195; {{ omsOrder.orderSn }}</div>
                        <div class="mb-15">{{ $t("platform.createOrderTime") }}:&#8195; {{ omsOrder.createTime }}</div>
                        <div>{{ $t("platform.orderConfirmTime") }}:&#8195; {{ omsOrder.receiveTime }}</div>
                    </div>
                    <BmTable :data="omsOrder.items" border style="width: 100%">
                        <BmTableColumn prop="goodName" :label="$t('platform.goodsInfo')">
                            <template #default="scope">
                                <div class="flex">
                                    <div>
                                        <BmImage class="goodsImg" :src="scope.row.goodImg" :preview-src-list="[scope.row.goodImg]" />
                                    </div>
                                    <div class="ml-10">
                                        <div>{{ scope.row.goodName }}</div>
                                        <div>
                                            <div>{{ scope.row.goodAttr }}</div>
                                        </div>
                                        <div>TSIN：{{ scope.row.skuTsin }}</div>
                                        <div>FNSKU：{{ scope.row.skuFnsku }}</div>
                                    </div>
                                </div>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="goodPrice" :label="$t('platform.commodityPrice')" width="120" align="center"></BmTableColumn>
                        <BmTableColumn prop="goodQuantity" :label="$t('platform.purchaseQuantity')" width="120" align="center"></BmTableColumn>
                    </BmTable>
                    <div class="count" v-if="omsOrder.items">
                        {{ $t("platform.common") }}&#8195;{{ omsOrder.items.length }}&#8195;{{ $t("platform.piecesGoods") }}&#8195; {{ $t("platform.paid") }}：{{ $store.state.app.currencySymbol }}
                        {{ omsOrder.payAmount }} &#8195;（{{ $t("platform.freight") }}：{{ $store.state.app.currencySymbol }} {{ omsOrder.buyerFreightAmount }}）
                    </div>
                    <div class="userInfo mb-15">
                        <div>{{ $t("platform.buyerInfo") }}: &#8195;{{ omsOrder.receiverName }} {{ omsOrder.receiverPhone }}</div>
                        <div>{{ $t("platform.contactAddress") }}: &#8195;{{ omsOrder.receiverProvince }} {{ omsOrder.receiverRegion }} {{ omsOrder.receiverDetailAddress }}</div>
                    </div>
                </div>
                <!-- 商家信息 -->
                <div class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.businessInfo") }}</div>
                    </div>
                </div>
                <div class="shopInfo mb-15">
                    <div class="mb-25">
                        <span>{{ $t("platform.businessCode") }}: </span><span class="ml-30">&#8195;{{ omsOrder.storeCode }}</span>
                    </div>
                    <div class="mb-25">
                        <span>{{ $t("platform.storeName") }}: </span><span class="ml-30">&#8195;{{ omsOrder.storeName }}</span>
                    </div>
                </div>
                <!-- 订单备注 -->
                <div class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.businessRemark") }}</div>
                        <div class="ml-30 orange">{{ $t("platform.orderRemarkTips") }}</div>
                    </div>
                    <el-popover placement="bottom" :title="$t('platform.remarkhistory')" :width="500" trigger="click">
                        <template #reference>
                            <el-button class="green">{{ $t("platform.seeRemarkHistory") }}</el-button>
                        </template>
                        <div>this is a remark history</div>
                    </el-popover>
                </div>
                <div class="remark mb-15" style="text-align: center;">{{ omsOrder.mnote }}</div>
                <!-- 订单物流信息 -->
                <div class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.logisticsInfo") }}</div>
                        <div class="ml-30 light-grey">{{ $t("platform.orderLogisticsInfo") }}</div>
                    </div>
                </div>
                <div class="express">
                    <div class="mb-15">
                        {{ $t("orderQuery.deliveryCompany") }}: <span>{{ omsOrder.deliveryCompany }}</span>
                    </div>
                    <div class="mb-15">
                        <span>{{ $t("platform.trackingNumber") }}: {{ omsOrder.deliverySn }}</span
                        ><span v-clipboard:copy="omsOrder.deliverySn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-30 cp">{{ $t("copy") }}</span>
                    </div>
                    <div class="mb-30">
                        <el-popover placement="bottom" :title="$t('platform.logisticsInfo')" :width="500" trigger="click">
                            <template #reference>
                                <div class="green cp" style="width: 200px;">{{ $t("platform.viewMoreLogisticsInformation") }}</div>
                            </template>
                            <div>
                                <el-timeline style="width: 100%;">
                                    <el-timeline-item v-for="(activity, index) in moreOrderExpessInfo" :key="index" :color="activity.color" size="large" :timestamp="activity.createTime">
                                        {{ activity.context }}
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                        </el-popover>
                    </div>
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in orderExpessInfo" :key="index" :type="activity.type" :color="activity.color" size="large" :timestamp="activity.createTime">
                            {{ activity.context }}
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>

            <!-- 右边 状态 -->
            <div class="right">
                <div class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.afterSaleState") }}</div>
                    </div>
                </div>
                <!-- <div class="serviceState bg-light-fa">
                <div class="item1 flex between">
                    <span class="stateTitle_2">买家已寄回,等待商家收货</span><span><el-button plain>确认收货</el-button><el-button plain>拒收</el-button></span>
                </div>
                <div class="item2">退款金额 ¥90.0</div>
            </div>
            <div class="serviceState bg-light-fa">
                <div class="item1 flex between">
                    <span class="stateTitle_3">买家已寄回,等待商家收货</span><span><el-button type="primary">处理</el-button></span>
                </div>
                <div class="item2">退款金额 ¥90.0</div>
            </div> -->
                <div v-if="omsOrderReturn.workId" class="mb-15">
                    <!-- 待举证 -->
                    <div v-if="returnWork.status == 1" class="serviceState bg-light-fa">
                        <div class="item3">
                            <div class="flex between">
                                <!-- <span><el-button type="primary" plain @click="addExhibit(1)">上传凭证</el-button></span> -->
                                <span>{{ $t("platform.waitingForTheMerchantToProvideTheVoucher") }}</span>
                            </div>
                            <div>{{ $t("platform.exceed") }}{{ poofDown }} {{ $t("platform.automaticRefundToBuyer") }}</div>
                            <div>
                                {{ $t("platform.voucherTips1") }}
                            </div>
                            <div>{{ $t("platform.voucherTips2") }}</div>
                        </div>
                        <!-- 退款退货2  仅退款1-->
                        <!-- <div class="item2">
                            <div class="flex between">
                                <span>{{ $t("platform.processingCountdown") }}: </span>
                                
                                <span
                                    ><el-button @click="moneyback(2)" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 1" type="primary">{{
                                        $t("platform.agreeToRefund")
                                    }}</el-button></span
                                >
                                
                                <span
                                    ><el-button @click="moneyback(1)" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 0" type="primary">{{
                                        $t("platform.agreeToRefund")
                                    }}</el-button></span
                                >
                            </div>
                        </div> -->
                    </div>
                    <!-- 平台处理中 -->
                    <div v-if="returnWork.status == 2" class="serviceState_2">
                        <div class="item3">
                            <div class="flex between">
                                <!-- <span><el-button type="primary" plain @click="addExhibit(2)">追加凭证</el-button></span> -->
                                <span class="stateTitle">{{ $t("platform.platformProcessing") }}</span>
                            </div>
                            <div>{{ $t("platform.platformProcessingTips") }}</div>
                        </div>
                        <div class="item4">
                            <div class="flex between">
                                <!-- 处理 -->
                                <span
                                    ><el-button v-permission="'returnManager_returnPlateform_deal'" type="primary" @click="disposeJude">{{ $t("platform.process") }}</el-button></span
                                >
                                <!-- 退款退货 -->
                                <!-- <span><el-button @click="moneyback(2)" type="primary" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 1">同意退款</el-button></span> -->
                                <!-- 仅退款 -->
                                <!-- <span><el-button @click="moneyback(1)" type="primary" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 0">同意退款</el-button></span> -->
                            </div>
                        </div>
                    </div>
                    <!-- 工单关闭 -->
                    <div v-if="returnWork.status == 3" class="serviceState bg-light-fa p-30">
                        <span class="stateTitle">{{ $t("platform.ticketClosed") }}</span>
                    </div>
                    <!-- 工单已完结 显示 判责结果 -->
                    <div v-if="returnWork.status == 4" class="serviceState bg-light-fa p-30">
                        <div>
                            <span class="stateTitle">{{
                                returnWork.responsJudage == 0
                                    ? $t("platform.noResponsibility")
                                    : returnWork.responsJudage == 1
                                    ? $t("platform.sellerResponsibility")
                                    : returnWork.responsJudage == 2
                                    ? $t("platform.buyerResponsibility")
                                    : ""
                            }}</span>
                            <span class="stateTitle" v-if="returnWork.responsJudage != ''">,</span>
                            <span class="stateTitle">{{ returnWork.refundJudage == 0 ? $t("platform.noRefundRequired") : returnWork.refundJudage == 1 ? $t("platform.refundToBuyer") : "" }}</span>
                        </div>
                        <!-- 责任提示 -->
                        <div v-if="returnWork.responsJudage !== 3">{{ $t("platform.responsJudageTips") }}</div>
                        <!-- 工单违规 -->
                        <div v-if="returnWork.responsJudage == 3">
                            <div class="item3 mb-15">{{ $t("platform.workOrderViolation") }}</div>
                            <div>{{ $t("platform.workOrderViolationTips") }}</div>
                        </div>
                    </div>
                    <div v-if="returnWork.status == 4" class="serviceState bg-light-fa p-30">
                        <div class="mb-15">
                            <!-- 工单违规 -->
                            <!-- "均无责任"  "卖家责任" "买家责任"-->
                            <!-- "无需退款" "退款给买家" -->
                            <span v-if="returnWork.responsJudage == 3" class="stateTitle mb-15 mr-15">{{ $t("platform.workOrderViolation") }}</span>
                            &#8195;
                            <span class="stateTitle">{{
                                returnWork.responsJudage == 0
                                    ? $t("platform.noResponsibility")
                                    : returnWork.responsJudage == 1
                                    ? $t("platform.sellerResponsibility")
                                    : returnWork.responsJudage == 2
                                    ? $t("platform.buyerResponsibility")
                                    : ""
                            }}</span
                            ><span class="stateTitle">{{ returnWork.refundJudage == 0 ? $t("platform.noRefundRequired") : returnWork.refundJudage == 1 ? $t("platform.refundToBuyer") : "" }}</span>
                        </div>
                        <!-- 责任提示 -->
                        <div v-if="returnWork.responsJudage !== 3">{{ $t("platform.responsJudageTips") }}</div>
                        <!-- 工单违规 -->
                        <div v-if="returnWork.responsJudage == 3">
                            <!-- <div class="item3 mb-15 stateTitle"></div> -->
                            <div>{{ $t("platform.workOrderViolationTips") }}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="serviceState bg-light-fa mb-15">
                    <!-- fbt -->
                    <div v-if="omsOrderReturn.orderType == 2" class="item1 flex between">
                        <span class="stateTitle">
                            {{
                                omsOrderReturn.status === 1
                                    ? $t("platform.returnOrderStatus1")
                                    : omsOrderReturn.status === 2
                                    ? $t("platform.returnOrderStatus2")
                                    : omsOrderReturn.status === 3
                                    ? $t("platform.returnOrderStatus3")
                                    : omsOrderReturn.status === 4
                                    ? $t("platform.returnOrderStatus4")
                                    : omsOrderReturn.status === 5
                                    ? $t("platform.returnOrderStatus5")
                                    : omsOrderReturn.status === 7
                                    ? $t("platform.returnOrderStatus7")
                                    : omsOrderReturn.status === 8
                                    ? $t("platform.returnOrderStatus8")
                                    : ""
                            }}
                            <!-- 关闭原因 6 "买家撤销已关闭" -->
                            <span v-if="omsOrderReturn.status === 6">
                                {{ omsOrderReturn.closeType == 6 ? $t("platform.buyerCloseCancel") : "" }}
                            </span>
                            <!-- "平台审核不通过关闭订单" -->
                            <span v-if="omsOrderReturn.status === 6">
                                {{ omsOrderReturn.closeType == 4 ? $t("platform.platformAuditRejectClose") : "" }}
                            </span>
                            <!-- "平台拒收关闭订单" -->
                            <span v-if="omsOrderReturn.status === 6"> {{ omsOrderReturn.closeType == 5 ? $t("platform.platformRejectReceiveClose") : "" }} </span>
                        </span>

                        <!-- 仅退款 -->
                        <span v-if="omsOrderReturn.status == 1 && omsOrderReturn.returnType === 0"
                            ><el-button @click="dispose(1)" type="primary">{{ $t("rewardPunishmentManagement.deal") }}</el-button></span
                        >
                        <!-- 退货退款 -->
                        <span v-if="omsOrderReturn.status == 1 && omsOrderReturn.returnType === 1"
                            ><el-button @click="dispose(2)" type="primary">{{ $t("rewardPunishmentManagement.deal") }}</el-button></span
                        >
                        <!-- 驳回 -->
                        <span v-if="omsOrderReturn.status == 1"
                            ><el-button type="primary" @click="rejectApply">{{ $t("status.reject") }}</el-button></span
                        >
                        <!-- 退货退款 待收货 才有-拒收- -->
                        <span v-if="omsOrderReturn.status == 3"
                            ><el-button type="primary" @click="rejectReceive">{{ $t("platform.reject") }}</el-button></span
                        >
                        <!-- 确认收货 -->
                        <span v-if="omsOrderReturn.status == 3"
                            ><el-button type="primary" @click="affirmReceive">{{ $t("platform.confirmTheReceiptOfGoods") }}</el-button></span
                        >
                    </div>
                    <!-- fbm -->
                    <div v-if="omsOrderReturn.orderType == 1" class="item1 flex between">
                        <span class="stateTitle">
                            {{
                                omsOrderReturn.status === 1
                                    ? $t("platform.waitingForMerchantReview")
                                    : omsOrderReturn.status === 2
                                    ? $t("platform.returnOrderStatus2")
                                    : omsOrderReturn.status === 3
                                    ? $t("platform.returnOrderStatus3")
                                    : omsOrderReturn.status === 4
                                    ? $t("platform.refundProcessStatus3")
                                    : omsOrderReturn.status === 5
                                    ? $t("platform.returnOrderStatus5")
                                    : omsOrderReturn.status === 6
                                    ? $t("platform.returnOrderStatus6")
                                    : omsOrderReturn.status === 7
                                    ? $t("platform.returnOrderStatus7")
                                    : omsOrderReturn.status === 8
                                    ? $t("platform.refundProcessStatus4")
                                    : ""
                            }}
                        </span>
                    </div>
                    <div class="item2">
                        {{ $t("platform.platformRefund") }}: {{ $store.state.app.currencySymbol }} {{ omsOrderReturn.returnAmount }}<br />
                        {{ $t("platform.merchantRefund") }}: {{ $store.state.app.currencySymbol }} {{ omsOrderReturn.sellerWithholdAmount }}
                    </div>
                </div>

                <!-- 售后申请单 -->
                <div class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.afterSalesApplicationForm") }}</div>
                    </div>
                </div>
                <div class="orderService bg-light-fa">
                    <div class="mb-15">{{ $t("platform.afterSaleCoding") }}: {{ omsOrderReturn.returnSn }}</div>
                    <div class="mb-15">
                        {{ $t("platform.afterSaleType") }}:
                        <span>{{ omsOrderReturn.returnType === 0 ? $t("platform.refund") : omsOrderReturn.returnType === 1 ? $t("platform.refunds") : "" }}</span>
                    </div>
                    <div class="mb-15">
                        {{ $t("platform.deliveryStatus") }}:
                        <span>{{ omsOrderReturn.goodState === 0 ? $t("platform.notReceiveGoods") : omsOrderReturn.goodState === 1 ? $t("platform.receivedGoods") : "" }}</span>
                    </div>
                    <div class="mb-15">
                        {{ $t("platform.refundAmount") }}: <span>{{ $store.state.app.currencySymbol }} {{ omsOrderReturn.returnAmount }}</span>
                    </div>
                    <div>
                        {{ $t("platform.returnReason") }}: <span>{{ omsOrderReturn.applyReason }}</span>
                    </div>
                </div>
                <!-- 退货商品信息 -->
                <div v-if="omsOrderReturn.returnType != 0">
                    <el-table :data="omsOrderReturn.items" border style="width: 100%" class="bg-light-fa">
                        <el-table-column prop="name" :label="$t('platform.goodsInfo')" width="563">
                            <template #default="scope">
                                <div class="flex">
                                    <div>
                                        <BmImage class="goodsImg" :src="scope.row.productImage" :preview-src-list="[scope.row.productImage]" />
                                    </div>
                                    <div class="ml-10">
                                        <div>{{ scope.row.productName }}</div>
                                        <div>
                                            <div>{{ scope.row.productAttr }}</div>
                                        </div>
                                        <div>TSIN：{{ scope.row.skuTsin }}</div>
                                        <div>FNSKU：{{ scope.row.skuFnsku }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- returnUnitAmount -->
                        <el-table-column prop="returnUnitAmount" :label="$t('platform.refundUnitPrice')" align="center"></el-table-column>
                        <el-table-column prop="returnQuantity" :label="$t('returns.returnNum')" align="center"></el-table-column>
                    </el-table>
                    <!-- <div class="count bg-light-fa">{{ $t("platform.paid") }}{{ omsOrderReturn.realAmount }} （{{ $t("platform.freight") }}： {{ omsOrderReturn.buyerFreightAmount }}）</div> -->
                    <div class="userInfo mb-15 bg-light-fa">
                        <div>{{ $t("platform.buyerInfo") }}: {{ omsOrderReturn.receiverName }} {{ omsOrderReturn.receiverPhone }}</div>
                        <div>{{ $t("platform.contactAddress") }}: {{ omsOrderReturn.receiverProvince }} {{ omsOrderReturn.receiverCity }} {{ omsOrderReturn.receiverRegion }}</div>
                    </div>
                </div>
                <!-- 举证 -->
                <div v-if="omsOrderReturn.workId" class="flex between mb-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.detailsOfProof") }}</div>
                    </div>
                </div>
                <div class="bg-light-fa" v-if="omsOrderReturn.workId" v-for="(item, i) in exhibit" :key="i">
                    <!-- 卖家 -->
                    <div v-if="item.utype == 2" class="flex between proof">
                        <div class="flex">
                            <!-- <img src="../../../assets/img/compoter.png" /> -->
                            <div class="ml-30">
                                <div class="mb-20 header">{{ $t("platform.sellerProof") }}</div>
                                <div class="mb-10">{{ item.workDesc }}</div>
                                <div>
                                    <template v-for="(items, index) in item.workMustVoucher" :key="index">
                                        <BmImage :src="items" class=" goodsImg mr-5" :preview-src-list="[items]" />
                                    </template>
                                </div>
                                <div>
                                    <template v-for="(items_2, index_2) in item.workOptionalVoucher" :key="index_2">
                                        <BmImage :src="items_2" class="goodsImg mr-5" :preview-src-list="[items_2]" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                    <!-- 买家 -->
                    <div v-if="item.utype == 1" class="flex between proof">
                        <div class="flex">
                            <!-- <svg class="icon" aria-hidden="true" style="font-size: 48px;">
                                <use xlink:href="#iconuser"></use>
                            </svg> -->
                            <div class="ml-30">
                                <div class="mb-20 header">{{ $t("platform.buyerProof") }}</div>
                                <div>{{ item.workDesc }}</div>
                                <div class="mb-5">
                                    <template v-for="(items, index) in item.workMustVoucher" :key="index">
                                        <BmImage :src="items" class="goodsImg mr-5" :preview-src-list="[items]" />
                                    </template>
                                </div>
                                <div>
                                    <template v-for="(items_2, index_2) in item.workOptionalVoucher" :key="index_2">
                                        <BmImage :src="items_2" class="goodsImg mr-5" :preview-src-list="[items_2]" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                </div>
                <div class="bottom"></div>

                <!-- 协商详情 -->
                <div class="flex between mb-15 mt-15">
                    <div class="flex vcenter">
                        <div class="title flex vcenter">{{ $t("platform.negotiationDetails") }}</div>
                    </div>
                </div>
                <div class="bg-light-fa" v-for="(item, i) in orderReturnOperateHistoryVOS" :key="i">
                    <div v-if="item.userType == 3" class="flex between proof">
                        <div class="flex">
                            <img src="../../../../assets/img/compoter.png" />
                            <div class="ml-30">
                                <div class="mb-20 header">
                                    {{
                                        item.status == 1
                                            ? $t("platform.buyersApplyForAfterSales") //"买家申请售后"
                                            : item.status == 4
                                            ? $t("platform.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                            : item.status == 5
                                            ? $t("platform.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                            : item.status == 7
                                            ? $t("platform.platformRejects") //"平台已拒收,售后单关闭"
                                            : item.status == 8
                                            ? $t("platform.returnOrderStatus5") //"退款成功"
                                            : item.status == 9
                                            ? $t("platform.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                            : item.status == 10
                                            ? $t("platform.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                            : item.status == 11
                                            ? $t("platform.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                            : item.status == 12
                                            ? $t("platform.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                            : item.status == 13
                                            ? $t("platform.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                            : item.status == 14
                                            ? $t("platform.undoIsClosed") //"撤销已关闭"
                                            : item.status == 15
                                            ? $t("platform.operationClosed") //"平台关闭"
                                            : item.status == 16
                                            ? $t("platform.sellerEditApply") //"买家修改申请"
                                            : item.status == 17
                                            ? $t("platform.sellerEditExpressNum") //"买家修改运单号"
                                            : item.status == 18
                                            ? $t("platform.timeoutSysAutoPass") //"因商家超时未处理, 系统自动审核通过"
                                            : item.status == 19
                                            ? $t("platform.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                            : item.status == 20
                                            ? $t("platform.buyerCancelVisitFetch") //"买家取消上门取件"
                                            : item.status == 21
                                            ? $t("platform.workOrderCancel") //"工单撤销关闭"
                                            : item.status == 22
                                            ? $t("platform.orderEnd") //"工单完结关闭"
                                            : ""
                                    }}
                                </div>
                                <!-- 平台同意 1退款退货 和 同意 0退款 -->
                                <div v-if="item.status == 2">
                                    <div class="mb-20 header">{{ $t("platform.platformAgreesRefundProgress") }}</div>
                                    <div>{{ $t("platform.RefundApplyPassTimeCheck") }}</div>
                                </div>
                                <div v-if="item.status == 23">
                                    <div class="mb-20 header">{{ $t("platform.platformAgreesRefundWaitBuyer") }}</div>
                                    <div>{{ $t("platform.salesReturnPassEnterExpressNum") }}</div>
                                </div>
                                <div v-if="item.status == 6 && item.orderReturn.returnType == 1">
                                    <div class="mb-20 header">{{ $t("platform.platformReceiveRefunding") }}</div>
                                    <div>{{ $t("platform.goodsReceiveTimeMoney") }}</div>
                                </div>
                                <div v-if="item.status == 7 || item.status == 13">{{ $t("platform.reasonForRejection") }}:{{ item.reason }}</div>
                                <div v-if="item.status == 3">
                                    <div class="mb-20 header">
                                        {{ $t("platform.platformReject") }}
                                        {{ item.orderReturn.returnType == 0 ? $t("platform.refund") : item.orderReturn.returnType == 1 ? $t("platform.salesReturn") : "" }}{{ $t("platform.apply") }},
                                        {{ item.orderReturn.returnType == 0 ? $t("platform.refund") : item.orderReturn.returnType == 1 ? $t("platform.salesReturn") : ""
                                        }}{{ $t("platform.orderClose") }}
                                    </div>
                                    <div>{{ $t("platform.refundApplyReject") }}</div>
                                </div>
                                <div v-for="(items, i) in item.voucherImgs.split(',')" :key="i">
                                    <BmImage class="mr-5 goodsImg" v-if="items != ''" :src="items" :preview-src-list="item.voucherImgs.split(',')" />
                                </div>
                            </div>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                    <div v-if="item.userType == 2" class="flex between proof">
                        <div class="flex">
                            <img src="../../../../assets/img/compoter.png" />
                            <div class="ml-30">
                                <div class="mb-20 header">
                                    {{
                                        item.status == 1
                                            ? $t("platform.buyersApplyForAfterSales") //"买家申请售后"
                                            : item.status == 3
                                            ? $t("platform.merchantReviewRejected") //"商家审核驳回"
                                            : item.status == 4
                                            ? $t("platform.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                            : item.status == 5
                                            ? $t("platform.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                            : item.status == 6
                                            ? $t("platform.sellerConfirmReceive") //"商家确定收货"
                                            : item.status == 7
                                            ? $t("platform.refundProcessStatus4") //"商家已拒收,售后单关闭"
                                            : item.status == 8
                                            ? $t("platform.returnOrderStatus5") //"退款成功"
                                            : item.status == 9
                                            ? $t("platform.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                            : item.status == 10
                                            ? $t("platform.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                            : item.status == 11
                                            ? $t("platform.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                            : item.status == 12
                                            ? $t("platform.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                            : item.status == 13
                                            ? $t("platform.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                            : item.status == 14
                                            ? $t("platform.undoIsClosed") //"撤销已关闭"
                                            : item.status == 15
                                            ? $t("platform.operationClosed") //"平台关闭"
                                            : item.status == 16
                                            ? $t("platform.sellerEditApply") //"买家修改申请"
                                            : item.status == 17
                                            ? $t("platform.sellerEditExpressNum") //"买家修改运单号"
                                            : item.status == 18
                                            ? $t("platform.timeoutSysAutoPass") //"因商家超时未处理, 系统自动审核通过"
                                            : item.status == 19
                                            ? $t("platform.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                            : item.status == 20
                                            ? $t("platform.buyerCancelVisitFetch") //"买家取消上门取件"
                                            : item.status == 21
                                            ? $t("platform.workOrderCancel") //"工单撤销关闭"
                                            : item.status == 22
                                            ? $t("platform.orderEnd") //"工单完结关闭"
                                            : ""
                                    }}
                                </div>

                                <!-- 商家审核通过,退款中 -->
                                <div v-if="item.status == 2">
                                    <div class="mb-20 header">{{ $t("platform.sellerAgreesRefundProgress") }}</div>
                                    <div>{{ $t("platform.RefundApplyPassTimeCheck") }}</div>
                                </div>
                                <div v-if="item.status == 23">
                                    <div class="mb-20 header">{{ $t("platform.sellerAgreesRefundWaitBuyer") }}</div>
                                    <div>{{ $t("platform.salesReturnPassEnterExpressNum") }}</div>
                                </div>
                                <!-- <div v-if="item.status == 2">{{ $t("platform.refundRulesTips1") }}</div> -->
                                <div v-if="item.status == 6">{{ $t("platform.refundRulesTips2") }}</div>
                                <div v-if="item.status == 7 || item.status == 13">{{ $t("platform.reasonForRejection") }}:{{ item.reason }}</div>
                                <div v-if="item.status == 3">{{ $t("platform.refundRulesTips3") }}</div>

                                <div v-if="item.voucherImgs">
                                    <template v-for="(items, i) in item.voucherImgs.split(',')" :key="i">
                                        <BmImage class="mr-5 goodsImg" v-if="items !== ''" :src="items" :preview-src-list="item.voucherImgs.split(',')" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                    <div v-if="item.userType == 1" class="flex between proof">
                        <div class="flex">
                            <!-- <img src="../../assets/img/phone@2x.png" /> -->
                            <svg class="icon" aria-hidden="true" style="width: 48px;height: 48px;">
                                <use xlink:href="#iconuser"></use>
                            </svg>
                            <div class="ml-30">
                                <div class="mb-20 header">
                                    {{
                                        item.status == 1
                                            ? $t("platform.buyersApplyForAfterSales") //"买家申请售后"
                                            : item.status == 2
                                            ? $t("platform.sellerOperationApproved") //"商家/运营审核通过"
                                            : item.status == 3
                                            ? $t("platform.merchantReviewRejected") //"商家审核驳回"
                                            : item.status == 4
                                            ? $t("platform.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                            : item.status == 5
                                            ? $t("platform.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                            : item.status == 6
                                            ? $t("platform.sellerConfirmReceive") //"商家确定收货"
                                            : item.status == 7
                                            ? $t("platform.refundProcessStatus4") //"商家拒收,售后单关闭"----------------
                                            : item.status == 8
                                            ? $t("platform.returnOrderStatus5") //"退款成功"
                                            : item.status == 9
                                            ? $t("platform.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                            : item.status == 10
                                            ? $t("platform.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                            : item.status == 11
                                            ? $t("platform.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                            : item.status == 12
                                            ? $t("platform.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                            : item.status == 13
                                            ? $t("platform.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                            : item.status == 14
                                            ? $t("platform.undoIsClosed") //"撤销已关闭"
                                            : item.status == 15
                                            ? $t("platform.operationClosed") //"平台关闭"
                                            : item.status == 16
                                            ? $t("platform.sellerEditApply") //"买家修改申请"
                                            : item.status == 17
                                            ? $t("platform.sellerEditExpressNum") //"买家修改运单号"
                                            : item.status == 18
                                            ? $t("platform.timeoutSysAutoPass") //"因商家超时未处理, 系统自动审核通过"
                                            : item.status == 19
                                            ? $t("platform.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                            : item.status == 20
                                            ? $t("platform.buyerCancelVisitFetch") //"买家取消上门取件"
                                            : item.status == 21
                                            ? $t("platform.workOrderCancel") //"工单撤销关闭"
                                            : item.status == 22
                                            ? $t("platform.orderEnd") //"工单完结关闭"
                                            : ""
                                    }}
                                </div>
                                <div>
                                    <!--退款金额  问题描述-->
                                    <span>{{ $t("platform.refundAmount") }}: {{ $store.state.app.currencySymbol }} {{ item.orderReturn.returnAmount }}</span
                                    ><span class="ml-15">{{ $t("platform.problemDescription") }}: {{ item.orderReturn.applyDesc }}</span>
                                </div>
                                <div>
                                    <!-- 联系方式 退款原因-->
                                    <span>{{ $t("platform.contactInformation") }}: {{ item.orderReturn.receiverPhone }}</span
                                    ><span class="ml-15">{{ $t("platform.returnReason") }}: {{ item.orderReturn.applyReason }}</span>
                                </div>
                                <div v-if="item.status == 4">{{ $t("platform.buyerReceiveGoodsTips") }}</div>
                                <div>
                                    <template v-for="(items, i) in item.orderReturn.proofPics.split(',')" :key="i">
                                        <BmImage class="mr-5 goodsImg" v-if="items != ''" :src="items" :preview-src-list="[items]" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                </div>
                <div class="bottom"></div>
                <!-- 退货单物流信息 -->
                <div v-if="omsOrderReturn.returnType != 0">
                    <div class="flex between mb-15 mt-15">
                        <div class="flex vcenter">
                            <div class="title flex vcenter">{{ $t("platform.logisticsInfo") }}</div>
                            <div class="ml-30 light-grey">{{ $t("orderQuery.returnOrderLogisticsInfo") }}</div>
                        </div>
                    </div>
                    <div class="express">
                        <div class="mb-15">
                            {{ $t("orderQuery.deliveryCompany") }}: <span>{{ omsOrderReturn.deliveryCompany }} </span>
                        </div>
                        <div class="mb-15">
                            <span>{{ $t("platform.trackingNumber") }}: {{ omsOrderReturn.deliverySn }}</span
                            ><span v-clipboard:copy="omsOrderReturn.deliverySn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-30 cp">{{ $t("copy") }}</span>
                        </div>
                        <div class="green mb-30">
                            <el-popover placement="bottom" :title="$t('platform.logisticsInfo')" :width="500" trigger="click">
                                <template #reference>
                                    <div class="green cp" style="width: 200px;">{{ $t("platform.viewMoreLogisticsInformation") }}</div>
                                </template>
                                <div>
                                    <el-timeline style="width: 500px;">
                                        <el-timeline-item v-for="(activity, index) in moreOrderReturnExpressInfo" :key="index" :color="activity.color" size="normal" :timestamp="activity.createTime">
                                            {{ activity.context }}
                                        </el-timeline-item>
                                    </el-timeline>
                                </div>
                            </el-popover>
                        </div>
                        <el-timeline>
                            <el-timeline-item v-for="(activity, index) in orderReturnExpressInfo" :key="index" :color="activity.color" size="large" :timestamp="activity.createTime">
                                {{ activity.context }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>
        </div>
        <!-- 退款退货 -->
        <BmDialog v-model:visible="visible" :title="title" :showFooter="false" :width="800">
            <BmDialog v-model:visible="visible_2" :title="title_2" :confirm="confirm_2" :cancel="cancel_2" :width="600">
                <el-form label-position="left">
                    <el-form-item>
                        <div class="flex">
                            <div>!</div>
                            <div class="ml-15">
                                <div v-if="returnStatus == 2">
                                    <div>{{ $t("platform.refundReminder3") }};</div>
                                    <div>{{ $t("platform.refundReminder4") }}?</div>
                                </div>
                                <div v-else>
                                    <div>{{ $t("platform.refundReminder1") }};</div>
                                    <div>{{ $t("platform.refundReminder2") }}?</div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </BmDialog>

            <div class="flex center mb-30" style="font-weight: 900;font-size: 16px;">
                <span>{{ $t("platform.refundProcessStatus1") }}</span>
            </div>
            <el-form label-position="left">
                <el-form-item :label="$t('platform.agreeReturnGoods') + ':'"> {{ $t("platform.refundProcessStatus2") }}; </el-form-item>
                <el-form-item :label="$t('platform.agreeToRefund') + ':'"> {{ $t("platform.refundReminder1") }}; </el-form-item>
                <el-form-item :label="$t('platform.rejectTheApplication') + ':'"> {{ $t("platform.refundReminder1") }}; </el-form-item>
                <!-- <el-form-item :label="$t('platform.ifTheMerchantHasNotProcessed') + ':'">
                    {{ $t("platform.refundTimeTip") }}
                </el-form-item> -->
            </el-form>
            <div class="flex center">
                <!-- 驳回申请 -->
                <el-button @click="rejectApply">{{ $t("platform.rejectTheApplication") }}</el-button>
                <div v-if="state == 1" class="ml-15">
                    <!-- 同意退款 -->
                    <el-button type="primary" @click="dialogVisble(1)">{{ $t("platform.agreeToRefund") }}</el-button>
                </div>
                <div v-if="state == 2" class="ml-15">
                    <!-- 同意退款 同意退款退货-->
                    <el-button type="primary" @click="dialogVisble(1)">{{ $t("platform.agreeToRefund") }}</el-button>
                    <el-button type="primary" @click="dialogVisble(2)">{{ $t("platform.agreeReturnGoods") }}</el-button>
                </div>
            </div>
        </BmDialog>
        <!-- 驳回申请 -->
        <BmDialog v-model:visible="visible_3" :title="$t('platform.rejectTheApplication')" :confirm="confirm_3" :cancel="cancel_3" :width="800">
            <div class="flex vcenter rejectTips">
                <span> </span>
                <span class="ml-15">{{ $t("platform.rejectTips") }}</span>
            </div>
            <el-form :model="rejectForm" :rules="rejectRules" ref="rejectRef" label-width="100px" class="demo-ruleForm" label-position="left">
                <el-form-item :label="$t('evaluationComplaintManagement.rejectReason')" prop="reason">
                    <el-select v-model="rejectForm.reason" :placeholder="$t('pleaseSelect')">
                        <el-option v-for="item in rejectReason" :key="item.id" :label="item.description" :value="item.description"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('platform.rejectExplain')" prop="remark">
                    <el-input v-model="rejectForm.remark" type="textarea" rows="5" show-word-limit maxlength="200" :placeholder="$t('platform.rejectExplainTips')" />
                </el-form-item>
                <el-form-item :label="$t('platform.upCertificate')">
                    <div>
                        {{ $t("platform.upCertificateTips") }}
                    </div>
                    <div>
                        <BmUpload @change="onChangeUploadCarousel($event)" :multiple="true" :fileList="rejectForm._tempImg" :limit="8" />
                    </div>
                </el-form-item>
            </el-form>
        </BmDialog>
        <!-- 确认收货 -->
        <BmDialog v-model:visible="visible_4" :title="$t('platform.confirmTheReceiptOfGoods')" :confirm="confirm_4" :cancel="cancel_4" :width="600">
            <el-form label-position="left">
                <el-form-item> {{ $t("platform.reallyRecivedGoods") }}? </el-form-item>
            </el-form>
        </BmDialog>
        <!-- 拒收 -->
        <BmDialog v-model:visible="visible_5" :title="$t('platform.reject')" :confirm="confirm_5" :cancel="cancel_5" :width="800">
            <!-- <div class="flex vcenter rejectTips mb-15">
                <span> </span>
                <span>{{ $t("platform.refusalAfterSalesTips") }}? </span>
            </div> -->
            <el-form :model="rejectGoodsForm" :rules="rejectGoodsRules" ref="rejectGoodsRef" label-width="100px" class="demo-ruleForm" label-position="left">
                <el-form-item :label="$t('platform.rejectExplain')" prop="reason">
                    <el-input v-model="rejectGoodsForm.reason" type="textarea" rows="5" show-word-limit maxlength="200" :placeholder="$t('platform.rejectExplainTips')" />
                </el-form-item>
                <el-form-item :label="$t('platform.upCertificate')">
                    <div>
                        {{ $t("platform.upCertificateTips") }}
                    </div>
                    <div>
                        <BmUpload @change="onChangeUploadDetailImg_5($event)" :multiple="true" :fileList="rejectGoodsForm._tempImgs" :limit="8" />
                    </div>
                </el-form-item>
            </el-form>
        </BmDialog>
        <BmDialog v-model:visible="visible_6" :title="$t('copingManagement.returnMoney')" :confirm="confirm_6" :cancel="cancel_6" :width="800">
            <el-form label-position="left">
                <el-form-item> {{ $t("platform.refundReminder1") }}? </el-form-item>
            </el-form>
        </BmDialog>
        <!-- 驳回 -->
        <BmDialog v-model:visible="visible_7" :title="title_7" :confirm="confirm_7" :cancel="cancel_7" :width="800">
            <div class="flex vcenter rejectTips mb-15">
                <span>{{ $t("platform.AppealDescription") }}</span>
            </div>
            <el-form :model="exhibitForm" :rules="exhibitRules" ref="exhibitRef" label-width="100px" class="demo-ruleForm" label-position="left">
                <el-form-item :label="$t('platform.rejectExplain')" prop="workDesc">
                    <el-input v-model="exhibitForm.workDesc" type="textarea" rows="5" show-word-limit maxlength="200" :placeholder="$t('platform.rejectExplainTips')" />
                </el-form-item>
                <el-form-item :label="$t('platform.upCertificate')">
                    <div>
                        <div>{{ $t("platform.requiredCredentialsTips") }}</div>
                        <div>{{ $t("platform.optionalCredentialsTips") }}</div>
                    </div>
                    <div>
                        <!-- 主要凭证 -->
                        <BmUpload @change="onChangeUploadCarousel_workMustVoucher($event)" :multiple="true" :fileList="exhibitForm.workMustVoucher" :limit="8" />
                        <!-- 次要凭证 -->
                        <BmUpload @change="onChangeUploadCarousel_workOptionalVoucher($event)" :multiple="true" :fileList="exhibitForm.workOptionalVoucher" :limit="8" />
                    </div>
                </el-form-item>
            </el-form>
        </BmDialog>
        <BmDialog v-model:visible="visible_8" :title="title_8" :confirm="confirm_8" :cancel="cancel_8" :width="800">
            <div class="flex vcenter rejectTips mb-10">
                <span> </span>
                <span class="ml-15">{{ $t("platform.condemnTips") }}</span>
            </div>
            <el-form :model="judageForm" label-width="110" :rules="judageFormRules" ref="judageFormRef">
                <el-form-item :label="$t('platform.workOrderJudgment')" prop="responsJudage" :rules="judageFormRules.responsJudage">
                    <el-radio-group v-model="judageForm.responsJudage">
                        <el-radio label="0">{{ $t("platform.noResponsibility") }}</el-radio>
                        <el-radio label="1">{{ $t("platform.sellerResponsibility") }}</el-radio>
                        <el-radio label="2">{{ $t("platform.buyerResponsibility") }}</el-radio>
                        <el-radio label="3">{{ $t("platform.workOrderViolation") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('platform.fundProcessing')" prop="refundJudage" :rules="judageFormRules.refundJudage">
                    <el-select v-model="judageForm.refundJudage" :placeholder="$t('pleaseSelect')">
                        <el-option :label="$t('platform.noRefundRequired')" value="0"></el-option>
                        <el-option :label="$t('platform.refundToBuyer')" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('platform.supplementaryDescription')">
                    <el-input v-model="judageForm.addDesc" type="textarea" rows="3" maxlength="255" show-word-limit :placeholder="$t('platform.supplementaryDescriptionTips')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('platform.picture')">
                    <div>{{ $t("platform.requiredCredentialsTips") }}</div>
                    <!-- 主要凭证 -->
                    <BmUpload @change="onChangeUploadJudageMain($event)" :multiple="true" :fileList="judageForm._tempImg" :limit="8" />
                    <div>{{ $t("platform.optionalCredentialsTips") }}</div>
                    <!-- 次要凭证 -->
                    <BmUpload @change="onChangeUploadJudageOptional($event)" :multiple="true" :fileList="judageForm._tempImg2" :limit="8" />
                </el-form-item>
                <el-form-item :label="$t('platform.remark')">
                    <el-input v-model="judageForm.note" type="textarea" rows="3" maxlength="255" show-word-limit :placeholder="$t('platform.remarkTips')"></el-input>
                </el-form-item>
            </el-form>
        </BmDialog>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, onMounted } from "vue";
import {
    orderReturnDetail,
    findReturnWorkAllegeList, // 获取举证详情列表
    orderReturnGetLogisticsInfo, // 查看物流信息
    orderReturnAgreeRefund, // 运营中心接口》 仅退款 -> 同意退款
    orderReturnagreeRefundInReturnGoodsAndRefund, // 运营中心接口》同意退款（退货退款）
    orderBatchAgreeReturnGoods, // 运营中心接口》批量同意退货（退货退款）
    getDictByType, // getDictByType 获取数据字典
    orderReturnSellerReject, // 运营中心接口》驳回售后
    orderReturnConfirmReceipt, // 商家中心接口》确认收货
    orderReturnRejectDelivery, // 商家中心接口》拒收
    orderReturnAddToProof, // 卖家中心》举证-追加举证
    orderReturnWorkOperatorProcess // 平台判责
} from "@/api/transaction";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { deepClone } from "@/utils/index";
export default {
    name: "platformtail",
    props: {
        row: Object
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const route = useRoute();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        let form = ref({});
        // watch(
        //     () => props.row,
        //     (nVal) => {
        //         form.value = { ...props.row };
        //         getData();
        //     }
        // );

        onMounted(() => {
            if (props.row) {
                form.value = { ...props.row };
                getData();
            }
        });

        let visible = ref(false);
        let visible_2 = ref(false);
        let visible_3 = ref(false);
        let visible_4 = ref(false);
        let visible_5 = ref(false);
        let visible_6 = ref(false);
        let visible_7 = ref(false);
        let visible_8 = ref(false);
        let title = ref(proxy.$t("orderQuery.AfterState"));
        let title_2 = ref(proxy.$t("orderQuery.batchAgreeToRefundGoods"));
        let title_7 = ref(proxy.$t("workReturn.additionalCredentials"));
        let title_8 = ref(proxy.$t("workReturn.workOrderProcessing"));

        // 退款仅退款
        let state = ref("");
        let returnStatus = ref(""); // 退货退款-> 1.仅退款 2退货退款

        let omsOrder = ref({}); // 订单信息
        let omsOrderReturn = ref({}); // 售后单信息
        let orderReturnOperateHistoryVOS = ref([]); // 协商历史
        let orderSetVOS = ref([]); // 同意/驳回订单设置时间
        let returnWork = ref({});

        let remainTimer = null;
        let poofDown = ref(""); // 举证 倒计时 售后商家未处理到计时

        let appealTime = ref(""); // 申诉时间 天
        let appealUnit = ref(""); // 申诉时间单位

        const getData = () => {
            orderReturnDetail(form.value.id).then((res) => {
                omsOrder.value = res.data.omsOrder;
                omsOrderReturn.value = res.data.omsOrderReturn;
                orderReturnOperateHistoryVOS.value = res.data.orderReturnOperateHistoryVOS;

                orderSetVOS.value = res.data.orderSetVOS;
                returnWork.value = res.data.returnWork;

                // 待举证剩余时间 或者  商家未处理时间
                if (returnWork.value.status == 1 || omsOrderReturn.value.status == 1) {
                    let remainTime = Math.ceil(orderSetVOS.value[0].remainTime / 1000);
                    remainTimer = setInterval(() => {
                        poofDown.value = countDown(remainTime);
                        remainTime--;
                        if (remainTime < 0) {
                            clearInterval(remainTimer);
                            remainTimer = null;
                        }
                    }, 1000);
                }

                // 申诉天数剩余时间
                if (omsOrderReturn.status == 1) {
                    // 申诉天数剩余时间
                    appealTime.value = orderSetVOS.value[1].value;
                    if (orderSetVOS.value[1].unit == "min") {
                        appealUnit.value = "分钟";
                    } else if (orderSetVOS.value[1].unit == "h") {
                        appealUnit.value = "小时";
                    } else if (orderSetVOS.value[1].unit == "day") {
                        appealUnit.value = "天";
                    }
                }

                // 获取举证详情
                if (res.data.omsOrderReturn.workId) {
                    getfindReturnWorkAllegeList(res.data.omsOrderReturn.workId);
                }
                //  售后单物流信息
                if (res.data.omsOrderReturn.deliverySn) {
                    getWorkOrderReturnGetLogisticsInfo(res.data.omsOrderReturn.deliverySn);
                }
                // 订单物流信息
                if (res.data.omsOrder.deliverySn) {
                    getorderReturnGetLogisticsInfo(res.data.omsOrder.deliverySn);
                }
                // getorderReturnGetLogisticsInfo(res.data.omsOrder.deliverySn);
            });
        };

        //设置倒计时
        function countDown(surplusTime) {
            const seconds = surplusTime;
            const second = seconds % 60;
            const minutes = (seconds - second) / 60;
            const minute = minutes % 60;
            const hours = (minutes - minute) / 60;
            const hour = hours % 24;
            const day = (hours - hour) / 24;
            const res = day + proxy.$t("day") + hours + proxy.$t("hour") + minute + proxy.$t("minute") + second + proxy.$t("second");
            return res;
        }

        let exhibit = ref([]);
        // 举证详情
        const getfindReturnWorkAllegeList = (workId) => {
            findReturnWorkAllegeList({ workId: workId }).then((res) => {
                res.data.omsOrderReturnWorkAlleges.forEach((v) => {
                    v.workMustVoucher = v.workMustVoucher.split(",");
                    v.workOptionalVoucher = (v.workOptionalVoucher && v.workOptionalVoucher.split(",")) || [];
                });
                exhibit.value = res.data.omsOrderReturnWorkAlleges;
            });
        };

        let orderExpessInfo = ref([]); // 订单物流信息
        let moreOrderExpessInfo = ref([]); // 更多物流信息
        let orderExpressData = ref({});
        // 获取订单物流信息
        const getorderReturnGetLogisticsInfo = (deliverySn) => {
            moreOrderExpessInfo.value = [];
            orderExpressData.value = [];
            orderReturnGetLogisticsInfo(deliverySn).then((res) => {
                orderExpressData.value = res.data;
                if (res.data) {
                    moreOrderExpessInfo.value = deepClone(res.data.locusList);

                    if (res.data.locusList.length !== 0) {
                        res.data.locusList.forEach((v, i) => {
                            if (i < 3) {
                                orderExpessInfo.value.push({
                                    context: v.context,
                                    createTime: v.createTime,
                                    color: "#f2f2f2"
                                });
                            }
                        });
                        orderExpessInfo.value[0].color = "#0bbd87";
                        moreOrderExpessInfo.value.map((v) => (v.color = "#f2f2f2"));
                        moreOrderExpessInfo.value[0].color = "#0bbd87";
                    }
                }
            });
        };

        let orderReturnExpressInfo = ref([]); // 售后物流信息
        let moreOrderReturnExpressInfo = ref([]); // 更多售后单物流信息
        let orderReturnData = ref({});
        // 获取售后物流信息omsOrderReturn.deliverySn
        const getWorkOrderReturnGetLogisticsInfo = (deliverySn) => {
            moreOrderReturnExpressInfo.value = [];
            orderReturnData.value = [];
            orderReturnGetLogisticsInfo(deliverySn).then((res) => {
                orderReturnData.value = res.data;
                if (res.data) {
                    moreOrderReturnExpressInfo.value = deepClone(res.data.locusList);

                    if (res.data.locusList.length !== 0) {
                        res.data.locusList.forEach((v, i) => {
                            if (i < 3) {
                                orderReturnExpressInfo.value.push({
                                    context: v.context,
                                    createTime: v.createTime,
                                    color: "#f2f2f2"
                                });
                            }
                        });
                        orderReturnExpressInfo.value[0].color = "#0bbd87";
                        moreOrderReturnExpressInfo.value.forEach((v) => {
                            v.color = "#f2f2f2";
                        });
                        moreOrderReturnExpressInfo.value[0].color = "#0bbd87";
                    }
                }
                console.log(moreOrderReturnExpressInfo, "=========================");
            });
        };

        let rejectReason = ref([]);
        // 获取驳回原因选项
        const DictType = () => {
            getDictByType("return_reject_reason").then((res) => {
                console.log(res);
                rejectReason.value = res.data;
            });
        };
        DictType();

        // state区分是 1退货退款 还是 2仅退款
        const dispose = (val) => {
            visible.value = true;
            state.value = val;
            returnStatus.value = val;
        };

        // 区分是退货还是退款 1.退款 2.退货
        let refundSalas = "";
        const dialogVisble = (val) => {
            visible_2.value = true;
            returnStatus.value = val;
            if (val == 1) {
                refundSalas = val;
                title_2.value = proxy.$t("platform.agreeToRefund");
            } else {
                refundSalas = val;
                title_2.value = proxy.$t("platform.agreeReturnGoods");
            }
        };

        // 退款货退货
        const confirm_2 = () => {
            if (refundSalas == 1) {
                if (state.value == 2) {
                    // 退货退款
                    orderReturnagreeRefundInReturnGoodsAndRefund({ id: omsOrderReturn.value.id }).then((res) => {
                        visible.value = false;
                        proxy.$message.success(res.msg);
                    });
                } else if (state.value == 1) {
                    // 仅退款
                    orderReturnAgreeRefund([omsOrderReturn.value.id]).then((res) => {
                        visible.value = false;
                        proxy.$message.success(res.msg);
                    });
                }
            } else {
                // 退货
                orderBatchAgreeReturnGoods([omsOrderReturn.value.id])
                    .then((res) => {
                        visible.value = false;
                        proxy.$message.success(res.msg);
                    })
                    .catch(() => {});
            }
            // 处理完刷新页面数据
            getData();
        };

        const cancel_2 = () => {
            visible_2.value = false;
        };

        // ----------------- 驳回申请 ------------------
        let rejectRef = ref(null);
        let rejectForm = reactive({
            voucherImgs: "",
            _tempImg: [],
            reason: "",
            remark: "",
            returnId: omsOrderReturn.value.id
        });

        const rejectRules = {
            reason: [{ required: true, message: proxy.$t("workReturn.pleaseSelectRejectReason"), trigger: "blur" }],
            remark: [{ required: true, message: proxy.$t("workReturn.pleaseFillInTheDescription"), trigger: "blur" }]
        };

        // 凭证图片
        const onChangeUploadDetailImg = (fileList) => {
            rejectForm._tempImg = fileList; // fileList.map((item) => item.url)
            console.log("rejectForm.voucherImgs", rejectForm._tempImg);
        };

        const rejectApply = () => {
            visible_3.value = true;
        };

        // 驳回申请
        const confirm_3 = () => {
            rejectForm.returnId = omsOrderReturn.value.id;
            if (rejectForm._tempImg) {
                rejectForm.voucherImgs = rejectForm._tempImg.map((v) => v.url).join(",");
            }
            delete rejectForm._tempImg;
            rejectRef.value.validate((valid) => {
                if (valid) {
                    orderReturnSellerReject(rejectForm).then((res) => {
                        visible_3.value = false;
                        proxy.$message.success(res.msg);
                        router.go(0);
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
            // 处理完刷新页面数据
            getData();
        };

        const cancel_3 = () => {
            visible_3.value = false;
        };

        // 确认收货
        const affirmReceive = () => {
            visible_4.value = true;
        };

        // 确认收货
        const confirm_4 = () => {
            orderReturnConfirmReceipt({ id: omsOrderReturn.value.id })
                .then((res) => {
                    if (res.code == 0) {
                        visible_4.value = false;
                        proxy.$message.success(res.msg);
                        router.go(0);
                    }
                })
                .catch((res) => {});
            // 处理完刷新页面数据
            getData();
        };

        const cancel_4 = () => {
            visible_4.value = false;
        };

        // ------------------- 拒收 ---------------------
        const rejectReceive = () => {
            visible_5.value = true;
        };

        // 拒收
        let rejectGoodsForm = reactive({
            reason: "",
            imgs: "",
            _tempImgs: [],
            id: null
        });
        const rejectGoodsRules = {
            reason: [{ required: true, message: proxy.$t("workReturn.pleaseFillInTheDescription"), trigger: "blur" }]
        };
        let rejectGoodsRef = ref(null);

        const onChangeUploadDetailImg_5 = (fileList) => {
            rejectGoodsForm._tempImgs = fileList; // fileList.map((item) => item.url)
        };
        // 拒收
        const confirm_5 = () => {
            if (rejectGoodsForm._tempImgs.length > 0) {
                rejectGoodsForm.imgs = rejectGoodsForm._tempImgs.map((v) => v.url);
                delete rejectGoodsForm._tempImgs;
            } else {
                rejectGoodsForm.imgs = "";
            }
            rejectGoodsRef.value.validate((valid) => {
                if (valid) {
                    rejectGoodsForm.returnId = omsOrderReturn.value.id;
                    orderReturnRejectDelivery(rejectGoodsForm).then((res) => {
                        if (res.code == 0) {
                            visible_5.value = false;
                            proxy.$message.success(res.msg);
                            router.go(0);
                        }
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
            // 处理完刷新页面数据
            getData();
        };

        const cancel_5 = () => {
            visible_5.value = false;
        };

        // ---------------------- 工单 退款 ------------------------
        let tmp = "";
        const moneyback = (val) => {
            visible_6.value = true;
            tmp = val;
        };

        const confirm_6 = () => {
            if (tmp == 2) {
                // 退货退款 -> 退款
                orderReturnagreeRefundInReturnGoodsAndRefund((id = omsOrderReturn.value.id)).then((res) => {
                    if (res.code === 0) {
                        visible_6.value = false;
                        proxy.$message.success(res.msg);
                    }
                });
            } else {
                // 仅退款
                orderReturnAgreeRefund({
                    returnId: omsOrderReturn.value.id,
                    workId: omsOrderReturn.value.workId
                }).then((res) => {
                    if (res.code === 0) {
                        visible_6.value = false;
                        proxy.$message.success(res.msg);
                    }
                });
            }
            // 处理完刷新页面数据
            getData();
        };

        const cancel_6 = () => {
            visible_6.value = false;
        };

        // ------------------ 举证 ------------------------
        // 凭证form
        let exhibitForm = ref({
            workDesc: "", // 描述
            orderWorkId: returnWork.id, // 工单id
            workMustVoucher: [], // 主凭证
            workOptionalVoucher: [] // 次凭证
        });

        let exhibitRef = ref(null);

        const exhibitRules = ref({
            workDesc: [{ required: true, message: proxy.$t("workReturn.pleaseFillInTheDescribe"), trigger: "blur" }]
        });

        // 添加凭证,追加凭证
        // 主要凭证图片
        const onChangeUploadCarousel_workMustVoucher = (fileList) => {
            exhibitForm.workMustVoucher = fileList;
        };

        // 次要凭证图片
        const onChangeUploadCarousel_workOptionalVoucher = (fileList) => {
            exhibitForm.workOptionalVoucher = fileList;
        };

        const addExhibit = (val) => {
            visible_7.value = true;
            if (val == 1) {
                title_7.value = proxy.$t("workReturn.addCredentials");
            } else {
                title_7.value = proxy.$t("workReturn.additionalCredentials");
            }
        };

        const confirm_7 = () => {
            exhibitForm.workMustVoucher = exhibitForm.workMustVoucher.join(",");
            exhibitForm.workOptionalVoucher = exhibitForm.workOptionalVoucher(",");
            // orderReturnAddToProof(exhibitForm).then(res => {
            //     console.log(res);
            // })
        };

        const cancel_7 = () => {
            visible_7.value = false;
        };

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        // ------------------判责 处理 --------------------------------
        const disposeJude = () => {
            visible_8.value = true;
        };

        let judageFormRef = ref(null);
        let judageForm = reactive({
            _tempImg: [],
            _tempImg2: [],
            addDesc: "", // 补充描述
            id: "",
            mallMustVoucher: "", // 主要凭证
            mallOptionalVoucher: "", // 次要
            note: "", // 备注
            refundJudage: "", //退款判定0表示无需退款,1 退款给买家
            responsJudage: "" // 责任判定0->均无责任 1->商家责任 2->买家责任 3->工单违规
        });

        const judageFormRules = ref({
            refundJudage: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }],
            responsJudage: [{ required: true, message: proxy.$t("workReturn.pleaseFillInTheDescribe"), trigger: "blur" }]
        });

        // 判定 主要图片
        const onChangeUploadJudageMain = (fileList) => {
            judageFormRules._tempImg = fileList;
        };

        // 次要
        const onChangeUploadJudageOptional = (fileList) => {
            judageFormRules._tempImg2 = fileList;
        };

        // 提交判责
        const confirm_8 = () => {
            judageForm.mallMustVoucher = judageForm._tempImg.join(",");
            judageForm.mallOptionalVoucher = judageForm._tempImg2.join(",");
            judageForm.id = returnWork.value.id;
            judageFormRef.value.validate((valid) => {
                if (valid) {
                    orderReturnWorkOperatorProcess(judageForm).then((res) => {
                        visible_8.value = false;
                        proxy.$message.success(res.msg);
                        router.go(0);
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
            // 处理完刷新页面数据
            getData();
        };

        const cancel_8 = () => {
            visible_8.value = false;
        };

        return {
            omsOrder,
            omsOrderReturn,
            orderReturnOperateHistoryVOS,
            orderSetVOS,
            returnWork,
            exhibit,
            orderExpessInfo,
            orderReturnExpressInfo,
            moreOrderExpessInfo,
            moreOrderReturnExpressInfo,
            orderReturnData,
            orderExpressData,
            title,
            visible,
            visible_2,
            visible_3,
            visible_4,
            visible_5,
            visible_6,
            visible_7,
            visible_8,
            title_2,
            title_7,
            confirm_2,
            cancel_2,
            confirm_3,
            cancel_3,
            dispose,
            state,
            dialogVisble,
            rejectApply,
            rejectRef,
            rejectForm,
            rejectRules,
            rejectReason,
            onChangeUploadDetailImg,
            affirmReceive,
            rejectReceive,
            confirm_4,
            cancel_4,
            confirm_5,
            cancel_5,
            rejectGoodsForm,
            rejectGoodsRules,
            rejectGoodsRef,
            onChangeUploadDetailImg_5,
            moneyback,
            confirm_6,
            cancel_6,
            onChangeUploadCarousel_workMustVoucher,
            onChangeUploadCarousel_workOptionalVoucher,
            addExhibit,
            confirm_7,
            cancel_7,
            exhibitRef,
            exhibitRules,
            onCopy,
            onError,
            disposeJude,
            judageForm,
            judageFormRef,
            judageFormRules,
            confirm_8,
            cancel_8,
            title_8,
            onChangeUploadJudageMain,
            onChangeUploadJudageOptional,
            form,
            appealTime,
            appealUnit,
            poofDown,
            returnStatus
        };
    }
};
</script>

<style lang="scss" scoped>
.content {
    // height: 100%;
    // overflow: hidden;

    .left {
        width: 50%;

        .order_time {
            border: 1px solid #ececec;
            padding: 30px 18px 30px 18px;
            border-bottom: none;
        }

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
        .shopInfo {
            height: 105px;
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
        .remark {
            height: 105px;
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
        .express {
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
        .userInfo {
            padding: 25px 27px 25px 27px;
            border: 1px solid #ececec;
        }
        .count {
            text-align: end;
            height: 55px;
            padding: 15px 20px 22px 0px;
            border: 1px solid #ececec;
            border-top: none;
            border-bottom: none;
        }
    }

    .right {
        width: 50%;
        margin-left: 20px;

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

        .serviceState {
            height: 238px;
            border: 1px solid #ececec;

            .item1 {
                height: 96px;
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item2 {
                height: 142px;
                padding: 30px 36px 30px 36px;
            }
            .item3 {
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item4 {
                padding: 30px 36px 30px 36px;
            }

            .stateTitle {
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 30px;
            }
            .stateTitle_2 {
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #42b7ae;
                line-height: 30px;
            }
            .stateTitle_3 {
                color: #ff6666;
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                line-height: 30px;
            }
        }
        .serviceState_2 {
            border: 1px solid #ececec;
            margin-bottom: 20px;

            .item1 {
                height: 96px;
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item2 {
                height: 142px;
                padding: 30px 36px 30px 36px;
            }
            .item3 {
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item4 {
                padding: 30px 36px 30px 36px;
            }
        }
        .orderService {
            height: 205px;
            padding: 28px 17px 12px 17px;
            border: 1px solid #ececec;
        }
        .count {
            text-align: end;
            height: 55px;
            padding: 15px 20px 22px 0px;
            border: 1px solid #ececec;
        }
        .userInfo {
            padding: 25px 27px 25px 27px;
            border: 1px solid #ececec;
        }
        .proof {
            padding: 22px 18px 22px 18px;
            border: 1px solid #ececec;
            border-bottom: none;
            .header {
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 700;
                color: #333333;
                line-height: 17px;
            }
            img {
                width: 48px;
                height: 48px;
            }
        }
        .bottom {
            border-top: 1px solid #ececec;
            height: 1px;
        }
        .express {
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
    }
}

.rejectTips {
    width: 100%;
    background-color: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 7px;
}

.goodsImg {
    width: 59px;
    height: 59px;
}
.stateTitle {
    font-size: 22px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 30px;
}
</style>
