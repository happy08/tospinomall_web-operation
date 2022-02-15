<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.printSupplyOrder')" :confirm="handlePrint" :confirmText="$t('print')" :cancel="handleCancel" width="1200px">
        <div class="flex center">
            <table id="printTable">
                <!-- 标题-->
                <tr>
                    <th colspan="15">
                        <div class="tc">
                            <span class="fs-16">{{ $t("warehouse.OrderNo") }}</span>
                            <!-- 供货单条形码 -->
                            <div id="supplyOrderCode" class="fr"></div>
                        </div>
                        <div></div>
                        <!-- 制单日期 -->
                        <div class="fl">
                            <span>{{ $t("warehouse.formDate") }}:</span>
                            <span style="font-weight:400">{{ nowDate }}</span>
                        </div>
                    </th>
                </tr>
                <tr>
                    <!-- 供货单号 -->
                    <td>{{ $t("warehouse.supplyOrder") }}</td>
                    <td colspan="7">{{ form.backSn }}</td>
                    <!-- 入库仓库 -->
                    <td>{{ $t("warehouse.Warehouse") }}</td>
                    <td colspan="6">{{ form.receiveWareAddress }}</td>
                </tr>
                <tr>
                    <!-- 供应商编码 -->
                    <td>{{ $t("warehouse.supplierCode") }}</td>
                    <td colspan="7">
                        {{ form.storeCode }}
                    </td>
                    <!-- 客户合同号 -->
                    <td>{{ $t("warehouse.customerContractNumber") }}</td>
                    <td colspan="6"></td>
                </tr>
                <tr>
                    <!-- 供货状态 -->
                    <td>{{ $t("warehouse.availability") }}</td>
                    <td colspan="7">{{ form.shippingStatusName }}</td>
                    <!-- 发货日期 -->
                    <td>{{ $t("warehouse.deliveryDate") }}</td>
                    <td colspan="6">{{ form.deliverTime }}</td>
                </tr>
                <!-- <tr> -->
                <!-- 审核人 -->
                <!-- <td>{{ $t("warehouse.examiner") }}</td>
                    <td colspan="7">{{ form.examiner }}</td> -->
                <!-- 审核日期 -->
                <!-- <td>{{ $t("warehouse.examineTime") }}</td>
                    <td colspan="6">{{ form.examineTime }}</td> -->
                <!-- </tr> -->
                <tr>
                    <!-- 装箱类型 -->
                    <td style="width:80px">{{ $t("warehouse.packingType") }}</td>
                    <!-- 批次号 -->
                    <td>{{ $t("warehouse.batchNo") }}</td>
                    <!-- 商品名称 -->
                    <!-- <td colspan="4">{{ $t("warehouse.goodTitle") }}</td> -->
                    <!-- 单位 -->
                    <td>{{ $t("warehouse.goodUnit") }}</td>
                    <!-- 供货箱数 -->
                    <td>{{ $t("warehouse.waperBoxnum") }}</td>
                    <!-- 供货数量 -->
                    <td>{{ $t("warehouse.backNum") }}</td>
                    <!-- 装箱码 -->
                    <td colspan="4">{{ $t("warehouse.packingCode") }}</td>
                    <!-- 国际码 -->
                    <td colspan="3">{{ $t("warehouse.internationalCode") }}</td>
                    <!-- FNSKU -->
                    <td colspan="3">{{ $t("warehouse.skuCode") }}</td>
                </tr>
                <tr v-for="(item, index) in form.backProductBoxList" :key="item.id">
                    <td colspan="15" class="p-0">
                        <table class="inTable">
                            <tr v-for="(bitem, bindex) in item.backProductBoxItems" :key="bindex">
                                <!-- 装箱类型 -->
                                <td v-if="bindex == 0" :rowspan="item.backProductBoxItems.length" class="border-bootm-white">
                                    <span v-if="item.boxType == 1">
                                        {{ $t("warehouse.Mixed") }}
                                    </span>
                                    <span v-else>
                                        {{ $t("warehouse.norm") }}
                                    </span>
                                </td>
                                <!-- 批次号 -->
                                <td class="border-bootm-white">{{ bitem.batchNo }}</td>
                                <!-- 商品名称 -->
                                <!-- <td class="border-bootm-white" colspan="4" style="text-align:left">{{ bitem.goodTitle }}</td> -->
                                <!-- 单位 -->
                                <td class="border-bootm-white">PCS</td>
                                <!-- 供货箱数 -->
                                <td class="border-bootm-white">
                                    {{ Math.ceil(bitem.backNum / bitem.waperBoxnum) }}
                                </td>
                                <!-- 供货数量 -->
                                <td class="border-bootm-white">{{ bitem.backNum }}</td>
                                <!-- 装箱码 -->
                                <td class="border-bootm-white tl" style="height:85px;vertical-align:middle" colspan="4" :rowspan="item.backProductBoxItems.length" v-if="bindex == 0">
                                    <!-- <div style="word-break:break-all ">{{ item.boxCode }}</div>-->
                                    <img v-if="item.boxCode" :id="'boxcode' + index" />
                                    <!-- {{ form.backProductBoxList.length }} -->
                                </td>
                                <!-- 国际码 -->
                                <td class="border-bootm-white" style="height:85px" colspan="3">
                                    <img v-if="bitem.backProductSkuVo.internationalCode" :id="'internationalCode' + index + bindex" />
                                    <!-- {{ item.backProductSkuVo.internationalCode }} -->
                                </td>
                                <!-- FNSKU -->
                                <td class="border-bootm-white" colspan="3" style="height:85px">
                                    <img v-if="bitem.backProductSkuVo.fnsku" :id="'fnsku' + index + bindex" />
                                    <!-- {{ item.backProductSkuVo.skuCode }} -->
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- 小计 -->
                <tr class="fw">
                    <td>{{ $t("warehouse.subtotal") }}</td>
                    <td colspan="2"></td>
                    <!-- 供货箱数合计 -->
                    <td>
                        {{ form.totalBoxnum }}
                    </td>
                    <!-- 供货数量合计 -->
                    <td>{{ backNumCount }}</td>
                    <td colspan="10"></td>
                </tr>
            </table>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed, onMounted, nextTick } from "vue";
