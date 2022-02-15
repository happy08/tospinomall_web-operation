<template>
    <BmDialog v-model:visible="visible" :title="$t('orderQuery.printShoppingList')" :confirm="handlePrint" :confirmText="$t('print')" :cancel="handleCancel" width="900px">
        <div class="flex center">
            <div id="printTable">
                <div class="fw fs-22 flex between p-40" style="width:80%">
                    <div>TospinoMall</div>
                    <div>{{ $t("orderQuery.shoppingList") }}</div>
                    <div></div>
                </div>
                <div style="width:800px">
                    <div class="flex between">
                        <div class="mb-20" style="width:400px">
                            <!-- 收件人 -->
                            <div class="flex mb-20">
                                <div style="width:100px">{{ $t("orderQuery.receiverName") }}:</div>
                                <div>
                                    {{ form.receiverName }}
                                </div>
                            </div>
                            <!-- 电话 -->
                            <div class="flex">
                                <div style="width:100px">{{ $t("orderQuery.receiverPhone") }}:</div>
                                <div>
                                    {{ form.receiverPhone }}
                                </div>
                            </div>
                        </div>
                        <!-- 销售订单号 -->
                        <div style="width:43%">
                            <div>{{ $t("orderQuery.orderSn") }}:</div>
                            <div><img id="orderCode" /></div>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="mb-20" style="width:400px">
                            <!-- 地址 -->
                            <div class="flex mb-20">
                                <div style="width:100px">{{ $t("orderQuery.address") }}:</div>
                                <div>{{ form.receiverCountry }}{{ form.receiverProvince }}{{ form.receiverCity }}{{ form.receiverRegion }}{{ form.receiverDetailAddress }}</div>
                            </div>
                            <!-- 订单类型 -->
                            <div class="flex">
                                <div style="width:100px">{{ $t("orderQuery.orderType") }}:</div>
                                <div>
                                    {{ $t("orderQuery.salesOutOfTheWarehouse") }}
                                </div>
                            </div>
                        </div>
                        <!-- 出库单号 -->
                        <div>
                            <div></div>
                            <div><img /></div>
                        </div>
                    </div>
                    <div class="flex between">
                        <div class="mb-20" style="width:400px">
                            <!-- 下单时间 -->
                            <div class="flex mb-20">
                                <div style="width:100px">{{ $t("orderQuery.createOrderTime") }}:</div>
                                <div>
                                    {{ form.createTime }}
                                </div>
                            </div>
                            <!-- 买家备注 -->
                            <div class="flex">
                                <div style="width:100px">{{ $t("orderQuery.note") }}:</div>
                                <div>
                                    {{ form.note }}
                                </div>
                            </div>
                        </div>
                        <!-- 快递单号 -->
                        <div style="width:43%">
                            <div>{{ $t("orderQuery.deliverySn") }}:</div>
                            <div><img id="expressCode" /></div>
                        </div>
                    </div>
                </div>
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
                        <!-- 商品信息 -->
                        <td>{{ $t("orderQuery.goodName") }}</td>
                        <!-- 属性 -->
                        <td>{{ $t("orderQuery.goodAttr") }}</td>
                        <!-- FNSKU -->
                        <td>{{ $t("platform.skuFnsku") }}</td>
                        <!-- 数量 -->
                        <td>{{ $t("platform.returnQuantity") }}</td>
                        <!-- 单价 -->
                        <td>{{ $t("orderQuery.goodPrice") }}</td>
                        <!-- 总价 -->
                        <td>{{ $t("platform.totalPrice") }}</td>
                    </tr>
                    <!-- 数据值 -->
                    <tr v-for="(item, index) in form.items" :key="item.id">
                        <!-- 编号 -->
                        <td>{{ index + 1 }}</td>
                        <!-- 商品信息 -->
                        <td>{{ item.goodName }}</td>
                        <!-- 属性 -->
                        <td>{{ item.goodAttr }}</td>
                        <!-- FNSKU -->
                        <td>{{ item.skuFnsku }}</td>
                        <!-- 数量 -->
                        <td>{{ item.goodQuantity }}</td>
                        <!-- 单价 -->
                        <td>{{ item.goodPrice }}</td>
                        <!-- 总价 -->
                        <td>{{ item.goodQuantity * item.goodPrice }}</td>
                    </tr>
                </table>

                <!-- 退货服务承诺 -->
                <div class="mt-30" v-if="form.servicePromises.length">
                    <div>{{ $t("orderQuery.returnServiceCommitment") }}:</div>
                    <div class="pl-30 mt-20" v-for="(item, index) in form.servicePromises" :key="index">
                        {{ item.title }}
                    </div>
                </div>
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
    emits: ["update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        form.value = props.row.order;
        // 服务承诺(0不支持 1支持)
        form.value.servicePromises = props.row.servicePromises.filter((item) => {
            return item.isRequired > 0;
        });
        dict.value.onlineOffline.forEach((item) => {
            if (item.value == form.value.paymentType) {
                form.value.paymentTypeName = item.name;
                console.log("form.value.paymentTypeName", form.value.paymentTypeName);
            }
        });
        onMounted(() => {
            // 销售订单号
            let orderSn = form.value.orderSn;
            // 快递单号
            let deliverySn = form.value.deliverySn;
            JsBarcode;
            nextTick(() => {
                const printObj = {
                    format: "CODE39",
                    lineColor: "#000",
                    background: "#fff",
                    width: 1,
                    height: 30,
                    fontSize: 16,
                    displayValue: true
                };
                if (deliverySn) {
                    JsBarcode(document.getElementById("expressCode"), deliverySn, printObj);
                }
                if (orderSn) {
                    JsBarcode(document.getElementById("orderCode"), orderSn, printObj);
                }
            });
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
    // width: 800px;
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
