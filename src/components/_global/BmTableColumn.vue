<template>
    <el-table-column v-if="type === 'index'" :type="type" :label="label"></el-table-column>
    <el-table-column v-else-if="type === 'selection'" :type="type"></el-table-column>
    <el-table-column v-else-if="type === 'expand'" :type="type" :label="label">
        <template #default="scope">
            <slot :row="scope.row" :$index="scope.$index"> </slot>
        </template>
    </el-table-column>
    <el-table-column v-else-if="columnList.includes(prop) || typeof prop == 'undefined' || columnList.length === 0" v-bind="$attrs">
        <template #header>
            <slot name="header"> {{ label }} </slot>
        </template>
        <template #default="scope">
            <slot name="default" :row="scope.row" :$index="scope.$index">
                {{ scope.row[prop] }}
            </slot>
        </template>
    </el-table-column>
</template>

<script>
import { inject } from "vue";

export default {
    name: "BmTableColumn",
    props: {
        prop: {
            type: String
        },
        label: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: ""
        }
    },
    setup() {
        const columnList = inject("columnList");
        return {
            columnList
        };
    }
};
</script>
