<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="8">
                    <!-- 操作记录 -->
                    <el-form-item :label="$t('permissionLog.record') + '/' + $t('permissionLog.createBy')">
                        <el-input v-model="searchForm.keywards" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="8">
                    <!-- 操作日期 -->
                    <el-form-item :label="$t('permissionLog.createTime')" prop="createTime">
                        <el-date-picker
                            v-model="searchForm.createTime"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            style="width: 100%"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div class="flex vstart"></div>
        </div>

        <BmTable :data="tableData">
            <BmTableColumn prop="createBy" :label="$t('permissionLog.createBy')"> </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('permissionLog.createTime')"> </BmTableColumn>
            <BmTableColumn prop="remoteAddr" :label="$t('permissionLog.ip')" width="150"> </BmTableColumn>
            <BmTableColumn prop="method" :label="$t('permissionLog.method')" width="120"> </BmTableColumn>
            <BmTableColumn prop="requestUri" label="API"> </BmTableColumn>
            <BmTableColumn prop="params" :label="$t('permissionLog.params')"> </BmTableColumn>
            <BmTableColumn prop="title" :label="$t('permissionLog.record')"> </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :total="pageTotal"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { logPage } from "@/api/permission";

export default {
    name: "permissionLog",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let current = ref(1),
            size = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            //status: null, //状态（0启用 1禁用）
            createTime: [],
            current: current,
            size: size
        });
        //搜索
        const handelSearch = () => {
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm.createTime && searchForm.createTime[1], true);

            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.startTime = searchForm.endTime = "";

            searchFormRef.value.resetFields();
            initData();
        };

        let tableData = ref([]);

        //获取列表
        const getListPage = () => {
            logPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records;
                })
                .catch((err) => {});
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.current = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.current = 1;
            searchForm.size = val;
            initData();
        };

        return {
            initData,
            current,
            size,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableData,

            handleSizeChange,
            handleCurrentChange
        };
    }
};
</script>
