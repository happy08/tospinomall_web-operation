<template>
    <!-- 审核 -->
    <BmDialog v-model:visible="visible" :title="$t('status.audit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
            <el-form-item :label="$t('status.status')" prop="action">
                <el-radio-group v-model="form.action">
                    <el-radio label="agree">{{ $t("status.pass") }}</el-radio>
                    <el-radio label="reject">{{ $t("status.reject") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.action == 'reject'" :label="$t('remark')" prop="mark">
                <el-input :placeholder="$t('pleaseEnter')" v-model="form.mark" type="textarea" maxlength="300" :rows="5" show-word-limit />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { productEvaluateBatchCheck } from "@/api/transaction";

export default {
    name: "BrandAudit",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        rows: Array
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = reactive({
            action: "",
            mark: "",
            evaluateIdList: []
        });

        const rules = {
            action: { required: true, message: proxy.$t("required"), trigger: "blur" },
            mark: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    const params = {
                        ...form,
                        evaluateIdList: props.rows.map((item) => item.id)
                    };
                    productEvaluateBatchCheck(params)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            proxy.$message.success(res.msg);
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
            cancel
        };
    }
};
</script>
