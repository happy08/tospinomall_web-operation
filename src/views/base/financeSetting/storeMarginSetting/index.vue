<template>
    <div class="top-search-form ">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 配置类型 -->
            <BmTableColumn prop="description" :label="$t('storeCapitalSettingTable.configurationType')" width="300"> </BmTableColumn>
            <!-- 金额 -->
            <BmTableColumn prop="value" :label="$t('storeCapitalSettingTable.money')" width="200">
                <template #default="scope">
                    <el-input v-model="scope.row.value" type="number" min="0">
                        <template #append>{{ scope.row.unit }}</template>
                    </el-input>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remark" :label="$t('storeCapitalSettingTable.remark')">
                <template #default="scope">
                    {{ scope.row.remark }}
                    <!-- <el-input v-model="scope.row.remark" maxlength="150" show-word-limit></el-input> -->
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                <template #default="scope">
                    <el-button v-permission="'financeSetting_storeMarginSetting_save'" @click="handleSave(scope.row)" type="text" :disabled="disabled">{{ $t("goodSettingTable.save") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { getMoneyType, editCapitalAllocation } from "@/api/base";
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

        let tableData = ref([]);
        //获取列表
        const getListPage = () => {
            // 查询店铺资金设置项
            const params = {
                moneyType: "2"
            };
            getMoneyType(params)
                .then((res) => {
                    tableData.value = res.data;
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
        // 订单设置项修改
        const handleSave = (row) => {
            disabled.value = true;
            delete row.updateTime;
            if (row.value >= 0) {
                editCapitalAllocation(row)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        disabled.value = false;
                        getListPage();
                    })
                    .catch((err) => {
                        disabled.value = false;
                    });
            } else {
                proxy.$message.warning(proxy.$t("storeCapitalSettingTable.moneySaveTips"));
                disabled.value = false;
            }
        };
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            handleSave,
            disabled
        };
    }
};
</script>
