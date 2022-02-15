<template>
    <BmDialog v-model:visible="visible" :title="$t('platform.printReturnOrder')" :confirm="handlePrint" :confirmText="$t('print')" :cancel="handleCancel" width="860px">
        <div class="flex center">
            <div id="printTable">
                <!-- 订单详情 -->
                <table class="mb-50">
                    <caption class="mb-20 fs-16 fw">
                        {{
                            $t("orderQuery.orderDetail")
                        }}
                    </caption>
                    <tr>
                        <!-- 订单号 -->
                        <td>{{ $t("orderQuery.basicOrderSn") }}</td>
                        <td>{{ form.orderSn }}</td>
                        <!-- 下单日期 -->
                        <td>{{ $t("orderQuery.createTime") }}</td>
                        <td>{{ form.createTime }}</td>
                    </tr>
                    <tr>
                        <!-- 会员账户 -->
                        <td>{{ $t("orderQuery.buyerAccount") }}</td>
                        <td>{{ form.buyerAccount }}</td>
                        <!-- 支付方式 -->
                        <td>{{ $t("platform.paymentType") }}</td>
                        <td>{{ form.payTypeName }}</td>
                    </tr>
                    <tr>
                        <!-- 收货人 -->
                        <td>{{ $t("platform.receiverName") }}</td>
                        <td>{{ form.receiverName }}</td>
                        <!-- 手机号 -->
                        <td>{{ $t("platform.receiverPhone") }}</td>
                        <td>{{ form.receiverPhone }}</td>
                    </tr>
                    <tr>
                        <!-- 收货地址 -->
                        <td>{{ $t("platform.shippingAddress") }}</td>
                        <td colspan="3">{{ form.receiverCountry }}{{ form.receiverProvince }}{{ form.receiverCity }}{{ form.receiverRegion }}{{ form.receiverDetailAddress }}</td>
                    </tr>
                </table>

                <!-- 商品详情 -->
                <table>
                    <caption class="mb-20 fs-16 fw">
                        {{
                            $t("platform.goodsDetail")
                        }}
                    </caption>
                    <!-- 标题列 -->
                    <tr>
                        <!-- 编号 -->
                        <td>{{ $t("platform.serialNumber") }}</td>
                        <!-- 商品名称/编号 -->
                        <td>{{ $t("platform.productNo") }}</td>
                        <!-- FNSKU -->
                        <td>{{ $t("platform.skuFnsku") }}</td>
                        <!-- 商品分类 -->
                        <td>{{ $t("platform.categories") }}</td>
                        <!-- 商品属性 -->
                        <td>{{ $t("platform.productAttr") }}</td>
                        <!-- 数量 -->
                        <td>{{ $t("platform.returnQuantity") }}</td>
                        <!-- 原价 -->
                        <td>{{ $t("platform.originalPrice") }}</td>
                        <!-- 售价 -->
                        <td>{{ $t("platform.sellingPrice") }}</td>
                        <!-- 总价 -->
                        <td>{{ $t("platform.totalPrice") }}</td>
                    </tr>
                    <!-- 数据值 -->
                    <tr v-for="(item, index) in form.items" :key="item.id">
                        <!-- 编号 -->
                        <td>{{ index + 1 }}</td>
                        <!-- 商品名称/编号 -->
                        <td>{{ item.goodName }}</td>
                        <!-- FNSKU -->
                        <td>{{ item.skuFnsku }}</td>
                        <!-- 商品分类 -->
                        <td>{{ item.categoryId }}</td>
                        <!-- 商品属性 -->
                        <td>{{ item.goodAttr }}</td>
                        <!-- 数量 -->
                        <td>{{ item.goodQuantity }}</td>
                        <!-- 原价 -->
                        <td></td>
                        <!-- 售价 -->
                        <td>{{ item.goodPrice }}</td>
                        <!-- 总价 -->
                        <td>{{ item.goodQuantity * item.goodPrice }}</td>
                    </tr>
                </table>

                <!-- table底部 -->
                <div style="width:800px" class="plr-40 mt-30 fs-14">
                    <div class="flex between">
                        <!-- 商品原价总金额 -->
                        <span class="fw"
                            >{{ $t("orderQuery.totalOriginalAmountOfGoods") }}
                            <span class="ml-20" style="font-weight:400">0</span>
                        </span>
                        <!-- 商品折扣总金额 -->
                        <span class="fw">{{ $t("orderQuery.theTotalAmountOfProductDiscounts") }} <span class="ml-20" style="font-weight:400">0</span></span>
                    </div>
                    <!-- 优惠券 -->
                    <div style="text-align:right">
                        <span class="fw">{{ $t("orderQuery.coupon") }} <span class="ml-20" style="font-weight:400">0</span></span>
                    </div>
                    <!-- 运费 -->
                    <div style="text-align:right">
                        <span class="fw">
                            {{ $t("orderQuery.buyerFreightAmount") }}
                            <span class="ml-20" style="font-weight:400">{{ form.buyerFreightAmount }}</span>
                        </span>
                    </div>
                    <!-- 总计 -->
                    <div style="text-align:right">
                        <span class="fw">
                            {{ $t("orderQuery.total") }}
                            <span class="ml-20" style="font-weight:400">{{ form.payAmount }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </BmDialog>
</template>

<script>
import { ref, inject } from "vue";
import { Print } from "@/components/print/print";
export default {
    name: "printOrderDetail",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["update:visible"],
    setup(props, { emit }) {
        const dict = inject("dict"); //数据字典

        let form = ref({});
        form.value = props.row.order;
        console.log("form.value", props.row);
        dict.value.orderDetailPayType.forEach((item) => {
            if (item.value == form.value.payType) {
                form.value.payTypeName = item.name;
            }
        });

        const formRef = ref(null);
        // 取消
        const handleCancel = () => {
            emit("update:visible", false);
        };
        // 打印
        const handlePrint = () => {
            Print({
                id: "printTable" // Dom对象，或者id字符串，不传参数打印整个窗口页面
                // standard:文档类型,
                // extraHead: head上的额外标签,
                //  *       extraCss:额外的css连接,
                //  *       popTitle:标题
            });
        };
        return {
            form,
            formRef,
            dict,
            handleCancel,
            handlePrint
        };
    }
};
</script>
<style lang="scss" scoped>
table,
th,
td {
    border: 1px solid black;
}
table {
    width: 800px;
    text-align: center;
    border-collapse: collapse;
}
th {
    height: 50px;
    line-height: 50px;
    font-weight: 700;
}
table tr:nth-child(4) span:last-child span {
    font-size: 0px;
}
td {
    width: 200px;
    height: 40px;
    line-height: 40px;
}
</style>
