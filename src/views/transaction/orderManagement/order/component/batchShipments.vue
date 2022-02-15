<template>
    <BmDialog v-model:visible="visible" :title="$t('orderQuery.batchDelivery')" :confirm="confirm" :cancel="cancel" width="1300px">
        <!-- <el-dialog :title="$t('orderQuery.batchDelivery')" v-model="dialogFormVisible" width="70%"> -->
        <BmAlert>
            <div>
                <!-- 发货警示 -->
                {{ $t("orderQuery.TheDeliveryWarning") }}
            </div>
            <div class="ml-25">{{ $t("orderQuery.warningOne") }}</div>
            <div class="ml-25">{{ $t("orderQuery.warningTwo") }}</div>
        </BmAlert>

        <BmAlert type="primary" class="mt-15">
            {{ $t("orderQuery.warningThree") }}
        </BmAlert>
        <div class="mb-10">
            <el-radio-group v-model="batchForm.expressType">
                <!-- 在线下单 -->
                <!-- <el-radio-button label="0">{{ $t("orderQuery.TheOnlineOrder") }}</el-radio-button> -->
                <!-- 自己联系物流 -->
                <!-- <el-radio-button label="1">{{ $t("orderQuery.ContactLogisticsByYourself") }}</el-radio-button> -->
            </el-radio-group>
        </div>
        <el-form :model="batchForm" ref="expressRef" class="mb-25" label-width="auto">
            <!-- 发货方式 -->
            <el-form-item v-if="batchForm.expressType == 1" :label="$t('orderQuery.deliveryMethod')">
                <!-- 物流发货 -->
                <el-radio v-model="batchForm.express" label="1">{{ $t("orderQuery.LogisticsDelivery") }}</el-radio>
            </el-form-item>
            <!-- 选择快递 -->
            <el-form-item v-if="batchForm.expressType == 1" :label="$t('orderQuery.ChooseExpress')">
                <!-- 请选择快递公司 -->
                <el-select v-model="batchForm.deliveryCompany" :placeholder="$t('orderQuery.PleaseChooseTheExpressCompany')" style="width: 543px;height: 32px;">
                    <el-option label="Tospino" value="1"></el-option>
                </el-select>
            </el-form-item>
            <!-- 发货地址 -->
            <el-form-item :label="$t('orderQuery.shipAddress')">
                <div class="flex vcenter">
                    <!-- 请选择快递公司 -->
                    <el-cascader v-model="batchForm.sendAddressId" :props="areaProps" style="width: 50%"></el-cascader>
                    <!-- <el-select v-model="batchForm.sendAddressId" :placeholder="$t('orderQuery.PleaseChooseTheExpressCompany')" style="width: 543px;">
                        <el-option v-for="(item, i) in sendfAddressList" :key="i" :label="item.address" :value="item.id"></el-option>
                    </el-select> -->
                </div>
            </el-form-item>
            <!-- 退货地址 -->
            <el-form-item :label="$t('orderQuery.returnAddress')">
                <div class="flex vcenter">
                    <el-cascader v-model="batchForm.returnAddressId" :props="areaProps" style="width: 50%"></el-cascader>
                    <!-- <el-select v-model="batchForm.returnAddressId" :placeholder="$t('orderQuery.PleaseChooseTheExpressCompany')" style="width: 543px;">
                        <el-option v-for="(item, i) in refundAddressList" :key="i" :label="item.address" :value="item.id"></el-option>
                    </el-select> -->
                    <div class="ml-25">
                        <el-popover placement="top-start" title="" trigger="hover" :content="$t('orderQuery.returnGoodTips')">
                            <template #reference>
                                <div class="cp green">{{ $t("orderQuery.returnGoodInstructions") }}</div>
                            </template>
                        </el-popover>
                    </div>
                </div>
            </el-form-item>

            <div class="mb-10 fw fs-14">
                <!-- 快递单 -->
                {{ $t("orderQuery.expressWaybill") }}
            </div>

            <el-table :data="batchForm.deliveryItems" height="250" border>
                <!-- 待发货 -->
                <el-table-column prop="orderSn" :label="$t('orderQuery.orderSn')" min-width="180"> </el-table-column>
                <!-- 发货 -->
                <el-table-column prop="status" :label="$t('orderQuery.orderStatus')" width="180">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? $t("orderQuery.waitForDelivery") : "" }}
                    </template>
                </el-table-column>
                <!-- 收货人 -->
                <el-table-column prop="receiverName" :label="$t('orderQuery.consignee')" width="180"> </el-table-column>
                <!-- 手机 -->
                <el-table-column prop="receiverPhone" :label="$t('orderQuery.phone')" width="180"> </el-table-column>
                <!-- 地区 -->
                <el-table-column prop="receiverCompleteAddress" :label="$t('orderQuery.region')" min-width="200"> </el-table-column>
                <!-- 快递单号 -->
                <el-table-column prop="deliverySn" :label="$t('orderQuery.trackingNumber')" width="180">
                    <template #default="scope">
                        <el-form-item v-if="batchForm.expressType == 0" :prop="`deliveryItems.${scope.$index}.deliverySn`" class="m-0">
                            <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="scope.row.deliverySn" key="deliverySn" :disabled="batchForm.expressType == 0" class="m-0" />
                        </el-form-item>
                        <el-form-item v-if="batchForm.expressType == 1" :prop="`deliveryItems.${scope.$index}.deliverySn`" :rules="rulesCommon.required">
                            <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="scope.row.deliverySn" key="deliverySn" :disabled="batchForm.expressType == 0" />
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { omsorderSellerBatchDelivery } from "@/api/goods";
import { basicsAreaFindByParentId } from "@/api/base";
export default {
    name: "batchShipments",
    components: {},
    props: {
        visible: Boolean,
        rows: Array
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        // 批量发货表单
        let batchForm = reactive({
            expressType: "1", // 发货类型
            express: "1", //发货方式
            sendAddressId: "", // 发货地址id
            deliveryCompany: "Tospino", // 物流公司名称
            deliveryCompanyType: "1", // 物流公司id
            returnAddressId: "", // 退货地址id
            deliveryItems: []
        });

        watch(
            () => props.rows,
            (nVal) => {
                batchForm.deliveryItems = nVal;
            }
        );

        // 发货地址级联选择框配置选项
        const areaProps = reactive({
            lazy: true,
            lazyLoad(node, resolve) {
                const { level, data } = node;
                basicsAreaFindByParentId({ parentId: data.id || 0 })
                    .then((res) => {
                        const nodes = res.data.map((item) => ({
                            id: item.id,
                            value: item.code,
                            label: item.name,
                            leaf: item.hasChild !== 1
                        }));
                        resolve(nodes);
                    })
                    .catch((err) => {});
            }
        });

        // 快递单号校验
        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" }
        });

        // 提交批量发货
        let expressRef = ref(null);
        const confirm = () => {
            expressRef.value.validate((valid) => {
                if (valid) {
                    // batchForm.deliveryItems = [];
                    // tableData_2.form.forEach((v) => {
                    //     batchForm.deliveryItems.push({
                    //         deliverySn: v.deliverySn,
                    //         orderId: v.orderId
                    //     });
                    // });

                    omsorderSellerBatchDelivery(batchForm)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            batchForm.deliveryItems = [];
                            emit("update:visible", false);
                            emit("reloadData");
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };

        // 取消
        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            rulesCommon,
            batchForm,
            expressRef,
            areaProps,
            confirm,
            cancel
        };
    }
};
</script>
<style lang="scss" scoped>
::v-deep(.cell .el-form-item__content) {
    margin-left: 0px !important;
}
</style>
