<template>
    <div class="top-search-form">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData" :span-method="arraySpanMethod" :default-sort="{ prop: 'tradeType', order: 'ascending' }">
            <!-- 配置类型 -->
            <!-- 贸易模式 -->
            <BmTableColumn prop="tradeType" :label="$t('goodSettingTable.configurationType')" width="100">
                <template #default="scope">
                    <div v-if="scope.row.tradeType == 1">
                        <span class="block fs-18 ml-20">FBT</span>
                        <span class="block ml-10">[{{ $t("orderSetting.localTrade") }}]</span>
                        <span class="block ml-10">[{{ $t("orderSetting.crossBorderTrade") }}]</span>
                    </div>
                    <div v-else-if="scope.row.tradeType == 2">
                        <span class="block fs-18 ml-20">FBM</span>
                        <span class="block ml-10">[{{ $t("orderSetting.localTrade") }}]</span>
                    </div>
                    <div v-else>
                        <span class="block fs-18 ml-20">FBM</span>
                        <span class="block ml-10">[{{ $t("orderSetting.crossBorderTrade") }}]</span>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 支付方式 -->
            <BmTableColumn prop="payType1" width="170">
                <template #default="scope">
                    {{ scope.row.payType1 }}
                </template>
            </BmTableColumn>
            <!-- 支付方式描述 -->
            <BmTableColumn prop="description" :label="$t('goodSettingTable.configurationType')" width="320"> </BmTableColumn>
            <!-- 时间 -->
            <BmTableColumn prop="value" :label="$t('goodSettingTable.time')" width="200">
                <template #default="scope">
                    <el-input v-model="scope.row.value">
                        <template #append>
                            <el-select v-model="scope.row.unit" style="width: 80px;">
                                <el-option v-for="item in timeChoose" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                    </el-input>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remark" :label="$t('goodSettingTable.remark')">
                <template #default="scope">
                    {{ scope.row.remark }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                <template #default="scope">
                    <el-button v-permission="'transactionSetting_serviceOrderSetting_save'" @click="handleSave(scope.row)" type="text" :disabled="disabled">{{
                        $t("goodSettingTable.save")
                    }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { getAllOrdersSettings, editOrdersSettings } from "@/api/base";
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
            // tab行合并
            if (columnIndex === 0) {
                const _row = spanArr.value[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    // [0,0] 表示这一行不显示， [2,1]表示行的合并数
                    rowspan: _row,
                    colspan: _col
                };
            }
        };
        //用于存放tab每一行记录的合并数
        let spanArr = ref([]);
        // 对获取到的数据进行排序统计(用于tab行合并)
        const getSpanArr = (data) => {
            let pos = 0;
            // data就是我们从后台拿到的数据
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    spanArr.value.push(1);
                    pos = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].tradeType === data[i - 1].tradeType) {
                        spanArr.value[pos] += 1;
                        spanArr.value.push(0);
                    } else {
                        spanArr.value.push(1);
                        pos = i;
                    }
                }
            }
        };
        //获取列表
        const getListPage = () => {
            // 查询售后设置项
            const params = {
                orderType: "2"
            };
            getAllOrdersSettings(params)
                .then((res) => {
                    tableData.value = res.data;
                    tableData.value = res.data.map((item) => {
                        // 支付方式(将数字转为字符)
                        for (let i in dict.value.onlineOffline) {
                            if (dict.value.onlineOffline[i].value === item.payType) {
                                item.payType1 = dict.value.onlineOffline[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                    getSpanArr(tableData.value);
                })
                .catch((err) => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 时间单位选择数据
        let timeChoose = ref([
            { value: "min", label: "min" },
            { value: "h", label: "h" },
            { value: "day", label: "day" }
        ]);
        // 时间修改
        // 保存按钮节流阀变量
        const disabled = ref(false);
        const handleSave = (row) => {
            disabled.value = true;
            // 删除请求服务器不需要的数据
            delete row.updateUser;
            delete row.createUser;
            delete row.updateTime;
            delete row.createTime;
            editOrdersSettings(row)
                .then((res) => {
                    proxy.$message.success(res.msg);
                    disabled.value = false;
                    // 重新调用table合并方法，以免table格式错乱
                    arraySpanMethod();
                    getListPage();
                })
                .catch((err) => {
                    disabled.value = false;
                    console.log(err);
                });
        };
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            handleSave,
            timeChoose,
            arraySpanMethod,
            getSpanArr,
            spanArr
        };
    }
};
</script>
