<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 类目名称 -->
            <el-form-item :label="$t('mainCategoriesTable.name')" prop="name">
                <el-input v-model="form.name" :placeholder="$t('pleaseEnter')" maxlength="50" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { attributeAdd, attributeUpdateById, attributeListGoodsCategoryByAttrId } from "@/api/goods";
import { editMainCategories, addMainCategories } from "@/api/base";

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

        //const lang = computed(() => store.state.app.lang);
        // watch(lang, (nVal) => {
        //     initData();
        // });

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));
        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = { ...nVal };
            }
            //{ immediate: true }
        );
        const rules = {
            name: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = attributeUpdateById;
                    // 添加操作
                    if (updateType.value === "add") {
                        type = attributeAdd;
                        addMainCategories(form.value)
                            .then((res) => {
                                proxy.$message.success(res.msg);
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else if (updateType.value === "edit") {
                        // 编辑操作
                        editMainCategories({ id: form.value.id, name: form.value.name })
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            formRef.value.resetFields();
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
