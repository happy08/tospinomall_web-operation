<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="reason">
                <el-input v-model="form.reason" type="textarea" maxlength="100" autosize show-word-limit autocomplete="off"></el-input>
            </el-form-item>

            <!-- 图片 -->
            <el-form-item :label="$t('image')" prop="imgList">
                <BmUpload @change="onChangeUpload($event)" :fileList="form.imgList" :multiple="true" :limit="8" />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { goodsMallBatchShieldStatus } from "@/api/goods";

export default {
    name: "GoodsShield",
    components: {},
    props: {
        visible: Boolean,
        shieldOption: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let title = computed(
            () =>
                props.shieldOption.status == 0
                    ? proxy.$t("status.cancelShieldingProducts") //0取消屏蔽
                    : proxy.$t("status.shieldingProducts") //1屏蔽
        );

        let form = reactive({ reason: "", imgList: [] });
        const rules = {
            reason: { required: true, message: proxy.$t("required"), trigger: "change" }
        };

        //上传图片
        const onChangeUpload = (fileList) => {
            console.log("form.imgList", fileList);
            form.imgList = fileList; //.map((item) => item.url);
        };

        //确认屏蔽
        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    //0取消屏蔽 1屏蔽
                    proxy
                        .$confirm(props.shieldOption.status == 0 ? proxy.$t("goodsList.tip2") : proxy.$t("goodsList.tip"), {
                            type: "warning"
                        })
                        .then(() => {
                            examineConfirm();
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };

        const examineConfirm = () => {
            let params = {
                shieldStatus: props.shieldOption.status,
                goodsIds: props.shieldOption.goodsIds,
                goodType: props.shieldOption.goodType,
                imgList: (form.imgList.length && form.imgList.map((item) => item.url)) || [],
                reason: form.reason
            };
            goodsMallBatchShieldStatus(params)
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                    formRef.value.resetFields();
                    form.imgList = [];
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        const cancel = () => {
            emit("update:visible", false);
            formRef.value.resetFields();
            form.imgList = [];
        };

        return {
            title,
            form,
            rules,
            onChangeUpload,
            formRef,
            confirm,
            cancel
        };
    }
};
</script>