import JsBarcode from "jsbarcode";
import { Print } from "@/components/print/print";
export default {
    name: "printSupplyOrder",
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
        for (let i in dict.value.shippingStatus) {
            if (dict.value.shippingStatus[i].value === form.value.status) {
                form.value.shippingStatusName = dict.value.shippingStatus[i].name;
                break;
            }
        }
        // 当前日期
        const nowDate = proxy.utils.formatStandardDate(new Date(), true);
        // 供货数量合计
        let backNumCount = ref(0);
        onMounted(() => {
            nextTick(() => {
                backNumCount.value = 0;
                // 打印配置对象
                const printOptionObj = {
                    format: "CODE39",
                    lineColor: "#000",
                    background: "#fff",
                    width: 1,
                    height: 50,
                    fontSize: 30,
                    displayValue: true
                };
                // 装箱码
                // 标准装
                form.value.backProductBoxList.forEach((item, index) => {
                    if (item.boxCode) {
                        let boxcode = item.boxCode;
                        JsBarcode(document.getElementById("boxcode" + index), boxcode, printOptionObj);
                    }
                    item.backProductBoxItems.forEach((bitem, bindex) => {
                        // 国际码
                        if (bitem.backProductSkuVo.internationalCode) {
                            let internationalCode = bitem.backProductSkuVo.internationalCode;
                            JsBarcode(document.getElementById("internationalCode" + index + bindex), internationalCode, printOptionObj);
                        }
                        // fnsku
                        if (bitem.backProductSkuVo.fnsku) {
                            let fnsku = bitem.backProductSkuVo.fnsku;
                            JsBarcode(document.getElementById("fnsku" + index + bindex), fnsku, printOptionObj);
                        }
                    });
                    backNumCount.value += item.backNum;
                });
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
            nowDate,
            backNumCount
        };
    }
};
</script>
<style lang="scss" scoped>
table {
    border: 1px solid black;
}
th,
td {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}
table {
    width: 100%;
    text-align: center;
    table-layout: fixed;
    border-collapse: collapse;
}
th {
    line-height: 50px;
    font-weight: 700;
}
table tr:nth-child(4) span:last-child span {
    font-size: 0px;
}

td {
    // height: 40px;
    line-height: 20px;
    padding: 7px;
    vertical-align: middle;
    img {
        width: 100%;
        height: 100%;
    }
}
.inTable {
    border: 0;
    // tr:last-child td {
    //     border-bottom: 0;
    // }
}
</style>
