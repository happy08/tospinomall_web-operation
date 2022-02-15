<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert
            :title="$t('businessMessageSettings.businessMessageSettingsTips')"
            icon="warnning"
            class="mt-10"
        /> -->
    </div>
    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 服务商 -->
            <BmTableColumn :label="$t('smsPlatformTable.name')">
                <template #default="scoped">
                    <div class="flex">
                        <div>
                            <BmImage :src="scoped.row.icon" fit="cover" style="width:100%;height:100%" />
                        </div>
                        <div>
                            <span class="block">{{ scoped.row.name }}</span>
                            <span class="block light-grey">{{ scoped.row.description }}</span>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 服务类型 -->
            <BmTableColumn prop="title" :label="$t('smsPlatform.serviceType')" width="300px">
                <span class="block">{{ $t("smsPlatform.SMS") }}</span>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" width="300px">
                <template #default="scoped">
                    <el-button v-permission="'thirdPartyPlatform_smsPlatform_config'" type="primary" @click="handleAddEdit(scoped.row)">{{ $t("smsPlatformTable.accessConfiguration") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 编辑内容弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { smsPlatform } from "@/api/base";
import AddEdit from "./component/addEdit";
export default {
    name: "GoodsAttribute",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        const multipleTable = ref(null);
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            createTime: [],
            type: 1 // 消息模板类型 1.商家消息模板 2.用户消息模板
        });

        const tableData = ref([]);
        //获取列表
        const getListPage = () => {
            smsPlatform()
                .then((res) => {
                    tableData.value = res.data.map((item) => {
                        item.configExplainName = item.configExplain.split("；");
                        return item;
                    });
                })
                .catch(() => {});
        };
        // 编辑
        const handleAddEdit = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        // 查看
        let editVisible = ref(false);
        let editRow = ref({});
        initData();
        return {
            dict,
            multipleTable,
            searchFormRef,
            searchForm,
            handleAddEdit,
            editVisible,
            editRow,
            tableData
        };
    }
};
</script>
