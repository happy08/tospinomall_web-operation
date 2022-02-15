<template>
    <div class="top-search-form">
        <BmBreadcrumb />
    </div>
    <div class="p-25 bg-white round-4">
        <!-- <span class="fs-18 block mb-15">{{ $t("withdrawalPaymentChannels.bankTransfer") }}</span> -->
        <el-form ref="Refs" :model="form" label-width="auto" class="border pt-20 pl-10 mb-20">
            <!-- 浮动范围 -->
            <el-form-item :label="$t('withdrawalManagement.withdrawOrderScope') + ':'" prop="float" :rules="rules.required">
                <el-input v-model="form.float" :placeholder="$t('pleaseEnter')" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item>
                <!-- 保存 -->
                <el-button @click="handleSave" type="primary">{{ $t("confirm") }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { baseFinanceMoneyFind } from "@/api/finance";
import { editCapitalAllocation } from "@/api/base";
export default {
    name: "",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        let form = reactive({
            float: "" // 浮动范围
        });

        const validateFloat = (rule, value, callback) => {
            if (isNaN(value) || value < 1 || value > 100) {
                // "浮动范围超出设置1-100的范围!"
                callback(new Error(proxy.$t("withdrawalManagement.floatScope")));
            } else {
                callback();
            }
        };

        let Refs = ref(null);
        const rules = reactive({
            required: { validator: validateFloat, required: true, trigger: "change" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }
        });

        const initData = () => {
            // 运营web->查询资金配置,moneyType 资金类型，1：店铺资金，2：保证金，3：会员资金，4：其他，5：平台通知提醒
            baseFinanceMoneyFind({ moneyType: 5 }).then((res) => {
                form.float = res.data[0].value;
            });
        };
        initData();

        // 保存修改
        const handleSave = () => {
            let data = {
                moneyType: 5,
                code: "TXDDJEPPZDBJDD",
                value: form.float
            };

            Refs.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    editCapitalAllocation(data)
                        .then((res) => {
                            loading.close();
                            proxy.$message.success(res.msg);
                            initData();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    return false;
                }
            });
        };

        return {
            handleSave,
            form,
            rules,
            Refs,
            rules
        };
    }
};
</script>

<style></style>
