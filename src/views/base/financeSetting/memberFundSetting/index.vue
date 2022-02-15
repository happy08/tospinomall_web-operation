<template>
    <div class="top-search-form ">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 配置类型 -->
            <BmTableColumn prop="description" :label="$t('memberFundSettingTable.configurationType')" width="200"> </BmTableColumn>
            <!-- 支付方式 -->
            <BmTableColumn prop="value" width="200" :label="$t('memberFundSettingTable.mode')">
                <template #default="scope">
                    <el-select v-model="scope.row.value">
                        <el-option v-for="(item, index) in payType" :key="index" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remark" :label="$t('memberFundSettingTable.remark')">
                <template #default="scope">
                    {{ scope.row.remark }}
                    <!-- <el-input v-model="scope.row.remark" maxlength="150" show-word-limit></el-input> -->
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                <template #default="scope">
                    <el-button v-permission="'financeSetting_memberFundSetting_save'" @click="handleSave(scope.row)" type="text" :disabled="disabled">{{
                        $t("memberFundSettingTable.save")
                    }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { getAllOrdersSettings, editOrdersSettings, getMoneyType, editCapitalAllocation } from "@/api/base";
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
        // 行合并方法
        const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
            // 获取表头的所有单元格
            let x = document.getElementsByClassName("el-table__header")[0].rows[0].cells;
            // 将第一列表头单元格的colSpan设为2
            x[0].colSpan = 3;
            // 将第二和第三列表头单元格的display设为none
            x[1].style.display = "none";
            x[2].style.display = "none";
        };
        //获取列表
        const getListPage = () => {
            // 查询会员资金
            const params = {
                moneyType: "3"
            };
            getMoneyType(params)
                .then((res) => {
                    console.log(res.data);
                    tableData.value = res.data;
                })
                .catch((err) => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 支付选择数据
        const payType = [{ value: "原路返回", label: "原路返回" }];
        // 保存按钮节流阀变量
        const disabled = ref(false);
        // 时间修改
        const handleSave = (row) => {
            disabled.value = true;
            delete row.updateTime;
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
        };
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            handleSave,
            payType,
            arraySpanMethod,
            disabled
        };
    }
};
</script>
