<template>
    <BmDialog v-model:visible="visible" :title="$t('goodsListTable.printBarcode')" :beforeClose="beforeClose" :showFooter="false" :width="1000">
        <!-- FNSKU -->
        <div v-if="form.fnsku" class="tc mb-30">
            <div class="fs-20">FNSKU</div>
            <img id="fnsku" style="max-width: 600px !important;display: block;margin: 0 auto;" />
            <div>
                <el-button @click="handlePrint('fnsku')" type="primary">{{ $t("print") }}</el-button>
            </div>
        </div>

        <!-- TSIN -->
        <div class="tc mb-30">
            <div class="fs-20">TSIN</div>
            <img id="tsin" style="max-width: 600px !important;display: block;margin: 0 auto;" />
            <div>
                <el-button @click="handlePrint('tsin')" type="primary">{{ $t("print") }}</el-button>
            </div>
        </div>

        <!-- 商品编码 -->
        <div v-if="form.goodCode" class="tc">
            <div class="fs-20">{{ $t("releaseGoods.goodsCode") }}</div>
            <img id="goodCode" style="max-width: 600px !important;display: block;margin: 0 auto;" />
            <div>
                <el-button @click="handlePrint('goodCode')" type="primary">{{ $t("print") }}</el-button>
            </div>
        </div>
    </BmDialog>
</template>
<script>
import { ref, reactive, watch, onMounted, nextTick } from "vue";
import JsBarcode from "jsbarcode";
import { Print } from "@/components/print/print";
export default {
    name: "printBarcode",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["update:visible"],
    setup(props, { emit }) {
        let form = ref({});
        form.value = props.row;
        onMounted(() => {
            nextTick(() => {
                // 打印配置对象
                const printOptionObj = {
                    format: "CODE128",
                    lineColor: "#000",
                    background: "#fff",
                    width: 4,
                    height: 70,
                    fontSize: 38,
                    displayValue: true
                };
                if (form.value.goodCode) {
                    let tsin = form.value.tsin;
                    let goodCode = form.value.goodCode;
                    JsBarcode(document.getElementById("tsin"), tsin, printOptionObj);
                    JsBarcode(document.getElementById("goodCode"), goodCode, printOptionObj);
                } else {
                    let fnsku = form.value.fnsku;
                    let tsin = form.value.tsin;
                    JsBarcode(document.getElementById("tsin"), tsin, printOptionObj);
                    JsBarcode(document.getElementById("fnsku"), fnsku, printOptionObj);
                }
                console.log("form", form.value);
            });
        });
        const beforeClose = () => {
            emit("update:visible", false);
        };
        // 打印
        const handlePrint = (id) => {
            Print({
                id: id // Dom对象，或者id字符串，不传参数打印整个窗口页面
                // standard:文档类型,
                // extraHead: head上的额外标签,
                //  *       extraCss:额外的css连接,
                //  *       popTitle:标题
            });
        };
        return {
            form,
            beforeClose,
            handlePrint
        };
    }
};
</script>
