<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="10" :lg="4">
                    <!-- 会员信息-->
                    <el-form-item :label="$t('memberList.memberInfo')" prop="companyName">
                        <el-input v-model="searchForm.userInfo" :placeholder="$t('memberList.memberInfoTips')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="10" :lg="4">
                    <!-- 手机号-->
                    <el-form-item :label="$t('sellerList.phone')" prop="phone">
                        <el-input v-model="searchForm.phone" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 注册日期 -->
                    <el-form-item :label="$t('entryAudit.registerDate')" prop="createTime">
                        <el-date-picker
                            v-model="searchForm.createTime"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                            style="width: 100%"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 注册平台 -->
                    <el-form-item :label="$t('entryAudit.registerPlatform')" prop="registerFrom">
                        <el-select v-model="searchForm.registerFrom" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in fromSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handleSearch" type="primary">
                    {{ $t("search") }}
                </el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex mb-10" style="justify-content: flex-end">
            <div class="flex">
                <!-- 导出 -->
                <el-button v-permission="'memberManagement_memberList_export'" @click="handleExportExcel">
                    {{ $t("table.exportExcel") }}
                </el-button>
                <!-- 表格选项 -->
                <BmTableOption table="mberListTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" :column="tableColumn">
            <!-- 会员信息(nickname+account) -->
            <BmTableColumn :label="$t('memberListTable.memberInfo')" prop="memberInfo">
                <template #default="scope">
                    <span class="block tc">{{ scope.row.nickname }}</span>
                    <span class="block tc">{{ scope.row.id }}</span>
                </template>
            </BmTableColumn>
            <!-- 手机号 -->
            <BmTableColumn :label="$t('memberListTable.phone')" prop="phone">
                <template #default="scope">{{ scope.row.phone }}</template>
            </BmTableColumn>
            <!-- 邮箱 -->
            <BmTableColumn :label="$t('memberListTable.email')" prop="email">
                <template #default="scope">{{ scope.row.email }}</template>
            </BmTableColumn>
            <!-- 注册平台 -->
            <BmTableColumn :label="$t('memberListTable.registerFrom')" prop="registerFrom">
                <template #default="scope">{{ scope.row.registerFrom }}</template>
            </BmTableColumn>
            <!-- 注册日期 -->
            <BmTableColumn :label="$t('memberListTable.createTime')" prop="createTime">
                <template #default="scope">{{ scope.row.createTime }}</template>
            </BmTableColumn>
            <!-- 最后一次登录 -->
            <BmTableColumn :label="$t('memberListTable.lastLoginTime')" prop="lastLoginTime">
                <template #default="scope">{{ scope.row.lastLoginTime }}</template>
            </BmTableColumn>
            <!-- 状态 -->
            <BmTableColumn :label="$t('memberListTable.status')" width="100" align="center" prop="status">
                <template #default="scope">{{ scope.row.statusName }}</template>
            </BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                <template #default="scope">
                    <!-- 启用/禁用 （0启用 1禁用）-->
                    <!-- 启用 -->
                    <el-button v-permission="'memberManagement_memberList_enable'" v-if="scope.row.status == 1" @click.stop="handleEnableFrozen(0, scope.row.id)" type="text">{{
                        $t("status.enable")
                    }}</el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'memberManagement_memberList_disable'" v-else-if="scope.row.status == 0" @click.stop="handleEnableFrozen(1, scope.row.id)" type="text">{{
                        $t("status.forbidden")
                    }}</el-button>
                    <!-- 查看 -->
                    <el-button v-permission="'memberManagement_memberList_look'" @click.stop="handleAddEdit(scope.row)" type="text">{{ $t("memberList.look") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"></BmPagination>
    </div>

    <!-- 查看 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { getUserInfoByCondition, enableOrDisableUser, UserInfoByConditionExport } from "@/api/member";
import { dateShortcuts } from "@/utils/dateShortcuts";
import AddEdit from "./component/addEdit";
import { exportExcel } from "@/utils/";
import dayjs from "dayjs";

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

        //分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageNo: pageNo,
            pageSize: pageSize,
            createTime: [], // 注册日期(点击查询的时候进行格式化),
            registerFrom: null, // 注册平台(android，ios，pc，h5)
            userInfo: null // 会员信息
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        // 注册平台select选择数据
        const fromSelectList = [
            { value: "android", label: "android" },
            { value: "ios", label: "ios" },
            { value: "pc", label: "pc" },
            { value: "h5", label: "h5" }
        ];
        //搜索
        const handleSearch = () => {
            // 注册日期
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.registerEndTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);
            searchForm.registerStartTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            delete searchForm.createTime;
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.userInfo = searchForm.registerEndTime = searchForm.registerStartTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        // 快速筛选
        const handleSelect = (num) => {
            initData();
        };
        const multipleTable = ref(null);

        let tableData = ref([]);

        // 表格选项的列//
        const tableColumn = ["memberInfo", "phone", "email", "registerFrom", "createTime", "lastLoginTime", "status"];
        //获取列表
        const getListPage = () => {
            getUserInfoByCondition(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        if (item.createTime) {
                            let createTime = new Date(item.createTime).getTime() - 8 * 60 * 60 * 1000; //减去8小时
                            item.createTime = dayjs(createTime).format("YYYY-MM-DD hh:mm:ss");
                        }
                        if (item.lastLoginTime) {
                            let lastLoginTime = new Date(item.lastLoginTime).getTime() - 8 * 60 * 60 * 1000; //减去8小时
                            item.lastLoginTime = dayjs(lastLoginTime).format("YYYY-MM-DD hh:mm:ss");
                        }

                        // 状态(数字转文字 0启用 1禁用)
                        for (let i in dict.value.forbiddenEnableReverse) {
                            if (dict.value.forbiddenEnableReverse[i].value == item.status) {
                                item.statusName = dict.value.forbiddenEnableReverse[i].name;
                                break;
                            }
                        }
                        // 性别 1男，2女，3双性，4保密
                        for (let i in dict.value.sexType) {
                            if (dict.value.sexType[i].value == item.sex) {
                                item.sexName = dict.value.sexType[i].name;
                                break;
                            }
                        }
                        return item;
                    });
                    // tableData.value.sort((a, b) => {
                    //     return a.createTime > b.createTime ? 1 : -1;
                    // });
                })
                .catch((err) => {});
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        // 启用/禁用按钮节流阀
        const disabled = ref(false);
        // 启用/禁用
        const handleEnableFrozen = (status, userId) => {
            disabled.value = true;
            enableOrDisableUser({ status: status, userId: userId })
                .then((res) => {
                    disabled.value = false;
                    initData();
                })
                .catch(() => {
                    disabled.value = false;
                });
        };
        initData();
        // 查看
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };
        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNo = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            initData();
        };
        // 导出excel表格
        const handleExportExcel = (val) => {
            UserInfoByConditionExport(searchForm)
                .then((res) => {
                    exportExcel("MemberList", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            dict,
            initData,
            pageNo,
            pageSize,
            pageTotal,
            searchFormRef,
            handleSearch,
            resetForm,
            searchForm,
            tableData,
            tableColumn,
            multipleTable,

            editVisible,
            editRow,
            handleAddEdit,
            handleSizeChange,
            handleCurrentChange,
            handleSelect,
            fromSelectList,
            shortcuts,
            disabledDate,
            handleEnableFrozen,
            disabled,
            handleExportExcel
        };
    }
};
</script>
