<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" width="70wx">
        <!-- 表单区域 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 单页标题 -->
            <el-form-item :label="$t('singlePageInfo.name')" prop="name">
                <el-input v-model="form.name" disabled :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('singlePageInfoTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="item in dict.forbiddenEnable" :key="item.value" :label="item.value">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 单页内容 -->
            <el-form-item :label="$t('singlePageInfo.content')" prop="content">
                <Tinymce v-model:value="form.content" :height="300" />
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('singlePageInfoTable.remarks')" prop="remarks">
                <el-input type="textarea" maxlength="255" show-word-limit v-model="form.remarks" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { editSinglePageInfo, AddSinglePageInfo } from "@/api/operation";
import Tinymce from "@/components/Tinymce";
export default {
    name: "AttributeAdd",
    components: { Tinymce },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        // 标题
        let title = ref("");
        // watch(
        //     () => props.row,
        //     (nVal) => {
        //         form.value = props.row;
        //         // 标题判断
        //         if (form.value.operate == "edit") {
        //             title.value = proxy.$t("status.edit");
        //         } else {
        //             title.value = proxy.$t("status.add");
        //         }
        //     }
        // );

        form.value = props.row;
        // 标题判断
        if (form.value && form.value.operate == "edit") {
            title.value = proxy.$t("status.edit");
        } else {
            title.value = proxy.$t("status.add");
        }

        const rules = {
            name: {
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
                    // 操作判断
                    if (form.value.operate == "edit") {
                        // 编辑
                        editSinglePageInfo(form.value)
                            .then(() => {
                                emit("reloadData");
                                emit("update:visible", false);
                                formRef.value.resetFields();
                            })
                            .catch(() => {});
                    } else {
                        // 新增
                        AddSinglePageInfo(form.value)
                            .then(() => {
                                emit("reloadData");
                                emit("update:visible", false);
                                formRef.value.resetFields();
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
            title
        };
    }
};
</script>
