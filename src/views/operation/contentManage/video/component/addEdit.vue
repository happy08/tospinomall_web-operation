<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600" destroy-on-close>
            <!-- 分类 -->
        <el-form ref="formRef" :model="form" label-width="auto">
            <el-form-item :label="$t('contentManage.selectCategory')" prop="categoryId" :rules="rulesCommon.required">
                <SelectionMenuTree :data="treeData" v-model:parentId="form.categoryId" :options="{ value: 'id', label: 'categoryName', children: 'children' }" lastLevel />
            </el-form-item>
            <!-- 标题 -->
            <el-form-item :label="$t('contentManage.title')" prop="title" :rules="rulesCommon.required">
                <el-input v-model="form.title" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <!-- 视频 -->
            <el-form-item :label="$t('contentManage.video')" prop="url" :rules="rulesCommon.required">
                <BmUpload @change="form.url = $event" :fileUrl="form.url" fileType="video" accept="video/mp4,video/WebM,video/Ogg" :showFileList="false" />
                <div class="light-grey">
                    <span>
                        {{$t('videoUploadTip',{type: 'MP4', size: '200'})}}
                    </span>
                </div>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('status.status')" prop="status" :rules="rulesCommon.required">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, inject, getCurrentInstance, watch, computed } from "vue";
import { sellerRulesHelpMallAdd, sellerRulesHelpMallUpdateById } from "@/api/operation";
import SelectionMenuTree from "@/components/selectionMenuTree";

export default {
    name: "storeDesignAdd",
    components: { SelectionMenuTree },
    props: {
        visible: Boolean,
        row: Object,
        treeData: Array
    },
    emits: ["reloadData", "update:visible"],
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
            required: { required: true, message: proxy.$t("required"), trigger: "change" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = sellerRulesHelpMallUpdateById;
                    if (updateType.value === "add") {
                        type = sellerRulesHelpMallAdd;
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
            rulesCommon,
            formRef,
            confirm,
            cancel,
        };
    }
};
</script>
