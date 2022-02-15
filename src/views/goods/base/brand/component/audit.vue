<template>
    <BmDialog v-model:visible="visible" :title="$t('status.audit')" :confirm="confirm" :cancel="cancel" :width="500">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :label="2">{{ $t("status.pass") }}</el-radio>
                    <el-radio :label="3">{{ $t("status.reject") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('brandTable.reason')" prop="reason">
                <el-input type="textarea" v-model="form.reason" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('image')" prop="imgList">
                <BmUpload @change="form.imgList = $event" :fileList="form.imgList" :limit="8" />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { brandBatchCheckStatus } from "@/api/goods";

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
            brandIds: "",
            status: 2,
            reason: "",
            imgList: []
        });

        const rules = {
            reason: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    const params = {
                        ...form,
                        brandIds: props.rows.map((item) => item.id),
                        imgList: form.imgList.map((item) => item.url)
                    };
                    brandBatchCheckStatus(params)
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
