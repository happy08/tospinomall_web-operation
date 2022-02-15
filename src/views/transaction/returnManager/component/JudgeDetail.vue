<template>
    <BmDialog v-model:visible="visible" :title="$t('orderQuery.SeeDetails')" width="800px" :showFooter="false" :cancel="handelCancel">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 买家问题描述及举证 -->
            <el-form-item :label="$t('workReturn.buyerProblemDescriptionProof')" prop="buyerProof">
                <div class="mb-10">
                    <el-input v-model="form.workDesc" :placeholder="$t('workReturn.questionDescription')" disabled></el-input>
                </div>
                <div class="mb-10 light-grey">
                    {{ $t("workReturn.mustVoucher") }}
                </div>
                <div>
                    <BmImage v-for="(item, index) in form.workMustVoucherImg" :key="index" :src="item" fit="cover" style="width:50px;height:50px" :preview-src-list="[item]" />
                </div>
                <div class="mb-10 light-grey">
                    {{ $t("workReturn.optionVoucher") }}
                </div>
                <BmImage v-for="(item, index) in form.workOptionalVoucherImg" :key="index" :src="item" fit="cover" style="width:50px;height:50px" :preview-src-list="[item]" />
            </el-form-item>
            <!-- 商家举证详情 -->
            <el-form-item :label="$t('workReturn.merchantProofDetails')" prop="sellerProof">
                <div v-for="item in form.sellerReturnWorkAlleges" :key="item.id">
                    <div class="mb-10">
                        <el-input v-model="item.workDesc" :placeholder="$t('workReturn.questionDescription')" disabled></el-input>
                    </div>
                    <div class="mb-10 light-grey">
                        {{ $t("workReturn.mustVoucher") }}
                    </div>
                    <div>
                        <BmImage v-for="(sonItem, index) in item.workMustVoucherImg" :key="index" :src="sonItem" fit="cover" style="width:50px;height:50px" :preview-src-list="[sonItem]" />
                    </div>
                    <div class="mb-10 light-grey">
                        {{ $t("workReturn.optionVoucher") }}
                    </div>
                    <BmImage v-for="(sonItem, index) in item.workOptionalVoucherImg" :key="index" :src="sonItem" fit="cover" style="width:50px;height:50px" :preview-src-list="[sonItem]" />
                </div>
            </el-form-item>
            <!-- 工单判定 -->
            <!-- 责任判定0->均无责任 1->商家责任 2->买家责任 3->工单违规 -->
            <el-form-item :label="$t('workReturn.workOrderJudgment')" prop="responsJudage">
                <el-select v-model="form.responsJudage" disabled>
                    <el-option v-for="item in dict.workOrderLiabilityDetermination" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- 资金处理 -->
            <!-- 0表示无需退款 1退款给买家 -->
            <el-form-item :label="$t('workReturn.fundProcessing')" prop="refundJudage">
                <el-select v-model="form.refundJudage" disabled>
                    <el-option v-for="item in dict.workOrderRefundJudage" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- 补充描述 -->
            <el-form-item :label="$t('workReturn.supplementaryDescription')" prop="mallDesc">
                <el-input v-model="form.mallDesc" :placeholder="$t('workReturn.supplementaryDescriptionTips')" disabled></el-input>
            </el-form-item>
            <!-- 图片  -->
            <el-form-item :label="$t('image')" prop="mallMustVoucher">
                <div>
                    <div class="light-grey">
                        {{ $t("platform.requiredCredentialsTips") }}
                    </div>
                    <BmImage v-for="(item, index) in form.mallMustVoucherImg" :key="index" :src="item" fit="cover" style="width:50px;height:50px" :preview-src-list="[item]" />
                </div>
                <div>
                    <div class="light-grey">
                        {{ $t("platform.optionalCredentialsTips") }}
                    </div>
                    <BmImage v-for="(item, index) in form.mallOptionalVoucherImg" :key="index" :src="item" fit="cover" style="width:50px;height:50px" :preview-src-list="[item]" />
                </div>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('platform.remark')" prop="mallRemark">
                <el-input v-model="form.mallRemark" :placeholder="$t('platform.remarkTips')" disabled></el-input>
            </el-form-item>
        </el-form>
        <!-- 工单状态为平台处理中(status=2)的才有处理 -->
        <div class="tc">
            <el-button v-permission="'returnManager_workOrder_deal'" @click="handleJump()" type="primary" v-if="status == 2">{{ $t("workReturn.process") }}</el-button>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { getProofDetailList } from "@/api/transaction";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        row: Object
    },
    emits: ["reloadData", "judgeJump"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({
            sellerReturnWorkAlleges: {}
        });
        let status = ref("");
        watch(
            () => props.row.id,
            (nVal) => {
                status.value = props.row.status;
                getProofDetailList({ workId: props.row.id })
                    .then((res) => {
                        form.value = res.data;
                        // 将凭证图片从字符串转为数组
                        // 买家
                        form.value.workMustVoucherImg = (form.value.workMustVoucher && form.value.workMustVoucher.split(",")) || [];
                        form.value.workOptionalVoucherImg = (form.value.workOptionalVoucher && form.value.workOptionalVoucher.split(",")) || [];
                        // 卖家
                        form.value.sellerReturnWorkAlleges.forEach((item) => {
                            item.workMustVoucherImg = (item.workMustVoucher && item.workMustVoucher.split(",")) || [];
                            item.workOptionalVoucherImg = (item.workOptionalVoucher && item.workOptionalVoucher.split(",")) || [];
                        });
                        // 平台
                        form.value.mallMustVoucherImg = (form.value.mallMustVoucher && form.value.mallMustVoucher.split(",")) || [];
                        form.value.mallOptionalVoucherImg = (form.value.mallOptionalVoucher && form.value.mallOptionalVoucher.split(",")) || [];
                    })
                    .catch((res) => {});
            }
            // { deep: true }
        );
        const formRef = ref(null);
        // 处理按钮监听事件
        const handleJump = () => {
            emit("judgeJump", props.row.id);
            emit("update:visible", false);
        };
        const handelCancel = () => {
            // formRef.value.resetFields();
            emit("update:visible", false);
        };
        return {
            dict,
            form,
            formRef,
            handelCancel,
            handleJump,
            status
        };
    }
};
</script>
