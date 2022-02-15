<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('storeDesignTable.name')" prop="name">
                <el-input v-model="form.name" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('storeDesign.pageType')" prop="pageType">
                <el-select v-model="form.pageType" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="(item, index) in dict.storePageList" :key="index" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, inject, getCurrentInstance, watch, computed } from "vue";
import { storeStylesAdd, storeStylesUpdateById } from "@/api/storeDesign";

export default {
    name: "storeDesignAdd",
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

        let form = ref({
            name: "",
            pageType: 1
        });
        watch(
            () => props.row,
            (nVal) => {
                console.log("nVal", nVal);
                form.value = nVal;
            }
        );

        const rules = {
            name: { required: true, message: proxy.$t("required"), trigger: "blur" },
            pageType: { required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = storeStylesUpdateById;
                    if (updateType.value === "add") {
                        type = storeStylesAdd;
                    }
                    type(form.value)
                        .then((res) => {
                            emit("reloadData");
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
