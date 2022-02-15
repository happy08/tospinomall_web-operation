<template>
    <div class="top-search-form">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <!-- 银行转账 -->
        <span class="fs-18 block mb-15">{{ $t("withdrawalPaymentChannels.bankTransfer") }}</span>
        <el-form ref="formRef" :model="bankTableData" :rules="rules" label-width="100px" class="border pt-20 mb-20">
            <!-- 转账账户 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.transferAccount')" prop="accountNumber">
                <el-input v-model="bankTableData.accountNumber" style="width:30%"></el-input>
            </el-form-item>
            <!-- 是否开启 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.openOrNot')" prop="status">
                <el-radio-group v-model="bankTableData.status">
                    <el-radio v-for="item in statusList" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
                <!-- 转账说明 -->
            </el-form-item>
            <el-form-item :label="$t('withdrawalPaymentChannels.transferInstructions')" prop="description">
                <el-input v-model="bankTableData.description" type="textarea" maxlength="1000" show-word-limit :placeholder="$t('withdrawalPaymentChannels.transferInstructionsNote')"></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.remark')" prop="remark">
                <el-input v-model="bankTableData.remark" type="textarea" maxlength="1000" show-word-limit :placeholder="$t('withdrawalPaymentChannels.remarkNote')"></el-input>
            </el-form-item>
            <el-form-item>
                <!-- 保持修改 -->
                <el-button v-permission="'financeSetting_marginCollectionAccount_save'" @click="handleSave(bankTableData, 1)" type="primary" :disabled="disabled">{{
                    $t("withdrawalPaymentChannels.keepChange")
                }}</el-button>
                <!-- 查看绑定国家 -->
                <el-button v-permission="'financeSetting_marginCollectionAccount_look'" @click="handleOpen(bankTableData)">{{ $t("withdrawalPaymentChannels.viewBindingCountry") }}</el-button>
            </el-form-item>
        </el-form>
        <!-- Payonner - 派安盈 -->
        <span class="fs-18 block mb-15">{{ $t("withdrawalPaymentChannels.Payonner") }}</span>
        <el-form ref="formRef" :model="payTableData" :rules="rules" label-width="100px" class="border pt-20 mb-20">
            <!-- 转账账户 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.transferAccount')" prop="accountNumber">
                <el-input v-model="payTableData.accountNumber" style="width:30%"></el-input>
            </el-form-item>
            <!-- 是否开启 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.openOrNot')" prop="status">
                <el-radio-group v-model="payTableData.status">
                    <el-radio v-for="item in statusList" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 转账说明 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.transferInstructions')" prop="description">
                <el-input v-model="payTableData.description" type="textarea" maxlength="1000" show-word-limit :placeholder="$t('withdrawalPaymentChannels.transferInstructionsNote')"></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('withdrawalPaymentChannels.remark')" prop="remark">
                <el-input v-model="payTableData.remark" type="textarea" maxlength="1000" show-word-limit :placeholder="$t('withdrawalPaymentChannels.remarkNote')"></el-input>
            </el-form-item>
            <el-form-item>
                <!-- 保持修改 -->
                <el-button v-permission="'financeSetting_marginCollectionAccount_save'" @click="handleSave(payTableData, 2)" type="primary" :disabled="disabled">{{
                    $t("withdrawalPaymentChannels.keepChange")
                }}</el-button>
                <!-- 查看绑定国家 -->
                <el-button v-permission="'financeSetting_marginCollectionAccount_look'" @click="handleOpen(payTableData)">{{ $t("withdrawalPaymentChannels.viewBindingCountry") }}</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 绑定国家信息Drawer抽屉 -->
    <el-drawer :title="$t('withdrawalPaymentChannels.siteManager')" v-model="drawer" size="15%" :direction="direction" destroy-on-close>
        <div class="ptb-5 pl-40 grey bg-light-grey tl">
            {{ $t("withdrawalPaymentChannels.siteManagerNote1") }};<br />
            {{ $t("withdrawalPaymentChannels.siteManagerNote2") }}
        </div>
        <el-checkbox-group v-model="middleData.bindingCountryCodes" class="pt-15 pl-40">
            <el-checkbox v-for="item in areaList" :key="item.value" :label="item.value" class="block mb-10">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
    </el-drawer>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { getcanelType, editcanelType, getAreaInfo } from "@/api/base";
