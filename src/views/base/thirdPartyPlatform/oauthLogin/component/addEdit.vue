<template>
    <BmDialog v-model:visible="visible" :title="$t('oauthLogin.oauthLogin') + '>' + form.title" :confirm="confirm" :cancel="cancel" width="70wx">
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
            <!-- AppID -->
            <el-form-item label="ID" prop="ID">
                <el-input v-model="form.appid" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- AppKey -->
            <el-form-item label="KEY" prop="KEY">
                <el-input v-model="form.apikey" :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { editOauthLogin } from "@/api/base";
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
        const rules = {};
        const formRef = ref(null);
        const confirm = () => {
            // debugger
            formRef.value.validate((valid) => {
                if (valid) {
                    delete form.value.createTime;
                    delete form.value.updateTime;
                    editOauthLogin(form.value)
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
            dict
        };
    }
};
</script>
