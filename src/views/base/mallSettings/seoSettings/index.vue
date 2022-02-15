<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('seoSettings.operationTips')" icon="warning" class="mb-20" />
    </div>
    <!-- 查看 -->
    <div class="p-25 bg-white round-4">
        <el-tabs v-model="activeName" class="custom-tabs-green" stretch type="card">
            <!-- 首页 -->
            <el-tab-pane :label="$t('seoSettings.index')" name="1">
                <el-form v-if="form.INDEXSEO" ref="formRef" :rules="rules" :model="form">
                    <el-form-item label="title">
                        <el-input v-model="form.INDEXSEO.title"></el-input>
                    </el-form-item>
                    <el-form-item label="keywords">
                        <el-input v-model="form.INDEXSEO.keyword"></el-input>
                    </el-form-item>
                    <el-form-item label="description">
                        <el-input v-model="form.INDEXSEO.description"></el-input>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button type="primary" @click="handleSave(form.INDEXSEO, 1)">
                        {{ $t("seoSettings.save") }}
                    </el-button>
                </div>
            </el-tab-pane>
            <!-- 商品详情 -->
            <el-tab-pane :label="$t('seoSettings.goodsDetail')" name="2">
                <el-form v-if="form.GOODSDETAILSEO" ref="formRef" :rules="rules" :model="form">
                    <el-form-item label="title">
                        <el-input v-model="form.GOODSDETAILSEO.title"></el-input>
                    </el-form-item>
                    <el-form-item label="keywords">
                        <el-input v-model="form.GOODSDETAILSEO.keyword"></el-input>
                    </el-form-item>
                    <el-form-item label="description">
                        <el-input v-model="form.GOODSDETAILSEO.description"></el-input>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button type="primary" @click="handleSave(form.GOODSDETAILSEO, 2)">
                        {{ $t("seoSettings.save") }}
                    </el-button>
                </div>
            </el-tab-pane>
            <!-- 商品分类列表 -->
            <el-tab-pane :label="$t('seoSettings.categoriesList')" name="3">
                <el-form v-if="form.GOODSCATEGORYSEO" ref="formRef" :rules="rules" :model="form">
                    <el-form-item label="title">
                        <el-input v-model="form.GOODSCATEGORYSEO.title"></el-input>
                    </el-form-item>
                    <el-form-item label="keywords">
                        <el-input v-model="form.GOODSCATEGORYSEO.keyword"></el-input>
                    </el-form-item>
                    <el-form-item label="description">
                        <el-input v-model="form.GOODSCATEGORYSEO.description"></el-input>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button type="primary" @click="handleSave(form.GOODSCATEGORYSEO, 3)">
                        {{ $t("seoSettings.save") }}
                    </el-button>
                </div>
            </el-tab-pane>
            <!-- 商品搜索列表 -->
            <el-tab-pane :label="$t('seoSettings.goodsSearchList')" name="4">
                <el-form v-if="form.GOODSSEARCHSEO" ref="formRef" :rules="rules" :model="form">
                    <el-form-item label="title">
                        <el-input v-model="form.GOODSSEARCHSEO.title"></el-input>
                    </el-form-item>
                    <el-form-item label="keywords">
                        <el-input v-model="form.GOODSSEARCHSEO.keyword"></el-input>
                    </el-form-item>
                    <el-form-item label="description">
                        <el-input v-model="form.GOODSSEARCHSEO.description"></el-input>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button v-permission="'mallSettings_seoSettings_save'" type="primary" @click="handleSave(form.GOODSSEARCHSEO, 4)">
                        {{ $t("seoSettings.save") }}
                    </el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { getAllSeoInfo, editCategoriesSeoInfo, editGoodsDetailSeoInfo, editGoodsSearchSeoInfo, editIndexSeoInfo } from "@/api/base";

export default {
    name: "baseInfoArea",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        let activeName = ref("1");
        // 平台信息表单数据对象
        let form = ref({});
        //获取列表
        const getListPage = () => {
            getAllSeoInfo()
                .then((res) => {
                    //   form.value = res.data
                    res.data.map((item) => {
                        switch (item.code) {
                            case "INDEXSEO":
                                form.value.INDEXSEO = item;
                                break;
                            case "GOODSDETAILSEO":
                                form.value.GOODSDETAILSEO = item;
                                break;
                            case "GOODSCATEGORYSEO":
                                form.value.GOODSCATEGORYSEO = item;
                                break;
                            case "GOODSSEARCHSEO":
                                form.value.GOODSSEARCHSEO = item;
                                break;
                        }
                    });
                    console.log("form", form.value);
                })
                .catch(() => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        const rules = {
            platformName: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const formRef = ref(null);
        // 保存与修改
        const handleSave = (obj, num) => {
            proxy
                .$confirm(proxy.$t("seoSettings.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    // formRef.value.validate((valid) => {
                    //   if (valid) {
                    // 判断修改类型(1.首页，2.商品详情，3.商品分类列表，4.商品搜索列表)
                    switch (num) {
                        case 1:
                            editIndexSeoInfo(obj)
                                .then((res) => {
                                    proxy.$message.success(res.msg);
                                })
                                .catch(() => {});
                            break;
                        case 2:
                            editGoodsDetailSeoInfo(obj)
                                .then((res) => {
                                    proxy.$message.success(res.msg);
                                })
                                .catch(() => {});
                            break;
                        case 3:
                            editCategoriesSeoInfo(obj)
                                .then((res) => {
                                    proxy.$message.success(res.msg);
                                })
                                .catch(() => {});
                            break;
                        case 4:
                            editGoodsSearchSeoInfo(obj)
                                .then((res) => {
                                    proxy.$message.success(res.msg);
                                })
                                .catch(() => {});
                            break;
                    }
                    //   } else {
                    //     return false
                    //   }
                });
            //   })
        };
        return {
            initData,
            form,
            rules,
            handleSave,
            formRef,
            activeName
        };
    }
};
</script>
