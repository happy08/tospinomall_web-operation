<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 货物状态 -->
            <!-- <el-form-item :label="$t('afterSalesReasonSettingTable.goodsStatus')" prop="goodsStatus">
                <el-radio-group v-model="form.goodsStatus">
                    <el-radio v-for="(item, index) in dict.goodsStatus" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <!-- 工单类型 -->
            <el-form-item :label="$t('workReturn.workOrderType')" prop="applyType">
                <el-radio-group v-model="form.applyType">
                    <el-radio v-for="(item, index) in dict.afterSaleType" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 是否启用 -->
            <el-form-item :label="$t('afterSalesReasonSettingTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 申请原因 -->
            <el-form-item :label="$t('afterSalesReasonSettingTable.applyReason')" prop="applyReason">
                <el-input v-model="form.applyReason" :placeholder="$t('pleaseEnter')"></el-input>

                <!-- <el-select v-model="form.applyReason" :placeholder="$t('pleaseSelect')" @change="selectChange">
                    <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.label"> </el-option>
                </el-select> -->
            </el-form-item>
            <!-- 排序 -->
            <el-form-item :label="$t('afterSalesReasonSettingTable.sort')" prop="sort">
                <el-input v-model.number="form.sort" type="number"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>

    <!-- 商品分类树 -->
    <GoodsCategory v-model:visible="goodsCategoryVisible" :ids="form.categoryIds" @change="changeGoodsCategory" />
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { attributeAdd, attributeUpdateById, attributeListGoodsCategoryByAttrId } from "@/api/goods";
import { editOrderReason, addOrderReason } from "@/api/base";
import GoodsCategory from "@/components/goodsCategory";

export default {
    name: "AttributeAdd",
    components: { GoodsCategory },
    props: {
        visible: Boolean,
        row: Object,
        selectData: Array
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));
        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = props.row;
            }
        );
        const rules = {
            goodsStatus: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            applyType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            applyReason: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            sort: { required: true, message: proxy.$t("required"), trigger: "blur" },
            status: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        // select选择发生变化触发的事件
        const selectChange = () => {
            // 退货退款的申请原因不能选空包裹
            if (form.value.applyType == 1) {
                if (form.value.applyReason == "空包裹") {
                    proxy.$message.error(proxy.$t("afterSalesReasonSettingTable.notSelect"));
                    form.value.applyReason = "";
                }
            }
        };
        const confirm = () => {
            form.value.orderType = 2;
            console.log(updateType.value);
            formRef.value.validate((valid) => {
                if (valid) {
                    // 去掉请求不要的参数
                    delete form.value.createTime;
                    delete form.value.updateTime;
                    let type = attributeUpdateById;
                    if (updateType.value === "add") {
                        // 新增
                        console.log(1);
                        type = attributeAdd;
                        addOrderReason(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch(() => {});
                    } else {
                        // 编辑
                        // 编辑操作
                        editOrderReason(form.value)
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
            emit("update:visible", false);
        };

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
            changeGoodsCategory,
            selectChange
        };
    }
};
</script>
