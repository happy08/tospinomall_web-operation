<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 参数录入方式 -->
            <el-form-item :label="$t('attributeTable.mode')" prop="mode">
                <el-select v-model="form.mode" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="(item, index) in dict.goodsModeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 单位/参数 -->
            <el-form-item :label="$t('attributeTable.isUnit')" prop="isUnit">
                <el-radio-group v-model="form.isUnit">
                    <el-radio v-for="(item, index) in dict.haveNone" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 选择分类 -->
            <el-form-item :label="$t('goods.selectCategory')" prop="categoryIds">
                <el-button @click="handelSelectCategory">
                    {{ $t("goods.selectCategory") }}
                </el-button>
                {{ $t("selectedN", { num: form.categoryNum || 0 }) }}
                <el-input v-model="form.categoryNum" type="hidden" class="none"></el-input>
            </el-form-item>
            <!-- 参数名称 -->
            <el-form-item :label="$t('attributeTable.title')" prop="title">
                <el-input v-model="form.title" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <!-- 参数值/单位名称 -->
            <el-form-item :label="$t('attributeTable.paramValue')" prop="paramValue">
                <el-input v-model="form.paramValue" type="textarea" maxlength="255" show-word-limit :placeholder="$t('attribute.unitInput')"></el-input>
                <div class="mt-5 lh-1 grey">{{ $t("attribute.unitTip") }}</div>
            </el-form-item>
            <!-- 限制字符长度 -->
            <el-form-item :label="$t('attributeTable.limitLenght')" prop="limitLenght">
                <el-input v-model.number="form.limitLenght" type="number"></el-input>
            </el-form-item>
            <!-- 必填 -->
            <el-form-item :label="$t('attributeTable.isRequired')" prop="isRequired">
                <el-radio-group v-model="form.isRequired">
                    <el-radio v-for="(item, index) in dict.yesNo" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('attributeTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnable" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>

    <!-- 商品分类树 -->
    <GoodsCategory v-model:visible="goodsCategoryVisible" :ids="form.categoryIds" @change="changeGoodsCategory" />
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { attributeAdd, attributeUpdateById, attributeListGoodsCategoryByAttrId } from "@/api/goods";
import GoodsCategory from "@/components/goodsCategory";

export default {
    name: "AttributeAdd",
    components: { GoodsCategory },
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
        let updateType = computed(() => (JSON.stringify(props.row) == "{}" ? "add" : "edit"));

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                //获取分类ids集合
                attributeListGoodsCategoryByAttrId({ specId: props.row.id })
                    .then((res) => {
                        let categoryIds = res.data.map((item) => item.id);
                        form.value = { ...props.row, categoryIds };
                    })
                    .catch(() => {});
            }
            //{ immediate: true }
        );

        // let form = reactive({
        //     mode: "",
        //     title: "",
        //     categoryIds: [],
        //     isUnit: 0,
        //     limitLenght: "",
        //     isRequired: 0,
        //     status: 1,
        //     paramValue: "",
        //     remarks: "",
        // });

        const rules = {
            mode: { required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" },
            isUnit: { required: true, message: proxy.$t("required"), trigger: "blur" },
            title: { required: true, message: proxy.$t("required"), trigger: "blur" },
            categoryIds: { required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" },
            isRequired: { required: true, message: proxy.$t("required"), trigger: "blur" },
            status: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    let type = attributeUpdateById;
                    if (updateType.value === "add") {
                        type = attributeAdd;
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

        // let goodsCategoryVisible = ref(false);
        // const changeCategory = (ids) => {
        //     form.categoryIds = ids;
        // };

        let goodsCategoryVisible = ref(false);
        const handelSelectCategory = () => {
            goodsCategoryVisible.value = true;
        };
        const changeGoodsCategory = (ids) => {
            console.log("ids", ids);
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
