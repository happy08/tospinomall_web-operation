<template>
    <BmDialog v-model:visible="visible" :title="$t('copingManagement.returnOnly')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 退款单号 -->
            <el-form-item :label="$t('copingManagement.refundNumber')" prop="orderNo">
                <el-input v-model="form.orderNo" disabled="false"></el-input>
            </el-form-item>
            <!-- 支付方式 -->
            <el-form-item :label="$t('copingManagement.paymentMethod')" prop="payMode">
                <el-select v-model="form.payMode">
                    <el-option v-for="item in paymentMethodSelect" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- 应退金额 -->
            <el-form-item :label="$t('copingManagementTable.refundableAmount')" prop="refundableAmount">
                <el-input v-model="form.refundableAmount" disabled="false"></el-input>
            </el-form-item>
            <!-- 交易凭证 -->
            <el-form-item :label="$t('copingManagement.voucherExplain')" prop="voucherExplain">
                <el-input v-model="form.voucherExplain" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 实退金额 -->
            <el-form-item :label="$t('copingManagementTable.actualRefundAmount')" prop="actualRefundAmount">
                <el-input v-model="form.actualRefundAmount" type="number" @blur="differenceAmountChange" :placeholder="$t('copingManagement.pleaseInputActualRefundAmount')"></el-input>
            </el-form-item>
            <!-- 差额 -->
            <el-form-item :label="$t('copingManagement.difference')" prop="differenceAmount">
                <span class="red">{{ differenceAmount }}</span>
            </el-form-item>
            <!-- 凭证上传 -->
            <el-form-item :label="$t('copingManagement.voucherPictrue')" prop="voucherPictrue">
                <BmUpload @change="onChangeUpload($event)" :multiple="true" :limit="8" />
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('copingManagementTable.remarks')" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" maxlength="255" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { financeRefund } from "@/api/finance";

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
        watch(
            () => props.row,
            (nVal) => {
                form.value = props.row;
            }
        );
        const rules = {
            payMode: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            voucherExplain: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            actualRefundAmount: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        // 支付方式slelect数据
        const paymentMethodSelect = [
            {
                value: 1,
                label: proxy.$t("copingManagement.cash")
            },
            {
                value: 2,
                label: "MTN"
            }
        ];
        // 退款差额(应退金额-实退金额)
        let differenceAmount = ref("");
        const differenceAmountChange = () => {
            differenceAmount.value = (form.value.refundableAmount - form.value.actualRefundAmount).toFixed(2);
            if (!differenceAmount.value) {
                differenceAmount.value = "";
            }
        };
        //上传图片
        const onChangeUpload = (fileList) => {
            form.imgList = fileList.map((item) => item.url);
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    // 退款网络请求
                    financeRefund(form.value)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false, form.value.type);
                            formRef.value.resetFields();
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
            formRef.value.resetFields();
        };

        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            onChangeUpload,
            paymentMethodSelect,
            differenceAmount,
            differenceAmountChange
        };
    }
};
</script>
