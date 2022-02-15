<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="1200" :showFooter="disabled">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 审核视窗区域 -->
            <div v-if="form.type == 'audit'">
                <!-- 审核/驳回 -->
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
                    <BmUpload @change="onChangeUpload($event)" :fileList="form.imgs" :multiple="true" :limit="8" />
                </el-form-item>
            </div>
            <!-- 转账/推送至Payoneer视窗区域 -->
            <div v-if="form.type == 'transfer' || form.type == 'payoneer'">
                <div v-if="phoneVisible">
                    <div class="tc mb-20">
                        <span>{{ $t("withdrawalManagement.phoneVerification") }}</span>
                    </div>
                    <!-- 手机号输入 -->
                    <el-form-item prop="phone">
                        <el-input :placeholder="$t('withdrawalManagement.pleaseEnterPhone')" v-model="financePhoneObj.value" disabled>
                            <template #prepend>
                                <el-button type="plain" style="width:100px">{{ financePhoneObj.unit }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <!-- 手机号验证码 -->
                    <el-form-item prop="phoneCode">
                        <el-input :placeholder="$t('withdrawalManagement.pleaseEnterCode')" v-model="phoneCode">
                            <template #append>
                                <el-button :type="buttonType" :disabled="getCodeButtonDisable" @click="handleCode">{{ buttonText }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>
                <!-- 转账v-else-if="phoneVisible == false"
         -->
                <div v-else-if="phoneVisible == false">
                    <div>
                        <!-- 提现单号 -->
                        <el-form-item :label="$t('withdrawalManagementTable.withdrawNo')" prop="withdrawNo">
                            <span>{{ form.withdrawNo }}</span>
                        </el-form-item>
                        <!-- 转账金额 -->
                        <el-form-item :label="$t('withdrawalManagement.amount')" prop="amount">
                            <span>{{ form.amount }}</span>
                        </el-form-item>
                        <!-- 开户人 -->
                        <el-form-item :label="$t('withdrawalManagement.accountHolder')">
                            <span>{{ form.holder }}</span>
                        </el-form-item>
                        <!-- 银行账号 -->
                        <el-form-item :label="$t('withdrawalManagement.bankCardNum')">
                            <span>{{ form.creditedAccount }}</span>
                        </el-form-item>
                        <!-- 转账流水号 -->
                        <el-form-item :label="$t('withdrawalManagement.transferSerialNo')" prop="serialNo">
                            <el-input v-model="form.serialNo"></el-input>
                        </el-form-item>
                        <!-- 凭证 -->
                        <el-form-item :label="$t('withdrawalManagement.certificate')" prop="imgs2">
                            <BmUpload @change="onChangeUpload2($event)" :fileList="form.imgs2" :multiple="true" :limit="8" />
                        </el-form-item>
                    </div>
                    <div>
                        <div class="flex vcenter between p-10" style="background: #f2f2f2;">
                            <!-- 订单编号 -->
                            <!-- <el-form-item :label="$t('orderQuery.orderNumber')" prop="orderSn" class="mb-0">
                                <el-input v-model="orderSn" :placeholder="$t('pleaseEnter')"></el-input>
                            </el-form-item> -->
                            <div></div>
                            <div>
                                <!-- 导出标记订单 -->
                                <!-- <el-button @click="exportMarkOrder" type="primary">
                                    导出标记订单
                                </el-button> -->
                                <!-- 重置 -->
                                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                            </div>
                        </div>
                        <!-- <div class="green tr p-10">您当前标记订单已超出浮动范围,建议手动标记</div> -->
                        <BmTable
                            ref="multipleTable"
                            :data="tableData"
                            v-loading="tableLoading"
                            :row-key="
                                (row) => {
                                    return row.id;
                                }
                            "
                            @selection-change="handleSelectionChange"
                        >
                            <BmTableColumn type="selection" :reserve-selection="true"></BmTableColumn>
                            <!-- 订单编号 -->
                            <BmTableColumn :label="$t('orderQuery.orderNumber')" prop="orderSn" align="center"></BmTableColumn>
                            <!-- 下单时间 -->
                            <BmTableColumn :label="$t('orderQuery.orderTime')" prop="createTime" align="center"></BmTableColumn>
                            <!-- 商品总价 -->
                            <BmTableColumn :label="$t('orderQuery.CommodityPrice')" prop="productAmount" align="center">
                                <template #header>
                                    <div>{{ $t("orderQuery.CommodityPrice") }}</div>
                                    <div class="red">{{ $store.state.app.currencySymbol }}{{ productAmount }}</div>
                                </template>
                            </BmTableColumn>
                            <!-- 交易总额 -->
                            <BmTableColumn :label="$t('orderQuery.grossMerchandiseVolume')" prop="payAmount" align="center">
                                <template #header>
                                    <div>{{ $t("orderQuery.grossMerchandiseVolume") }}</div>
                                    <div class="red">{{ $store.state.app.currencySymbol }}{{ payAmount }}</div>
                                </template>
                            </BmTableColumn>
                            <!-- 订单状态 -->
                            <BmTableColumn :label="$t('orderQuery.orderStatus')" prop="status" align="center">
                                <template #default="scope">
                                    {{
                                        scope.row.status == 0
                                            ? $t("billingDetails.pendingPayment") // "待付款"
                                            : scope.row.status == 1
                                            ? $t("billingDetails.toBeDelivered") // "待发货"
                                            : scope.row.status == 2
                                            ? $t("billingDetails.toBeReceived") // "待收货"
                                            : scope.row.status == 4
                                            ? $t("billingDetails.completed") // "已完成"
                                            : scope.row.status == 5
                                            ? $t("billingDetails.cancelled") // "已取消"
                                            : scope.row.status == 6
                                            ? $t("billingDetails.overtimeUnpaid") + $t("platform.orderCloseForTimeout") // "超时未付款(订单关闭)"
                                            : scope.row.status == 7
                                            ? $t("platform.orderCloseForAfterSale") // "未发货发起售后关闭(订单关闭)"
                                            : scope.row.status == 8
                                            ? $t("billingDetails.orderClose") // "订单关闭(活到付款拒签关闭)"
                                            : ""
                                    }}
                                </template>
                            </BmTableColumn>
                        </BmTable>
                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"> </BmPagination>
                    </div>
                </div>
            </div>
            <!-- 查看转账详情视窗区域 -->
            <div v-if="form.type == 'viewTransfer'">
                <!-- 提现单号 -->
                <el-form-item :label="$t('withdrawalManagementTable.withdrawNo')">
                    <span>{{ form.withdrawNo }}</span>
                </el-form-item>
                <!-- 转账金额 -->
                <el-form-item :label="$t('withdrawalManagement.amount')">
                    <span>{{ form.amount }} {{ $store.state.app.currencySymbol }}</span>
                </el-form-item>
                <!-- 开户人 -->
                <el-form-item :label="$t('withdrawalManagement.accountHolder')">
                    <span>{{ form.holder }}</span>
                </el-form-item>
                <!-- 银行账号 -->
                <el-form-item :label="$t('withdrawalManagement.bankCardNum')">
                    <span>{{ form.creditedAccount }}</span>
                </el-form-item>
                <!-- 转账流水号 -->
                <el-form-item :label="$t('withdrawalManagement.transferSerialNo')">
                    <span>{{ form.serialNo }}</span>
                </el-form-item>
                <!-- 凭证 -->
                <el-form-item :label="$t('withdrawalManagement.certificate')" prop="imgs">
                    <span v-for="(item, index) in form.picUrl" :key="index">
                        <BmImage :src="item" style="width:100px; height:100px" />
                    </span>
                </el-form-item>
                <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading">
                    <!-- 订单编号 -->
                    <BmTableColumn :label="$t('orderQuery.orderNumber')" prop="orderSn" align="center"></BmTableColumn>
                    <!-- 下单时间 -->
                    <BmTableColumn :label="$t('orderQuery.orderTime')" prop="createTime" align="center"></BmTableColumn>
                    <!-- 商品总价 -->
                    <BmTableColumn :label="$t('orderQuery.CommodityPrice')" prop="productAmount" align="center">
                        <template #header>
                            <div>{{ $t("orderQuery.CommodityPrice") }}</div>
                            <!-- <div class="red">{{ $store.state.app.currencySymbol }}{{ productAmount }}</div> -->
                        </template>
                    </BmTableColumn>
                    <!-- 交易总额 -->
                    <BmTableColumn :label="$t('orderQuery.grossMerchandiseVolume')" prop="payAmount" align="center">
                        <template #header>
                            <div>{{ $t("orderQuery.grossMerchandiseVolume") }}</div>
                            <!-- <div class="red">{{ $store.state.app.currencySymbol }}{{ payAmount }}</div> -->
                        </template>
                    </BmTableColumn>
                    <!-- 订单状态 -->
                    <BmTableColumn :label="$t('orderQuery.orderStatus')" prop="status" align="center">
                        <template #default="scope">
                            {{
                                scope.row.status == 0
                                    ? $t("billingDetails.pendingPayment") // "待付款"
                                    : scope.row.status == 1
                                    ? $t("billingDetails.toBeDelivered") // "待发货"
                                    : scope.row.status == 2
                                    ? $t("billingDetails.toBeReceived") // "待收货"
                                    : scope.row.status == 4
                                    ? $t("billingDetails.completed") // "已完成"
                                    : scope.row.status == 5
                                    ? $t("billingDetails.cancelled") // "已取消"
                                    : scope.row.status == 6
                                    ? $t("billingDetails.overtimeUnpaid") + $t("platform.orderCloseForTimeout") // "超时未付款(订单关闭)"
                                    : scope.row.status == 7
                                    ? $t("platform.orderCloseForAfterSale") // "未发货发起售后关闭(订单关闭)"
                                    : scope.row.status == 8
                                    ? $t("billingDetails.orderClose") // "订单关闭(活到付款拒签关闭)"
                                    : ""
                            }}
                        </template>
                    </BmTableColumn>
                </BmTable>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"> </BmPagination>
            </div>
            <!-- 查看驳回原因视窗区域 -->
            <div v-if="form.type == 'viewDismissal'">
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
        <BmDialog v-model:visible="payoneerVisible" width="20vw" :cancel="logCancel" :confirm="logConfirm">
            <div class="flex">
                <div class="mr-15 mt-30">
                    <i class="el-icon-warning" style="fontSize:50px;color:#FFD939"></i>
                </div>
                <div class="tl">
                    <div class="fs-12">{{ $t("withdrawalManagement.withdrawalAmount") }}:{{ form.trueRow.currenyAmount }}{{ form.trueRow.currency }}</div>
                    <div class="light-grey fs-16">
                        <div>
                            {{ $t("withdrawalManagement.payonnerConfirmtip1") }}
                        </div>
                        <div>
                            {{ $t("withdrawalManagement.payonnerConfirmtip2") }}
                        </div>
                        <div class="mt-15 fs-12">{{ $t("withdrawalManagement.payonnerCurrentBalance") }}{{ withdrawableAmount }}{{ form.trueRow.currency }}</div>
                    </div>
                </div>
            </div>
        </BmDialog>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import {
    financeRefund,
    withdrawalReview,
    pushToPayoneer,
    getSellerAccountsReceivable,
    getFinancePhone,
    getFinancePhoneVerificationCode,
    verifyFinancePhoneCode,
    confirmTransfer,
    getPayonnerbalance,
    getOrderFindSellerTagWithdrawOrders,
    baseFinanceMoneyFindByCode,
    financeSellerFindWithdrawDetail
} from "@/api/finance";
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
        let form = ref({
            orderIds: "",
            ids: []
        });

        let scopeExceed = false; // 是否超出浮动范围

        watch(
            () => props.row,
            (nVal) => {
                console.log(props.row, "33333333333333333");
                form.value = { ...props.row };
                // 判断操作，确定标题
                if (form.value.type == "audit") {
                    // 审核
                    title.value = proxy.$t("status.audit");
                } else if (form.value.type == "transfer") {
                    // 转账
                    title.value = proxy.$t("withdrawalManagement.transfer");
                    // 调卖家开户信息接口
                    getSellerAccount({
                        creditedAccount: form.value.creditedAccount,
                        type: form.value.accountType
                    });
                    getCwPhone();
                    initData();
                } else if (form.value.type == "viewTransfer") {
                    // 查看转账详情
                    disabled.value = false;
                    title.value = proxy.$t("withdrawalManagement.transferDetails");
                    // 调卖家开户信息接口
                    getSellerAccount({
                        creditedAccount: form.value.creditedAccount,
                        type: form.value.accountType
                    });
                    // 将图片url字符串转为数字
                    form.value.picUrl = form.value.picUrl.split(",");
                    initData();
                } else if (form.value.type == "viewDismissal") {
                    // 查看驳回原因
                    disabled.value = false;
                    title.value = proxy.$t("withdrawalManagement.viewDismissal");
                    // 将图片url字符串转为数字
                    form.value.picUrl = form.value.picUrl.split(",");
                } else if (form.value.type == "payoneer") {
                    // 调用获取财务手机号接口
                    getCwPhone();
                    title.value = "";
                }
                phoneVisible.value = true;
                form.value.ids = [];
                form.value.orderIds = "";
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
            imgs2: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };

        //上传图片
        const onChangeUpload = (fileList) => {
            let imgs = fileList.map((item) => item.url);
            if (imgs && imgs.length) {
                form.value.voucherPic = imgs.join(",");
            }
        };

        // 流水凭证
        const onChangeUpload2 = (fileList) => {
            form.value.imgs2 = fileList;
        };

        const formRef = ref(null);
        // 手机号
        let phone = ref("");
        // 手机号验证码
        let phoneCode = ref("");
        // 手机号前缀
        let phonePrefix = ref("");
        // 手机号验证视窗区域显示控制变量
        let phoneVisible = ref(true);
        // 获取短信验证码按钮的type变量
        let buttonType = ref("sucssess");
        // 控制短信验证码按钮是否禁用变量
        let getCodeButtonDisable = ref(false);
        //  短信按钮显示内容变量
        let buttonText = ref(proxy.$t("receiveAddress.getVerificationCode"));
        // 获取短信验证码倒计时变量
        let countDownNumber = ref(59);
        // 倒计时定时器函数
        let countDownTime = null;
        const countDownTimeFn = () => {
            countDownNumber.value = 59;
            countDownTime = setInterval(() => {
                buttonText.value = countDownNumber.value;
                countDownNumber.value--;
                if (countDownNumber.value == 1) {
                    buttonText.value = proxy.$t("receiveAddress.getVerificationCode");
                    getCodeButtonDisable.value = false;
                    buttonType.value = "primary";
                    clearInterval(countDownTime);
                }
            }, 1000);
        };

        // 获取手机验证码
        const handleCode = () => {
            // if (financePhoneObj.value.unit == "" || financePhoneObj.value.value == "") {
            //     proxy.$message.error(proxy.$t("withdrawalManagement.pleaseEnterPhoneOrCode"));
            //     return;
            // }
            getCodeButtonDisable.value = true;
            buttonType.value = "info";
            countDownTimeFn();
            getFinancePhoneVerificationCode({
                phone: financePhoneObj.value.value, //phone.value,
                phonePrefix: financePhoneObj.value.unit, //phonePrefix.value.unit,
                userType: "operator"
            })
                .then((res) => {
                    phoneCode.value = res.data;
                })
                .catch(() => {});
        };

        // 获取指定卖家用户默认收款账户
        const getSellerAccount = (obj) => {
            getSellerAccountsReceivable(obj).then((res) => {
                form.value.holder = res.data.holder;
            });
        };

        // 财务手机号相关信息对象
        let financePhoneObj = ref({});
        // 获取财务手机号
        const getCwPhone = () => {
            getFinancePhone({ code: "CWPHONE" })
                .then((res) => {
                    financePhoneObj.value = res.data;
                })
                .catch(() => {});
        };

        let flag1 = false;
        // payoneer手机号验证成功后的弹窗界面显示关闭控制变量
        let payoneerVisible = ref(false);
        // payoneer可提现余额
        let withdrawableAmount = ref(0);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    // 判断操作类型
                    if (form.value.type == "audit") {
                        // 审核操作
                        if (form.value.imgs2 && form.value.imgs2.length) {
                            form.value.imgs = form.value.imgs2.map((item) => item.url).join(",");
                        }
                        withdrawalReview(form.value)
                            .then((res) => {
                                flag1 = false;
                            })
                            .catch(() => {});
                    } else if (form.value.type == "transfer" || form.value.type == "payoneer") {
                        if (financePhoneObj.value.value && phoneCode.value && financePhoneObj.value.unit) {
                        } else {
                            proxy.$message.error(proxy.$t("receiveAddress.PleaseFillInTheFormDataStandardly"));
                            return;
                        }

                        // 银行转账验证成功进行转账
                        if (form.value.transferVer) {
                            form.value.serial_no = form.value.serialNo;
                            if (form.value.imgs2 && form.value.imgs2.length) {
                                form.value.imgs = form.value.imgs2.map((item) => item.url).join(",");
                            }
                            if (form.value.orderIds == "") {
                                // "请勾选订单进行标记"
                                proxy.$message.error(proxy.$t("withdrawalManagement.pleaseOrderMark"));
                                return;
                            }
                            if (scopeExceed == true) {
                                // "您当前标记订单已超出浮动范围"
                                proxy.$message.error(proxy.$t("withdrawalManagement.orderMarkExceedScope"));
                                return;
                            }
                            // 验证通过后的确认转账
                            confirmTransfer(form.value)
                                .then(() => {
                                    flag1 = false;
                                    scopeExceed == false;
                                })
                                .catch(() => {
                                    return;
                                });
                        }
                        if (!flag1) {
                            // 先进行手机号验证
                            verifyFinancePhoneCode({
                                code: phoneCode.value,
                                phone: phone.value,
                                phonePrefix: phonePrefix.value,
                                userType: "operator"
                            })
                                .then((res) => {
                                    if (res.code == 0) {
                                        // 推送至payoneer
                                        if (form.value.type == "payoneer") {
                                            getPayonnerbalance({ sellerId: form.value.trueRow.sellerId })
                                                .then((res) => {
                                                    withdrawableAmount.value = res.data.withdrawableAmount;
                                                })
                                                .catch(() => {});
                                            payoneerVisible.value = true;
                                        } else {
                                            // 银行转账
                                            // 验证成功
                                            proxy.$message.success(res.msg);
                                            phoneVisible.value = false;
                                            form.value.transferVer = true;
                                            flag1 = true;
                                        }
                                    } else {
                                        proxy.$message.error(res.msg);
                                        return;
                                    }
                                })
                                .catch(() => {});
                        }
                    }
                    if (!flag1) {
                        return;
                    }
                    emit("reloadData");
                    emit("update:visible", false, form.value.type);
                    formRef.value.resetFields();
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            flag1 = false;
            scopeExceed == false;
            emit("update:visible", false);
            phonePrefix.value = phone.value = phonePrefix.value = "";
            formRef.value.resetFields();
            phoneVisible.value = true;
            disabled.value = true;
        };

        const logCancel = () => {
            payoneerVisible.value = false;
        };

        const logConfirm = () => {
            pushToPayoneer({ id: form.value.id })
                .then(() => {
                    payoneerVisible.value = false;
                    emit("reloadData");
                    emit("update:visible", false, form.value.type);
                    formRef.value.resetFields();
                })
                .catch(() => {});
        };

        // -----------------转账分页----------------------
        let payAmount = ref(0); // 交易总额
        let productAmount = ref(0); //商品总价
        watch(
            () => payAmount.value,
            (nVal) => {
                let scopeValue = Number(scope.value) / 100; // 浮动范围
                let scopeMoney = Math.abs(form.value.amount - payAmount.value); // 浮动金额
                let scopeMaxMoney = Math.abs(form.value.amount * scopeValue); // 允许浮动的最大金额
                if (scopeMoney > scopeMaxMoney) {
                    scopeExceed = true;
                    proxy.$message.error(proxy.$t("withdrawalManagement.orderMarkExceedScope"));
                }
            }
        );

        // 分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let orderSn = ref(""); // 订单号搜索
        let tableData = ref([]);
        let scope = ref(); // 浮动值

        let tableLoading = ref(true);
        const getListPage = () => {
            tableLoading.value = true;
            // 获取 资金 浮动范围
            baseFinanceMoneyFindByCode().then((res) => {
                console.log(res);
                scope.value = res.data.value;
            });
            if (form.value.type == "viewTransfer") {
                financeSellerFindWithdrawDetail({ id: props.row.id })
                    .then((res) => {
                        console.log(res);
                        tableData.value = res.data.orders;
                        pageTotal.value = res.data.total;
                        tableLoading.value = false;
                    })
                    .catch((err) => {
                        tableLoading.value = false;
                    });
            } else {
                getOrderFindSellerTagWithdrawOrders({ sellerId: props.row.sellerId, orderSn: orderSn.value, pageNo: pageNo.value, pageSize })
                    .then((res) => {
                        console.log(res);
                        tableData.value = res.data.records;
                        pageTotal.value = res.data.total;
                        tableLoading.value = false;
                    })
                    .catch((err) => {
                        tableLoading.value = false;
                    });
            }
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        // initData();

        //搜索
        const handleSearch = () => {
            initData();
        };

        // 转账勾选订单 选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            payAmount.value = 0;
            productAmount.value = 0;
            form.value.orderIds = "";
            tableSelectionRows = rows;
            console.log(form.value.ids);
            rows.forEach((item) => {
                form.value.ids.push(item.id);
                payAmount.value = payAmount.value + item.payAmount;
                productAmount.value = productAmount.value + item.productAmount;
            });
            form.value.orderIds = form.value.ids.join(",");
        };

        // 重置
        const resetForm = () => {
            tableSelectionRows = [];
            // searchFormRef.value.resetFields();
            initData();
        };

        // 导出标记订单
        const exportMarkOrder = () => {};

        //当前页
        const handleCurrentChange = (val) => {
            pageNo.value = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            pageNo.value = 1;
            pageSize = val;
            initData();
        };

        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            onChangeUpload,
            title,
            phone,
            phoneCode,
            phonePrefix,
            handleCode,
            phoneVisible,
            disabled,
            getSellerAccount,
            buttonType,
            getCodeButtonDisable,
            buttonText,
            countDownNumber,
            getCwPhone,
            financePhoneObj,
            onChangeUpload2,
            logCancel,
            logConfirm,
            payoneerVisible,
            withdrawableAmount,
            pageNo,
            pageTotal,
            tableLoading,
            tableData,
            handleSearch,
            resetForm,
            handleSelectionChange,
            handleCurrentChange,
            handleSizeChange,
            orderSn,
            payAmount,
            productAmount,
            exportMarkOrder
        };
    }
};
</script>
