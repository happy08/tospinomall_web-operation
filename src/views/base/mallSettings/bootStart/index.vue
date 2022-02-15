<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <!-- <BmAlert
      :title="$t('seoSettings.operationTips')"
      icon="warning"
      class="mb-20"
    /> -->
    </div>
    <!-- 查看 -->
    <div class="p-25 bg-white round-4">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="custom-tabs-green" type="card">
            <!-- 安卓端 -->
            <el-tab-pane :label="$t('bootStart.Android')" :name="0">
                <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
                    <!-- 是否启用闪屏页 -->
                    <el-form-item :label="$t('bootStart.whetherToEnableTheBootPage')">
                        <el-radio-group v-model="form.openGuide">
                            <el-radio v-for="item in dict.yesNo" :key="item.value" :label="item.value">
                                {{ item.name }}
                            </el-radio>
                        </el-radio-group>
                        <span class="ml-30">{{ $t("bootStart.independentBootPageAfterEnabling") }}</span>
                    </el-form-item>
                    <!-- 闪屏图 -->
                    <el-form-item :label="$t('bootStart.guidePicture')" style="position:relative">
                        <BmUpload @change="onChangeUpload($event)" :fileList="form.guideImgs" :multiple="true" :limit="1" />
                        <!-- 提示区域 -->
                        <div style="position:absolute;left:-104px;top:30px">
                            <!-- 尺寸提示 -->
                            <span class="light-grey block">{{ $t("bootStart.size") }}:750 X 1334</span>
                            <!-- 图片数量实时统计 -->
                            <span class="block">+{{ $t("bootStart.uploadImage") }}({{ pictureNum }}/1)</span>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button type="primary" @click="handleSave()">
                        {{ $t("seoSettings.save") }}
                    </el-button>
                </div>
            </el-tab-pane>
            <!-- ios端 -->
            <el-tab-pane :label="$t('bootStart.IOS')" :name="1">
                <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
                    <!-- 是否启用闪屏页 -->
                    <el-form-item :label="$t('bootStart.whetherToEnableTheBootPage')">
                        <el-radio-group v-model="form.openGuide">
                            <el-radio v-for="item in dict.yesNo" :key="item.value" :label="item.value">
                                {{ item.name }}
                            </el-radio>
                        </el-radio-group>
                        <span class="ml-30">{{ $t("bootStart.independentBootPageAfterEnabling") }}</span>
                    </el-form-item>
                    <!-- 闪屏图 -->
                    <el-form-item :label="$t('bootStart.guidePicture')" style="position:relative">
                        <BmUpload @change="onChangeUpload($event)" :fileList="form.guideImgs" :multiple="false" :limit="1" />
                        <!-- 提示区域 -->
                        <div style="position:absolute;left:-104px;top:30px">
                            <!-- 尺寸提示 -->
                            <span class="light-grey block">{{ $t("bootStart.size") }}:750 X 1334</span>
                            <!-- 图片数量实时统计 -->
                            <span class="block">+{{ $t("bootStart.uploadImage") }}({{ pictureNum }}/1)</span>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button v-permission="'mallSettings_bootStart_save'" type="primary" @click="handleSave()">
                        {{ $t("seoSettings.save") }}
                    </el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { getAllSeoInfo, editCategoriesSeoInfo, editGoodsDetailSeoInfo, editGoodsSearchSeoInfo, editIndexSeoInfo, bootStart, editBootStart } from "@/api/base";
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
        // tab选择控制变量
        let activeName = ref(0);
        // 平台信息表单数据对象
        let form = ref({});
        // 加一个图片数量统计属性
        let pictureNum = ref(0);
        //获取列表
        const getListPage = () => {
            bootStart({ type: activeName.value })
                .then((res) => {
                    form.value = res.data;
                    // 将服务器返回的图片数据转为数组(数组里面为对象)格式
                    // 首先判断服务器返回的图片数据值是否为空
                    if (!form.value.guideImgs) {
                        form.value.guideImgs = [];
                    } else {
                        form.value.guideImgs = form.value.guideImgs.split(",");
                        form.value.guideImgs = form.value.guideImgs.map((item) => {
                            return {
                                url: item
                            };
                        });
                    }
                    pictureNum.value = form.value.guideImgs.length;
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
        // 上传图片
        const onChangeUpload = (fileList) => {
            form.value.guideImgs = fileList;
            pictureNum.value = form.value.guideImgs.length;
        };
        // 保存与修改
        const handleSave = (obj, num) => {
            proxy
                .$confirm(proxy.$t("seoSettings.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    delete form.value.updateTime;
                    // type属性区分安卓与ios，0安卓 1ios
                    form.value.type = activeName.value;
                    // 将form.guideImgs转为字符串
                    let picUrl = [];
                    for (let i in form.value.guideImgs) {
                        picUrl[i] = form.value.guideImgs[i].url;
                    }
                    form.value.guideImgs = picUrl.join(",");
                    editBootStart(form.value)
                        .then(() => {
                            initData();
                        })
                        .catch(() => {});
                });
            //   })
        };
        const handleClick = () => {
            // 清空之前tab界面的数据
            formRef.value.resetFields();
            initData();
        };
        return {
            dict,
            initData,
            form,
            rules,
            handleSave,
            formRef,
            activeName,
            onChangeUpload,
            handleClick,
            pictureNum
        };
    }
};
</script>
<style lang="scss" scoped>
::v-deep(.el-upload--picture-card) {
    width: 150px;
    height: 237px;
    line-height: 237px;
}
::v-deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 150px;
    height: 237px;
}
</style>
