<template>
    <BmDialog v-model:visible="visible" :title="$t('status.audit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.examineStatus">
                    <el-radio :label="2">{{ $t("status.pass") }}</el-radio>
                    <el-radio :label="3">{{ $t("status.reject") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('brandTable.reason')" prop="reason">
                <el-input type="textarea" v-model="form.reason" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('image')" prop="imgList">
                <BmUpload @change="onChangeUpload($event)" :multiple="true" :limit="8" />
            </el-form-item>
        </el-form>
    </BmDialog>

    <BmDialog v-model:visible="examineVisible" :title="$t('goodsList.examineConfirm')" :confirm="examineConfirm" :cancel="examineCancel" :width="500" top="20vh !important">
        {{ $t("goodsList.tip3") }}
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { goodsMallBatchCheckStatus } from "@/api/goods";

export default {
    name: "CheckAudit",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        rows: Array,
        examineStatus: {
            type: Number,
            default: 2
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = reactive({
            goodsIds: "",
            examineStatus: 2, //状态1->待审核 2已通过 3未通过
            reason: "",
            imgList: []
        });
        watch(
            () => props.examineStatus,
            (nVal) => {
                form.examineStatus = nVal;
            }
        );

        const rules = {
            reason: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        //上传图片
        const onChangeUpload = (fileList) => {
            form.imgList = fileList.map((item) => item.url);
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    examineVisible.value = true;
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
        };

        //确认审核
        let examineVisible = ref(false);
        const examineConfirm = () => {
            form.goodsIds = props.rows.map((item) => item.goodId || item.goodsId);
            goodsMallBatchCheckStatus(form)
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                    examineVisible.value = false;
                    form.reason = "";
                    form.imgList = [];
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        const examineCancel = () => {
            examineVisible.value = false;
        };

        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            onChangeUpload,
            examineVisible,
            examineConfirm,
            examineCancel
        };
    }
};
</script>
