<template>
    <BmDialog v-model:visible="visible" :title="$t('accountsReceivable.collectionInfoChangeRecord')" :confirm="confirm" :cancel="cancel" :width="600" :showFooter="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <div v-for="(item, index) in form" :key="index" class="mb-30" style="backgroundColor:#FBFCFF">
                <!-- 银行卡 -->
                <div v-if="item.type == 2">
                    <!-- 收款方式 -->
                    <el-form-item :label="$t('accountsReceivable.paymentMethod')" prop="type">
                        <span>{{ item.typeName }}</span>
                    </el-form-item>
                    <!-- 持卡人 -->
                    <el-form-item :label="$t('accountsReceivable.holder')" prop="holder">
                        <span>{{ item.holder }}</span>
                    </el-form-item>
                    <!-- 银行卡号 -->
                    <el-form-item :label="$t('accountsReceivableTable.bankCard')" prop="bankCard">
                        <span>{{ item.holder }}</span>
                    </el-form-item>
                    <!-- 银行预留手机号 -->
                    <el-form-item :label="$t('accountsReceivableTable.bankCard')" prop="bankCard">
                        <span>{{ item.holder }}</span>
                    </el-form-item>
                    <!-- 开户行支行 -->
                    <el-form-item :label="$t('accountsReceivableTable.openingBank')" prop="openingBank">
                        <span>{{ item.openingBank }}</span>
                    </el-form-item>
                    <!-- 开户行支行地址 -->
                    <el-form-item :label="$t('accountsReceivableTable.openingBankLocation')" prop="openingBankLocation">
                        <span>{{ item.openingBankLocation }}</span>
                    </el-form-item>
                    <!-- 开户许可证 -->
                    <el-form-item :label="$t('accountsReceivableTable.licencePic')" prop="openingBankLocation">
                        <!-- <span>{{ $t('accountsReceivableTable.licencePic') }}:</span>
            <span
              v-for="(item, index) in scope.row.licencePicList"
              :key="index"
            >
              <BmImage :src="item" style="width:50px; height:50px" />
            </span> -->
                    </el-form-item>
                    <!-- 使用日期 -->
                    <el-form-item :label="$t('accountsReceivable.useTime')" prop="useTime">
                        <span>{{ item.useStartTime }}</span>
                        <span> ~ </span>
                        <span>{{ item.useEndTime }}</span>
                    </el-form-item>
                </div>
                <!-- Payoneer -->
                <div v-else-if="item.type == 1" class="mb-30" style="backgroundColor:#FBFCFF">
                    <!-- 收款方式 -->
                    <el-form-item :label="$t('accountsReceivable.paymentMethod')" prop="type">
                        <span>{{ item.typeName }}</span>
                    </el-form-item>
                    <!-- 账号状态 -->
                    <el-form-item :label="$t('accountsReceivable.payoneerStatus')" prop="payoneerStatus">
                        <span>{{ item.payoneerStatusName }}</span>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item :label="$t('accountsReceivableTable.payoneerEmail')" prop="payoneerEmail">
                        <span>{{ item.payoneerEmail }}</span>
                    </el-form-item>
                    <!-- 开户人 -->
                    <el-form-item :label="$t('accountsReceivable.holder')" prop="holder">
                        <span>{{ item.holder }}</span>
                    </el-form-item>
                    <!-- 联系方式 -->
                    <el-form-item :label="$t('accountsReceivable.connectMethod')" prop="phone">
                        <span>{{ item.phone }}</span>
                    </el-form-item>
                    <!-- 联系方式 -->
                    <el-form-item :label="$t('accountsReceivable.connectMethod')" prop="phone">
                        <span>{{ item.phone }}</span>
                    </el-form-item>
                    <!-- 最新验证时间 -->
                    <el-form-item :label="$t('accountsReceivable.payoneerProofTime')" prop="payoneerProofTime">
                        <span>{{ item.payoneerProofTime }}</span>
                    </el-form-item>
                    <!-- 使用日期 -->
                    <el-form-item :label="$t('accountsReceivable.useTime')" prop="useTime">
                        <span>{{ item.useStartTime }}</span>
                        <span> ~ </span>
                        <span>{{ item.useEndTime }}</span>
                    </el-form-item>
                </div>
            </div>
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
        //上传图片
        const onChangeUpload = (fileList) => {
            form.imgList = fileList.map((item) => item.url);
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    emit("reloadData");
                    emit("update:visible", false, form.value.type);
                    form.value.resetFields();
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
            //   form.value.resetFields()
        };

        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            onChangeUpload
        };
    }
};
</script>
