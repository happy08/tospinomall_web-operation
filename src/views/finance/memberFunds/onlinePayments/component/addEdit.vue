<template>
    <BmDialog v-model:visible="visible" :title="dialogTitle" :confirm="confirm" :cancel="cancel" :showFooter="form.action == 'look' ? false : true" :width="600">
        <!-- 新增和修改视窗区域 -->
        <div v-if="form.action !== 'look'">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <!-- 订单号 -->
                <el-form-item :label="$t('onlinePayments.associatedOrderNo1')" prop="associatedOrderNo">
                    <el-input v-model="form.associatedOrderNo" disabled></el-input>
                </el-form-item>
                <!-- 支付方式 -->
                <el-form-item :label="$t('onlinePaymentTable.paymentType')" prop="paymentType">
                    <el-select v-model="form.paymentType" disabled>
                        <el-option v-for="(item, key) in 8" :key="key" :label="$t(`orderQuery.payType[${key}]`)" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 支付货币 -->
                <el-form-item :label="$t('onlinePayments.paymentCurrency')" prop="currencyName">
                    <span>{{ form.currencyShortName }}</span>
                </el-form-item>
                <!-- 应付金额 -->
                <el-form-item :label="$t('onlinePayments.amountsPayable')" prop="orderReceivableAmount">
                    <el-input v-model="form.orderReceivableAmount" :placeholder="$t('pleaseEnter')" disabled>
                        <template #append>{{ form.currencyShortName }}</template>
                    </el-input>
                </el-form-item>
                <!-- 实收金额 -->
                <el-form-item :label="$t('onlinePayments.orderReceiptsAmount')" prop="orderReceiptsAmount">
                    <el-input v-model="form.orderReceiptsAmount" :placeholder="$t('pleaseEnter')" @blur="differenceAmountChange(form.orderReceiptsAmount)">
                        <template #append>{{ form.currencyShortName }}</template>
                    </el-input>
                </el-form-item>
                <!-- 差额 -->
                <el-form-item :label="$t('copingManagement.difference')" prop="differenceAmount">
                    <span class="red">{{ differenceAmount }}</span>
                </el-form-item>
                <!-- 交易凭证 -->
                <el-form-item :label="$t('onlinePaymentTable.transactionVoucher')" prop="transactionVoucher">
                    <el-input v-model="form.transactionVoucher" :disabled="form.action != 'pay'"></el-input>
                </el-form-item>
                <!-- 凭证上传 -->
                <el-form-item :label="$t('copingManagement.voucherPictrue')" prop="voucherPic" v-if="form.action == 'pay'">
                    <!-- <BmUpload @change="onChangeUpload($event)" :fileList="form.voucherPic" :multiple="true" :limit="8" /> -->
                    <BmUpload @change="onChangeUpload($event)" :fileList="form.voucherPic" :multiple="true" :limit="8" :disabled="form.action != 'pay'" />
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('copingManagementTable.remarks')" prop="remark">
                    <el-input v-model="form.remark" type="textarea" maxlength="255" show-word-limit :disabled="form.action != 'pay'"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <!-- 查看操作记录视窗区域 -->
        <div v-else-if="form.action == 'look'">
            <el-timeline v-if="activities.length">
                <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
                    <div class="flex between h-100">
                        <!-- 订单号 -->
                        <span class="iblock mr-20">{{ $t("onlinePayments.order") }}:{{ activity.content.associatedOrderNo }}</span>
                        <!-- 支付方式 -->
                        <span class="iblock mr-20"
                            >{{ $t("onlinePaymentTable.paymentType") }}:
                            <span v-if="activity.content.paymentType">
                                {{ $t(`orderQuery.payType[${activity.content.paymentType}]`) }}
                                <span v-if="activity.content.platformPayTypeName">-{{ activity.content.platformPayTypeName }}</span>
                            </span>
                        </span>
                        <!-- 实收金额 -->
                        <span>{{ $t("onlinePayments.orderReceiptsAmount") }}:{{ activity.content.orderReceiptsAmount }}</span>
                    </div>
                    <div class="mtb-10">
                        <!-- 交易凭证 -->
                        <span class="iblock mr-20">{{ $t("onlinePaymentTable.transactionVoucher") }}:{{ activity.content.transactionVoucher }}</span>
                        <!-- 操作人 -->
                        <span>{{ $t("onlinePayments.operator") }}:{{ activity.content.userName }}</span>
                    </div>
                    <div>
                        <!-- 下载凭证图片按钮 -->
                        <template v-if="activity.content.voucherPic">
                            <BmImage
                                v-for="item in activity.content.voucherPic.split(',')"
                                :key="item"
                                :src="item"
                                :preview-src-list="activity.content.voucherPic.split(',')"
                                style="width:50px;height:50px"
                            />
                        </template>
                    </div>
                </el-timeline-item>
            </el-timeline>
            <BmNoData v-else :text="$t('noData')" />
        </div>
    </BmDialog>
</template>

