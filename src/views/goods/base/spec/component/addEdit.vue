<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 名称 -->
            <el-form-item :label="$t('specTable.cnSpecName')" prop="cnSpecName">
                <el-input v-model="form.cnSpecName" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <!-- 选择分类 -->
            <el-form-item :label="$t('goods.selectCategory')" prop="categoryIds">
                <el-button @click="handelSelectCategory">
                    {{ $t("goods.selectCategory") }}
                </el-button>
                {{ $t("selectedN", { num: form.categoryNum || 0 }) }}
                <el-input v-model="form.categoryNum" type="hidden" class="none"></el-input>
            </el-form-item>
            <!-- 卖家自定义参数值 -->
            <el-form-item :label="$t('specTable.isEdit')" prop="isEdit">
                <el-radio-group v-model="form.isEdit">
                    <el-radio v-for="(item, index) in dict.supportOrNot" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 属性图片 -->
            <el-form-item :label="$t('specTable.isPicture')" prop="isPicture">
                <el-radio-group v-model="form.isPicture">
                    <el-radio v-for="(item, index) in dict.haveNone" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 卖家上传图片 -->
            <el-form-item :label="$t('specTable.isSellerUploadPicture')" prop="isSellerUploadPicture">
                <el-radio-group v-model="form.isSellerUploadPicture">
                    <el-radio v-for="(item, index) in dict.supportOrNot" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('specTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
        </el-form>

        <!-- 商品分类树 -->
        <GoodsCategory v-model:visible="goodsCategoryVisible" :ids="form.categoryIds" @change="changeGoodsCategory" />
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { specModelMallAdd, specModelMallUpdateById, specModelMallListGoodsCategoryByAttrId } from "@/api/goods";
import GoodsCategory from "@/components/goodsCategory";

export default {
    name: "SpecAddEdit",
    components: { GoodsCategory },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        let updateType = computed(() => (JSON.stringify(props.row) == "{}" ? "add" : "edit"));

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                //获取分类ids集合
                specModelMallListGoodsCategoryByAttrId({ specId: props.row.id })
                    .then((res) => {
                        let categoryIds = res.data.map((item) => item.id);
                        form.value = { ...props.row, categoryIds };
                    })
                    .catch(() => {});
            }
            //{ immediate: true }
        );

        const rules = {
            cnSpecName: { required: true, message: proxy.$t("required"), trigger: "change" },
            isEdit: { required: true, message: proxy.$t("required"), trigger: "change" },
            categoryIds: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" },
            isPicture: { required: true, message: proxy.$t("required"), trigger: "change" },
            isSellerUploadPicture: {
                required: true,
                message: proxy.$t("required"),
                trigger: "change"
            },
            status: { required: true, message: proxy.$t("required"), trigger: "change" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = specModelMallUpdateById;
                    if (updateType.value === "add") {
                        type = specModelMallAdd;
                    }
                    type(form.value)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            proxy.$message.success(res.msg);
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

        let goodsCategoryVisible = ref(false);
        const handelSelectCategory = () => {
            goodsCategoryVisible.value = true;
        };
        const changeGoodsCategory = (ids) => {
            form.value.categoryIds = ids;
            form.value.categoryNum = ids.length;
        };

        return {
            dict,
            updateType,
            form,
            rules,
            formRef,
            confirm,
            cancel,
            goodsCategoryVisible,
            handelSelectCategory,
            changeGoodsCategory
        };
    }
};
</script>
