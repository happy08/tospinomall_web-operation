<template>
    <BmDialog v-model:visible="visible" :title="$t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <!-- 关键字 -->
            <el-form-item :label="$t('searchJumpTable.keyword')" prop="keyword">
                <el-input v-model="form.keyword" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 跳转参数 -->
            <el-form-item :label="$t('searchJumpTable.jumpParam')" prop="jumpParam">
                <el-input v-model="form.jumpParam" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 权重值 -->
            <el-form-item :label="$t('searchJumpTable.weight')" prop="weight">
                <el-input v-model="form.weight" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('searchJumpTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="item in dict.forbiddenEnableReverse" :key="item.value" :label="item.value">{{ item.name }} </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { editSearchJump } from "@/api/base";
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
                form.value = props.row;
            }
        );
        const rules = {
            keyword: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            jumpParam: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            weight: {
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
                    // 删除openStatus参数
                    delete form.value.openStatus;
                    editSearchJump(form.value)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false, form.value.type);
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
            cancel,
            dict
        };
    }
};
</script>
