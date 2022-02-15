<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600" :showFooter="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 查看视窗区域 -->
            <div v-if="form.type == 'look'">
                <!-- 费用类型 -->
                <el-form-item :label="$t('rewardPunishmentManagement.rewardType')" prop="rewardType">
                    <el-radio-group v-model="form.rewardType" disabled>
                        <el-radio :label="1">{{ $t("rewardPunishmentManagement.supplement") }}</el-radio>
                        <el-radio :label="2">{{ $t("rewardPunishmentManagement.deduction") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 金额 -->
                <el-form-item :label="$t('rewardPunishmentManagementTable.amount')" prop="amount">
                    <span>{{ form.amount }}</span>
                </el-form-item>
                <!-- 选择卖家 -->
                <el-form-item :label="$t('rewardPunishmentManagement.sellerId')" prop="sellerId">
                    <span>{{ form.storeName }}</span>
                </el-form-item>
                <!-- 关联订单 -->
                <el-form-item :label="$t('rewardPunishmentManagement.associatedOrder')" prop="associatedOrder">
                    <span>{{ form.associatedOrder }}</span>
                </el-form-item>
                <!-- 关联售后单 -->
                <el-form-item :label="$t('rewardPunishmentManagement.associatedReturnOrder')" prop="associatedReturnOrder">
                    <span>{{ form.associatedReturnOrder }}</span>
                </el-form-item>
                <!-- 关联提现单 -->
                <el-form-item :label="$t('rewardPunishmentManagement.associatedWithdrawOrder')" prop="associatedWithdrawOrder">
                    <span>{{ form.associatedWithdrawOrder }}</span>
                </el-form-item>

                <!-- 凭证上传 -->
                <el-form-item :label="$t('rewardPunishmentManagement.voucherPic')" prop="voucherPic">
                    <span v-for="(item, index) in form.voucherPic" :key="index">
                        <BmImage :src="item" :preview-src-list="form.voucherPic" style="width:50px;height:50px" class="m-5" />
                    </span>
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('rewardPunishmentManagementTable.remark')" prop="remark">
                    <span>{{ form.remark }}</span>
                </el-form-item>
            </div>
            <!-- 审核详情视窗区域 -->
            <div v-else>
                <!-- 驳回原因 -->
                <el-form-item :label="$t('withdrawalManagement.reason')" prop="approvalReason">
                    <span>{{ form.approvalReason }}</span>
                </el-form-item>
                <!-- 凭证 -->
                <el-form-item :label="$t('rewardPunishmentManagement.voucher')" prop="approvalPic">
                    <span v-for="(item, index) in form.approvalPic" :key="index">
                        <BmImage :src="item" :preview-src-list="form.approvalPic" style="width:50px;height:50px" class="m-5" />
                    </span>
                </el-form-item>
            </div>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
export default {
    name: "AttributeLook",
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
                if (form.value.type == "look") {
                    form.value.associatedOrder = form.value.associatedNo2["1"];
                    form.value.associatedReturnOrder = form.value.associatedNo2["2"];
                    form.value.associatedWithdrawOrder = form.value.associatedNo2["3"];
                    title.value = proxy.$t("rewardPunishmentManagement.lookRewardDetail");
                } else {
                    title.value = proxy.$t("rewardPunishmentManagement.auditDetail");
                }
            }
        );
        let title = ref("");
        const formRef = ref(null);
        const confirm = () => {};
        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            form,
            formRef,
            confirm,
            cancel,
            title
        };
    }
};
</script>
