<template>
    <BmDialog v-model:visible="visible" :title="$t('platform.printReturnOrder')" :confirm="handlePrint" :confirmText="$t('print')" :cancel="handleCancel" width="70wx">
        <div class="flex center">
            <div id="printTable">
                <!-- 退货单详情 -->
                <table class="mb-50">
                    <caption class="mb-20 fs-16 fw">
                        {{
                            $t("platform.returnOrderDetails")
                        }}
                    </caption>
                    <tr>
                        <!-- 退单号 -->
                        <td>{{ $t("platform.returnSn") }}</td>
                        <td>{{ form.returnSn }}</td>
                        <!-- 退单日期 -->
                        <td>{{ $t("platform.refundTime") }}</td>
                        <td>{{ form.refundTime }}</td>
                    </tr>
                    <tr>
                        <!-- 关联订单号 -->
                        <td>{{ $t("platform.orderSn") }}</td>
                        <td>{{ form.orderSn }}</td>
                        <!-- 下单日期 -->
                        <td>{{ $t("platform.createTime") }}</td>
                        <td>{{ form.createTime }}</td>
                    </tr>
                    <tr>
                        <!-- 会员账户 -->
                        <td>{{ $t("platform.buyerId") }}</td>
                        <td>{{ form.buyerId }}</td>
                        <!-- 支付方式 -->
                        <td>{{ $t("platform.paymentType") }}</td>
                        <td>{{ form.paymentTypeName }}</td>
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
                    <tr>
                        <!-- 编号 -->
                        <td>1</td>
                        <!-- 商品名称/编号 -->
                        <td>{{ form.productNo }}</td>
                        <!-- FNSKU -->
                        <td>{{ form.skuFnsku }}</td>
                        <!-- 商品分类 -->
                        <td></td>
                        <!-- 商品属性 -->
                        <td>{{ form.productAttr }}</td>
                        <!-- 数量 -->
                        <td>{{ form.returnQuantity }}</td>
                        <!-- 原价 -->
                        <td></td>
                        <!-- 售价 -->
                        <td></td>
                        <!-- 总价 -->
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed, onMounted, nextTick } from "vue";
import { editOauthLogin } from "@/api/base";
import JsBarcode from "jsbarcode";
import { DirPrint, Print } from "@/components/print/print";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        form.value = props.row;
        dict.value.onlineOffline.forEach((item) => {
            if (item.value == form.value.paymentType) {
                form.value.paymentTypeName = item.name;
            }
        });
        onMounted(() => {
            // let str =
            //     form.value.backProductBoxList[0].backProductBoxItems[0]
            //         .backProductSkuVo.skuCode
            // JsBarcode
            // nextTick(() => {
            //     JsBarcode(document.getElementById('skucode'), str, {
            //         format: 'CODE39',
            //         lineColor: '#000',
            //         background: '#fff',
            //         width: 1,
            //         height: 40,
            //         fontSize: 20,
            //         displayValue: true,
            //     })
            // })
        });
        watch(
            () => props.row,
            (nVal) => {}
        );
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
