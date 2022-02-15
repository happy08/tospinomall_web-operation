<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :noConfirm="true" :cancel="cancel" :width="800">
        <el-form ref="formRef" :model="form" label-width="auto">
            <el-form-item :label="$t('permissionMenu.parent')" prop="categoryId" :rules="rulesCommon.required">
                <SelectionMenuTree :data="treeData" v-model:parentId="form.categoryId" :options="{ value: 'id', label: 'categoryName', children: 'children' }" disabled />
            </el-form-item>

            <el-form-item :label="$t('contentManage.title')" prop="title" :rules="rulesCommon.required">
                <el-input v-model="form.title" maxlength="15" show-word-limit disabled></el-input>
            </el-form-item>
            <!-- 内容 -->
            <el-form-item :label="$t('contentManage.content')" prop="content" :rules="rulesCommon.required">
                <video width="320" height="240" controls>
                    <source :src="form.url" type="video/mp4" />
                    您的浏览器不支持 video 标签。
                </video>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('status.status')" prop="status" :rules="rulesCommon.required">
                <el-radio-group v-model="form.status" disabled>
                    <el-radio v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, inject, getCurrentInstance, watch, computed } from "vue";
import SelectionMenuTree from "@/components/selectionMenuTree";

export default {
    name: "storeDesignAdd",
    components: { SelectionMenuTree },
    props: {
        visible: Boolean,
        row: Object,
        treeData: Array
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = nVal;
            }
        );

        const rulesCommon = {
            required: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            dict,
            updateType,
            form,
            rulesCommon,
            formRef,
            cancel
        };
    }
};
</script>
