<template>
    <el-table ref="multipleTable" v-bind="$attrs" tooltip-effect="light" :class="{ 'table-bg-grey': bgGrey }" :border="border">
        <template #empty>
            <slot name="empty">
                <BmNoData :text="emptyText || $t('noData')" />
            </slot>
        </template>
        <slot></slot>
    </el-table>
</template>

<script>
import { ref, provide, computed } from "vue";
import { useStore } from "vuex";

export default {
    name: "BmTable",
    props: {
        //是否灰背景
        bgGrey: {
            type: Boolean,
            default: true
        },
        border: {
            type: Boolean,
            default: true
        },
        emptyText: {
            type: String,
            default: ""
        },
        column: {
            type: [String, Array],
            default: ""
        }
    },

    setup(props, { emit }) {
        const store = useStore();

        const columnList = computed(() => store.state.column.columnList);

        if (!props.column) {
            //注入 table当前显示的列
            provide("columnList", ""); //必要 否则可能是其他表的列
        } else {
            //注入 table当前显示的列
            provide("columnList", columnList);
        }

        //全选
        const multipleTable = ref(null);
        const toggleAllSelection = () => {
            multipleTable.value.toggleAllSelection();
        };

        const clearSelection = () => {
            multipleTable.value.clearSelection();
        };

        const setCurrentRow = (row) => {
            multipleTable.value.setCurrentRow(row);
        };

        const toggleRowSelection = (row) => {
            multipleTable.value.toggleRowSelection(row);
        };

        return {
            columnList,
            multipleTable,
            toggleAllSelection,
            clearSelection,
            toggleRowSelection,
            setCurrentRow
        };
    }
};
</script>
