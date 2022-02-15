<template>
    <BmDialog v-model:visible="visible" :title="$t('status.audit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('status.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :label="1">{{ $t("status.pass") }}</el-radio>
                    <el-radio :label="2">{{ $t("status.reject") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                :label="$t('warehouse.warehouseAddress')"
                prop="receiveWareId"
                :rules="
                    form.status == 1
                        ? {
                              required: true,
                              message: $t('required'),
                              trigger: 'blur'
                          }
                        : null
                "
            >
                <el-select v-model="form.receiveWareId" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="(item, index) in addressList" :key="index" :label="item.name + ' (' + item.countryName + item.cityName + item.detailAddress + ')'" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('remark')" prop="reason">
                <el-input type="textarea" v-model="form.reason" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('image')" prop="voucherImgs">
                <BmUpload @change="onChangeUpload($event)" :fileList="form.voucherImgs" :multiple="true" :limit="8" />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { productMallCheck, baseFbtAddressFind } from "@/api/warehouse";

export default {
    name: "CheckAudit",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object,
        status: Number
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = reactive({
            ids: [],
            receiveWareId: "",
            status: 1, //状态1：同意，2：驳回
            reason: "",
            voucherImgs: []
        });

        const rules = {
            reason: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };

        watch(
            () => props.status,
            (nVal) => {
                form.status = nVal;
            }
        );
        watch(
            () => props.row,
            (nVal) => {
                form.ids = [props.row.id];
                //0=Tospino物流 1=第三方物流
                if (addressListAll && addressListAll.length) {
                    if (props.row.firstExpress == "0") {
                        addressList.value = addressListAll.filter((item) => {
                            return item.sendModel == 2;
                        });
                    } else {
                        addressList.value = addressListAll.filter((item) => {
                            return item.sendModel == 1;
                        });
                    }
                }
            },
            {
                immediate: true
            }
        );

        //集货仓地址
        let addressListAll = [];
        let addressList = ref([]);
        const getBaseFbtAddressFind = () => {
            baseFbtAddressFind({ type: 1 })
                .then((res) => {
                    addressListAll = res.data;
                    //0=Tospino物流 1=第三方物流
                    if (props.row.firstExpress == "0") {
                        addressList.value = addressListAll.filter((item) => {
                            return item.sendModel == 2;
                        });
                    } else {
                        addressList.value = addressListAll.filter((item) => {
                            return item.sendModel == 1;
                        });
                    }
                })
                .catch((err) => {});
        };
        getBaseFbtAddressFind();

        //上传图片
        const onChangeUpload = (fileList) => {
            form.voucherImgs = fileList; //.map((item) => item.url);
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    const address = addressList.value.filter((item) => {
                        return item.id === form.receiveWareId;
                    });
                    const params = {
                        ...form,
                        receiveWare: (address && address.length > 0 && address[0].name) || "",
                        voucherImgs: form.voucherImgs.map((item) => item.url) || []
                    };
                    productMallCheck(params)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            proxy.$message.success(res.msg);
                            form.voucherImgs = [];
                            formRef.value.resetFields();
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
            form.voucherImgs = [];
            formRef.value.resetFields();
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
