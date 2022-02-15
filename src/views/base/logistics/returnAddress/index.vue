<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <div class="mt-20 bg-white round-4">
            <div class="flex between mb-10">
                <div>
                    <div class="fl mb-10">
                        <!-- 新增 -->
                        <span class="fs-18 mr-20">{{ $t("receiveAddress.returnAddress") }}</span>
                        <el-button v-permission="'logistics_returnAddress_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                            {{ $t("status.add") }}
                        </el-button>
                    </div>
                </div>
                <div class="flex vstart">
                    <!-- 表格选项 -->
                    <BmTableOption table="returnAddressTable" :column="tableColumn" class="ml-10" />
                </div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn">
                <!-- <BmTableColumn type="selection"> </BmTableColumn> -->
                <BmTableColumn prop="name" :label="$t('returnAddressTable.name')" width="150"> </BmTableColumn>
                <BmTableColumn prop="phone" :label="$t('returnAddressTable.phone')">
                    <template #default="scope">
                        {{ scope.row.fullPhone }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="region" :label="$t('returnAddressTable.region')">
                    <template #default="scope">
                        {{ scope.row.region }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="detailAddress" :label="$t('returnAddressTable.detailAddress')">
                    <template #default="scope">
                        {{ scope.row.detailAddress }}
                    </template>
                </BmTableColumn>
                <BmTableColumn :label="$t('table.operation')" width="150">
                    <template #default="scope">
                        <el-button v-permission="'logistics_returnAddress_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                            {{ $t("status.edit") }}
                        </el-button>
                        <el-button v-permission="'logistics_returnAddress_del'" @click.stop="handleDelete(scope.row.id)" type="text">
                            {{ $t("status.delete") }}
                        </el-button>
                        <el-button v-permission="'logistics_returnAddress_setDefault'" @click.stop="handleDefault(scope.row)" :disabled="scope.row.isDefault" type="text">
                            {{ $t("receiveAddressTable.setDefault") }}
                        </el-button>
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
import { attributeRemoveByIds, attributeUpdateById, receivingAddress, typeQueryAddress, receiveAddressDel, editReceiveAddress } from "@/api/base";
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
        const tableColumn = ["name", "phone", "region", "detailAddress", "operation"];
        // 收货地址查询参数
        const typeQueryAddressParams = reactive({
            // sendModel: 2, // 发货模式：1：直发模式，2：集货仓模式,
            type: 2 //类型 1：FBT收货地址，2：FBT退货地址
        });
        // 获取列表
        const getListPage = () => {
            typeQueryAddress(typeQueryAddressParams)
                .then((res) => {
                    // pageTotal.value = res.data;
                    tableData.value = res.data;
                    tableData.value = res.data.map((item) => {
                        item.region = item.provinceName + item.cityName + item.regionName;
                        item.fullPhone = item.prefixPhone + "\n" + item.phone;
                        return item;
                    });
                    console.log(tableData.value);
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
            console.log(tableData.value);
            if (type === "add") {
                editRow.value = {};
                // editRow.value.sendModel = typeQueryAddressParams.sendModel
                editRow.value.type = 1;
                editVisible.value = true;
            } else if (type === "edit") {
                editRow.value = row;
                editVisible.value = true;
            }
        };
        // 添加编辑操作完成后关闭dialog
        const changeVisible = (visible) => {
            editVisible.value = visible;
        };
        //删除
        const handleDelete = (id) => {
            const ids = tableSelectionRows.map((item) => item.id).join("_");
            receiveAddressDel(id)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };
        // 设为默认地址
        const handleDefault = (row) => {
            // 将scope.row.isDefault改为1，然后发起编辑请求
            row.isDefault = 1;
            console.log(row);
            editReceiveAddress(row)
                .then(() => {
                    initData();
                })
                .catch((err) => {
                    console.log(err);
                });
        };
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
            handleDelete,
            receiveAddressInitData,
            typeQueryAddressParams,
            handleDefault,
            changeVisible
        };
    }
};
</script>
