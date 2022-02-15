<template>
    <!-- 仪表盘 -->
    <div class="mb-25 plr-15 pt-15 pb-5 bg-white">
        <BmBaseTitle :title="$t('index.dashBoard')" />
    </div>
    <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 会员总数 -->
            <div class="home-item">
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.memberTotal") }}</div>
                        <div>{{ infoDataObj.memberTotal }}</div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 店铺总数 -->
            <div class="home-item">
                <div class="w-100 tr">
                    <span class="mr-10 ">{{ $t("index.pendingReview") }}</span>
                    <a :href="'#/store/sellerAdmin/entryAudit?status=1'" class="red">{{ infoDataObj.storeReviewedTotal }}</a>
                </div>
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.storeTotal") }}</div>
                        <div>{{ infoDataObj.storeTotal }}</div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 商品总数 -->
            <div class="home-item">
                <div class="w-100 tr">
                    <span class="mr-10">{{ $t("index.pendingReview") }}</span>
                    <a :href="'#/goods/checkRecord?status=1'" class="red">{{ infoDataObj.total_await_check }}</a>
                </div>
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.total_count") }}</div>
                        <div>{{ infoDataObj.total_count }}</div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 订单总数 -->
            <div class="home-item">
                <div class="w-100 tr">
                    <span class="mr-10">{{ $t("index.toBeDelivered") }}</span>
                    <a :href="'#/transaction/orderManagement/orderQuery?fastStatus=0'" class="red">{{ infoDataObj.await_delivery_count }}</a>
                </div>
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.total_order") }}</div>
                        <div>{{ infoDataObj.total_order }}</div>
                    </div>
                </div>
                <div class="w-100 flex between">
                    <span class="grey tl">FBT：{{ infoDataObj.FBT_total_order }}</span>
                    <span class="grey tr">FBM：{{ infoDataObj.FBM_total_order }}</span>
                </div>
            </div>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 总充值金额 -->
            <div class="home-item">
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.rechargeBalance") }}</div>
                        <div>
                            {{ $store.state.app.currencySymbol }}
                            <span v-if="infoDataObj && infoDataObj.rechargeBalance">{{ infoDataObj.rechargeBalance }}</span>
                            <span v-else>0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 总交易额 -->
            <div class="home-item">
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.total_pay_amount") }}</div>
                        <div>{{ $store.state.app.currencySymbol }}{{ infoDataObj.total_pay_amount }}</div>
                    </div>
                </div>
                <div class="w-100 flex between">
                    <span class="grey tl">FBT：{{ infoDataObj.FBT_total_pay_amount }}</span>
                    <span class="grey tr">FBM：{{ infoDataObj.FBM_total_pay_amount }}</span>
                </div>
            </div>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 会员钱包余额 -->
            <div class="home-item">
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.memberAmount") }}</div>
                        <div>{{ $store.state.app.currencySymbol }}{{ infoDataObj.memberAmount }}</div>
                    </div>
                </div>
            </div>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 总交易额 -->
            <div class="home-item">
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.total_commission") }}</div>
                        <div>{{ $store.state.app.currencySymbol }}{{ infoDataObj.total_commission }}</div>
                    </div>
                </div>
                <div class="w-100 flex between">
                    <span class="grey tl">FBT：{{ infoDataObj.FBT_total_commission }}</span>
                    <span class="grey tr">FBM：{{ infoDataObj.FBM_total_commission }}</span>
                </div>
            </div>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <!-- 售后订单总数 -->
            <div class="home-item">
                <div class="w-100 tr">
                    <span class="mr-10">{{ $t("index.pending") }}</span>
                    <a :href="'#/transaction/returnManager/returnPlateform?returnStatus=1'" class="red">{{ infoDataObj.order_refund_await_deal }}</a>
                </div>
                <div class="flex center">
                    <i class="mr-20 el-icon-document red fs-36"></i>
                    <div>
                        <div>{{ $t("index.order_refund_await_deal") }}</div>
                        <div>{{ infoDataObj.order_refund_total }}</div>
                    </div>
                </div>
                <div class="w-100 flex between">
                    <span class="grey tl">FBT：{{ infoDataObj.FBT_order_refund_total }}</span>
                    <span class="grey tr">FBM：{{ infoDataObj.FBM_order_refund_total }}</span>
                </div>
            </div>
        </el-col>
    </el-row>

    <!-- 待办提醒 -->
    <div class="mtb-25 plr-15 pt-15 pb-5 bg-white">
        <BmBaseTitle :title="$t('index.toDoReminder')" />
    </div>

    <el-row :gutter="20">
        <!-- FBT订单 -->
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <div class="bg-white p-15">
                <div class="flex vcenter mb-15">
                    <span class="red fs-22">
                        <i class="el-icon-document"></i>
                    </span>
                    <span class="ml-10">{{ $t("index.fbtOrder") }}</span>
                </div>
                <div class="flex between mb-15">
                    <span>{{ $t("index.toBeDelivered") }}</span>
                    <span>{{ infoDataObj.FBT_await_delivery_count }}</span>
                </div>
            </div>
        </el-col>

        <!-- FBT售后 -->
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <div class="bg-white p-15">
                <div class="flex vcenter mb-15">
                    <span class="red fs-22">
                        <i class="el-icon-document"></i>
                    </span>
                    <span class="ml-10">{{ $t("index.fbtAfterSale") }}</span>
                </div>
                <!-- 仅退款:待审核 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.onlyRefund") }}: {{ $t("index.pendingReview") }}</span>
                    <span>{{ infoDataObj.FBT_order_only_refund_await_check }}</span>
                </div>
                <!-- 仅退款:待退款 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.onlyRefund") }}: {{ $t("index.pendingRefund") }}</span>
                    <span>{{ infoDataObj.FBT_order_only_refund_await_refund }}</span>
                </div>
                <!-- 退/贷款:待审核 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.refundOrLoan") }}: {{ $t("index.pendingReview") }}</span>
                    <a :href="'#/transaction/returnManager/returnPlateform?orderType=2&&returnType=1&&returnStatus=1'" class="red">{{ infoDataObj.FBT_order_refund_goods_await_check }}</a>
                </div>
                <!-- 退/贷款:待退款 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.refundOrLoan") }}: {{ $t("index.pendingRefund") }}</span>
                    <a :href="'#/transaction/returnManager/returnPlateform?orderType=2&&returnType=1&&returnStatus=4'" class="red">{{ infoDataObj.FBT_await_delivery_count }}</a>
                </div>
            </div>
        </el-col>

        <!-- FBM订单 -->
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <div class="bg-white p-15">
                <div class="flex vcenter mb-15">
                    <span class="red fs-22">
                        <i class="el-icon-document"></i>
                    </span>
                    <span class="ml-10">{{ $t("index.fbmOrder") }}</span>
                </div>
                <div class="flex between mb-15">
                    <span>{{ $t("index.toBeDelivered") }}</span>
                    <span>{{ infoDataObj.FBM_await_delivery_count }}</span>
                </div>
            </div>
        </el-col>

        <!-- FBM售后 -->
        <el-col :xs="12" :sm="8" :md="8" :lg="6" class="mb-20">
            <div class="bg-white p-15">
                <div class="flex vcenter mb-15">
                    <span class="red fs-22">
                        <i class="el-icon-document"></i>
                    </span>
                    <span class="ml-10">{{ $t("index.fbmAfterSale") }}</span>
                </div>
                <!-- 仅退款:待(商家)审核 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.onlyRefund") }}: {{ $t("index.pendingMerchantReview") }}</span>
                    <span>{{ infoDataObj.FBM_order_only_refund_await_check }}</span>
                </div>
                <!-- 仅退款:待退款 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.onlyRefund") }}: {{ $t("index.pendingRefund") }}</span>
                    <span>{{ infoDataObj.FBM_order_only_refund_await_refund }}</span>
                </div>
                <!-- 退/贷款:待审核 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.refundOrLoan") }}: {{ $t("index.pendingMerchantReview") }}</span>
                    <a :href="'#/transaction/returnManager/returnPlateform?orderType=1&&returnType=1&&returnStatus=1'" class="red">{{ infoDataObj.FBM_order_refund_goods_await_check }}</a>
                </div>
                <!-- 退/贷款:待退款 -->
                <div class="flex between mb-15">
                    <span>{{ $t("index.refundOrLoan") }}: {{ $t("index.pendingRefund") }}</span>
                    <a :href="'#/transaction/returnManager/returnPlateform?orderType=1&&returnType=1&&returnStatus=4'" class="red">{{ infoDataObj.FBM_await_delivery_count }}</a>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { reactive, getCurrentInstance } from "vue";
