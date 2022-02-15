<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('platformInfo.platformInfoTips')" icon="warning" class="mb-20" />
    </div>
    <!-- 查看 -->
    <div class="p-25 bg-white round-4" v-if="saveEditVisible">
        <el-form v-model="form" label-width="auto" :key="saveEditVisible">
            <!-- 站点信息 -->
            <el-form-item :label="$t('platformInfo.siteInfo')" prop="siteInfo">
                <span>{{ $store.state.app.phonePrefix }}</span>
            </el-form-item>
            <!-- 平台名称 -->
            <el-form-item :label="$t('platformInfo.platformName')" prop="platformName">
                <span>{{ form.platformName }}</span>
            </el-form-item>
            <!-- 平台标题 -->
            <el-form-item :label="$t('platformInfo.platformTitle')" prop="platformTitle">
                <span>{{ form.platformTitle }}</span>
            </el-form-item>
            <!-- 平台描述 -->
            <el-form-item :label="$t('platformInfo.platformDesc')" prop="platformDesc">
                <span>{{ form.platformDesc }}</span>
            </el-form-item>
            <!-- 店铺客服热线 -->
            <el-form-item :label="$t('platformInfo.storeHotline')" prop="storeHotline">
                <span>{{ form.storeHotline }}</span>
            </el-form-item>
            <!-- 商城客服热线 -->
            <el-form-item :label="$t('platformInfo.shoppingHotline')" prop="shoppingHotline">
                <span>{{ form.shoppingHotline }}</span>
            </el-form-item>
            <!-- 客服邮箱 -->
            <el-form-item :label="$t('platformInfo.kefuEmail')" prop="kefuEmail">
                <span>{{ form.kefuEmail }}</span>
            </el-form-item>
            <!-- 运营后台网页图标 -->
            <el-form-item :label="$t('platformInfo.adminIcon')" prop="adminIcon">
                <BmImage :src="form.adminIcon" style="width:50px;height:50px" />
            </el-form-item>
            <!-- 卖家后台网页图标 -->
            <el-form-item :label="$t('platformInfo.salerIcon')" prop="salerIcon">
                <BmImage :src="form.salerIcon" style="width:50px;height:50px" />
            </el-form-item>
            <!-- PC商城网页图标 -->
            <el-form-item :label="$t('platformInfo.pcshoppingIcon')" prop="pcshoppingIcon">
                <BmImage :src="form.pcshoppingIcon" style="width:50px;height:50px" />
            </el-form-item>
        </el-form>
    </div>
    <div class="p-25 bg-white round-4" v-else>
        <el-form :model="form" ref="formRef" :rules="rules" label-width="auto" :key="saveEditVisible">
            <!-- 站点信息 -->
            <el-form-item :label="$t('platformInfo.siteInfo')" prop="siteInfo">
                <span>{{ $store.state.app.phonePrefix }}</span>
            </el-form-item>
            <!-- 平台名称 -->
            <el-form-item :label="$t('platformInfo.platformName')" prop="platformName">
                <el-input v-model="form.platformName" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <!-- 平台标题 -->
            <el-form-item :label="$t('platformInfo.platformTitle')" prop="platformTitle">
                <el-input v-model="form.platformTitle" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <!-- 平台描述 -->
            <el-form-item :label="$t('platformInfo.platformDesc')" prop="platformDesc">
                <el-input type="textarea" v-model="form.platformDesc" maxlength="255" show-word-limit></el-input>
            </el-form-item>
            <!-- 店铺客服热线 -->
            <el-form-item :label="$t('platformInfo.storeHotline')" prop="storeHotline">
                <el-input v-model="form.storeHotline" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <!-- 商城客服热线 -->
            <el-form-item :label="$t('platformInfo.shoppingHotline')" prop="shoppingHotline">
                <el-input v-model="form.shoppingHotline" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <!-- 客服邮箱 -->
            <el-form-item :label="$t('platformInfo.kefuEmail')" prop="kefuEmail">
                <el-input type="email" v-model="form.kefuEmail" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <!-- 修改 -->
            <!-- 运营后台网页图标 -->
            <el-form-item :label="$t('platformInfo.adminIcon')" prop="adminIcon">
                <BmUpload @change="onChangeUpload($event, 'adminIcon')" :fileUrl="form.adminIcon" :showFileList="false" />
                <span class="light-grey">{{ $t("platformInfo.imgUploadTip") }}
                      {{ $t("imgUploadTip", { type: "png", size: "150*150"}) }}
                </span>
            </el-form-item>
            <!-- 卖家后台网页图标 -->
            <el-form-item :label="$t('platformInfo.salerIcon')" prop="salerIcon">
                <BmUpload @change="onChangeUpload($event, 'salerIcon')" :fileUrl="form.salerIcon" :showFileList="false" />
                <span class="light-grey"> {{ $t("imgUploadTip", { type: "png", size: "150*150"}) }}</span>
            </el-form-item>
            <!-- PC商城网页图标 -->
            <el-form-item :label="$t('platformInfo.pcshoppingIcon')" prop="pcshoppingIcon">
                <BmUpload @change="onChangeUpload($event, 'pcshoppingIcon')" :fileUrl="form.pcshoppingIcon" :showFileList="false" />
                <span class="light-grey"> {{ $t("imgUploadTip", { type: "png", size: "150*150"}) }}</span>
            </el-form-item>
        </el-form>
    </div>
    <div class="button flex center mt-20">
        <el-button v-permission="'mallSettings_platformInfo_save'" class="mr-30" type="primary" v-if="saveEditVisible == false" @click="handleAddEdit">{{ $t("platformInfo.save") }}</el-button>
        <el-button v-permission="'mallSettings_platformInfo_edit'" v-if="saveEditVisible" @click="saveEditVisible = false">{{ $t("platformInfo.edit") }}</el-button>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { getPlatformInfo, editPlatformInfo } from "@/api/base";
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
            getPlatformInfo()
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
        //上传图片
        const onChangeUpload = (fileList, type) => {
            form.value[type] = fileList;
            console.log(form.value[type]);
        };
        // 修改与查看界面切换控制变量
        let saveEditVisible = ref(true);
        const rules = {
            platformName: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            platformTitle: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            platformDesc: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            storeHotline: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            shoppingHotline: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            kefuEmail: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            adminIcon: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            salerIcon: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            pcshoppingIcon: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const formRef = ref(null);
        // 保存与修改
        const handleAddEdit = () => {
            proxy
                .$confirm(proxy.$t("platformInfo.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    formRef.value.validate((valid) => {
                        if (valid) {
                            editPlatformInfo(form.value)
                                .then((res) => {
                                    saveEditVisible.value = true;
                                })
                                .catch(() => {});
                        } else {
                            return false;
                        }
                    });
                });
        };
        return {
            dict,
            initData,
            form,
            onChangeUpload,
            rules,
            saveEditVisible,
            handleAddEdit,
            formRef
        };
    }
};
</script>
