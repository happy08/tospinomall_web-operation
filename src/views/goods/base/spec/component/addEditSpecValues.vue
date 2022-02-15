<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 名称 -->
            <el-form-item :label="$t('specValuesTable.cnName')" prop="cnName">
                <el-input v-model="form.cnName" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <!-- 属性图片 -->
            <el-form-item v-if="form.isPicture == 0" :label="$t('specValuesTable.picture')" prop="picture">
                <BmUpload
                    @change="
                        (file) => {
                            form.picture = file;
                        }
                    "
                    :fileUrl="form.picture"
                    :showFileList="false"
                    :limit="8"
                />
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('specValuesTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, inject, watch, getCurrentInstance, computed } from "vue";
import { specsValueModelAdd, specsValueModelUpdateById } from "@/api/goods";

export default {
    name: "SpecValueAddEdit",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        //同时监听2个值specId, id
        let forId = computed(() => {
            const { specId, id } = props.row;
            return { specId, id };
        });

        let form = ref({});
        watch(
            forId,
            (nVal) => {
                form.value = { ...props.row };
            },
            { immediate: true }
        );

        const rules = {
            cnName: { required: true, message: proxy.$t("required"), trigger: "blur" },
            status: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = specsValueModelUpdateById;
                    if (updateType.value === "add") {
                        type = specsValueModelAdd;
                    }
                    type(form.value)
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
            dict,
            updateType,
            form,
            rules,
            formRef,
            confirm,
            cancel
        };
    }
};
</script>
