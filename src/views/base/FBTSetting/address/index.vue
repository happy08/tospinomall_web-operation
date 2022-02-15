<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- 按钮组区域 -->
        <el-radio-group v-model="typeQueryAddressParams.sendModel">
            <el-radio-button @click="warehouseHandle(2)" label="2">{{ $t("receiveAddress.warehouseMode") }}</el-radio-button>
            <el-radio-button @click="warehouseHandle(1)" label="1">{{ $t("receiveAddress.directMode") }}</el-radio-button>
        </el-radio-group>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button v-permission="'FBTSetting_area_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                </div>
            </div>
            <div class="flex vstart">
                <!-- 表格选项 -->
                <BmTableOption table="receiveAddressTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn">
            <!-- <BmTableColumn type="selection"> </BmTableColumn> -->
            <BmTableColumn prop="name" :label="$t('receiveAddressTable.name')" width="150"> </BmTableColumn>
            <BmTableColumn prop="phone" :label="$t('receiveAddressTable.phone')">
                <template #default="scope"> {{ scope.row.prefixPhone }} {{ scope.row.phone }} </template>
            </BmTableColumn>
            <BmTableColumn prop="countryName" :label="$t('receiveAddressTable.countryName')"> </BmTableColumn>
            <BmTableColumn prop="warehouseReceivingAddress" :label="$t('receiveAddressTable.warehouseReceivingAddress')">
                <template #default="scope">
                    {{ scope.row.warehouseReceivingAddress }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="detailAddress" :label="$t('receiveAddressTable.detailAddress')">
                <template #default="scope">
                    {{ scope.row.detailAddress }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="150">
                <template #default="scope">
                    <el-button v-permission="'FBTSetting_area_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <el-button v-permission="'FBTSetting_area_del'" @click.stop="handleDelete(scope.row.id)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                    <el-button v-permission="'FBTSetting_area_setDefault'" @click.stop="handleDefault(scope.row)" :disabled="scope.row.isDefault" type="text">
                        {{ $t("receiveAddressTable.setDefault") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" @update:visible="changeVisible" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
// 请求接口方法引入
import { typeQueryAddress, receiveAddressDel, editReceiveAddress } from "@/api/base";
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
        // 汇率查询请求参数
        const exchangeRateParams = reactive({});
        const handelSearch = () => {
            exchangeRateParams.endTime = proxy.utils.formatStandardDateFull(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1], true);
            exchangeRateParams.name = searchForm.currencyName;
            exchangeRateParams.startTime = proxy.utils.formatStandardDateFull(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0], true);
            exchangeRateParams.status = 0;
            getListPage(exchangeRateParams);
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["name", "phone", "countryName", "warehouseReceivingAddress", "detailAddress", "operation"];
        // 收货地址查询参数
        const typeQueryAddressParams = reactive({
            sendModel: 2, // 发货模式：1：直发模式，2：集货仓模式,
            type: 1 //类型 1：FBT收货地址，2：FBT退货地址
        });
        // 获取列表
        const getListPage = () => {
            typeQueryAddress(typeQueryAddressParams)
                .then((res) => {
                    // pageTotal.value = res.data;
                    tableData.value = res.data;
                    tableData.value = res.data.map((item) => {
                        item.warehouseReceivingAddress = item.provinceName + item.cityName + item.regionName;
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
        // 点击按钮，切换集货仓模式与直发模式
        const warehouseHandle = (num) => {
            typeQueryAddressParams.sendModel = num;
            getListPage();
        };
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
                editRow.value.sendModel = typeQueryAddressParams.sendModel;
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
            proxy
                .$confirm(proxy.$t("warehouse.deleteTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    const ids = tableSelectionRows.map((item) => item.id).join("_");
                    receiveAddressDel(id)
                        .then((res) => {
                            initData();
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                });
        };
        // 设为默认地址
        const handleDefault = (row) => {
            // 将scope.row.isDefault改为1，然后发起编辑请求
            // // 取消其他行数组的默认值
            // tableData.value = tableData.value.map((item) => {
            //       item.isDefault = 0
            //       return item;
            //     });
            // // 当前行设置为默认
            // tableData.value.some((item,index) => {
            //   if(item.id === id) {
            //     item.isDefault = 1
            //   }
            // })
            row.isDefault = 1;
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
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
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
            warehouseHandle,
            handleDefault,
            changeVisible
        };
    }
};
</script>
