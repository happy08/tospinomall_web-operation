<template>
    <!-- 模板装修 -->
    <BmDialog v-model:visible="visible" :title="$t('mallCategory.fitment')" :width="1000">
        <div class="fl" style="width:160px">
            <!-- 新增一级分类 -->
            <el-button @click="handleAddOneNav" type="primary" plain icon="el-icon-plus" class="w-100">
                {{ $t("mallCategory.addOneCategory") }}
            </el-button>
            <div class="nav-one active" v-for="(item, index) in form.categoryNavItemList" :key="item.id">
                <div @click="handleChangeNav(item)" class="flex between vcenter">
                    <div class="flex1 mr-10">
                        <el-input type="text" v-model="item.name" :placeholder="$t('mallCategory.oneCategory')" />
                    </div>
                    <div style="flex: 0 0 40px">
                        <el-button @click.stop="handleMinusOneNav(index)" icon="el-icon-minus" type="text"></el-button>
                        <el-button @click="handleAddTwoNav(item)" icon="el-icon-plus" type="text"></el-button>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-left:180px">
            <!-- 新增二级分类 -->
            <el-button @click="handleAddTwoNav(tableData, 2)" type="primary" plain icon="el-icon-plus" class="mb-15">
                {{ $t("mallCategory.addTwoCategory") }}
            </el-button>
            <div class="ml-20 mb-10 light-grey">
                {{ $t("imgUploadTip2", { type: "png", size: "250*250", size2: "2" }) }}
            </div>
            <div v-for="(item, index) in tableData" :key="item.id" class="p-15 mb-15 bg-light-grey round-4">
                <div class="flex">
                    <el-input type="text" v-model="item.name" :placeholder="$t('mallCategory.twoCategory')" maxlength="100" show-word-limit />
                    <el-button @click="handleMinusTwoNav(index, tableData)" icon="el-icon-delete" type="text" class="ml-20"></el-button>
                </div>
                <div class="mt-10 bg-white">
                    <div v-for="(cItem, cIndex) in item.children" :key="cItem.id" class="flex between p-10 border-b">
                        <div>
                            <el-input type="text" v-model="cItem.name" :placeholder="$t('mallCategory.threeCategory')" maxlength="100" show-word-limit />
                        </div>
                        <div>
                            <BmUpload
                                @change="
                                    (file) => {
                                        cItem.icon = file;
                                    }
                                "
                                :fileUrl="cItem.icon"
                                :showFileList="false"
                                size="xs"
                            />
                        </div>
                        <div class="flex1">
                            <el-button @click="handleRelevance(cItem)" icon="el-icon-plus">
                                {{ $t("mallCategory.categoryRelevance") }}
                                (
                                {{ cItem.linkType == 2 ? cItem.linkIds.length : 0 }}
                                /
                                {{ cItem.linkType == 1 ? cItem.linkIds.length : 0 }}
                                )
                            </el-button>
                        </div>
                        <div>
                            <el-button @click="handleSort('up', cIndex, item.children)" icon="el-icon-top" type="text"></el-button>
                            <el-button @click="handleSort('down', cIndex, item.children)" icon="el-icon-bottom" type="text"></el-button>
                        </div>
                        <div class="mr-20 ml-10">
                            <el-button @click="handleMinusThreeNav(cIndex, item.children)" icon="el-icon-delete" type="text"></el-button>
                        </div>
                    </div>
                </div>
                <!-- 新增三级分类 -->
                <el-button @click="handleAddThreeNav(item)" type="primary" plain icon="el-icon-plus" class="mt-15">
                    {{ $t("mallCategory.addThreeCategory") }}
                </el-button>
            </div>
        </div>
        <div class="clear"></div>

        <template #footer>
            <el-button @click="handleCancel" plain class="ml-20">
                {{ $t("cancel") }}
            </el-button>
            <el-button @click="handleSave(0)" :disabled="saveDisabled" type="primary" plain class="ml-20">
                {{ $t("storeDesign.saveDrafts") }}
            </el-button>
            <el-button @click="handleSave(1)" :disabled="saveDisabled" type="primary">
                {{ $t("storeDesign.savePublish") }}
            </el-button>
        </template>
    </BmDialog>

    <SelectionGoodsList v-model:visible="goodsVisible" :row="goodsRow" />
</template>

<script>
import { ref, getCurrentInstance, watch } from "vue";
import { categoryMallListTree, categoryMallUpdate } from "@/api/storeDesign";
import SelectionGoodsList from "./selectionGoodsList";

