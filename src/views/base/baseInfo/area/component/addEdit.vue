<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 父级 -->
            <el-form-item v-if="updateType === 'add'" :label="$t('area.parent')">
                {{ form.parentName || $t("none") }}
            </el-form-item>
            <!-- 地区名称 -->
            <el-form-item :label="$t('areaTable.phonePrefix')" prop="phonePrefix">
                <el-input v-model="form.phonePrefix" type="text"></el-input>
            </el-form-item>
            <!-- 地区名称 -->
            <el-form-item :label="$t('areaTable.name')" prop="name">
                <el-input v-model="form.name" type="text"></el-input>
            </el-form-item>
            <!-- 地区编码 -->
            <el-form-item :label="$t('areaTable.areaCode')" prop="areaCode">
                <el-input v-model="form.areaCode" type="text"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('areaTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 是否是当前站点国家 -->
            <el-form-item :label="$t('area.isCurrentSite')" prop="isCurrentSite" v-if="form.isOne">
                <el-radio-group v-model="form.isCurrentSite">
                    <el-radio v-for="item in dict.yesNo" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 地区编码 -->
            <!-- 层级 
            <el-form-item :label="$t('areaTable.level')" prop="level">
                <el-input v-model="form.level" type="text"></el-input>
            </el-form-item>-->

            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remark">
                <el-input v-model="form.remark" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <!-- 地区名称 -->
            <el-form-item v-for="item in form.languageDict" :key="item.id" :label="item.label" :prop="item.value">
                <el-input v-model="form[item.value]"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { areaAdd, areaUpdate } from "@/api/base";
import { getDictByType } from "@/api/transaction";
export default {
    name: "areaTableAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        let length = 20;
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        //修改类型
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        let form = ref({});
        // 数据字典语言数据
        let languageDict = ref("");
        watch(
            () => props.row,
            (nVal) => {
                form.value = { ...props.row };
                // 调用数据字典获取多语言数据
                getDictByType("basics_place_name_config")
                    .then((res) => {
                        form.value.languageDict = res.data;
                        // 默认语言设置
                        rules[form.value.languageDict[0].value] = {
                            required: true,
                            message: proxy.$t("required"),
                            trigger: "blur"
                        };
                    })
                    .catch(() => {});
            }
        );

        const rules = {
            name: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            isCurrentSite: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            areaCode: {
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
                    let type = areaUpdate;
                    if (updateType.value === "add") {
                        type = areaAdd;
                    }
                    form.value.createUser = "4_test";
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
            cancel,
            languageDict
        };
    }
};
</script>
