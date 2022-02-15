<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('sharingSettings.operationTips')" icon="warning" class="mb-20" />
    </div>
    <!-- 操作提示 -->
    <div class="p-25 bg-white round-4">
        <!-- 复制商品链接分享 -->
        <span class="fs-14">{{ $t("sharingSettings.copyProductLinkToShare") }}:</span>
        <span class="light-grey">{{ $t("sharingSettings.copyProductLinkToShareTips") }}</span>
        <!-- 切换tab区域 -->
        <div class="mt-40">
            <el-tabs class="custom-tabs-green" type="card" v-model="activeName">
                <!-- facebook分享商品 -->
                <el-tab-pane :label="$t('sharingSettings.facebookShareGoods')" name="1">
                    <span class="fs-14 light-grey block mb-15">{{ $t("sharingSettings.productDetailsMainImage") }} {{ $t("sharingSettings.picture") }}</span>
                    <span class="fs-14 block mb-15">{ {{ $t("sharingSettings.skuTitleVariable") }} } Tospino Online shopping</span>
                    <span class="fs-14 light-grey block mb-15">{{ $t("sharingSettings.customizeTheContentBelowThePicture") }}</span>
                    <!-- :toolbar="[
                            'lineheight newdocument bold italic underline strikethrough alignleft aligncenter alignright alignjustify styleselect formatselect fontselect fontsizeselect cut copy paste outdent indent blockquote undo redo removeformat subscript superscript'
                        ]" -->
                    <!-- <Tinymce v-model:value="form.urlContent" :height="300" /> -->
                    <el-input v-model="form.urlContent" type="textarea" maxlength="500" show-word-limit></el-input>

                    <div class="tc mt-10">
                        <el-button type="primary" @click="handleSave">
                            {{ $t("seoSettings.save") }}
                        </el-button>
                    </div>
                </el-tab-pane>
                <!-- 复制商品内容分享 -->
                <el-tab-pane :label="$t('sharingSettings.copyProductContentToShare')" name="2">
                    <!-- <Tinymce v-model:value="form.textContent" :height="300" /> -->
                    <el-input v-model="form.textContent" type="textarea" maxlength="500" show-word-limit></el-input>

                    <div class="tc mt-10">
                        <el-button type="primary" @click="handleSave">
                            {{ $t("seoSettings.save") }}
                        </el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { getShareContent, editShareContent } from "@/api/base";
// import Tinymce from "@/components/Tinymce";

export default {
    name: "sharingSettings",
    // components: { Tinymce },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        // 分享内容表单数据对象
        let form = ref({
            urlContent: "",
            textContent: ""
        });
        // tab标签选择切换变量
        let activeName = ref("1");
        //获取列表
        const getListPage = () => {
            getShareContent()
                .then((res) => {
                    form.value = res.data;
                })
                .catch(() => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 保存与修改
        const handleSave = () => {
            proxy
                .$confirm(proxy.$t("platformInfo.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    editShareContent(form.value)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                        })
                        .catch(() => {});
                });
        };
        return {
            form,
            handleSave,
            activeName
        };
    }
};
</script>
