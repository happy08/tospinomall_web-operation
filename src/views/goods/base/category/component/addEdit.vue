<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :close-on-click-modal="false" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 上级类目 -->
            <el-form-item :label="$t('goodsCategory.parent')">
                <div v-if="categoryList.length">
                    <span v-for="(item, index) in categoryList" :key="item.id">{{ index != 0 ? "》" : "" }}{{ item.cnName }}</span>
                </div>
                <div v-else>无</div>
            </el-form-item>
            <!-- 名称 -->
            <el-form-item :label="$t('goodsCategoryTable.cnName')" prop="cnName">
                <el-input v-model="form.cnName" maxlength="255" show-word-limit></el-input>
            </el-form-item>
            <!-- 编码 -->
            <el-form-item :label="$t('goodsCategory.code')" prop="code">
                <el-input v-model="form.code" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('goodsCategoryTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 排序 -->
            <el-form-item :label="$t('goodsCategoryTable.sort')" prop="sort">
                <el-input v-model="form.sort" type="number" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { categoryUpdate, categorySave, categoryGetPath } from "@/api/goods";

export default {
    name: "goodsCategoryAddEdit",
    props: {
        visible: Boolean,
        categoryId: String,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));
        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                if (nVal) {
                    form.value = { ...props.row };
                }
            },
            { immediate: true }
        );
        let categoryList = ref([]);
        watch(
            () => props.categoryId,
            (nVal) => {
                if (nVal) {
                    //通过id查询分类path
                    categoryGetPath(nVal)
                        .then((res) => {
                            categoryList.value = res.data;
                        })
                        .catch(() => {});
                } else {
                    categoryList.value = [];
                }
            },
            { immediate: true }
        );

        const rules = {
            cnName: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            status: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            code: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = categoryUpdate;
                    if (updateType.value === "add") {
                        type = categorySave;
                        form.value.categoryId = props.categoryId;
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
            categoryList,
            rules,
            formRef,
            confirm,
            cancel
        };
    }
};
</script>
