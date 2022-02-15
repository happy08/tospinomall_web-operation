<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 名称 -->
                    <el-form-item :label="$t('area.info')" prop="name">
                        <el-input v-model="searchForm.codeOrName" :placeholder="$t('areaTable.code') + ' / ' + $t('areaTable.name')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 状态 -->
                    <el-form-item :label="$t('status.status')" prop="status">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
                    <el-form-item :label="$t('areaTable.updateTime')" prop="_tmpTimeValue">
                        <el-date-picker
                            v-model="searchForm._tmpTimeValue"
                            type="datetimerange"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开
                <BmCollapse el="#elCollapse" :isShow="false" />  -->
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10 mr-15">
                    <!-- 新增 -->
                    <el-button v-permission="'baseInfo_area_addClassification'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("area.addOne") }}
                    </el-button>
                    <!-- 编辑
                    <el-button @click="handleAddEdit('edit')" class="">
                        {{ $t("status.edit") }}
                    </el-button> -->
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作 -->
                    <span>{{ $t("status.batchOperation") }}：</span>

                    <!-- 启用 -->
                    <el-button v-permission="'baseInfo_area_enable'" @click="handleOpenShield(0)">{{ $t("status.enable") }}</el-button>
                    <!-- 禁用 -->
                    <el-button v-permission="'baseInfo_area_disable'" @click="handleOpenShield(1)">{{ $t("status.forbidden") }}</el-button>
                    <!-- 删除
                    <el-button @click="handleDelete">{{ $t("status.delete") }}</el-button> -->
                </div>
            </div>
            <div class="flex vstart"></div>
        </div>

        <BmTable
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            @row-dblclick="handleRowdblClick"
            lazy
            row-key="id"
            :load="tableDataLoad"
            :tree-props="{ children: 'aresChilds', hasChildren: 'hasChildren' }"
        >
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="areaCode" :label="$t('areaTable.code')"> </BmTableColumn>
            <BmTableColumn prop="name" :label="$t('areaTable.name')"> </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('areaTable.createTime')" width="155"></BmTableColumn>
            <BmTableColumn prop="updateTime" :label="$t('areaTable.updateTime')" width="155"></BmTableColumn>
            <BmTableColumn prop="status" :label="$t('areaTable.status')" width="120"
                ><template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="180">
                <template #default="scope">
                    <el-button v-permission="'baseInfo_area_enable'" v-if="scope.row.status === 1" @click.stop="handleOpenShield(0, scope.row)" type="text">{{ $t("status.enable") }}</el-button>
                    <el-button v-permission="'baseInfo_area_disable'" v-else @click.stop="handleOpenShield(1, scope.row)" type="text">
                        {{ $t("status.forbidden") }}
                    </el-button>
                    <el-button v-permission="'baseInfo_area_add'" @click.stop="handleAddEdit('add', scope.row)" type="text">
                        {{ $t("status.add") }}
                    </el-button>
                    <el-button v-permission="'baseInfo_area_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <el-button v-permission="'baseInfo_area_del'" @click.stop="handleDelete(scope.row)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>
    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { areaFindAreas, areFindByParentId, areaDelete, areaBatchUpdate } from "@/api/base";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { deepClone } from "@/utils/";
import AddEdit from "./component/addEdit";

