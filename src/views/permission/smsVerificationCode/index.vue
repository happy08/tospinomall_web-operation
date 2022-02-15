<template>
    <!-- 搜索表单区域 -->
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="8">
                    <!-- 手机号 -->
                    <el-form-item :label="$t('permissionUser.phone')" prop="phone">
                        <el-input v-model="searchForm.phone" clearable :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="8">
                    <!-- 时间 -->
                    <el-form-item :label="$t('time')" prop="time">
                        <el-date-picker
                            v-model="searchForm.time"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                            style="width:100%"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 搜索按钮区域 -->
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
    <!-- table区域 -->
    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData">
            <!-- 手机号 -->
            <BmTableColumn :label="$t('permissionUser.phone')" prop="phone">
                <template #default="scope">
                    <span>{{ scope.row.phonePrefix }}{{ scope.row.phone }}</span>
                </template>
            </BmTableColumn>
            <!-- 验证码 -->
            <BmTableColumn :label="$t('businessMessageSettings.code')" prop="code"></BmTableColumn>
            <!-- 发送时间 -->
            <BmTableColumn :label="$t('smsVerificationCode.sendTime')" prop="createTime"></BmTableColumn>
        </BmTable>

        <!-- 分页区域 -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNo" :total="pageTotal"></BmPagination>
    </div>
</template>
<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { useStore } from "vuex";
import { smsVerificationCode } from "@/api/permission";
export default {
    name: "smsVerificationCode",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); // 数据字典
        const lang = computed(() => store.state.app.lang);

        watch(lang, (nval) => {
            initData();
        });

        // 分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);
        // 搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            pageNo: 1, // 页码
            pageSize: 10, // 分页数量
            phone: "",
            time: [],
            startTime: "",
            endTime: ""
        });
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        // 禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };
        const multipleTable = ref(null);
        // 表单数据数组
        const tableData = ref([]);
        // 数据Table页码是否重置为1控制变量
        let pageFlag = ref(true);
        // 获取数据
        const getListPage = () => {
            if (pageFlag.value) {
                searchForm.pageNo = 1;
            }
            smsVerificationCode(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records;
                })
                .catch(() => {});
            pageFlag.value = true;
        };
        // 初始化获取
        const initData = () => {
            getListPage();
        };
        initData();
        // 查询
        const handleSearch = () => {
            // 将DatePicker日期选择器中的时间转换为标准时间
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm.time && searchForm.time[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm.time && searchForm.time[1], true);
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.startTime = searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        // 当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNo = val;
            pageFlag.value = false;
            initData();
        };
        // 每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            initData();
        };
        return {
            multipleTable,
            tableData,
            searchFormRef,
            searchForm,
            handleSearch,
            resetForm,
            pageNo,
            pageTotal,
            shortcuts,
            disabledDate,
            pageFlag,
            handleCurrentChange,
            handleSizeChange
        };
    }
};
</script>
