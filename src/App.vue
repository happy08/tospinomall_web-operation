<template>
    <router-view />
</template>
<script>
import { provide, computed, getCurrentInstance } from "vue";

export default {
    name: "App",
    setup() {
        const { proxy } = getCurrentInstance();

        //数据字典
        const dict = computed(() => {
            return {
                //是否（1是 0否）
                yesNo: [
                    {
                        name: proxy.$t("yes"),
                        value: 1
                    },
                    {
                        name: proxy.$t("no"),
                        value: 0
                    }
                ],
                //有无 (0有 1无)
                haveNone: [
                    {
                        name: proxy.$t("have"),
                        value: 0
                    },
                    {
                        name: proxy.$t("none"),
                        value: 1
                    }
                ],
                //通过驳回（2通过 3驳回）
                passReject: [
                    {
                        name: proxy.$t("status.pass"),
                        value: 2
                    },
                    {
                        name: proxy.$t("status.reject"),
                        value: 3
                    }
                ],
                //禁用启用（0禁用 1启用）
                forbiddenEnable: [
                    {
                        name: proxy.$t("status.enable"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.forbidden"),
                        value: 0
                    }
                ],
                //启用禁用（0启用 1禁用）
                forbiddenEnableReverse: [
                    {
                        name: proxy.$t("status.enable"),
                        value: 0
                    },
                    {
                        name: proxy.$t("status.forbidden"),
                        value: 1
                    }
                ],
                //支持不支持（0不支持 1支持）
                supportOrNot: [
                    {
                        name: proxy.$t("status.support"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notSupport"),
                        value: 0
                    }
                ],
                //允许不允许（0不允许 1允许）
                allowOrNot: [
                    {
                        name: proxy.$t("status.allow"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notAllow"),
                        value: 0
                    }
                ],
                //必填不必填（0不必填 1必填）
                requiredOrNot: [
                    {
                        name: proxy.$t("status.required"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notRequired"),
                        value: 0
                    }
                ],
                //必选不必选（0不必选 1必选）
                selectOrNot: [
                    {
                        name: proxy.$t("status.select"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notSelect"),
                        value: 0
                    }
                ],
                //商品参数录入方式（1字符串 2自然数 3日期 4货币 5浮点数 6select单选 7布尔 8时间 9select多选）
                goodsModeList: [
                    {
                        name: proxy.$t("attribute.string"),
                        value: 1
                    },
                    {
                        name: proxy.$t("attribute.number"),
                        value: 2
                    },
                    {
                        name: proxy.$t("attribute.date"),
                        value: 3
                    },
                    {
                        name: proxy.$t("attribute.currency"),
                        value: 4
                    },
                    {
                        name: proxy.$t("attribute.decimals"),
                        value: 5
                    },
                    {
                        name: proxy.$t("attribute.bool"),
                        value: 7
                    },
                    {
                        name: proxy.$t("attribute.time"),
                        value: 8
                    },
                    {
                        name: proxy.$t("attribute.radio"),
                        value: 6
                    },
                    {
                        name: proxy.$t("attribute.select"),
                        value: 9
                    }
                ],
                //审核状态（1待审核 2已通过 3未通过 4品牌已屏蔽 5品牌待更新）
                auditStatus: [
                    {
                        name: proxy.$t("status.beAudit"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.auditPass"),
                        value: 2
                    },
                    {
                        name: proxy.$t("status.auditRejected"),
                        value: 3
                    },
                    {
                        name: proxy.$t("status.shield"),
                        value: 4
                    },
                    {
                        name: proxy.$t("status.beUpdated"),
                        value: 5
                    }
                ],
                //商标类型（1自有商标 2授权商标）
                brandType: [
                    {
                        name: proxy.$t("brand.own"),
                        value: 1
                    },
                    {
                        name: proxy.$t("brand.auth"),
                        value: 2
                    }
                ],
                //商标注册人类型（1自有商标 2授权商标）
                brandRegistrant: [
                    {
                        name: proxy.$t("brand.notNatural"),
                        value: 1
                    },
                    {
                        name: proxy.$t("brand.natural"),
                        value: 2
                    }
                ],
                //运输方式（1：空运，2：海运，3：陆运）
                sendTypeList: [
                    {
                        name: proxy.$t("sellerFreight.airParcel"),
                        value: 1
                    },
                    {
                        name: proxy.$t("sellerFreight.shipping"),
                        value: 2
                    },
                    {
                        name: proxy.$t("sellerFreight.landCarriage"),
                        value: 3
                    }
                ],
                //贸易形式（1：本地贸易，2：跨境贸易）
                tradeTypeList: [
                    {
                        name: proxy.$t("sellerFreight.localTrade"),
                        value: 1
                    },
                    {
                        name: proxy.$t("sellerFreight.crossBorderTrade"),
                        value: 2
                    }
                ],
                //商品配送方式（1：FBM，2:FBT）
                freightTypeList: [
                    {
                        name: "FBM",
                        value: 1
                    },
                    {
                        name: "FBT",
                        value: 2
                    }
                ],
                //发货地类型（1仓库地址2手动设置）
                deliverTypeList: [
                    {
                        name: proxy.$t("sellerFreight.warehouse"),
                        value: 1
                    },
                    {
                        name: proxy.$t("sellerFreight.manualSetting"),
                        value: 2
                    }
                ],
                // 计费方式（1. 按重量计费）
                postageBillingMethod: [
                    {
                        name: proxy.$t("memberShippingTemplate.billedByWeight"),
                        value: 1
                    }
                ],
                // 包邮条件类型(1：件数，2：重量，3：金额，4：重量+金额)
                freeShippingConditionsType: [
                    {
                        name: proxy.$t("memberShippingTemplate.num"),
                        value: 1
                    },
                    {
                        name: proxy.$t("memberShippingTemplate.weight"),
                        value: 2
                    },
                    {
                        name: proxy.$t("memberShippingTemplate.amount"),
                        value: 3
                    },
                    {
                        name: proxy.$t("memberShippingTemplate.weightAndAmount"),
                        value: 4
                    }
                ],
                //发补货状态列表（0->草稿 1->审核中 2->待发货 3->待收货 4->在运营中心 5->入仓完成 6->驳回 7->已拒签）
                shippingStatus: [
                    {
                        name: proxy.$t("warehouse.audit"),
                        value: 1
                    },
                    {
                        name: proxy.$t("warehouse.waitDelivery"),
                        value: 2
                    },
                    {
                        name: proxy.$t("warehouse.waitReceiving"),
                        value: 3
                    },
                    {
                        name: proxy.$t("warehouse.InOperations"),
                        value: 4
                    },
                    {
                        name: proxy.$t("warehouse.completedLevite"),
                        value: 5
                    },
                    {
                        name: proxy.$t("warehouse.draft"),
                        value: 0
                    },
                    {
                        name: proxy.$t("warehouse.reject"),
                        value: 6
                    },
                    {
                        name: proxy.$t("warehouse.haveVisa"),
                        value: 7
                    }
                ],
                //退货发补货状态（0草稿 1审核中 2审核驳回 3待出库 4退货协商中 5退货出库完成）
                returnsStatus: [
                    {
                        name: proxy.$t("returns.draft"),
                        value: 0
                    },
                    {
                        name: proxy.$t("returns.inReview"),
                        value: 1
                    },
                    {
                        name: proxy.$t("returns.auditRejected"),
                        value: 2
                    },
                    {
                        name: proxy.$t("returns.outbound"),
                        value: 3
                    },
                    {
                        name: proxy.$t("returns.negotiation"),
                        value: 4
                    },
                    {
                        name: proxy.$t("returns.finish"),
                        value: 5
                    }
                ],
                //店铺装修页面类型（1PC端页面 2手机端页面 3专题页）
                storePageList: [
                    {
                        name: proxy.$t("storeDesign.pcPage"),
                        value: 1
                    },
                    {
                        name: proxy.$t("storeDesign.mobilePage"),
                        value: 2
                    }
                ],
                // 付款方式(1.在线支付  2.货到付款 3.在线支付货到付款)
                onlineOffline: [
                    {
                        name: proxy.$t("orderSetting.onlinePay"),
                        value: 1
                    },
                    {
                        name: proxy.$t("orderSetting.offlinePay"),
                        value: 2
                    },
                    {
                        name: proxy.$t("orderSetting.onlinePay") + proxy.$t("orderSetting.offlinePay"),
                        value: 3
                    }
                ],
                // 货物状态(0.未收到货 1.已收到货)
                goodsStatus: [
                    {
                        name: proxy.$t("afterSalesReasonSetting.notReceived"),
                        value: 0
                    },
                    {
                        name: proxy.$t("afterSalesReasonSetting.received"),
                        value: 1
                    }
                ],
                // 售后类型(0：仅退款，1：退货退款)
                afterSaleType: [
                    {
                        name: proxy.$t("afterSalesReasonSetting.refundOnly"),
                        value: 0
                    },
                    {
                        name: proxy.$t("afterSalesReasonSetting.returnRefund"),
                        value: 1
                    }
                ],
                // 卖家类型(1：个人卖家，2：专业卖家)
                sellerType: [
                    {
                        name: proxy.$t("entryAudit.personalSeller"),
                        value: 1
                    },
                    {
                        name: proxy.$t("entryAudit.professionSeller"),
                        value: 2
                    }
                ],
                // 店铺状态(1：审核中，2：正常营业，3：停业, 4：审核驳回)
                storeStatusType: [
                    {
                        name: proxy.$t("entryAudit.examining"),
                        value: 1
                    },
                    {
                        name: proxy.$t("entryAudit.openAsUsual"),
                        value: 2
                    },
                    {
                        name: proxy.$t("entryAudit.close"),
                        value: 3
                    },
                    {
                        name: proxy.$t("entryAudit.examineReject"),
                        value: 4
                    }
                ],
                // 入驻类型(1：新注册，2：站点开通)
                enterType: [
                    {
                        name: proxy.$t("entryAudit.newRegister"),
                        value: 1
                    },
                    {
                        name: proxy.$t("entryAudit.siteOpen"),
                        value: 2
                    }
                ],
                // 店铺类型(1.普通店铺)
                storeType: [
                    {
                        name: proxy.$t("entryAudit.normalStore"),
                        value: 1
                    }
                ],
                // 证件类型(1：中国大陆身份证，2：ID证件)
                idCardType: [
                    {
                        name: proxy.$t("entryAudit.chineseIdCard"),
                        value: 1
                    },
                    {
                        name: proxy.$t("entryAudit.idCard"),
                        value: 2
                    }
                ],
                // 店铺账号状态(1：待审核，2：启用，3：冻结，4：审核驳回)
                storeStatusType2: [
                    {
                        name: proxy.$t("sellerList.pendingReview"),
                        value: 1
                    },
                    {
                        name: proxy.$t("sellerList.enable"),
                        value: 2
                    },
                    {
                        name: proxy.$t("sellerList.frozen"),
                        value: 3
                    },
                    {
                        name: proxy.$t("sellerList.reviewRejected"),
                        value: 4
                    }
                ],
                // 卖家收款账号payoneer账号状态(0未激活1已激活）
                payoneerStatus: [
                    {
                        name: proxy.$t("sellerList.inactivated"),
                        value: 0
                    },
                    {
                        name: proxy.$t("sellerList.activated"),
                        value: 1
                    }
                ],
                // 退单类型(0->退款 1->退款退货 2->换货)
                chargebackType: [
                    {
                        name: proxy.$t("copingManagement.returnOnly"),
                        value: 0
                    },
                    {
                        name: proxy.$t("copingManagement.returnRefund"),
                        value: 1
                    },
                    {
                        name: proxy.$t("copingManagement.exchange"),
                        value: 2
                    }
                ],
                // 退单状态(0未支付1支付成功2支付失败)
                chargebackStatus: [
                    {
                        name: proxy.$t("copingManagement.pendingPayment"),
                        value: 0
                    },
                    {
                        name: proxy.$t("copingManagement.Paid"),
                        value: 1
                    },
                    {
                        name: proxy.$t("copingManagement.paymentFailed"),
                        value: 2
                    }
                ],
                // 支付状态(0未支付1支付成功2支付失败)
                payStatus: [
                    {
                        name: proxy.$t("onlinePayments.pendingPayment"),
                        value: 0
                    },
                    {
                        name: proxy.$t("onlinePayments.paid"),
                        value: 1
                    },
                    {
                        name: proxy.$t("onlinePayments.paymentFailed"),
                        value: 2
                    }
                ],
                // 支付方式(1余额支付，2MTN,3现金支付）
                payMethod: [
                    {
                        name: proxy.$t("onlinePayments.balancePayment"),
                        value: 1
                    },
                    {
                        name: "MTN",
                        value: 2
                    },
                    {
                        name: proxy.$t("onlinePayments.cashPayment"),
                        value: 3
                    }
                ],
                // 单据类型(1钱包充值 2订单消费 3订单退款)
                orderType: [
                    {
                        name: proxy.$t("incomeExpenditureDetails.walletRecharge"),
                        value: 1
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.orderConsumption"),
                        value: 2
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.orderRefund"),
                        value: 3
                    }
                ],
                // 钱包充值状态(0失败 1成功 2待支付 3已取消)
                rechargeStatus: [
                    {
                        name: proxy.$t("incomeExpenditureDetails.fail"),
                        value: 0
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.success"),
                        value: 1
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.toBePaid"),
                        value: 2
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.cancelled"),
                        value: 3
                    }
                ],
                // 钱包充值平台(1:android，2:iOS ，3::H5，4:web 5: 运营平台)
                rechargePlatform: [
                    {
                        name: "Android",
                        value: 1
                    },
                    {
                        name: "ios",
                        value: 2
                    },
                    {
                        name: "H5",
                        value: 3
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.webMall"),
                        value: 4
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.operatingPlatform"),
                        value: 5
                    }
                ],
                  // 财务-会员资金-收支明细(1:运营平台，2:安卓，3:iOS ，4::H5，5:web商城)
                financePlatform: [
                    {
                        name: "operatingPlatform",
                        value: 1
                    },
                    {
                        name: "Android",
                        value: 2
                    },
                    {
                        name: "ios",
                        value: 3
                    },
                    {
                        name: "H5",
                        value: 4
                    },
                    {
                        name: proxy.$t("incomeExpenditureDetails.webMall"),
                        value: 5
                    }
                ],
                // 卖家反馈消息来源(1:Android，2:IOS，3:H5，4:PC)
                feedbackMessageSource: [
                    {
                        name: "Android",
                        value: 1
                    },
                    {
                        name: "IOS",
                        value: 2
                    },
                    {
                        name: "H5",
                        value: 3
                    },
                    {
                        name: "PC",
                        value: 4
                    }
                ],
                // 卖家反馈消息状态
                feedbackMessageStatus: [
                    {
                        name: proxy.$t("sellerFeedbackList.unread"),
                        value: 0
                    },
                    {
                        name: proxy.$t("sellerFeedbackList.haveRead"),
                        value: 1
                    }
                ],
                // 充值卡类型(1固定充值卡 2自由充值卡）
                rechargeCardType: [
                    {
                        name: proxy.$t("memberWallet.fixedRechargeCard"),
                        value: 1
                    },
                    {
                        name: proxy.$t("memberWallet.freeRechargeCard"),
                        value: 2
                    }
                ],
                // 提现账户类型(1.Payoneer，2.银行卡账户，3.保证金）
                withdrawalAccountType: [
                    {
                        name: "Payoneer",
                        value: 1
                    },
                    {
                        name: proxy.$t("withdrawalManagement.bankCardAccount"),
                        value: 2
                    },
                    {
                        name: proxy.$t("withdrawalManagement.Margin"),
                        value: 3
                    }
                ],
                // 提现状态(1待审核2处理中3提现完成4已驳回5已取消)
                withdrawalStatusType: [
                    {
                        name: proxy.$t("withdrawalManagement.pendingReview"),
                        value: 1
                    },
                    {
                        name: proxy.$t("withdrawalManagement.processing"),
                        value: 2
                    },
                    {
                        name: proxy.$t("withdrawalManagement.withdrawalCompleted"),
                        value: 3
                    },
                    {
                        name: proxy.$t("withdrawalManagement.rejected"),
                        value: 4
                    },
                    {
                        name: proxy.$t("withdrawalManagement.cancelled"),
                        value: 5
                    }
                ],
                // 收款账户类型(1.Payoneer，2银行借记卡，3银行信用卡）
                paymentMethod: [
                    {
                        name: "Payoneer",
                        value: 1
                    },
                    {
                        name: proxy.$t("withdrawalManagement.bankCardAccount"),
                        value: 2
                    },
                    {
                        name: proxy.$t("accountsReceivable.creditCard"),
                        value: 3
                    }
                ],
                // 收支类型(1销售2退款3提现4奖励5处罚6其他)
                withdrawalStatus: [
                    {
                        name: proxy.$t("billingDetails.sale"),
                        value: 1
                    },
                    {
                        name: proxy.$t("billingDetails.refund"),
                        value: 2
                    },
                    {
                        name: proxy.$t("billingDetails.withdraw"),
                        value: 3
                    },
                    {
                        name: proxy.$t("billingDetails.award"),
                        value: 4
                    },
                    {
                        name: proxy.$t("billingDetails.punishment"),
                        value: 5
                    },
                    {
                        name: proxy.$t("billingDetails.other"),
                        value: 6
                    }
                ],
                // 结算状态(0待结算1已结算2无需结算）
                settlementStatus: [
                    {
                        name: proxy.$t("billingDetails.toBeSettled"),
                        value: 0
                    },
                    {
                        name: proxy.$t("billingDetails.settled"),
                        value: 1
                    },
                    {
                        name: proxy.$t("billingDetails.noNeedToSettle"),
                        value: 2
                    }
                ],
                // 结算订单状态(0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成
                // 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他)
                settlementOrderStatus: [
                    {
                        name: proxy.$t("billingDetails.pendingPayment"),
                        value: 0
                    },
                    {
                        name: proxy.$t("billingDetails.toBeDelivered"),
                        value: 1
                    },
                    {
                        name: proxy.$t("billingDetails.toBeReceived"),
                        value: 2
                    },
                    {
                        name: proxy.$t("billingDetails.beEvaluated"),
                        value: 3
                    },
                    {
                        name: proxy.$t("billingDetails.completed"),
                        value: 4
                    },
                    {
                        name: proxy.$t("billingDetails.cancelled"),
                        value: 5
                    },
                    {
                        name: proxy.$t("billingDetails.overtimeUnpaid"),
                        value: 6
                    },
                    {
                        name: proxy.$t("billingDetails.orderClosed"),
                        value: 7
                    },
                    {
                        name: proxy.$t("billingDetails.orderClose"),
                        value: 8
                    }
                ],
                // 结算售后状态(1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款
                // 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品)
                settlementAfterSalesStatus: [
                    {
                        name: proxy.$t("billingDetails.MerchantOperationPending"),
                        value: 1
                    },
                    {
                        name: proxy.$t("billingDetails.toBeSentBackByYourselfOrPickedUp"),
                        value: 2
                    },
                    {
                        name: proxy.$t("billingDetails.merchantOrOperationPendingReceipt"),
                        value: 3
                    },
                    {
                        name: proxy.$t("billingDetails.pendingRefund"),
                        value: 4
                    },
                    {
                        name: proxy.$t("billingDetails.returnOrderStatus5"),
                        value: 5
                    },
                    {
                        name: proxy.$t("billingDetails.closeAfterSalesOrder"),
                        value: 6
                    },
                    {
                        name: proxy.$t("billingDetails.merchantOrOperationRejectionApplicationz"),
                        value: 7
                    },
                    {
                        name: proxy.$t("billingDetails.merchantOrOperatorRefusesToAcceptReturnedGoods"),
                        value: 8
                    }
                ],
                // 赏罚类型(1奖励2处罚）
                rewardPunishmentType: [
                    {
                        name: proxy.$t("rewardPunishmentManagement.award"),
                        value: 1
                    },
                    {
                        name: proxy.$t("rewardPunishmentManagement.Punishment"),
                        value: 2
                    }
                ],
                // 赏罚状态(0待审核1已审核2已作废）
                rewardPunishmentStatus: [
                    {
                        name: proxy.$t("rewardPunishmentManagement.pendingReview"),
                        value: 0
                    },
                    {
                        name: proxy.$t("rewardPunishmentManagement.audited"),
                        value: 1
                    },
                    {
                        name: proxy.$t("rewardPunishmentManagement.void"),
                        value: 2
                    }
                ],
                // 收支类型(1 收入 2 支出)
                incomeExpenditureType: [
                    {
                        name: proxy.$t("billingDetails.income"),
                        value: 1
                    },
                    {
                        name: proxy.$t("billingDetails.expenditure"),
                        value: 2
                    }
                ],
                // 资金账户
                fundAccount: [
                    {
                        name: proxy.$t("margin.storeDeposit"),
                        value: 1
                    }
                ],
                // 业务类型(1充值2提现3扣款4汇入)
                businessType: [
                    {
                        name: proxy.$t("margin.recharge"),
                        value: 1
                    },
                    {
                        name: proxy.$t("margin.withdraw"),
                        value: 2
                    },
                    {
                        name: proxy.$t("margin.deduction"),
                        value: 3
                    },
                    {
                        name: proxy.$t("margin.sendIncome"),
                        value: 4
                    }
                ],
                // 支付渠道(1银行汇款2货款账户3系统充值4系统扣款)
                payChannelType: [
                    {
                        name: proxy.$t("margin.bankTransfer"),
                        value: 1
                    },
                    {
                        name: proxy.$t("margin.loanAccount"),
                        value: 2
                    },
                    {
                        name: proxy.$t("margin.systemRecharge"),
                        value: 3
                    },
                    {
                        name: proxy.$t("margin.systemDeduction"),
                        value: 4
                    }
                ],
                // 交易状态(1充值成功2提现待审核3待处理4提现完成5提现驳6待确认)
                transactionStatusType: [
                    {
                        name: proxy.$t("margin.rechargeSuccess"),
                        value: 1
                    },
                    {
                        name: proxy.$t("margin.withdrawalPendingReview"),
                        value: 2
                    },
                    {
                        name: proxy.$t("margin.withdrawPending"),
                        value: 3
                    },
                    {
                        name: proxy.$t("margin.withdrawalCompleted"),
                        value: 4
                    },
                    {
                        name: proxy.$t("margin.withdrawalRejected"),
                        value: 5
                    },
                    {
                        name: proxy.$t("margin.rechargeToBeConfirmed"),
                        value: 6
                    }
                ],
                // 加密方式(1：不加密，2：ssl，3：tls)
                encryption: [
                    {
                        name: proxy.$t("emailPush.notEncrypted"),
                        value: 1
                    },
                    {
                        name: "ssl",
                        value: 2
                    },
                    {
                        name: "tls",
                        value: 3
                    }
                ],
                // 单页面信息平台(1:商城移动端 2:商城PC端 3卖家PC)
                singalPageInfoPlatform: [
                    {
                        name: proxy.$t("singlePageInfo.mallMobileTerminal"),
                        value: 1
                    },
                    {
                        name: proxy.$t("singlePageInfo.mallPC"),
                        value: 2
                    },
                    {
                        name: proxy.$t("singlePageInfo.sellerPC"),
                        value: 3
                    }
                ],
                // 单页面打开方式(1:新窗口)
                singalPageInfoOpenMode: [
                    {
                        name: proxy.$t("singlePageInfo.newWindow"),
                        value: 1
                    }
                ],
                // 交易-订单详情-支付方式(支付方式：0->系统支付；1->余额支付 2->uniwall)
                orderDetailPayType: [
                    {
                        name: proxy.$t("orderQuery.systemPayment"),
                        value: 0
                    },
                    {
                        name: proxy.$t("orderQuery.balancePayment"),
                        value: 1
                    },
                    {
                        name: "uniwall",
                        value: 2
                    }
                ],
                // 售后工单-责任判定(责任判定0->均无责任 1->商家责任 2->买家责任 3->工单违规)
                workOrderLiabilityDetermination: [
                    {
                        name: proxy.$t("platform.noResponsibility"),
                        value: 0
                    },
                    {
                        name: proxy.$t("platform.sellerResponsibility"),
                        value: 1
                    },
                    {
                        name: proxy.$t("platform.buyerResponsibility"),
                        value: 2
                    },
                    {
                        name: proxy.$t("platform.workOrderViolation"),
                        value: 3
                    }
                ],
                // 售后工单-退款判定(0表示无需退款 1退款给买家)
                workOrderRefundJudage: [
                    {
                        name: proxy.$t("platform.noRefundRequired"),
                        value: 0
                    },
                    {
                        name: proxy.$t("platform.refundToBuyer"),
                        value: 1
                    }
                ],
                // 售后订单状态
                // 0->待付款；1->待发货；2->待收货；3->待评价；4->已完成
                // 5->已取消；6->订单关闭（超时关闭）；7->已拒收；8->其他

                afterSaleOrderStatus: [
                    {
                        name: proxy.$t("billingDetails.pendingPayment"),
                        value: 0
                    },
                    {
                        name: proxy.$t("billingDetails.toBeDelivered"),
                        value: 1
                    },
                    {
                        name: proxy.$t("billingDetails.toBeReceived"),
                        value: 2
                    },
                    {
                        name: proxy.$t("billingDetails.beEvaluated"),
                        value: 3
                    },
                    {
                        name: proxy.$t("billingDetails.completed"),
                        value: 4
                    },
                    {
                        name: proxy.$t("billingDetails.cancelled"),
                        value: 5
                    },
                    {
                        name: proxy.$t("platform.orderCloseForTimeout"),
                        value: 6
                    },
                    {
                        name: proxy.$t("platform.orderCloseForAfterSale"),
                        value: 7
                    },
                    {
                        name: proxy.$t("billingDetails.other"),
                        value: 8
                    }
                ],
                 // 性别，1男，2女，3双性，4保密
                sexType: [
                    {
                        name: proxy.$t("memberListTable.man"),
                        value: 1
                    },
                    {
                        name: proxy.$t("memberListTable.woman"),
                        value: 2
                    },
                    {
                        name: proxy.$t("memberListTable.bisexual"),
                        value: 3
                    },
                    {
                        name: proxy.$t("memberListTable.secrecy"),
                        value: 4
                    }
                ],
            };
        });
        provide("dict", dict);
    }
};
</script>
