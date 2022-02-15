<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('searchFound.searchFoundTips')" icon="warning" class="mb-20" />
    </div>
    <!-- 热门搜索 -->
    <div class="p-25 bg-white round-4">
        <div>
            <span class="fw fs-16">
                {{ $t("searchFound.popularSearches") }}
            </span>
            <div class="p-25 bg-grey round-4 mtb-20">
                <div>
                    <span class="fs-16" style="clolor:#333333">
                        {{ $t("searchFound.popularDefaultSearchTerms") }}
                    </span>
                </div>
                <div class=" tc mtb-20 fw round-4">
                    <el-input type="textarea" v-model="form.value"></el-input>
                </div>
                <div>
                    <span>{{ $t("searchFound.popularSearchesTips") }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="button flex center mt-20">
        <el-button v-permission="'operationalSettings_searchFound_save'" type="primary" @click="handleSave()">{{ $t("commodityEvaluationSettings.saveEdit") }}</el-button>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { getLanguageByType, editLanguageByid } from "@/api/base";
import { deepClone } from "@/utils/";

export default {
    name: "baseInfoArea",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        // 平台信息表单数据对象
        let form = ref({});
        //获取列表
        const getListPage = () => {
            getLanguageByType()
                .then((res) => {
                    form.value = res.data[0];
                })
                .catch(() => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // const rules = {
        //     evaluateTime: {
        //         required: true,
        //         message: proxy.$t('required'),
        //         trigger: 'blur',
        //     },
        // }
        // 保存与修改
        const handleSave = () => {
            proxy
                .$confirm(proxy.$t("platformInfo.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    editLanguageByid(form.value)
                        .then((res) => {})
                        .catch(() => {});
                });
        };
        return {
            dict,
            initData,
            form,
            handleSave
        };
    }
};
</script>
