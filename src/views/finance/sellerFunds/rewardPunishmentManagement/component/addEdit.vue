<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <!-- 审核视窗区域 -->
            <div v-if="form.type == 'deal'">
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
                    <BmUpload @change="onChangeUpload2($event)" :fileList="form.imgs" :multiple="true" :limit="8" />
                </el-form-item>
            </div>
            <!-- 新增/编辑 -->
            <div v-else-if="form.type == 'add' || form.type == 'edit'">
                <!-- 费用类型 -->
                <el-form-item :label="$t('rewardPunishmentManagement.rewardType')" prop="rewardType">
                    <el-radio-group v-model="form.rewardType">
                        <el-radio :label="1">{{ $t("rewardPunishmentManagement.supplement") }}</el-radio>
                        <el-radio :label="2">{{ $t("rewardPunishmentManagement.deduction") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 金额 -->
                <el-form-item :label="$t('rewardPunishmentManagementTable.amount')" prop="amount">
                    <el-input v-model="form.amount" type="number" @blur="amountCheck()"></el-input>
                </el-form-item>
                <!-- 选择卖家 -->
                <el-form-item :label="$t('rewardPunishmentManagement.sellerId')" prop="sellerId">
                    <BmSelectRemote
                        v-model="form.sellerId"
                        :remoteApi="getSellerListByKeywords"
                        keyword="keywords"
                        :option="{ label: 'phone', value: 'id' }"
                        @change="handleGetInfo(form.sellerId)"
                        :placeholder="$t('entryAudit.keywordTips')"
                    >
                    </BmSelectRemote>

                    <!-- <el-select v-model="form.sellerId" @change="handleGetInfo(form.sellerId)">
                        <el-option v-for="item in sellerInfoList" :key="item.id" :label="item.storeName" :value="item.userId"></el-option>
                    </el-select> -->
                </el-form-item>
                <!-- 关联订单 -->
                <el-form-item :label="$t('rewardPunishmentManagement.associatedOrder')" prop="associatedOrder">
                    <el-select v-model="form.associatedOrder" filterable>
                        <el-option v-for="item in orderInfoList" :key="item.id" :label="item.orderSn" :value="item.orderSn"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 关联售后单 -->
                <el-form-item :label="$t('rewardPunishmentManagement.associatedReturnOrder')" prop="associatedReturnOrder">
                    <el-select v-model="form.associatedReturnOrder" filterable>
                        <el-option v-for="item in afterSaleOrderInfoList" :key="item.id" :label="item.returnSn" :value="item.returnSn"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 关联提现单 -->
                <el-form-item :label="$t('rewardPunishmentManagement.associatedWithdrawOrder')" prop="associatedWithdrawOrder">
                    <el-select v-model="form.associatedWithdrawOrder" filterable>
                        <el-option v-for="item in withdrawOrderInfoList" :key="item.id" :label="item.withdrawNo" :value="item.withdrawNo"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 凭证上传 -->
                <el-form-item :label="$t('rewardPunishmentManagement.voucherPic')" prop="voucherPic">
                    <BmUpload @change="onChangeUpload($event)" :fileList="form.voucherPic" :multiple="true" :limit="8" :tip="$t('withdrawalManagement.maxEight')" />
                </el-form-item>
                <!-- 备注 -->
                <el-form-item :label="$t('rewardPunishmentManagementTable.remark')" prop="remark">
                    <el-input v-model="form.remark" :placeholder="$t('pleaseEnter')" type="textarea" maxlength="255" show-word-limit></el-input>
                </el-form-item>
            </div>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { dealReward, getAllStoreInfo, getAllSellerOrder, getAllSellerAfterSaleOrder, getAllSellerWithdrawOrder, addReward } from "@/api/finance";
import { getSellerListByKeywords } from "@/api/store";
import { deepClone } from "@/utils/";

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
            imgs: [],
            voucherPic: []
        });
        watch(
            () => props.row,
            (nVal) => {
                form.value = props.row;
                // 标题判断
                if (form.value.type == "deal") {
                    title.value = proxy.$t("rewardPunishmentManagement.deal");
                    form.value.imgs = [];
                } else if (form.value.type == "edit") {
                    title.value = proxy.$t("status.edit");
                    // getAllStoreInfoFn();
                    form.value.associatedOrder = form.value.associatedNo2["1"];
                    form.value.associatedReturnOrder = form.value.associatedNo2["2"];
                    form.value.associatedWithdrawOrder = form.value.associatedNo2["3"];
                    handleGetInfo(form.value.sellerId);
                } else if (form.value.type == "add") {
                    title.value = proxy.$t("status.add");
                    // 请求店铺信息列表
                    // getAllStoreInfoFn();
                    form.value.voucherPic = [];
                } else {
                    title.value = proxy.$t("rewardPunishmentManagement.look");
                }
            }
        );
        // 标题
        let title = ref("");
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
            rewardType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "change"
            },
            amount: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            sellerId: {
                required: true,
                message: proxy.$t("required"),
                trigger: "change"
            }
        };
        //上传图片
        const onChangeUpload = (fileList) => {
            form.value.voucherPic = fileList;
        };
        const onChangeUpload2 = (fileList) => {
            form.value.imgs = fileList;
        };
        // 卖家用户信息列表
        // let sellerInfoList = ref([]);
        // 获取所有卖家用户信息列表
        // const getAllStoreInfoFn = () => {
        //     getAllStoreInfo()
        //         .then((res) => {
        //             sellerInfoList.value = res.data;
        //         })
        //         .catch(() => {});
        // };
        // 获取对应的关联订单信息列表
        let orderInfoList = ref([]);
        // 获取对应的关联售后单信息列表
        let afterSaleOrderInfoList = ref([]);
        // 获取对应的关联提现单信息列表
        let withdrawOrderInfoList = ref([]);
        // 卖家选择改变的监听事件
        const handleGetInfo = (sellerId) => {
            // 订单信息获取
            getAllSellerOrder({ sellerId })
                .then((res) => {
                    orderInfoList.value = res.data;
                })
                .catch(() => {});
            // 售后单信息获取
            getAllSellerAfterSaleOrder({ sellerId })
                .then((res) => {
                    afterSaleOrderInfoList.value = res.data;
                })
                .catch(() => {});
            // 提现单信息获取
            getAllSellerWithdrawOrder({ sellerId })
                .then((res) => {
                    withdrawOrderInfoList.value = res.data;
                })
                .catch(() => {});
        };
        const formRef = ref(null);
        // 金额数据验证正则表达式
        const amountReg = new RegExp(/^[1-9][0-9]{0,9}(\.[0-9]{0,2})?$/);
        // 金额数据是否验证通过控制变量
        let flag = ref(false);
        // 金额数据验证
        const amountCheck = () => {
            if (amountReg.test(form.value.amount)) {
                flag.value = true;
            } else {
                proxy.$message.warning(proxy.$t("margin.amountTips"));
            }
        };
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (!flag) {
                    proxy.$message.warning(proxy.$t("margin.amountTips"));
                    return;
                }

                if (valid) {
                    const params = deepClone(form.value);
                    // 判断操作类型
                    if (form.value.type == "deal") {
                        const imgs = params.imgs;
                        if (imgs && Array.isArray(imgs)) {
                            params.imgs = imgs.map((item) => item.url).join(",");
                        }
                        // 处理操作
                        dealReward(params)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false, params.type);
                                formRef.value.resetFields();
                            })
                            .catch(() => {});
                    } else if (form.value.type == "add") {
                        //凭证
                        const voucherPic = params.voucherPic;
                        if (voucherPic && Array.isArray(voucherPic)) {
                            params.voucherPic = voucherPic.map((item) => item.url).join(",");
                        }
                        // 关联订单、关联售后单、关联体现单的值必须有一个才能进行添加操作
                        //if (params.associatedOrder || params.associatedReturnOrder || params.associatedWithdrawOrder) {
                        addReward(params)
                            .then((res) => {
                                proxy.$message.success(res.msg);
                                emit("reloadData");
                                emit("update:visible", false, params.type);
                                formRef.value.resetFields();
                            })
                            .catch(() => {});
                        // } else {
                        //     proxy.$message.error(proxy.$t("rewardPunishmentManagement.pleaseOrderInfo"));
                        //     return;
                        // }
                    }
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
            getSellerListByKeywords,
            formRef,
            confirm,
            cancel,
            onChangeUpload,
            title,
            // getAllStoreInfoFn,
            // sellerInfoList,
            handleGetInfo,
            orderInfoList,
            afterSaleOrderInfoList,
            withdrawOrderInfoList,
            onChangeUpload2,
            amountCheck,
            flag
        };
    }
};
</script>