export default {
    name: "baseInfoArea",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //状态
        const statusList = computed(() => [
            {
                name: proxy.$t("status.enable"),
                value: 0
            },
            {
                name: proxy.$t("status.forbidden"),
                value: 1
            }
        ]);
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            codeOrName: "", //名称
            status: "",
            _tmpTimeValue: []
        });
        //搜索
        const handelSearch = () => {
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1], true);

            areaFindAreas(searchForm)
                .then((res) => {
                    tableData.value = res.data; //forTree(res.data);
                })
                .catch((err) => {});
        };
        //重置
        const resetForm = () => {
            searchForm.startTime = searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);

        let tableData = ref([]);

        //获取列表
        const initData = (parentId) => {
            return new Promise((resolve, reject) => {
                areFindByParentId({ parentId: parentId || 0 })
                    .then((res) => {
                        let data = res.data.map((item) => {
                            for (let i in statusList.value) {
                                if (statusList.value[i].value === item.status) {
                                    item.statusName = statusList.value[i].name;
                                    break;
                                }
                            }

                            item.hasChildren = true;
                            return item;
                        });

                        if (!parentId) {
                            tableData.value = data;
                            return;
                        }

                        resolve(data);
                    })
                    .catch((err) => {});
            });
        };
        initData();

        //展开加载
        const tableDataLoad = async (tree, treeNode, resolve) => {
            const data = await initData(tree.id);
            resolve(data);
        };

        // //整理列表树
        // function forTree(data) {
        //     const d = data.map((item) => {
        //         for (let i in statusList.value) {
        //             if (statusList.value[i].value === item.status) {
        //                 item.statusName = statusList.value[i].name;
        //                 break;
        //             }
        //         }
        //         if (item.aresChilds && item.aresChilds.length > 0) {
        //             item.hasChildren = true;
        //             item.aresChilds = forTree(item.aresChilds);
        //         }
        //         return item;
        //     });
        //     return d;
        // }

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            // const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            // if (index > -1) {
            //     tableSelectionRows.push(row);
            // } else {
            //     tableSelectionRows.splice(index, 1);
            // }
            multipleTable.value.toggleRowSelection(row);
        };

        //双击行编辑
        const handleRowdblClick = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                if (row) {
                    editRow.value = {
                        level: row.level,
                        parentId: row.id,
                        parentName: row.name
                    };
                } else {
                    editRow.value = {
                        level: 0,
                        parentId: 0,
                        parentName: "",
                        isOne: true
                    };
                }
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //删除
        const handleDelete = (row) => {
            areaDelete(row.id)
                .then((res) => {
                    //initData();
                    row.isDelete = true;
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        //开启-屏蔽
        const handleOpenShield = (status, row) => {
            let ids = "",
                parentIds = "";
            if (row) {
                ids = row.id;
                parentIds = row.parentId;
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
                ids = tableSelectionRows.map((item) => item.id).join(",");
                parentIds = tableSelectionRows.map((item) => item.parentId).join(",");
            }
            const params = {
                ids: ids,
                parentIds: parentIds,
                status: status
            };
            areaBatchUpdate(params)
                .then((res) => {
                    if (row) {
                        row.status = status;
                        for (let i in statusList.value) {
                            if (statusList.value[i].value === row.status) {
                                row.statusName = statusList.value[i].name;
                                break;
                            }
                        }
                    } else {
                        tableSelectionRows.forEach((item) => {
                            item.status = status;
                            for (let i in statusList.value) {
                                if (statusList.value[i].value === item.status) {
                                    item.statusName = statusList.value[i].name;
                                    break;
                                }
                            }
                        });
                    }

                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        /**
         * 递归过滤节点，生成新的树结构
         * @param {Node[]} nodes 要过滤的节点
         * @param {node => boolean} predicate 过滤条件，符合条件的节点保留
         * @return 过滤后的节点
         */
        // function searchTree(nodes, predicate) {
        //     // 如果已经没有节点了，结束递归
        //     if (!(nodes && nodes.length)) {
        //         return [];
        //     }

        //     const newChildren = [];
        //     for (const node of nodes) {
        //         if (predicate(node)) {
        //             // 如果节点符合条件，直接加入新的节点集
        //             newChildren.push(node);
        //             node.aresChilds = searchTree(node.aresChilds, predicate);
        //         } else {
        //             // 如果当前节点不符合条件，递归过滤子节点，
        //             // 把符合条件的子节点提升上来，并入新节点集
        //             newChildren.push(...searchTree(node.aresChilds, predicate));
        //         }
        //     }
        //     return newChildren;
        // }
        return {
            dict,
            statusList,
            initData,
            tableDataLoad,
            shortcuts,
            disabledDate,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableData,
            multipleTable,

            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete,
            handleOpenShield,
            detailVisible,
            detailRow,
            handleDetail
        };
    }
};
</script>
