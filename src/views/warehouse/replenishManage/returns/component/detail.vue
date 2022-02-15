<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" :width="1000" top="6vh">
        <!-- 卖家地址 -->
        <div class="mb-15 fs-12">
            <span class="red">*</span> {{ $t("warehouse.shipAddress") }}：
            {{ tableData.receiverAddress }}
        </div>
        <BmTable v-if="tableData.backReturnItems" :data="tableData.backReturnItems" :height="480" class="mb-20">
            <BmTableColumn :label="$t('status.status')" width="90">
                <template #default="scope">
                    {{ scope.row.isLaunch == 1 ? $t("status.onSale") : $t("status.notSale") }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('image')" width="70px">
                <template #default="scope">
                    <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('warehouse.info')">
                <template #default="scope">
                    <div :class="scope.row.delFlag ? 'through grey' : ''">
                        <span class="green"> {{ scope.row.goodTitle }}</span>
                        （
                        {{ scope.row.backProductSkuVo.skuAttr && scope.row.backProductSkuVo.skuAttr.join(" / ") }}
                        ）<br />
                        {{ $t("warehouse.sellerSKU") }}：{{ scope.row.backProductSkuVo.skuCode }}
                        <br />
                        TSIN：{{ scope.row.backProductSkuVo.tsin }}<br />
                        FNSKU：{{ scope.row.backProductSkuVo.fnsku }}
                    </div>
                </template>
            </BmTableColumn>

            <BmTableColumn prop="returnNum" :label="$t('returns.returnNum')" width="100"></BmTableColumn>
            <BmTableColumn prop="internationalCode" :label="$t('goodsListTable.internationalCode')" width="150"></BmTableColumn>
        </BmTable>

        <el-row>
            <el-col :span="12">
                <!-- 商家备注 -->
                <div class="flex flex1 mr-30 fs-12">
                    <span> {{ $t("warehouse.businessmenNote") }}：</span>
                    {{ tableData.sellerNote }}
                </div>
            </el-col>
            <el-col :span="12">
                <!-- 平台备注 -->
                <div class="flex flex1 ml-30 fs-12">
                    <span> {{ $t("warehouse.platformNote") }}：</span>
                    {{ tableData.reason }}
                </div>
            </el-col>
        </el-row>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="cancel">{{ $t("cancel") }}</el-button>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, watch } from "vue";
import { returnProductInfo } from "@/api/warehouse";

export default {
    name: "replenishManageAddEdit",
    components: {},
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        //获取列表
        let tableData = ref({
            //id: "",
            mallNote: "",
            receiverAddress: "",
            saveStatus: 0, //保存状态0草稿 1保存并提交审核
            sellerNote: "",
            backReturnItems: []
        });
        watch(
            () => props.row,
            (nVal) => {
                if (nVal.id) {
                    returnProductInfo(nVal.id)
                        .then((res) => {
                            tableData.value = res.data;
                        })
                        .catch((err) => {});
                }
            }
        );

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            tableData,
            cancel
        };
    }
};
</script>