import { getStoreTotalAndMemberTotal, getMemberWalletAndRechargeBalance, getQuotaAndOrderInfo, getRefundAndAfterSale, getGoodsNum } from "@/api/index";
export default {
    name: "Home",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        // 所有的展示数据信息总对象
        let infoDataObj = reactive({});
        // 获取展示的数据信息
        const getListPage = () => {
            getStoreTotalAndMemberTotal()
                .then((res) => {
                    // 店铺总数
                    infoDataObj.storeTotal = proxy.utils.moneyFormat(res.data.storeTotal, 0);
                    // 待审核店铺总数
                    infoDataObj.storeReviewedTotal = proxy.utils.moneyFormat(res.data.storeReviewedTotal, 0);
                    // 会员总数
                    infoDataObj.memberTotal = proxy.utils.moneyFormat(res.data.memberTotal, 0);
                })
                .catch(() => {});
            getMemberWalletAndRechargeBalance()
                .then((res) => {
                    // 会员钱包余额
                    infoDataObj.memberAmount = proxy.utils.moneyFormat(res.data.memberAmount);
                    // 总充值金额
                    infoDataObj.rechargeBalance = proxy.utils.moneyFormat(res.data.rechargeBalance);
                })
                .catch(() => {});
            getQuotaAndOrderInfo()
                .then((res) => {
                    // 总交易额
                    infoDataObj.total_pay_amount = proxy.utils.moneyFormat(res.data.total_pay_amount);
                    // FBT总交易额
                    infoDataObj.FBT_total_pay_amount = proxy.utils.moneyFormat(res.data.FBT_total_pay_amount);
                    // FBM总交易额
                    infoDataObj.FBM_total_pay_amount = proxy.utils.moneyFormat(res.data.FBM_total_pay_amount);
                    // 总佣金
                    infoDataObj.total_commission = proxy.utils.moneyFormat(res.data.total_commission);
                    // FBM总佣金
                    infoDataObj.FBM_total_commission = proxy.utils.moneyFormat(res.data.FBM_total_commission);
                    // FBT总佣金
                    infoDataObj.FBT_total_commission = proxy.utils.moneyFormat(res.data.FBT_total_commission);
                    // FBM待发货
                    infoDataObj.FBM_await_delivery_count = proxy.utils.moneyFormat(res.data.FBM_await_delivery_count, 0);
                    // FBT待发货
                    infoDataObj.FBT_await_delivery_count = proxy.utils.moneyFormat(res.data.FBT_await_delivery_count, 0);
                    // 待发货总数
                    infoDataObj.await_delivery_count = proxy.utils.moneyFormat(res.data.await_delivery_count, 0);
                    // FBM总订单数量
                    infoDataObj.FBM_total_order = proxy.utils.moneyFormat(res.data.FBM_total_order, 0);
                    // FBT总订单数量
                    infoDataObj.FBT_total_order = proxy.utils.moneyFormat(res.data.FBT_total_order, 0);
                    // 总订单数量
                    infoDataObj.total_order = proxy.utils.moneyFormat(res.data.total_order, 0);
                })
                .catch(() => {});
            getRefundAndAfterSale()
                .then((res) => {
                    // fbt仅退款:待审核
                    infoDataObj.FBT_order_only_refund_await_check = parseInt(proxy.utils.moneyFormat(res.data.FBT_order_only_refund_await_check, 0));
                    // fbm仅退款:待审核
                    infoDataObj.FBM_order_only_refund_await_check = parseInt(proxy.utils.moneyFormat(res.data.FBM_order_only_refund_await_check, 0));
                    // fbm仅退款:待退款
                    infoDataObj.FBM_order_only_refund_await_refund = parseInt(proxy.utils.moneyFormat(res.data.FBM_order_only_refund_await_refund, 0));
                    // fbt仅退款:待退款
                    infoDataObj.FBT_order_only_refund_await_refund = parseInt(proxy.utils.moneyFormat(res.data.FBT_order_only_refund_await_refund, 0));
                    // fbm退/货款:待审核
                    infoDataObj.FBM_order_refund_goods_await_check = parseInt(proxy.utils.moneyFormat(res.data.FBM_order_refund_goods_await_check, 0));
                    // fbt退/货款:待审核
                    infoDataObj.FBT_order_refund_goods_await_check = parseInt(proxy.utils.moneyFormat(res.data.FBT_order_refund_goods_await_check, 0));
                    // fbt退/货款:待退款
                    infoDataObj.FBT_order_refund_goods_await_refund = proxy.utils.moneyFormat(res.data.FBT_order_refund_goods_await_refund, 0);
                    // fbm退/货款:待退款
                    infoDataObj.FBM_order_refund_goods_await_refund = proxy.utils.moneyFormat(res.data.FBM_order_refund_goods_await_refund, 0);
                    // fbm售后单总数
                    infoDataObj.FBM_order_refund_total = proxy.utils.moneyFormat(res.data.FBM_order_refund_total, 0);
                    // fbt售后单总数
                    infoDataObj.FBT_order_refund_total = proxy.utils.moneyFormat(res.data.FBT_order_refund_total, 0);
                    // 售后单总数
                    infoDataObj.order_refund_total = proxy.utils.moneyFormat(res.data.order_refund_total, 0);
                    // 待处理售后单总数
                    infoDataObj.order_refund_await_deal = proxy.utils.moneyFormat(res.data.order_refund_await_deal, 0);
                })
                .catch(() => {});
            getGoodsNum()
                .then((res) => {
                    // 总商品数量
                    infoDataObj.total_count = proxy.utils.moneyFormat(res.data.total_count, 0);
                    // 待审核商品数量
                    infoDataObj.total_await_check = proxy.utils.moneyFormat(res.data.total_await_check, 0);
                })
                .catch(() => {});
        };
        // 初始化数据
        const initData = () => {
            getListPage();
        };
        initData();
        return {
            infoDataObj
        };
    }
};
</script>

<style lang="scss" scoped>
.home-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: #ffffff;
    padding: 10px 20px;
}
.fs-36 {
    font-size: 36px;
}
</style>
