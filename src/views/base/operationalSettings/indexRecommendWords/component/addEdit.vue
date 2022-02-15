<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
            <!-- 首页推荐词 -->
            <el-form-item :label="$t('indexRecommendWords.name')" prop="name">
                <el-input v-model="form.name" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 排序 -->
            <el-form-item :label="$t('indexRecommendWords.sort')" prop="sort">
                <el-input v-model="form.sort" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="item in dict.forbiddenEnableReverse" :key="item.value" :label="item.value">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { addIndexRecommendWords, editIndexRecommendWords } from "@/api/base";
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
        let title = computed(() => (form.value.type == "add" ? proxy.$t("status.add") : proxy.$t("status.edit")));
        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = props.row;
            }
        );
        const rules = {
            name: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            sort: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    if (form.value.type == "add") {
                        addIndexRecommendWords(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false, form.value.type);
                                formRef.value.resetFields();
                            })
                            .catch(() => {});
                    } else {
                        editIndexRecommendWords(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false, form.value.type);
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
