<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.print')" :confirm="handlePrint" :confirmText="$t('print')" :cancel="handleCancel" width="1200px" top="5vh">
        <div style="width:830px">
            <table id="printTable">
                <!-- 标题 :showFooter="false"-->
                <!-- 混装 -->
                <img v-if="form.boxType == 1" class="mix-norm" src="@/assets/img/mix.png" style="width:90px;height:90px" />
                <!-- 标准装 -->
                <img v-else class="mix-norm" src="@/assets/img/norm.png" style="width:90px;height:90px" />
                <tr>
                    <th colspan="4">TospinoMall Shipping Mark</th>
                </tr>
                <!-- 商品名称 -->
                <!-- 标准装才显示sku名称 -->
                <!-- <tr v-if="form.boxType == 0">
                    <td colspan="4">{{ $t("warehouse.Listing") }}</td>
                </tr> -->
                <!-- <tr v-if="form.boxType == 0">
                    <td colspan="4" v-if="form.boxType == 0">
                        <div class="hidden-1" style="width:300px">
                            {{ form.backProductBoxItems[0].goodTitle }}
                        </div>
                    </td>
                    <td colspan="4" v-else>
                        {{ $t("warehouse.mixedGoods") }}
                    </td>
                </tr> -->
                <!-- 供货单 -->
                <tr>
                    <td colspan="4">{{ $t("warehouse.OrderNo") }}</td>
                </tr>
                <tr class="code">
                    <td colspan="4" class="lh-1">
                        <svg id="OrderNo"></svg>
                        <div class="mb-10">{{ form.OrderNo }}</div>
                    </td>
                </tr>
                <!-- TSIN码 -->
                <!-- 标准装才显示TSIN码 -->
                <!-- <tr v-if="form.boxType == 0">
                    <td colspan="4">{{ $t("warehouse.tsinCode") }}</td>
                </tr>
                <tr v-if="form.boxType == 0" class="code">
                    <td colspan="4">
                        <div><svg id="tsincode"></svg></div>
                    </td>
                </tr> -->
                <!-- FNSKU码 -->
                <!-- 标准装才显示FNSKU码 -->
                <tr v-if="form.boxType == 0">
                    <td colspan="4">{{ $t("warehouse.FNSKU") }}</td>
                </tr>
                <tr v-if="form.boxType == 0" class="code">
                    <td colspan="4" class="lh-1">
                        <svg id="skucode"></svg>
                        <div class="mb-10">{{ form.fnsku }}</div>
                    </td>
                    <!-- <td colspan="3" v-show="form.boxType == 1">
                        {{ $t("warehouse.mixedGoods") }}
                    </td> -->
                </tr>
                <!-- 装箱码 -->
                <tr>
                    <td colspan="4">{{ $t("warehouse.CTNBarcode") }}</td>
                </tr>
                <tr class="code">
                    <td colspan="4" class="lh-1">
                        <svg id="boxcode"></svg>
                        <div class="mb-10">{{ form.boxCode }}</div>
                    </td>
                </tr>
                <!-- 规格属性 -->
                <tr>
                    <td>{{ $t("warehouse.Parameters") }}</td>
                    <td v-if="form.boxType == 0">
                        <span class="mr-5" v-for="(item, index) in form.backProductBoxItems[0].backProductSkuVo.skuAttr" :key="index">
                            {{ item }}
                            <span v-if="form.backProductBoxItems[0].backProductSkuVo.skuAttr[index + 1]">/</span>
                        </span>
                    </td>
                    <td v-else>
                        {{ $t("warehouse.mixedGoods") }}
                    </td>
                    <!-- 原产地 -->
                    <td>{{ $t("warehouse.Origin") }}</td>
                    <td>{{ form.storeCountryName }}</td>
                </tr>
                <!-- 商家编号 -->
                <tr>
                    <td>{{ $t("warehouse.VendorNo") }}</td>
                    <td colspan="3">
                        {{ form.storeCode }}
                    </td>
                </tr>
                <!-- 装箱尺寸 -->
                <tr>
                    <td>{{ $t("warehouse.MEAS") }}</td>
                    <td colspan="3">
                        {{ form.boxLong }}*{{ form.boxWide }}*{{ form.boxHigh }}
                        <span>{{ form.boxSizeUnit }}</span>
                    </td>
                </tr>
                <tr>
                    <!-- 总箱数 -->
                    <td>{{ $t("warehouse.CTN") }}</td>
                    <td>{{ form.deliveryBoxnum }}</td>
                    <!-- 单箱数量 -->
                    <td>{{ $t("warehouse.QTYOrCTN") }}</td>
                    <td>
                        <span>{{ waperBoxnum }}</span>
                    </td>
                </tr>
                <tr>
                    <!-- 净重 -->
                    <td>{{ $t("warehouse.NW") }}</td>
                    <!-- 商品包装重量*装箱数量 -->
                    <td>
                        <span>{{ netWeight.toFixed(2) }}</span>
                    </td>
                    <!-- 毛重 -->
                    <td>{{ $t("warehouse.GW") }}</td>
                    <td>
                        {{ form.boxWeight }}
                    </td>
                </tr>
                <tr>
                    <!-- 创建时间 -->
                    <td>{{ $t("warehouse.Time") }}</td>
                    <td colspan="3">{{ form.createTime }}</td>
                </tr>
            </table>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed, onMounted, nextTick } from "vue";
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

        // 净重1
        let netWeight = ref(0);
        let waperBoxnum = ref(0);
        // 需要提前计算净重
        form.value.backProductBoxItems.forEach((item) => {
            netWeight.value += item.weight * item.waperBoxnum;
            waperBoxnum.value += item.waperBoxnum;
        });
        onMounted(() => {
            nextTick(() => {
                let printObj = {
                    format: "CODE128", //CODE128//CODE39
                    lineColor: "#000",
                    background: "#fff",
                    width: 3,
                    height: 90,
                    displayValue: false //是否在条形码下方显示文字
                };
                // 供货单号
                let OrderNo = form.value.backSn;
                if (OrderNo) {
                    form.value.OrderNo = OrderNo;
                    printObj.width = 4;
                    JsBarcode(document.getElementById("OrderNo"), OrderNo, printObj);
                }
                if (form.value.boxType == 0) {
                    // 标准装才有tsin和fnsku
                    // tsin
                    // let tsin = form.value.backProductBoxItems[0].backProductSkuVo.tsin;
                    // JsBarcode(document.getElementById("tsincode"), tsin, printObj);
                    // fnsku
                    let fnsku = form.value.backProductBoxItems[0].backProductSkuVo.fnsku;
                    if (fnsku) {
                        form.value.fnsku = fnsku;
                        printObj.width = 4;
                        JsBarcode(document.getElementById("skucode"), fnsku, printObj);
                    }
                }
                // 装箱码
                let boxCode = form.value.boxCode;
                if (boxCode) {
                    printObj.width = 3;
                    JsBarcode(document.getElementById("boxcode"), boxCode, printObj);
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
            handlePrint,
            netWeight,
            waperBoxnum
        };
    }
};
</script>
<style lang="scss" scoped>
table,
th,
td {
    padding: 8px;
    vertical-align: middle;
    border: 1px solid black;
    font-size: 35px;
    color: #000000;
}
table {
    position: relative;
    text-align: center;
    border-collapse: collapse;
}
.mix-norm {
    position: absolute;
    top: 5px;
    left: 750px;
    margin-left: -40px;
}
td {
    width: 200px;
}
img {
    max-width: 100%;
}
</style>
