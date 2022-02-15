<!-- 关联设置 -->
<template>
    <BmDialog v-model:visible="visible" :title="$t('goodsCategory.associate')" :showFooter="false" :confirm="confirm" :cancel="cancel" :width="1000" top="10vh">
        <el-form ref="formRef" :model="form">
            <BmTable :data="form.configParams">
                <BmTableColumn prop="title" :label="$t('goodsCategory.configOptions')" width="200">
                    <template #default="scope">
                        <span class="red">*</span>
                        {{ scope.row.title }}
                    </template>
                </BmTableColumn>
                <BmTableColumn :label="$t('goodsCategory.rule')" width="250">
                    <template #default="scope">
                        <el-form-item v-if="scope.row.ruleType === 1" :prop="`configParams.${scope.$index}.value`" :rules="rulesCommon.required" class="mtb-15">
                            <el-input v-model="scope.row.value" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                        <el-form-item v-if="scope.row.ruleType === 2" :prop="`configParams.${scope.$index}.value`" :rules="rulesCommon.isSelect" class="mtb-15">
                            <el-radio-group v-model="scope.row.value">
                                <el-radio v-for="(value, key) in scope.row.valueMap" :key="key" :label="key">
                                    {{ value }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="remarks" :label="$t('remark')"> </BmTableColumn>
                <BmTableColumn width="120">
                    <template #default="scope">
                        <el-button @click="hanldleEdit(scope.row)" type="primary">{{ $t("status.edit") }}</el-button>
                    </template>
                </BmTableColumn>
            </BmTable>

            <el-tabs class="custom-tabs-green mt-30" v-model="activeName" @tab-click="handleTabClick" type="card">
                <!-- 商品参数 -->
                <el-tab-pane name="first">
                    <template #label>
                        <div class="label">{{ $t("goodsCategory.param") }}</div>
                    </template>

                    <el-form-item prop="paramIds" :rules="rulesCommon.isSelect">
                        <el-checkbox-group v-model="form.paramIds">
                            <el-checkbox v-for="item in attributeTableData" :key="item.id" :label="item.id" style="width:150px">{{ item.title }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <BmPagination
                        @size-change="handleSizeChangeAttribute"
                        @current-change="handleCurrentChangeAttribute"
                        :current-page="attributeForm.pageNum"
                        :page-size="attributeForm.pageSize"
                        :total="attributePageTotal"
                    >
                    </BmPagination>

                    <el-button @click="confirm" type="primary">{{ $t("status.edit") }}</el-button>
                </el-tab-pane>
                <!-- 属性项 -->
                <el-tab-pane name="second">
                    <template #label>
                        <div class="label">{{ $t("goodsCategory.attribute") }}</div>
                    </template>
                    <el-checkbox-group v-model="form.specIds">
                        <el-checkbox v-for="item in specModelTableData" :key="item.id" :label="item.id" style="width:150px">{{ item.cnSpecName }}</el-checkbox>
                    </el-checkbox-group>

                    <BmPagination
                        @size-change="handleSizeChangeSpecModel"
                        @current-change="handleCurrentChangeSpecModel"
                        :current-page="specModelForm.pageNum"
                        :page-size="specModelForm.pageSize"
                        :total="specModelPageTotal"
                    >
                    </BmPagination>

                    <el-button @click="confirm" type="primary">{{ $t("status.edit") }}</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, getCurrentInstance, watch, reactive } from "vue";
import { categoryConfigListAll, categoryCreateAssociated, categoryConfigAssociatedOp, categoryInfoAssociated, categoryUpdateAssociated, attributeListPage, specModelListPage } from "@/api/goods";

export default {
    name: "GoodsCategoryRelevance",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    async setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //创建or修改
        let updateType = "add";

        let form = reactive({
            categoryId: "",
            configParams: [],
            specIds: [],
            paramIds: []
        });

        //分类配置
        let categoryConfig = await categoryConfigListAll();
        form.configParams = categoryConfig.data.map((item) => {
            item.configId = item.id;
            item.value = "";
            return item;
        });

        watch(
            () => props.row,
            (nVal) => {
                if (nVal) {
                    form.categoryId = nVal.id;
                    //获取配置信息
                    categoryInfoAssociated(nVal.id)
                        .then((res) => {
                            const data = res.data;
                            if (data.configs && data.configs.length > 0) {
                                updateType = "edit";
                            } else {
                                updateType = "add";
                            }
                            // 先删除form.configParam中的id字段，再用接口请求数据中的id选择性替换
                            form.configParams = form.configParams.map((item) => {
                                delete item.id;
                                return item;
                            });
                            form.configParams.forEach((item) => {
                                if (updateType === "add") {
                                    item.id = "";
                                    item.value = "";
                                } else {
                                    data.configs.forEach((cItem) => {
                                        if (item.configId === cItem.configId) {
                                            item.id = cItem.id;
                                            item.value = cItem.value;
                                        }
                                    });
                                }
                            });
                            form.specIds = data.specs.map((item) => item.specId);
                            form.paramIds = data.attribtes.map((item) => item.attrId);
                        })
                        .catch(() => {});
                }
            }
        );

        const rulesCommon = {
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }
        };

        let activeName = ref("first");

        //获取属性项
        let attributeForm = reactive({
                pageNum: 1,
                pageSize: 50
            }),
            attributePageTotal = ref(0),
            attributeTableData = ref([]);
        const handleCurrentChangeAttribute = (val) => {
            attributeForm.pageNum = val;
            initData();
        };
        const handleSizeChangeAttribute = (val) => {
            attributeForm.pageNum = 1;
            attributeForm.pageSize = val;
            initData();
        };

        //获取商品参数
        let specModelForm = reactive({
                pageNum: 1,
                pageSize: 50
            }),
            specModelPageTotal = ref(0),
            specModelTableData = ref([]);
        const handleCurrentChangeSpecModel = (val) => {
            specModelForm.pageNum = val;
            initData();
        };
        const handleSizeChangeSpecModel = (val) => {
            specModelForm.pageNum = 1;
            sspecModelForm.pageSize = val;
            initData();
        };

        //获取分类配置 / 属性项 / 商品参数
        const initData = () => {
            attributeListPage(attributeForm)
                .then((res) => {
                    attributePageTotal.value = res.data.total;
                    attributeTableData.value = res.data.records;
                })
                .catch((err) => {});

            specModelListPage(specModelForm)
                .then((res) => {
                    specModelPageTotal.value = res.data.total;
                    specModelTableData.value = res.data.records;
                })
                .catch((err) => {});
        };
        initData();

        //修改
        const hanldleEdit = (row) => {
            proxy
                .$confirm(proxy.$t("goodsCategory.isUpdateSubcategory"), {
                    confirmButtonText: proxy.$t("goodsCategory.saveCurCategory"),
                    cancelButtonText: proxy.$t("goodsCategory.saveSubCategory"),
                    type: "warning",
                    distinguishCancelAndClose: true
                })
                .then(() => {
                    changeCategoryConfigAssociatedOp(row, 0); //0表示保存当前类目 1表示更新子类目 默认0
                })
                .catch((action) => {
                    if (action === "cancel") {
                        changeCategoryConfigAssociatedOp(row, 1); //0表示保存当前类目 1表示更新子类目 默认0
                    }
                });
        };
        const changeCategoryConfigAssociatedOp = (row, type) => {
            categoryConfigAssociatedOp({ configParam: row, categoryId: form.categoryId, type: type })
                .then((res) => {
                    proxy.$message.success(res.msg);
                })
                .catch(() => {});
        };

        //确认
        const formRef = ref(null);
        const confirm = () => {
            // formRef.value.validate((valid) => {
            //     if (valid) {

            let type = categoryCreateAssociated;
            if (updateType === "edit") {
                type = categoryUpdateAssociated;
            }
            type(form)
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                    proxy.$message.success(res.msg);
                    form.specIds = [];
                    form.paramIds = [];
                    formRef.value.resetFields();
                })
                .catch(() => {});
            // } else {
            //     return false;
            // }
            // });
        };

        //取消
        const cancel = () => {
            emit("update:visible", false);
            formRef.value.resetFields();
        };

        return {
            formRef,
            form,
            rulesCommon,
            confirm,
            cancel,
            activeName,

            attributeForm,
            attributePageTotal,
            attributeTableData,
            handleCurrentChangeAttribute,
            handleSizeChangeAttribute,

            specModelForm,
            specModelPageTotal,
            specModelTableData,
            handleCurrentChangeSpecModel,
            handleSizeChangeSpecModel,

            hanldleEdit
        };
    }
};
</script>
