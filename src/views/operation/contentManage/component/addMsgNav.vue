<template>
    <!-- 会员消息 卖家消息分类 -->
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="400">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('permissionMenu.parent')" prop="categoryName">
                {{ form.parentName || $t("permissionMenu.rootDirectory") }}
            </el-form-item>
            <el-form-item :label="$t('contentManage.title')" prop="categoryName">
                <el-input v-model="form.categoryName" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('contentManage.icon')" prop="icon">
                <BmUpload @change="form.icon = $event" :fileUrl="form.icon" :showFileList="false" />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, getCurrentInstance, watch, computed } from "vue";
import { msgCategoryMallSave, msgCategoryMallUpdateById } from "@/api/operation";

export default {
    name: "addMsgNav",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        let form = ref({
            categoryName: ""
        });
        watch(
            () => props.row,
            (nVal) => {
                form.value = nVal;
            }
        );

        const rules = {
            categoryName: { required: true, message: proxy.$t("required"), trigger: "blur" },
            icon: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = msgCategoryMallUpdateById;
                    if (updateType.value === "add") {
                        type = msgCategoryMallSave;
                    }
                    type(form.value)
                        .then((res) => {
                            emit("reloadData", res.data);
                            emit("update:visible", false);
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
