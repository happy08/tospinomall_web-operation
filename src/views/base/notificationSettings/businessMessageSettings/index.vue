<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('businessMessageSettings.businessMessageSettingsTips')" icon="warnning" class="mt-10" />
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex mb-10 between">
            <el-radio-group v-model="searchForm.type" @change="handleChangeCardType">
                <!-- 用户消息模板 -->
                <el-radio-button :label="1">{{ $t("businessMessageSettings.businessMessageTemplate") }}</el-radio-button>
                <!-- 会员消息模板 -->
                <el-radio-button :label="2">{{ $t("businessMessageSettings.userMessageTemplate") }}</el-radio-button>
            </el-radio-group>
        </div>
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 消息类型 -->
            <BmTableColumn prop="title" :label="$t('businessMessageSettingsTable.msgTypeTitle')">
                <template #default="scope">{{ scope.row.msgTypeTitle }}</template>
            </BmTableColumn>
            <!-- 站内信 -->
            <BmTableColumn prop="title" :label="$t('businessMessageSettingsTable.isStationSwitch')">
                <template #default="scope">
                    <span>{{ scope.row.isStationSwitchName }}</span>
                </template>
            </BmTableColumn>
            <!-- 邮件 -->
            <BmTableColumn prop="title" :label="$t('businessMessageSettingsTable.isMailSwitch')">
                <template #default="scope">
                    <span>{{ scope.row.isMailSwitchName }}</span>
                </template>
            </BmTableColumn>
            <!-- 短信 -->
            <BmTableColumn prop="title" :label="$t('businessMessageSettingsTable.isNoteSwitch')">
                <template #default="scope">
                    <span>{{ scope.row.isNoteSwitchName }}</span>
                </template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')">
                <template #default="scope">
                    <el-button v-permission="'notificationSettings_businessMessageSettings_edit'" type="text" @click="handleAddEdit(scope.row)">{{ $t("status.edit") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- 分页 -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"></BmPagination>
        <!-- 编辑内容弹窗 -->
        <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, oncreated } from "vue";
import { useStore } from "vuex";
import { getAllGoodsSettings, editGoodsSettings, messageSettings } from "@/api/base";
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
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let tableData = ref([]);
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageSize: pageSize,
            pageNum: pageNum,
            createTime: [],
            type: 1 // 消息模板类型 1.商家消息模板 2.用户消息模板
        });
        // 商家消息模板与用户消息模板点击按钮切换
        const handleChangeCardType = () => {
            initData();
        };
        //获取列表
        const getListPage = () => {
            // 查询所有商家消息设置
            messageSettings({ type: searchForm.type })
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        // 站内信、邮件、短信类型数字转文字(0禁用 1启用)
                        for (let i in dict.value.forbiddenEnable) {
                            if (dict.value.forbiddenEnable[i].value == item.isStationSwitch) {
                                item.isStationSwitchName = dict.value.forbiddenEnable[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.forbiddenEnable) {
                            if (dict.value.forbiddenEnable[i].value == item.isMailSwitch) {
                                item.isMailSwitchName = dict.value.forbiddenEnable[i].name;
                                break;
                            }
                        }
                        for (let i in dict.value.forbiddenEnable) {
                            if (dict.value.forbiddenEnable[i].value == item.isNoteSwitch) {
                                item.isNoteSwitchName = dict.value.forbiddenEnable[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                })
                .catch((err) => {});
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
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };
        initData();
        // 保存按钮节流阀变量
        const disabled = ref(false);
        return {
            dict,
            initData,
            tableData,
            multipleTable,

            disabled,
            handleChangeCardType,
            pageNum,
            pageSize,
            pageTotal,
            searchFormRef,
            searchForm,
            pageTotal,
            handleSizeChange,
            handleCurrentChange,
            handleAddEdit,
            editVisible,
            editRow
        };
    }
};
</script>
