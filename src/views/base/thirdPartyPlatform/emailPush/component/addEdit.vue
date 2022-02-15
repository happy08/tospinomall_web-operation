<template>
    <BmDialog v-model:visible="visible" :title="$t('emailPush.emailPushTitel')" :confirm="confirm" :cancel="cancel" width="70wx">
        <!-- 提示信息区域 -->
        <div>
            <span class="block">{{ $t("emailPush.SMTPCustomization") }}</span>
            <span class="block light-grey">{{ $t("emailPush.SMTPtips") }}</span>
        </div>
        <!-- 配置说明 -->
        <div>
            <div class="fs-16 fw m-15">
                {{ $t("emailPush.configurationInstructions") }}
            </div>
            <div class="m-15">
                {{ $t("emailPush.configurationInstructions1") }}
            </div>
            <div class="m-15">
                {{ $t("emailPush.configurationInstructions2") }}
            </div>
            <div class="m-15">
                {{ $t("emailPush.configurationInstructions3") }}
            </div>
            <div class="m-15">
                {{ $t("emailPush.configurationInstructions4") }}
            </div>
        </div>
        <!-- 表单区域 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- smtp服务器 -->
            <el-form-item :label="$t('emailPush.smtpServerAddress')" prop="smtpServerAddress">
                <el-input v-model="form.smtpServerAddress" :placeholder="$t('emailPush.smtpServerAddressTips')"></el-input>
            </el-form-item>
            <!-- SMPT端口 -->
            <el-form-item :label="$t('emailPush.smtpServerPort')" prop="smtpServerPort">
                <el-input v-model="form.smtpServerPort" :placeholder="$t('emailPush.smtpServerPortTips')"></el-input>
            </el-form-item>
            <!-- 发信人邮件地址 -->
            <el-form-item :label="$t('emailPush.senderEmailAddress')" prop="senderEmailAddress">
                <el-input v-model="form.senderEmailAddress" :placeholder="$t('emailPush.senderEmailAddressTips')"></el-input>
            </el-form-item>
            <!-- SMTP身份证用户名 -->
            <el-form-item :label="$t('emailPush.smtpIdcardUsername')" prop="smtpIdcardUsername">
                <el-input v-model="form.smtpIdcardUsername" :placeholder="$t('emailPush.smtpIdcardUsernameTips')"></el-input>
            </el-form-item>
            <!-- SMTP身份验证密码 -->
            <el-form-item :label="$t('emailPush.smptAuthPassword')" prop="smptAuthPassword">
                <el-input v-model="form.smptAuthPassword" :placeholder="$t('emailPush.smptAuthPasswordTips')"></el-input>
            </el-form-item>
            <!-- 加密方式 -->
            <el-form-item :label="$t('emailPush.encryptMethod')" prop="encryptMethod">
                <el-radio-group v-model="form.encryptMethod">
                    <el-radio v-for="item in dict.encryption" :key="item.value" :label="item.value">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 发件人显示名称 -->
            <el-form-item :label="$t('emailPush.senderName')" prop="senderName" class="mb-50">
                <el-input v-model="form.senderName" :placeholder="$t('emailPush.senderNameTips')"></el-input>
            </el-form-item>
            <!-- 测试收件邮箱地址 -->
            <el-form-item style="position:relative" :label="$t('emailPush.emailAddress')" prop="emailAddress">
                <el-input v-model="form.emailAddress" :placeholder="$t('pleaseEnter')"></el-input>
                <div style="position:absolute;left:0;top:-36px;width:860px" class="flex between">
                    <div class="light-grey">
                        {{ $t("emailPush.emailTestTips") }}
                    </div>
                </div>
            </el-form-item>
            <!-- 测试内容 -->
            <el-form-item :label="$t('emailPush.content')" prop="content">
                <el-input v-model="form.content" :placeholder="$t('pleaseEnter')"></el-input>
                <div>
                        <el-button type="primary" @click="handleTest">{{ $t("emailPush.startTest") }}</el-button>
                    </div>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { editMessageTemplate, emailPush, testEmailPush, editEmailPush } from "@/api/base";
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
                emailPush()
                    .then((res) => {
                        form.value = res.data;
                    })
                    .catch(() => {});
            }
        );
        const rules = {};
        const formRef = ref(null);
        // 测试
        const handleTest = () => {
            if (form.value.emailAddress && form.value.content) {
                testEmailPush({
                    emailAddress: form.value.emailAddress,
                    content: form.value.content
                });
            } else {
                proxy.$message.error(proxy.$t("emailPush.testTips"));
            }
        };
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    editEmailPush(form.value)
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
            handleTest
        };
    }
};
</script>