<script>
import { ref, inject, getCurrentInstance, watch } from "vue";
import { siteCurrency, onlinePayBatchAdd, onlinePayEdit, queryOperationRecordById } from "@/api/finance";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["update:visible", "reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = {
                    ...props.row,
                    voucherPic: (props.row.voucherPic && props.row.voucherPic.split(",")) || []
                };
                // 获取查看操作数据
                if (form.value.action == "look") {
                    queryOperationRecordById({ paymentId: form.value.paymentId })
                        .then((res) => {
                            let associatedOrderNo = form.value.associatedOrderNo;
                            form.value = res.data;
                            if (!form.value.length) {
                                activities.value = [];
                            } else {
                                form.value = res.data.map((item, index) => {
                                    // 支付方式(数字转文字 1余额支付，2MTN)
                                    for (let i in dict.value.payMethod) {
                                        if (dict.value.payMethod[i].value == item.paymentType) {
                                            item.paymentTypeName = dict.value.payMethod[i].name;
                                            break;
                                        }
                                    }
                                    activities.value[index] = {
                                        content: {
                                            associatedOrderNo: associatedOrderNo, // 订单号
                                            paymentTypeName: item.paymentTypeName, // 支付方式
                                            orderReceiptsAmount: item.orderReceiptsAmount, // 实收金额
                                            transactionVoucher: item.transactionVoucher, // 交易凭证
                                            userName: item.userName, // 操作人
                                            voucherPic: item.voucherPic
                                        },
                                        timestamp: item.createTime
                                    };
                                    return item;
                                });
                            }
                            form.value.action = "look";
                        })
                        .catch(() => {});
                } else {
                    if (form.value.action == "topAdd") {
                        form.value.associatedOrderNo = "";
                    }
                    // 请求当地货币信息
                    siteCurrency()
                        .then((res) => {
                            // 货币名称
                            form.value.currencyName = res.data.name;
                            // 货币名称英文
                            form.value.currencyShortName = res.data.shortName;
                            // 货币符号
                            form.value.currencySymbol = res.data.currency;
                        })
                        .catch(() => {});
                }
            }
        );
        // 标题
        let dialogTitle = ref("");
        // 标题判断
        if (form.value.action == "pay") {
            dialogTitle.value = proxy.$t("onlinePayments.addOnlinePay");
        } else if (form.value.action == "edit") {
            dialogTitle.value = proxy.$t("onlinePayments.changePaymentInformation");
        } else {
            dialogTitle.value = proxy.$t("onlinePayments.onlinePaymentChangeRecord");
        }
        // 退款差额(应付金额-实收金额)
        let differenceAmount = ref("");
        const differenceAmountChange = (num) => {
            if (!num) {
                form.value.orderReceiptsAmount = "";
                return;
            }
            differenceAmount.value = (form.value.orderReceivableAmount - form.value.orderReceiptsAmount).toFixed(2);
            if (!differenceAmount.value) {
                differenceAmount.value = "";
            }
            // 实收金额只能为大于等于零的两位小数
            if (num < 0) {
                form.value.orderReceiptsAmount = "";
                return proxy.$message.error(proxy.$t("onlinePayments.orderReceiptsAmountTips"));
            } else {
                //
                const returnFloat = (value) => {
                    var value = Math.round(parseFloat(value) * 100) / 100;
                    var xsd = value.toString().split(".");
                    if (xsd.length == 1) {
                        value = value.toString() + ".00";
                        return value;
                    }
                    if (xsd.length > 1) {
                        if (xsd[1].length < 2) {
                            value = value.toString() + "0";
                        }
                        return value;
                    }
                };
                form.value.orderReceiptsAmount = returnFloat(num);
            }
        };
        const rules = {
            paymentType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            orderReceiptsAmount: [
                {
                    required: true,
                    message: proxy.$t("onlinePayments.orderReceiptsAmountTips"),
                    trigger: "blur"
                }
            ],
            transactionVoucher: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            voucherPic: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        //上传图片
        const onChangeUpload = (fileList) => {
            form.value.voucherPic = fileList; //fileList.map((item) => item.url)
        };

        const formRef = ref(null);
        // 查看操作记录时间线数据
        let activities = ref([]);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    form.value.voucherPic = form.value.voucherPic.map((item) => item.url);
                    // 添加操作人为当前登录用户
                    form.value.createUser = proxy.$store.state.user.userInfo.account;
                    // 判断操作类型
                    if (form.value.action == "pay" || form.value.action == "edit") {
                        // 付款 || 修改
                        onlinePayEdit(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false, form.value.action);
                            })
                            .catch(() => {});
                    } else if (form.value.action == "topAdd") {
                        // 添加在线支付(批量)
                        onlinePayBatchAdd([form.value])
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false, form.value.action);
                                proxy.$message.success(res.msg);
                            })
                            .catch((err) => {
                                proxy.$message.error(err.msg);
                            });
                    } else {
                        // 查看变更记录
                        emit("update:visible", false, form.value.action);
                    }
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
            differenceAmount,
            differenceAmountChange,
            dialogTitle,
            activities
        };
    }
};
</script>
