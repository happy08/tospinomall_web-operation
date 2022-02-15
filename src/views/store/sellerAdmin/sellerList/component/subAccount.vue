<template>
    <BmDialog v-model:visible="visible" :title="$t('entryAudit.look')" width="60%" :showFooter="false">
        <BmBaseTitle :title="$t('subAccount.subAccount')" />
        <BmAlert :title="$t('subAccount.subAccountTips')" icon="warning" class="mb-20" />
        <!-- 状态选择和搜索 -->
        <div class="p-25 bg-white round-4">
            <div class="flex between mb-10">
                <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mr-20 mb-10">
                    <!-- 全部 -->
                    <el-radio-button label>{{ $t("subAccount.all") }}</el-radio-button>
                    <!-- 正常 -->
                    <el-radio-button label="0">{{ $t("subAccount.normal") }}</el-radio-button>
                    <!-- 禁用 -->
                    <el-radio-button label="1">{{ $t("subAccount.disable") }}</el-radio-button>
                    <!-- 回收站 -->
                    <el-radio-button label="2">{{ $t("subAccount.recycleBin") }}</el-radio-button>
                </el-radio-group>
                <div class="flex vstart">
                    <!-- 导出
          <el-button @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>-->
                    <!-- 查询 -->
                    <el-input :placeholder="$t('subAccount.pleaseInput')" v-model="searchForm.account">
                        <template #append>
                            <el-button @click="handleSearch(searchForm.account)" type="primary">
                                {{ $t("search") }}
                            </el-button>
                        </template>
                    </el-input>
                </div>
            </div>
            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleRowdblClick" :column="tableColumn">
                <!-- 当前账号 -->
                <BmTableColumn :label="$t('subAccountTable.account')">
                    <template #default="scope">{{ scope.row.account }}</template>
                </BmTableColumn>
                <!-- 备注 -->
                <BmTableColumn :label="$t('subAccountTable.remark')">
                    <template #default="scope">{{ scope.row.remark }}</template>
                </BmTableColumn>
                <!-- 最近登录时间 -->
                <BmTableColumn :label="$t('subAccountTable.lastLoginTime')">
                    <template #default="scope">{{ scope.row.lastLoginTime }}</template>
                </BmTableColumn>
                <!-- 操作 -->
                <BmTableColumn :label="$t('table.operation')">
                    <el-button type="text">{{ $t("subAccount.viewPermissions") }}</el-button>
                </BmTableColumn>
            </BmTable>
        </div>
        <template #footer></template>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { getAuditResult, getSellersAllAccount, inquireSubAccountByCondition } from "@/api/store";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        id: Number
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        watch(
            () => props.id,
            (nVal) => {
                searchForm.sellerId = props.id;
                inquireSubAccountByCondition(searchForm).then((res) => {
                    // pageTotal.value = res.data.length
                    tableData.value = res.data;

                    console.log(res.data);
                });
            }
        );
        const formRef = ref(null);
        const handelCancel = () => {
            emit("update:visible", false);
        };
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let tableData = ref([]);
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            // account: null,
            sellerId: null,
            status: null
        });
        return {
            dict,
            form,
            formRef,
            handelCancel,
            searchFormRef,
            searchForm,
            tableData,

            pageNum,
            pageSize
        };
    }
};
</script>
