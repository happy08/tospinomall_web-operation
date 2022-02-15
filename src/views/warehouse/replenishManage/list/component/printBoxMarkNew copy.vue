<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.print')" :confirm="handlePrint" :confirmText="$t('print')" :cancel="handleCancel" width="1300px" top="5vh">
        <div id="printTable" class="print" style="width:900px">
            <!-- -->
            <div v-for="(item, index) in form.deliveryBoxnum" :key="index" style="height:1400px">
                <!-- 纸箱编号 -->
                <div class="flex between vcenter" style="border-bottom: solid 4px #000000;">
                    <div class="flex center">
                        <span class="mr-10" style="font-size:50px">FBT</span>
                        <img v-if="form.boxType == 1" class="mix-norm" src="@/assets/img/mix.png" style="width:90px;height:90px" />
                        <img v-else class="mix-norm" src="@/assets/img/norm.png" style="width:90px;height:90px" />
                    </div>
                    <div>{{ $t("warehouse.BOXNO") }} {{ index + 1 }} {{ $t("warehouse.totaleNo", { num: form.deliveryBoxnum }) }} - {{ $t("warehouse.GW") }}{{ form.boxWeight }}KG</div>
                </div>
                <div>SHIP TO：</div>
                <div style="font-size:32px">
                    {{ form.receiveWareAddress }}
                </div>
                <div>SHIP FROM：</div>
                <div style="font-size:32px">
                    {{ form.deliveryAddress }}
                </div>

                <!-- 创建时间 -->
                <div class="create-time mtb-10">
                    <div style="position: relative;z-index:1;font-size:40px" class="p-5">FBT（{{ form.createTime }}）UTC 0</div>
                    <div class="after-border"></div>
                </div>
                <div class="flex2 mb-20" style="position: relative;">
                    <!-- 装箱码 -->
                    <div class="print-boxCode">
                        <svg :id="'BoxCode' + index"></svg>
                        <div class="mb-10 tc">{{ form.boxCode }}</div>
                    </div>
                    <!-- 供货单号 -->
                    <div class="print-order">
                        <svg :id="'OrderNo' + index"></svg>
                        <div class="mb-10 tc">{{ form.OrderNo }}</div>
                    </div>
                </div>

                <!-- 单SKU、混装 -->
                <div>{{ form.boxType == 1 ? $t("warehouse.mixedSKUs") : $t("warehouse.singleSKU") }}</div>
                <div v-if="form.boxType == 0">FNSKU：{{ form.fnsku }}</div>
                <!-- 净重 -->
                <div>{{ $t("warehouse.NW") }}：{{ netWeight.toFixed(2) }}KG</div>
                <!-- 箱规 -->
                <div>{{ $t("warehouse.MEAS") }}：{{ form.boxLong }}*{{ form.boxWide }}*{{ form.boxHigh }} CM</div>
                <!-- 箱体积 -->
                <div>{{ $t("warehouse.CBM") }}：{{ ((form.boxLong * form.boxWide * form.boxHigh) / 1000000).toFixed(4) }} CBM</div>
                <!-- 数量/单箱 -->
                <div>{{ $t("warehouse.QTYOrCTN") }}：{{ form.backProductBoxItems[0].waperBoxnum }} PCS</div>
            </div>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed, onMounted, nextTick } from "vue";
import JsBarcode from "jsbarcode";
import { DirPrint, Print } from "@/components/print/print";
export default {
    name: "printBoxMarkNew",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const dict = inject("dict"); //数据字典
        let form = ref({});
        form.value = props.row;

        // 净重1
        let netWeight = ref(0);
        // 需要提前计算净重
        form.value.backProductBoxItems.forEach((item) => {
            netWeight.value += item.weight * item.waperBoxnum;
        });
        onMounted(() => {
            nextTick(() => {
                let printObj = {
                    format: "CODE128", //CODE128//CODE39
                    lineColor: "#000",
                    background: "#fff",
                    width: 2,
                    height: 100,
                    displayValue: false //是否在条形码下方显示文字
                };
                // 供货单号
                let OrderNo = form.value.backProductBoxItems[0].backSn;
                if (OrderNo) {
                    form.value.OrderNo = OrderNo;
                    printObj.width = 3.5;
                    printObj.height = 130;
                    debugger;
                    for (let index = 0; index < form.value.deliveryBoxnum; index++) {
                        JsBarcode(document.getElementById("OrderNo" + index), OrderNo, printObj);
                    }
                }
                // 标准装才有tsin和fnsku
                if (form.value.boxType == 0) {
                    // tsin
                    // let tsin = form.value.backProductBoxItems[0].backProductSkuVo.tsin;
                    // JsBarcode(document.getElementById("tsincode"), tsin, printObj);
                    // fnsku
                    let fnsku = form.value.backProductBoxItems[0].backProductSkuVo.fnsku;
                    if (fnsku) {
                        form.value.fnsku = fnsku;
                        //JsBarcode(document.getElementById("skucode"), fnsku, printObj);
                    }
                }
                // 装箱码
                let boxCode = form.value.boxCode;
                if (boxCode) {
                    printObj.width = 2.5;
                    printObj.height = 250;
                    for (let index = 0; index < form.value.deliveryBoxnum; index++) {
                        JsBarcode(document.getElementById("BoxCode" + index), boxCode, printObj);
                    }
                    // JsBarcode(document.getElementsByClassName("BoxCode"), boxCode, printObj);
                }
            });
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
            handlePrint,
            netWeight
        };
    }
};
</script>
<style lang="scss" scoped>
.print {
    color: #000000;
    font-size: 35px;
    line-height: 1.4;
    min-height: 1300px;
    .create-time {
        position: relative;
        color: #ffffff;
        .after-border {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            content: "";
            border-bottom: solid 70px #000000;
            z-index: 0;
        }
    }
}
.print-boxCode {
    width: 600px;
    border-bottom: solid 10px #000000;
    line-height: 1;
}
.print-order {
    position: absolute;
    width: 600px;
    top: 200px;
    right: -200px;
    transform: rotate(90deg);
    line-height: 1;
}
img {
    max-width: 100%;
}
.bg-code {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
