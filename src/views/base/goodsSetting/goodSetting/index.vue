<template>
    <div class="top-search-form">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 配置类型 -->
            <BmTableColumn prop="title" :label="$t('goodSettingTable.configurationType')" width="300"> </BmTableColumn>
            <!-- 参数 -->
            <BmTableColumn prop="time" :label="$t('goodSettingTable.time')" width="350">
                <template #default="scope">
                    <el-input v-model="scope.row.time" type="number" min="1">
                        <template #append>
                            <el-select v-model="scope.row.unit" style="width: 80px;">
                                <el-option v-for="item in timeChoose" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                    </el-input>
                </template>
            </BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="remarks" :label="$t('goodSettingTable.remark')">
                <template #default="scope">
                    {{ scope.row.remarks }}
                    <!-- <el-input v-model="scope.row.remarks" disabled></el-input> -->
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                <template #default="scope">
                    <el-button v-permission="'goodsSetting_goodSetting_save'" @click="handleSave(scope.row)" type="text" :disabled="disabled">{{ $t("goodSettingTable.save") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmAlert :title="$t('goodSetting.alert1')" icon="info" class="mt-40" />
        <BmAlert :title="$t('goodSetting.alert2')" icon="info" class="mt-10" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { getAllGoodsSettings, editGoodsSettings } from "@/api/base";
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
            // 查询所有商品配置
            getAllGoodsSettings()
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
        // 时间单位选择数据
        let timeChoose = ref([
            { value: "min", label: "min" },
            { value: "h", label: "h" },
            { value: "day", label: "day" }
        ]);
        // 保存按钮节流阀变量
        const disabled = ref(false);
        // 时间修改
        const handleSave = (row) => {
            disabled.value = true;
            delete row.updateTime;
            delete row.createTime;
            // 数据校验,时间参数只能输入正整数
            if (row.time > 0) {
                editGoodsSettings(row)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        disabled.value = false;
                        getListPage();
                    })
                    .catch((err) => {
                        console.log(err);
                        disabled.value = false;
                    });
            } else {
                proxy.$message.warning(proxy.$t("goodSetting.timeSaveTips"));
                disabled.value = false;
            }
        };
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            handleSave,
            timeChoose,
            disabled
        };
    }
};
</script>
