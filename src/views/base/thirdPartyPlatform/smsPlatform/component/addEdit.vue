<template>
    <BmDialog v-model:visible="visible" :title="$t('smsPlatform.smsPlatform') + '>' + form.name" :confirm="confirm" :cancel="cancel" width="70wx">
        <!-- 提示信息区域 -->
        <div class="flex">
            <div>
                <BmImage :src="form.icon" fit="cover" style="width:100%;height:100%" />
            </div>
            <div>
                <span class="block">{{ form.name }}</span>
                <span class="block light-grey">{{ form.description }}</span>
            </div>
        </div>
        <!-- 配置说明 -->
        <div>
            <div class="fs-16 fw m-15">
                {{ $t("emailPush.configurationInstructions") }}
            </div>
            <div class="m-15" v-for="(item, index) in form.configExplainName" :key="index">
                {{ item }}
            </div>
        </div>
        <!-- 表单区域 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- AccessKey ID -->
            <el-form-item :label="$t('smsPlatform.accessKeyId')" prop="accessKeyId">
                <el-input v-model="form.accessKeyId" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- AccessKey Secret -->
            <el-form-item :label="$t('smsPlatform.accessSecret')" prop="accessSecret">
                <el-input v-model="form.accessSecret" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 短信签名 -->
            <el-form-item :label="$t('smsPlatform.sign')" prop="sign">
                <el-input v-model="form.sign" :placeholder="$t('smsPlatform.signTips')"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { editSmsPlatform } from "@/api/base";
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
        let title = ref("");
        const rules = {};
        const formRef = ref(null);
        const confirm = () => {
            // debugger
            formRef.value.validate((valid) => {
                if (valid) {
                    editSmsPlatform(form.value)
                        .then(() => {
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
            form,
            rules,
            formRef,
            confirm,
            cancel,
            dict,
            title
        };
    }
};
</script>