export default {
    name: "GoodsAttribute",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        const multipleTable = ref(null);

        // 银行转账表单信息
        let bankTableData = ref([]);
        // Payonner - 派安盈表单信息
        let payTableData = ref([]);
        // 是否开启状态选择数据
        const statusList = [
            {
                name: proxy.$t("yes"),
                value: 0
            },
            {
                name: proxy.$t("no"),
                value: 1
            }
        ];
        // 控制国家信息展示抽屉开关变量
        const drawer = ref(false);
        // 用来接收打开抽屉市传进来的data
        const middleData = ref({});
        // 点击按钮，打开国家信息展示抽屉
        const handleOpen = (data) => {
            // // 判断data的值是否为空,如果为空则手动赋值bindingCountryCodes
            if (JSON.stringify(data) == "[]") {
                data.bindingCountryCodes = [];
            }
            if (data.bindingCountryCodes && !data.bindingCountryCodes instanceof Array) {
                console.log(1);
                data.bindingCountryCodes = data.bindingCountryCodes.split(",");
            }
            middleData.value = data;
            drawer.value = true;
        };
        // 存储国家地区信息数组
        const areaList = ref([]);
        // 获取国家地区信息
        getAreaInfo({ parentId: 0 }).then((res) => {
            res.data.forEach((item) => {
                if (item.level == 0) {
                    areaList.value.push({
                        name: item.name,
                        value: item.code
                    });
                }
            });
        });
        //获取列表
        const getListPage = () => {
            // 保证金收款账户canelType: 3
            const params = {
                canelType: 3
            };
            getcanelType(params)
                .then((res) => {
                    // 对返回数据进行判断，然后根据accountType值分类
                    // 注意，当某个表单数据为空的时候，在对这个表单进行相关操作的时候，需要先手动赋值bindingCountryCodes字段
                    res.data.forEach((item) => {
                        if (item.accountType == 1) {
                            bankTableData.value = {
                                ...item,
                                bindingCountryCodes: item.bindingCountryCodes.split(",")
                            };
                        } else if (item.accountType == 2) {
                            payTableData.value = {
                                ...item,
                                bindingCountryCodes: item.bindingCountryCodes.split(",")
                            };
                        }
                    });
                })
                .catch((err) => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 保存按钮节流阀变量
        const disabled = ref(false);
        // 保存修改
        const handleSave = (tData, atype) => {
            disabled.value = true;
            let data = {};
            // 判断传入的tData值是否为空,如为空，则手动添加一下bindingCountryCodes,accountType,canelType字段
            if (JSON.stringify(tData) == "[]") {
                tData.bindingCountryCodes = [];
                tData.accountType = atype;
                tData.canelType = 3;
            }
            // 查看middleData的值是否为空，为空则直接将接收到的信息赋值给data
            if (JSON.stringify(middleData.value) == "{}") {
                data = tData;
                if (data.bindingCountryCodes.length === 0) {
                    data.bindingCountryCodes = "";
                } else {
                    data.bindingCountryCodes = data.bindingCountryCodes.join(",");
                }
            } else {
                data = middleData.value;
                data.bindingCountryCodes = data.bindingCountryCodes.join(",");
            }
            delete data.updateTime;
            editcanelType(data)
                .then((res) => {
                    proxy.$message.success(res.msg);
                    disabled.value = false;
                    getListPage();
                })
                .catch((err) => {
                    console.log(err);
                    disabled.value = false;
                });
        };
        return {
            dict,
            initData,
            bankTableData,
            payTableData,
            multipleTable,

            handleSave,
            disabled,
            statusList,
            handleOpen,
            drawer,
            areaList,
            middleData
        };
    }
};
</script>
