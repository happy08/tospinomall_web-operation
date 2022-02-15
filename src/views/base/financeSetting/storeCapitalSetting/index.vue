<template>
    <div class="top-search-form ">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 配置类型 -->
            <BmTableColumn prop="description" :label="$t('storeCapitalSettingTable.configurationType')" width="300"> </BmTableColumn>
            <!-- 数值 -->
            <BmTableColumn prop="value" :label="$t('storeCapitalSettingTable.val')" width="200">
                <template #default="scope">
                    <el-input v-model="scope.row.value">
                        <template #append>
                            <el-select v-model="scope.row.unit" style="width: 80px;" v-if="scope.row.id == 1 || scope.row.id == 2 || scope.row.id == 6">
                                <el-option v-for="item in timeChoose" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                            <span v-else class="iblock" style="width:40px">
                                {{ scope.row.unit }}
                            </span>
                        </template>
                    </el-input>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remark" :label="$t('storeCapitalSettingTable.remark')">
                <template #default="scope">
                    {{ scope.row.remark }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                <template #default="scope">
                    <el-button v-permission="'financeSetting_storeCapitalSetting_save'" @click="handleSave(scope.row)" type="text" :disabled="disabled">{{ $t("goodSettingTable.save") }}</el-button>
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
                moneyType: "1"
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
        // 时间单位选择数据
        const timeChoose = ref([
            { value: "min", label: "min" },
            { value: "h", label: "h" },
            { value: "day", label: "day" }
        ]);
        initData();
        // 保存按钮节流阀变量
        const disabled = ref(false);
        // 订单设置项修改
        const handleSave = (row) => {
            disabled.value = true;
            delete row.updateTime;
            // 对保存项进行判断并做对应的数据限制
            // 是否执行保存网络请求的控制变量
            let flag = false;
            switch (row.id) {
                case "1": // FBT账单结算时间
                    if (row.value >= 0 && row.value.toString().indexOf(".") == -1) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterPositiveInteger"));
                    }
                    break;
                case "2": // FBM账单结算时间
                    if (row.value >= 0 && row.value.toString().indexOf(".") == -1) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterPositiveInteger"));
                    }
                    break;
                case "3": // 提现: 最低提现金额
                    if ((row.value > 0 && row.value.toString().indexOf(".") == -1) || row.value == "") {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterPositiveIntegerOrNull"));
                    }
                    break;
                case "4": // 个人卖家-店铺质保金额
                    if (row.value >= 0 && row.value.toString().indexOf(".") == -1) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterNaturalNumber"));
                    }
                    break;
                case "5": // 专业卖家-店铺质保金额
                    if (row.value >= 0 && row.value.toString().indexOf(".") == -1) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterNaturalNumber"));
                    }
                    break;
                case "6": // 提现: 平台预计处理时间
                    if (row.value > 0 && row.value.toString().indexOf(".") == -1) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterPositiveInteger"));
                    }
                    break;
                case "7": // 每月提现次数
                    if (row.value >= 0 && row.value.toString().indexOf(".") == -1) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.pleaseEnterNaturalNumber"));
                    }
                    break;
                case "8": // 预计汇款日期
                    let reg = new RegExp(/^(0?[1-9]|[1-2]\d|3[0-1]),(0?[1-9]|[1-2]\d|3[0-1])$/);
                    if (reg.test(row.value)) {
                        flag = true;
                    } else {
                        proxy.$message.warning(proxy.$t("storeCapitalSettingTable.dateEnterTips"));
                    }
                    break;
            }
            if (flag) {
                editCapitalAllocation(row)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        disabled.value = false;
                        getListPage();
                    })
                    .catch((err) => {
                        console.log(err);
                        disabled.value = false;
                    });
            }
            disabled.value = false;
        };
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            handleSave,
            disabled,
            timeChoose
        };
    }
};
</script>
