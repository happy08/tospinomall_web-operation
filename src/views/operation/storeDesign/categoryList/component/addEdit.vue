<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('mallCategory.name')" prop="name">
                <el-input v-model="form.name" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('mallCategory.clientType')" prop="clientType">
                <el-radio-group v-model="form.clientType">
                    <el-radio :label="1">
                        APP+H5
                    </el-radio>
                    <el-radio :label="2">
                        PC
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('mallCategory.msort')" prop="msort">
                <el-input v-model="form.msort" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('mallCategory.note')" prop="note">
                <el-input v-model="form.note" type="textarea" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, inject, getCurrentInstance, watch, computed } from "vue";
import { categoryStyleSave, categoryStyleUpdate } from "@/api/storeDesign";

export default {
    name: "categoryListAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = { ...nVal };
            }
        );

        const rules = {
            name: { required: true, message: proxy.$t("required"), trigger: "blur" },
            clientType: { required: true, message: proxy.$t("required"), trigger: "blur" },
            status: { required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = categoryStyleUpdate;
                    if (updateType.value === "add") {
                        type = categoryStyleSave;
                    }
                    type(form.value)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
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
