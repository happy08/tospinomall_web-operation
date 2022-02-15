<template>
    <el-select ref="select" v-model="valueTitle">
        <el-option class="options" :label="valueTitle" :value="valueId">
            <el-tree ref="selectTree" :data="data" :props="options" :node-key="options.value" :default-expanded-keys="[]" @node-click="handleNodeClick"> </el-tree>
        </el-option>
    </el-select>
</template>
<script>
import { ref, nextTick, watch } from "vue";

export default {
    name: "selectionMenuTree",
    props: {
        /* 配置项 */
        options: {
            type: Object,
            default: () => {
                return {
                    value: "id", // ID字段名
                    label: "name", // 显示名称
                    children: "children" // 子级字段名
                };
            }
        },
        /* 选项列表数据(树形结构的对象数组) */
        data: {
            type: Array,
            default: () => {
                return [];
            }
        },
        /* 初始值 */
        parentId: {
            default: () => {
                return null;
            }
        },
        //只能选择最后一级
        lastLevel: {
            type: Boolean,
            default: false
        }
    },

    setup(props, { emit }) {
        let valueId = ref(""); // 初始值
        let valueTitle = ref("");

        watch(
            () => props.parentId,
            (nVal) => {
                valueId.value = nVal;
                initHandle();
            },
            {
                immediate: true
            }
        );

        // 初始化值
        let selectTree = ref(null);
        let defaultExpandedKey = [];
        function initHandle() {
            nextTick(() => {
                if (valueId.value) {
                    // 初始化显示label
                    valueTitle.value = selectTree.value.getNode(valueId.value).data[props.options.label];
                    selectTree.value.setCurrentKey(valueId.value); // 设置默认选中
                    defaultExpandedKey.value = [valueId.value]; // 设置默认展开
                }
            });
        }

        // 切换选项
        const handleNodeClick = (node) => {
            // 只能选择最后一级
            if (props.lastLevel && node.children && node.children.length > 0) {
                return;
            }
            valueTitle.value = node[props.options.label]; //获取label
            valueId.value = node[props.options.value]; //获取value
            emit("update:parentId", valueId.value); //传值给父组件
        };

        return {
            valueId,
            valueTitle,
            defaultExpandedKey,
            selectTree,
            handleNodeClick
        };
    }
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
}
.el-tree-node__label {
    font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
    color: #409eff;
    font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
}
</style>