export default {
    name: "categoryListFitment",
    components: { SelectionGoodsList },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = ref({
            navStyleId: "",
            status: "",
            categoryNavItemList: []
        });
        let tableData = ref([]);
        watch(
            () => props.row,
            (nVal) => {
                if (!!nVal.navStyleId) {
                    form.value = { ...nVal };
                    categoryMallListTree(nVal.navStyleId)
                        .then((res) => {
                            if (res.data) {
                                form.value.categoryNavItemList = res.data;
                                tableData.value = res.data[0].children;
                            } else {
                                // 设置默认
                                form.value.categoryNavItemList = [
                                    {
                                        name: "",
                                        level: 1,
                                        children: [
                                            {
                                                name: "",
                                                level: 2,
                                                children: []
                                            }
                                        ]
                                    }
                                ];
                                tableData.value = form.value.categoryNavItemList[0].children;
                            }
                        })
                        .catch((err) => {});
                }
            }
        );

        //新增一级分类
        const handleAddOneNav = () => {
            form.value.categoryNavItemList.push({
                name: "",
                level: 1,
                children: [
                    {
                        name: "",
                        level: 2,
                        children: []
                    }
                ]
            });
        };

        //切换一级导航
        const handleChangeNav = (item) => {
            tableData.value = item.children;
        };

        //删除一级分类
        const handleMinusOneNav = (index) => {
            form.value.categoryNavItemList.splice(index, 1);
        };

        //新增二级分类
        const handleAddTwoNav = (item, type) => {
            if (type === 2) {
                item.push({
                    name: "",
                    level: 2,
                    children: []
                });
            } else {
                item.children.push({
                    name: "",
                    level: 2,
                    children: []
                });
            }
        };

        //删除二级分类
        const handleMinusTwoNav = (index, item) => {
            item.splice(index, 1);
        };

        //新增三级分类
        const handleAddThreeNav = (item) => {
            item.children.push({
                name: "",
                level: 3,
                icon: "",
                linkIds: [],
                linkType: "",
                children: []
            });
        };

        //删除三级分类
        const handleMinusThreeNav = (index, item) => {
            item.splice(index, 1);
        };

        //关联宝贝/分类
        let goodsVisible = ref(false);
        let goodsRow = ref({});
        const handleRelevance = (row) => {
            goodsRow.value = row;
            goodsVisible.value = true;
        };

        //排序 上移下移
        const handleSort = (type, index, row) => {
            if (type === "up") {
                if (index <= 0) {
                    return;
                }
                swapArray(row, index, index - 1);
            } else {
                if (index >= row.length - 1) {
                    return;
                }
                swapArray(row, index, index + 1);
            }
        };
        const swapArray = (row, index1, index2) => {
            row[index1] = row.splice(index2, 1, row[index1])[0];
        };

        let saveDisabled = ref(false);
        let errMsg;
        const handleSave = (status) => {
            const categoryNavItemList = form.value.categoryNavItemList;
            if (categoryNavItemList.length === 0) {
                proxy.$message.error(proxy.$t("mallCategory.addOneCategory"));
                return;
            }
            form.value.categoryNavItemList = toSort(categoryNavItemList); //排序
            //验证
            errMsg = "";
            const msg = verifyTree(categoryNavItemList);
            if (msg) {
                proxy.$message.error(proxy.$t("mallCategory.categoryNameEmpty", { msg })); //名称不能为空
                return;
            }

            saveDisabled.value = true;
            form.value.status = status;
            categoryMallUpdate(form.value)
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                    saveDisabled.value = false;
                })
                .catch(() => {
                    saveDisabled.value = false;
                });
        };

        const handleCancel = () => {
            emit("update:visible", false);
            saveDisabled.value = false;
        };

        //验证名称不能为空
        function verifyTree(data) {
            for (let i = 0, length = data.length; i < length; i++) {
                if (data[i].name == "") {
                    errMsg = data[i].categoryName || proxy.$t("mallCategory.oneCategory");
                }
                if (data[i].children && data[i].children.length > 0) {
                    verifyTree(data[i].children);
                }
            }
            return errMsg;
        }
        // 排序
        function toSort(data) {
            for (let i = 0, length = data.length; i < length; i++) {
                data[i].sort = i + 1;
                if (data[i].children && data[i].children.length > 0) {
                    data[i].children.forEach((item) => {
                        item.categoryName = (data[i].categoryName ? data[i].categoryName + ">" : "") + data[i].name;
                    });
                    toSort(data[i].children);
                }
            }
            return data;
        }

        return {
            form,
            tableData,
            handleAddOneNav,
            handleChangeNav,
            handleRelevance,
            handleMinusOneNav,
            handleAddTwoNav,
            handleMinusTwoNav,
            handleAddThreeNav,
            handleMinusThreeNav,
            goodsVisible,
            goodsRow,
            handleRelevance,
            handleSort,
            saveDisabled,
            handleSave,
            handleCancel
        };
    }
};
</script>
<style lang="scss" scoped>
.nav-one {
    margin: 5px 0;
    padding: 2px 5px;
    &:hover,
    &.active {
        background-color: #f7f7f7;
    }
}
.border-b {
    border-bottom: solid 1px #f7f7f7;
}
</style>
