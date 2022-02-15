<template>
    <BmDialog v-model:visible="visible" :title="$t('entryAudit.look')" width="60%" :showFooter="false" :cancel="handelCancel">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <BmBaseTitle :title="$t('memberList.accountInfo')" />
            <!-- 会员编码 -->
            <el-form-item :label="$t('memberList.memberNum')" prop="account">{{ form.account }}</el-form-item>
            <!-- 手机号 -->
            <el-form-item :label="$t('memberListTable.phone')" prop="phone">{{ form.phone }}</el-form-item>
            <!-- 邮箱 -->
            <el-form-item :label="$t('memberListTable.email')" prop="email">{{ form.email }}</el-form-item>
            <BmBaseTitle :title="$t('memberList.member')" />
            <!-- 头像 -->
            <el-form-item :label="$t('memberList.headPictureUrl')" prop="headPictureUrl">
                <BmImage :src="form.headPictureUrl" :alt="$t('memberList.headPictureUrl')" style="width: 100px" />
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item :label="$t('memberList.nickname')" prop="nickname">{{ form.nickname }}</el-form-item>
            <!-- 性别 -->
            <el-form-item :label="$t('memberList.sex')" prop="sex">{{ form.sexName }}</el-form-item>
            <!-- 出生日期 -->
            <el-form-item :label="$t('memberList.birthday')" prop="birthday">{{ form.birthday }}</el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
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
        const formRef = ref(null);
        const handelCancel = () => {
            emit("update:visible", false);
        };
        return {
            dict,
            form,
            formRef,
            handelCancel
        };
    }
};
</script>
