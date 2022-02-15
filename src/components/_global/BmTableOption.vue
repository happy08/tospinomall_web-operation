<template>
    <!-- 表格选项 -->
    <el-dropdown trigger="click" size="small" :hide-on-click="false" :max-height="375">
        <el-button> {{ $t("table.column") }}<i class="el-icon-arrow-down el-icon--right"></i></el-button>

        <template #dropdown>
            <el-dropdown-menu>
                <el-checkbox-group v-model="checkColumnList">
                    <el-dropdown-item v-for="(item, index) in columnLabel" :key="index">
                        <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
                    </el-dropdown-item>
                </el-checkbox-group>
            </el-dropdown-menu>
            <el-dropdown-item disabled class="tc">
                <el-button @click="handleColumnConfirm" class="mtb-10" size="mini">{{ $t("confirm") }}</el-button>
            </el-dropdown-item>
        </template>
    </el-dropdown>
</template>

<script>
import { ref, toRaw, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import storage from "@/utils/storage";

export default {
    name: "BmTableOption",
    props: {
        //table名称 必填
        table: {
            type: String,
            require: true,
            default: ""
        },
        //表格选项下拉所有列
        column: {
            type: Array,
            default: []
        }
    },

    setup(props) {
        const store = useStore();
        const { proxy } = getCurrentInstance();
        //下拉选中列
        const columnList = storage.get(`table-column-${props.table}`) || props.column;

        let checkColumnList = ref(columnList);
        store.commit("column/SET_COLUMN", checkColumnList.value);

        //下拉所有列 (注意：props.table必须和多语言键值一致才能获取对应语言)
        const columnLabel = computed(() => {
            let columnLabelTmp = [];
            for (let i in props.column) {
                let tmp = {
                    label: proxy.$t(`${props.table}.${props.column[i]}`),
                    value: props.column[i]
                };
                columnLabelTmp.push(tmp);
            }
            return columnLabelTmp;
        });

        //修改显示table列
        const handleColumnConfirm = () => {
            if (checkColumnList.value.length < 1) {
                proxy.$message.error(proxy.$t("selectLeastOne")); //至少选择一项
                return;
            }
            store.commit("column/SET_COLUMN", checkColumnList.value);
            storage.set(`table-column-${props.table}`, toRaw(checkColumnList.value));
        };

        return {
            columnLabel,
            checkColumnList,
            handleColumnConfirm
        };
    }
};
</script>
