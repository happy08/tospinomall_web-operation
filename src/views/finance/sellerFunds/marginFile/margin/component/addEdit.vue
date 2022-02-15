<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600" :showFooter="disabled">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 充值扣款区域 -->
            <div v-if="form.num == 0">
                <!-- 充值类型 -->
                <el-form-item :label="$t('margin.rechargeType')" prop="businessType">
                    <el-radio-group v-model="form.businessType">
                        <el-radio :label="4">{{ $t("margin.recharge") }}</el-radio>
                        <el-radio :label="3">{{ $t("margin.deduction") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 关联卖家 -->
                <el-form-item :label="$t('margin.associatedSeller')" prop="sellerId">
                    <!-- <el-select v-model="form.sellerId">
                        <el-option v-for="item in sellersInfoList" :key="item.userId" :label="item.storeName" :value="item.userId"></el-option>
                    </el-select> -->
                    <!-- --- -->
                    <el-select v-model="form.sellerId" filterable remote reserve-keyword :placeholder="$t('pleaseEnter')" :remote-method="sellersInfo" :loading="loading">
                        <el-option v-for="item in sellersInfoList" :key="item.userId" :label="item.storeName" :value="item.userId"></el-option>
                    </el-select>
                    <!-- --- -->
                </el-form-item>
                <!-- 费用金额 -->
                <el-form-item :label="$t('margin.amount')" prop="amount">
                    <div class="flex">
                        <el-input v-model.number="form.amount" type="number" @blur="amountCheck()"></el-input>
                        <span class="ml-20">{{ $store.state.app.currencySymbol }}</span>
                    </div>
                </el-form-item>
                <!-- 上传凭证 -->
                <el-form-item :label="$t('withdrawalManagement.certificate')" prop="imgs">
                    <BmUpload @change="onChangeUpload($event, 'voucherUrl')" :fileList="form.voucherUrl" :multiple="true" :limit="3" :tip="$t('withdrawalManagement.maxThree')" />
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('marginTable.remark')" prop="remark">
                    <el-input v-model="form.remark" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </div>
            <!-- 充值处理视窗区域 -->
            <div v-if="form.num == 1">
                <!-- 充值金额 -->
                <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                    <el-form-item :label="$t('marginTable.amount')">
                        <span>{{ form.amount }}</span>
                    </el-form-item>
                    <!-- 图片 -->
                    <el-form-item :label="$t('withdrawalManagement.certificate')" prop="picUrl">
                        <BmUpload @change="onChangeUpload($event, 'picUrl')" :fileList="form.picUrl" :multiple="true" :limit="8" />
                    </el-form-item>
                    <!-- 备注 -->
                    <el-form-item :label="$t('marginTable.remark')" prop="remark">
                        <el-input v-model="form.remark" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 提现审核视窗区域 -->
            <div v-if="form.num == 2">
                <!-- 通过/驳回 -->
                <el-form-item :label="$t('withdrawalManagement.result')" prop="result">
                    <el-radio-group v-model="form.result">
                        <el-radio :label="1">{{ $t("status.pass") }}</el-radio>
                        <el-radio :label="0">{{ $t("status.reject") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 原因 -->
                <el-form-item :label="$t('withdrawalManagement.reason')" prop="reason">
                    <el-input v-model="form.reason" :placeholder="$t('pleaseEnter')" type="textarea" maxlength="100" show-word-limit></el-input>
                </el-form-item>
                <!-- 图片上传 -->
                <el-form-item :label="$t('withdrawalManagement.picture')" prop="imgs">
                    <BmUpload @change="onChangeUpload($event, 'imgs')" :fileList="form.imgs" :multiple="true" :limit="8" />
                </el-form-item>
            </div>
            <!-- 提现处理视窗区域 -->
            <div v-if="form.num == 3">
                <!-- 提现单号 -->
                <!-- <el-form-item
            :label="$t('withdrawalManagementTable.withdrawNo')"
            prop="withdrawNo"
          >
            <span>{{ form.withdrawNo }}</span>
          </el-form-item> -->
                <!-- 转账金额 -->
                <!-- <el-form-item
            :label="$t('withdrawalManagement.amount')"
            prop="amount"
          >
            <span>{{ form.amount }}</span>
          </el-form-item> -->
                <!-- 开户人 -->
                <!-- <el-form-item :label="$t('withdrawalManagement.accountHolder')">
            <span>{{ form.holder }}</span>
          </el-form-item> -->
                <!-- 银行账号 -->
                <!-- <el-form-item :label="$t('withdrawalManagement.bankCardNum')">
            <span>{{ form.creditedAccount }}</span>
          </el-form-item> -->
                <!-- 转账流水号 -->
                <el-form-item :label="$t('withdrawalManagement.transferSerialNo')" prop="serialNo">
                    <el-input v-model="form.serialNo"></el-input>
                </el-form-item>
                <!-- 凭证 -->
                <el-form-item :label="$t('withdrawalManagement.certificate')" prop="imgs">
                    <BmUpload @change="onChangeUpload($event, 'imgs')" :fileList="form.imgs" :multiple="true" :limit="8" />
                </el-form-item>
            </div>
            <!-- 扣款处理视窗区域 -->
            <div v-if="form.num == 4">
                <!-- 转账流水号 -->
                <!-- 系统扣款不需要流水号 -->
                <el-form-item :label="$t('withdrawalManagement.transferSerialNo')" prop="serialNo" v-if="form.payChannel != 4">
                    <el-input v-model="form.serialNo"></el-input>
                </el-form-item>
                <!-- 凭证 -->
                <el-form-item :label="$t('withdrawalManagement.certificate')" prop="imgs">
                    <BmUpload @change="onChangeUpload($event, 'imgs')" :fileList="form.imgs" :multiple="true" :limit="8" />
                </el-form-item>
            </div>
            <!-- 查看驳回详情视窗区域 -->
            <div v-if="form.num == 5">
                <!-- 驳回原因 -->
                <el-form-item :label="$t('withdrawalManagement.viewDismissal')">
                    <span>{{ form.rejectReason }}</span>
                </el-form-item>
                <!-- 凭证 -->
                <el-form-item :label="$t('withdrawalManagement.picture')" prop="imgs">
                    <span v-for="(item, index) in form.picUrl" :key="index">
                        <BmImage :src="item" style="width:100px; height:100px" />
                    </span>
                </el-form-item>
            </div>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { marginWithdrawalReview, withdrawalProcessing, getAllStoreInfo, rechargeOrWithhold, rechargeAudit } from "@/api/finance";
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
                // 判断操作，确定标题
                if (form.value.num == 0) {
                    title.value = proxy.$t("margin.recharge");
                    // 给关联卖家一个初始值
                    form.value.sellerId = "";
                    form.value.voucherUrl = [];
                    // 给充值类型一个初始值
                    form.value.businessType = 4;
                    sellersInfo();
                    // 调用获取所有卖家信息的接口
                } else if (form.value.num == 1) {
                    title.value = proxy.$t("margin.rechargeConfirm");
                    flag.value = true;
                    // 将凭证从url字符串转为数组
                    form.value.picUrl = (form.value.picUrl && form.value.picUrl.split(",")) || [];
                } else if (form.value.num == 2) {
                    title.value = proxy.$t("status.audit");
                    flag.value = true;
                } else if (form.value.num == 3) {
                    title.value = proxy.$t("margin.withdrawalProcessing");
                } else if (form.value.num == 4) {
                    title.value = proxy.$t("margin.deductionProcessing");
                } else if (form.value.num == 5) {
                    title.value = proxy.$t("margin.lookRejectDetail");
                    disabled.value = false;
                    // 将图片url字符串转为数组
                    form.value.picUrl = form.value.picUrl.split(",");
                }
            }
        );
        // 标题
        let title = ref("");
        // 是否显示底部的取消确认按钮控制变量
        let disabled = ref(true);
        const rules = {
            result: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            reason: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            serialNo: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            businessType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            sellerId: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            amount: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        //上传图片
        const onChangeUpload = (fileList, type) => {
            form.value[type] = fileList; //fileList.map((item) => item.url)
        };
        // 表单验证信息是否通过控制变量
        let flag = ref(false);
        const formRef = ref(null);
        // 充值/扣款金额正则验证表达式
        const amountReg = new RegExp(/^[1-9][0-9]{0,9}(\.[0-9]{0,2})?$/);
        const amountCheck = () => {
            if (amountReg.test(form.value.amount)) {
                flag.value = true;
            } else {
                proxy.$message.warning(proxy.$t("margin.amountTips"));
            }
        };
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (!flag.value && form.value.num != 4) {
                    proxy.$message.warning(proxy.$t("margin.amountTips"));
                    return;
                }
                if (valid) {
                    // 图片格式处理
                    debugger
                    form.value.imgs = (form.value.imgs && form.value.imgs.join(",")) || "";
                    form.value.picUrl = (form.value.picUrl && form.value.picUrl.join(",")) || "";
                    // 判断操作类型
                    if (form.value.num == 0) {
                        // 充值/扣款
                        if (form.value.voucherUrl) {
                            form.value.voucherUrl = form.value.voucherUrl.map((item) => {
                                item = item.url;
                                return item;
                            });
                            form.value.voucherUrl = form.value.voucherUrl.join(",");
                        } else {
                            form.value.voucherUrl = "";
                        }
                        rechargeOrWithhold(form.value)
                            .then((res) => {})
                            .catch(() => {});
                    } else if (form.value.num == 1) {
                        // 充值处理
                        rechargeAudit(form.value)
                            .then((res) => {})
                            .catch(() => {});
                    } else if (form.value.num == 2) {
                        // 提现审核
                        marginWithdrawalReview(form.value)
                            .then((res) => {})
                            .catch(() => {});
                    } else if (form.value.num == 3 || form.value.num == 4) {
                        // 提现/扣款处理
                        withdrawalProcessing(form.value)
                            .then((res) => {})
                            .catch(() => {});
                    }
                    emit("reloadData");
                    emit("update:visible", false);
                    formRef.value.resetFields();
                } else {
                    return false;
                }
            });
        };
        // 所有卖家信息列表
        const sellersInfoList = ref([]);
        // 获取所有卖家信息(拿到sellerID)
        const sellersInfo = (storeName) => {
            getAllStoreInfo({ storeName })
                .then((res) => {
                    sellersInfoList.value = res.data;
                })
                .catch(() => {});
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
            onChangeUpload,
            title,
            disabled,
            sellersInfo,
            sellersInfoList,
            amountCheck
        };
    }
};
</script>
