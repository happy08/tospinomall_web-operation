<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('sendOrRecoilSetting.alert')" icon="warning" class="mb-20" />
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 配置类型 -->
            <BmTableColumn prop="name" :label="$t('sendOrRecoilSettingTable.configurationType')" width="300"> </BmTableColumn>
            <!-- 参数 -->
            <BmTableColumn prop="value" :label="$t('sendOrRecoilSettingTable.params')" width="350">
                <template #default="scope">
                    <div v-if="scope.row.id === 3">
                        <el-select v-model="scope.row.value" style="width: 40%">
                            <el-option v-for="item in statusChoose" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        <el-input v-model="scope.row.value" type="number" v-if="scope.row.id == 1" @blur="verifyWeight()">
                            <template #append>{{ scope.row.unit }}</template>
                        </el-input>
                        <el-input v-model="scope.row.value" v-else @blur="verifySize()">
                            <template #append>{{ scope.row.unit }}</template>
                        </el-input>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remark" :label="$t('sendOrRecoilSettingTable.remark')">
                <template #default="scope">
                    {{ scope.row.remark }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                <template #default="scope">
                    <el-button v-permission="'FBTSetting_sendOrRecoil_save'" @click="handleSave(scope.row)" type="text" :disabled="disabled">{{ $t("sendOrRecoilSettingTable.save") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { rateFind, attributeRemoveByIds, attributeUpdateEnableDisableByIds, attributeUpdateById, batchStart, getSORSettings, editSORSettings } from "@/api/base";

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
            getSORSettings()
                .then((res) => {
                    tableData.value = res.data;
                    tableData.value = res.data.map((item) => {
                        if (item.id === 3) {
                            if (item.value === "0") {
                                item.statusName = $t("sendOrRecoilSetting.enable");
                            } else {
                                item.statusName = $t("sendOrRecoilSetting.disable");
                            }
                        }
                        return item;
                    });
                })
                .catch((err) => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 发补货混装选择数据
        let statusChoose = ref([
            { value: "0", label: proxy.$t("sendOrRecoilSetting.enable") },
            { value: "1", label: proxy.$t("sendOrRecoilSetting.disable") }
        ]);
        // 重量表单验证规范控制变量
        let flag = ref(false);
        // 尺寸表单验证规范控制变量
        let flag2 = ref(false);
        // 尺寸限制正则表达式
        const sizeReg = new RegExp(/^(0|[1-9]{1,3}|1000)[*](0|[0-9]{1,3}|1000)[*](0|[0-9]{1,3}|1000)$/);
        // 重量输入限制
        const verifyWeight = () => {
            if (tableData.value[0].id == 1 && tableData.value[0].value >= 1 && tableData.value[0].value <= 1000 && tableData.value[0].value.indexOf(".") == -1) {
                flag.value = true;
            } else {
                proxy.$message.warning(proxy.$t("receiveAddress.PleaseFillInTheFormDataStandardly"));
                flag.value = false;
            }
        };
        // 尺寸输入限制
        const verifySize = () => {
            debugger;
            if (sizeReg.test(tableData.value[1].value)) {
                flag2.value = true;
            } else {
                proxy.$message.warning(proxy.$t("receiveAddress.PleaseFillInTheFormDataStandardly"));
                flag2.value = false;
            }
        };
        // 保存按钮节流阀
        let disabled = ref(false);
        // 发补货设置修改
        const handleSave = (row) => {
            // 根据不同的保存项做不同的验证限制
            let finallyFlag = false;
            switch (row.id) {
                case 1: // 重量限制
                    if (flag.value) {
                        finallyFlag = true;
                    }
                    break;
                case 2: // 尺寸限制
                    if (flag2.value) {
                        finallyFlag = true;
                    }
                    break;
                case 3: // 不做限制
                    finallyFlag = true;
            }
            if (finallyFlag) {
                disabled.value = true;
                // 发补货修改请求参数
                const params = {};
                params.id = row.id;
                params.value = row.value;
                editSORSettings(params)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        disabled.value = false;
                        getListPage();
                    })
                    .catch((err) => {});
            } else {
                proxy.$message.warning(proxy.$t("receiveAddress.PleaseFillInTheFormDataStandardly"));
            }
        };
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            statusChoose,
            handleSave,
            disabled,
            verifyWeight,
            flag,
            flag2,
            verifySize
        };
    }
};
</script>
