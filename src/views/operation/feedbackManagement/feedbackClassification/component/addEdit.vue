<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" width="70wx">
        <!-- 表单区域 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 反馈类型 -->
            <el-form-item :label="$t('feedbackClassificationTable.title')" prop="title">
                <el-input v-model="form.title" :placeholder="$t('pleaseEnter')" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('feedbackClassificationTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { addFeedbackClassification, editFeedbackClassification } from "@/api/operation";
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
                form.value = {...props.row};
                // 标题判断
                if (form.value.operate == "edit") {
                    title.value = proxy.$t("status.edit");
                    typeNum.value = 1;
                } else {
                    title.value = proxy.$t("status.add");
                    typeNum.value = 0;
                }
            }
        );
        let title = ref("");
        // 操作类型 0新增，1编辑
        let typeNum = ref(1);
        const rules = {
            title: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            status: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    // 判断操作类型
                    if (typeNum.value) {
                        // 编辑;
                        editFeedbackClassification(form.value)
                            .then(() => {
                                emit("reloadData");
                                emit("update:visible", false);
                                formRef.value.resetFields();
                            })
                            .catch(() => {});
                    } else {
                        //新增
                        addFeedbackClassification(form.value)
                            .then(() => {
                                emit("reloadData");
                                emit("update:visible", false);
                                // formRef.value.resetFields();
                            })
                            .catch(() => {});
                    }
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
            dict,
            title,
            typeNum
        };
    }
};
</script>
