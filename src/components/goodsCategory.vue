<template>
    <el-drawer :title="$t('goods.selectCategory')" v-model="visible" direction="rtl" :before-close="beforeClose" destroy-on-close :size="400">
        <div class="plr-15 pb-50 mb-50">
            <div class="flex mb-15">
                <el-input :placeholder="$t('goods.categoryInfo')" v-model="filterText" class="mr-15"> </el-input>
                <!-- <el-select v-model="categoryLanguage" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="(item, index) in dict.language" :key="index" :label="item.name" :value="item.value"> </el-option>
                </el-select> -->
            </div>
            <el-tree
                :data="categoryList"
                show-checkbox
                node-key="id"
                ref="tree"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :default-expanded-keys="ids"
                :default-checked-keys="ids"
                highlight-current
            ></el-tree>
        </div>
        <div class="btns">
            <el-button @click="beforeClose">{{ $t("cancel") }}</el-button>
            <el-button @click="handleConfirm" type="primary">{{ $t("confirm") }}</el-button>
        </div>
    </el-drawer>
</template>

<script>
import { ref, reactive, watch, computed, inject } from "vue";
import { useStore } from "vuex";
import { categoryListMoretree } from "@/api/goods";

export default {
    name: "AttributeAdd",
    props: {
        visible: Boolean,
        ids: Array
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const store = useStore();
        //const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);

        //获取产品分类列表
        let categoryList = ref([]);
        const getListPage = () => {
            categoryListMoretree({
                status: 1
            })
                .then((res) => {
                    categoryList.value = res.data;
                })
                .catch((err) => {});
        };
        getListPage();

        const tree = ref(null);
        const beforeClose = () => {
            emit("update:visible", false);
        };
        const handleConfirm = () => {
            const nodes = tree.value.getCheckedNodes();
            let ids = [];
            nodes.forEach((item) => {
                !item.children && ids.push(item.id);
            });
            emit("change", ids, nodes);
            beforeClose();
        };

        const defaultProps = reactive({
            children: "children",
            label: "cnName"
        });
        //语言
        let categoryLanguage = ref(lang.value);
        watch(
            categoryLanguage,
            (nVal) => {
                let name = "enName";
                if (nVal === "zh-CN") {
                    name = "cnName";
                }
                defaultProps.label = name;
            },
            { immediate: true }
        );

        //过滤
        let filterText = ref("");
        watch(filterText, (val) => {
            tree.value.filter(val);
        });
        const filterNode = (value, data) => {
            if (!value) return true;
            return data.cnName.indexOf(value) !== -1 || data.enName.indexOf(value) !== -1;
        };

        return {
            //dict,
            categoryList,
            defaultProps,
            tree,
            categoryLanguage,
            filterText,
            filterNode,
            beforeClose,
            handleConfirm
        };
    }
};
</script>
<style lang="scss" scoped>
.btns {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    text-align: center;
}
</style>
