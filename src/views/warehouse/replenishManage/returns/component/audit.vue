<template>
    <BmDialog v-model:visible="visible" :title="$t('status.audit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :label="1">{{ $t("status.pass") }}</el-radio>
                    <el-radio :label="2">{{ $t("status.reject") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('warehouse.warehouseAddress')" prop="reason">
                <el-select v-model="form.receiveWareTmp" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="(item, index) in addressList" :key="index" :label="item.name" :value="item.id + '####' + item.name"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('remark')" prop="reason">
                <el-input type="textarea" v-model="form.reason" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('image')" prop="voucherImgs">
                <BmUpload @change="onChangeUpload($event)" :fileList="form.voucherImgsTmp" :multiple="true" :limit="8" />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { returnProductMallCheck, baseFbtAddressFind } from "@/api/warehouse";

export default {
    name: "CheckAudit",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = reactive({
            ids: [],
            receiveWare: "", //平台分配收货仓库名称
            receiveWareId: "", //平台分配收货仓库ID
            status: 1, //状态1：同意，2：驳回
            reason: "",
            voucherImgsTmp: [] //图片
        });

        watch(
            () => props.row.ids,
            (nVal) => {
                form.ids = nVal;
            }
        );

        const rules = {
            reason: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        //集货仓地址 type=1：收货地址，2：退货地址
        let addressList = ref([]);
        const getBaseFbtAddressFind = () => {
            baseFbtAddressFind({ type: 2 })
                .then((res) => {
                    addressList.value = res.data;
                })
                .catch((err) => {});
        };
        getBaseFbtAddressFind();

        //上传图片
        const onChangeUpload = (fileList) => {
            form.voucherImgsTmp = fileList; //.map((item) => item.url);
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    const receive = form.receiveWareTmp.split("####");
                    form.receiveWareId = receive[0];
                    form.receiveWare = receive[1];
                    form.voucherImgs = form.voucherImgsTmp.map((item) => item.url);

                    returnProductMallCheck(form)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            form.reason = "";
                            form.voucherImgs = [];
                            form.voucherImgsTmp = [];
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            onChangeUpload,
            addressList
        };
    }
};
</script>
