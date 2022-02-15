<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <div class="mt-20 bg-white round-4">
            <div class="flex between mb-10">
                <div>
                    <div class="fl mb-10">
                        <!-- 新增 -->
                        <span class="fs-18 mr-20">{{ $t("mainCategories.categorySelection") }}</span>
                        <el-button v-permission="'baseInfo_category_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                            {{ $t("status.add") }}
                        </el-button>
                    </div>
                </div>
                <div class="flex vstart">
                    <!-- 表格选项 -->
                    <BmTableOption table="mainCategoriesTable" :column="tableColumn" class="ml-10" />
                </div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn">
                <!-- <BmTableColumn type="selection"> </BmTableColumn> -->
                <BmTableColumn prop="id" :label="$t('mainCategoriesTable.id')" width="150"> </BmTableColumn>
                <BmTableColumn prop="name" :label="$t('mainCategoriesTable.name')">
                    <template #default="scope">
                        {{ scope.row.name }}
                    </template>
                </BmTableColumn>
                <BmTableColumn :label="$t('table.operation')" width="150">
                    <template #default="scope">
                        <el-button v-permission="'baseInfo_category_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                            {{ $t("status.edit") }}
                        </el-button>
                        <el-button v-permission="'baseInfo_category_del'" @click.stop="handleAddEdit('del', scope.row)" type="text">
                            {{ $t("status.delete") }}
                        </el-button>
                        <!-- <el-button @click.stop="handleDelete(scope.row.id)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                    <el-button @click.stop="handleDefault(scope.row)" :disabled="scope.row.isDefault" type="text">
                        {{ $t("receiveAddressTable.setDefault") }}
                    </el-button> -->
                    </template>
                </BmTableColumn>
            </BmTable>
        </div>
    </div>
    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" @update:visible="changeVisible" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
// 请求接口方法引入
import { getAllCategory, delMainCategory } from "@/api/base";
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

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({});
        //搜索
        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["id", "name", "operation"];
        // 收货地址查询参数
        const typeQueryAddressParams = reactive({
            // sendModel: 2, // 发货模式：1：直发模式，2：集货仓模式,
            type: 2 //类型 1：FBT收货地址，2：FBT退货地址
        });
        // 获取列表
        const getListPage = () => {
            getAllCategory()
                .then((res) => {
                    // pageTotal.value = res.data;
                    tableData.value = res.data;
                    tableData.value = res.data.map((item) => {
                        item.region = item.provinceName + item.cityName + item.regionName;
                        item.fullPhone = "+" + item.prefixPhone + "\n" + item.phone;
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
        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            if (index > -1) {
                tableSelectionRows.push(row);
            } else {
                tableSelectionRows.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
        };

        //双击行编辑
        const handleRowdblClick = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };

        //控制编辑对话框的显示与隐藏
        let editVisible = ref(false);
        // 控制新增对话框的显示与隐藏
        let addVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {};
                editVisible.value = true;
            } else if (type === "edit") {
                editRow.value = row;
                editVisible.value = true;
            } else {
                // 删除
                proxy
                    .$confirm(proxy.$t("warehouse.deleteTips"), {
                        confirmButtonText: proxy.$t("confirm"),
                        cancelButtonText: proxy.$t("cancel"),
                        type: "warning"
                    })
                    .then(() => {
                        delMainCategory(row.id)
                            .then(() => {
                                initData();
                            })
                            .catch(() => {});
                    });
            }
        };
        // 添加编辑操作完成后关闭dialog
        const changeVisible = (visible) => {
            editVisible.value = visible;
        };
        //删除
        // const handleDelete = (id) => {
        //   const ids = tableSelectionRows.map((item) => item.id).join("_");
        //   receiveAddressDel(id)
        //     .then((res) => {
        //       initData();
        //       proxy.$message.success(res.msg);
        //     })
        //     .catch((err) => {});
        // };
        // 初始默认数据列表
        let receiveAddressInitData = ref([]);
        return {
            dict,
            initData,
            pageNum,
            pageSize,
            pageTotal,
            tableData,
            tableColumn,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            receiveAddressInitData,
            typeQueryAddressParams,
            changeVisible
        };
    }
};
</script>
