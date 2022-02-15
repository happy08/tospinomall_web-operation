<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" width="60%">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <BmBaseTitle :title="$t('memberList.accountInfo')" />
            <!-- 充值组名称 -->
            <el-form-item :label="$t('memberWallet.rechargeGroupName')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 设置有效日期 -->
            <div class="flex vcenter">
                <el-form-item :label="$t('memberWallet.setEffectiveDate')" prop="termOfValidityTime">
                    <el-date-picker class="mr-30" v-model="form.termOfValidityTime" type="datetimerange" :placeholder="$t('startDate')"> </el-date-picker>
                </el-form-item>
            </div>
            <!-- 充值设置 -->
            <el-form-item :label="$t('memberWallet.fixedRechargeSet')" prop="cardItems">
                <div v-for="(item, index) in form.cardItems" :key="item.id" class="flex vcenter">
                    <!-- 固定充值设置 -->
                    <div class="border flex between p-20" v-if="form.cardName == 'fixed'">
                        <!-- 充值金额 -->
                        <div class="">
                            <div>
                                {{ $t("memberWalletTable.rechargeAmount") }}
                            </div>
                            <div>
                                <el-input v-model="item.rechargeAmount">
                                    <template #prepend>{{ $store.state.app.currencySymbol }}</template>
                                </el-input>
                            </div>
                        </div>
                        <!-- 赠送金额 -->
                        <div class="ml-15">
                            <div>{{ $t("memberWalletTable.giftAmount") }}</div>
                            <div>
                                <el-input v-model="item.giftAmount">
                                    <template #prepend>{{ $store.state.app.currencySymbol }}</template>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <!-- 自由充值设置 -->
                    <div class="border flex between p-20" v-else>
                        <!-- 最低金额 -->
                        <div class="">
                            <div>
                                {{ $t("memberWalletTable.minAmount") }}
                            </div>
                            <div>
                                <el-input v-model="item.minAmount">
                                    <template #prepend>{{ $store.state.app.currencySymbol }}</template>
                                </el-input>
                            </div>
                        </div>
                        <!-- 最高金额 -->
                        <div class="ml-15">
                            <div>{{ $t("memberWalletTable.maxAmount") }}</div>
                            <div>
                                <el-input v-model="item.maxAmount">
                                    <template #prepend>{{ $store.state.app.currencySymbol }}</template>
                                </el-input>
                            </div>
                        </div>
                        <!-- 增加金额 -->
                        <div class="ml-15">
                            <div>
                                {{ $t("memberWalletTable.addAmount") }}
                            </div>
                            <div>
                                <el-input v-model="item.addAmount">
                                    <template #prepend>{{ $store.state.app.currencySymbol }}</template>
                                </el-input>
                            </div>
                        </div>
                        <!-- 赠送金额 -->
                        <div class="ml-15">
                            <div>{{ $t("memberWalletTable.giftAmount") }}</div>
                            <div>
                                <el-input v-model="item.giftAmount">
                                    <template #prepend>{{ $store.state.app.currencySymbol }}</template>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <div class="ml-40">
                        <!-- 添加按钮 -->
                        <icon class="el-icon-circle-plus fs-22 cp m-20 block" @click="handlePlus"></icon>
                        <icon v-if="index !== 0" class="el-icon-remove fs-22 cp block ml-20" @click="handleRemove(index)"></icon>
                    </div>
                </div>
            </el-form-item>
            <!-- 充值说明 -->
            <el-form-item :label="$t('memberWallet.rechargeExplain')" prop="rechargeExplain">
                <el-input v-model="form.rechargeExplain" type="textarea" maxlength="255" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { editRechargeCard, addRechargeCard } from "@/api/operation";
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
                // 编辑操作，将时间重组为时间控件需要的数据格式
                if (form.value.type == 1) {
                    form.value.termOfValidityTime = [form.value.termOfValidityStartTime, form.value.termOfValidityEndTime];
                }
            }
        );

        // 判断操作确认标题
        const updateType = computed(() => {
            return props.row && props.row.id ? "edit" : "add";
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        const formRef = ref(null);
        // 表单验证规则
        const rules = {
            name: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            termOfValidityTime: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            cardItems: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            rechargeExplain: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const handelCancel = () => {
            emit("update:visible", false);
        };
        const confirm = () => {
            form.value.orderType = 2;
            formRef.value.validate((valid) => {
                if (valid) {
                    form.value.type = form.value.cardType;
                    // 处理日期格式
                    form.value.termOfValidityStartTime = proxy.utils.formatStandardDate(form.value.termOfValidityTime && form.value.termOfValidityTime[0], true);
                    form.value.termOfValidityEndTime = proxy.utils.formatStandardDate(form.value.termOfValidityTime && form.value.termOfValidityTime[1], true);
                    if (updateType.value === "add") {
                        // 新增
                        addRechargeCard(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch(() => {});
                    } else {
                        // 编辑
                        // 编辑操作
                        editRechargeCard(form.value)
                            .then((res) => {
                                formRef.value.resetFields();
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch((err) => {
                            });
                    }
                } else {
                    return false;
                }
            });
        };

        // let cardItem = {
        //     addAmount: '',
        //     cardId: '',
        //     giftAmount: '',
        //     id: '',
        //     maxAmount: '',
        //     minAmount: '',
        // }
        const handlePlus = () => {
            const cardItem = {
                addAmount: "",
                cardId: "",
                giftAmount: "",
                id: "",
                maxAmount: "",
                minAmount: ""
            };
            form.value.cardItems.push(cardItem);
            // form.value.cardItems.push('')
        };
        const handleRemove = (index) => {
            form.value.cardItems.splice(index, 1);
        };

        const cancel = () => {
            // emit("reloadData");
            emit("update:visible", false);
            formRef.value.resetFields();
        };
        return {
            dict,
            form,
            formRef,
            handelCancel,
            shortcuts,
            disabledDate,
            rules,
            handlePlus,
            handleRemove,
            confirm,
            cancel
        };
    }
};
</script>
