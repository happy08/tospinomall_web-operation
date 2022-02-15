<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" :confirm="confirm" :cancel="cancel" :showFooter="false" width="70wx">
        <!-- 表单区域 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 页面链接 -->
            <el-form-item :label="$t('sellerFeedbackListTable.pageHref')" prop="pageHref">
                {{ form.pageHref }}
            </el-form-item>
            <!-- 反馈类型 -->
            <el-form-item :label="$t('sellerFeedbackListTable.feedbackCategoryName')" prop="feedbackCategoryName">
                {{ form.feedbackCategoryName }}
            </el-form-item>
            <!-- 反馈内容 -->
            <el-form-item :label="$t('sellerFeedbackListTable.content')" prop="content">
                <!-- 文字 -->
                <div class="lh-16">
                    {{ form.content }}
                </div>
                <!-- 图片 -->
                <span v-for="(item, index) in form.imgUrls" :key="index">
                    <BmImage :src="item" fit="cover" :preview-src-list="form.imgUrls ? form.imgUrls : ''" style="width:80px;height:80px" class="mr-10" />
                </span>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item :label="$t('sellerFeedbackListTable.phone')" prop="phone">
                {{ form.phone }}
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item :label="$t('sellerFeedbackListTable.mailbox')" prop="mailbox">
                {{ form.mailbox }}
            </el-form-item>
            <!-- 用户信息 -->
            <el-form-item :label="$t('sellerFeedbackListTable.userInfo')" prop="userInfo">
                {{ form.userInfo }}
            </el-form-item>
            <!-- 反馈时间 -->
            <el-form-item :label="$t('sellerFeedbackList.feedbackTime')" prop="feedbackTime">
                {{ form.createTime }}
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
                form.value = props.row;
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
