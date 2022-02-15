<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('commodityEvaluationSettings.commodityEvaluationSettingsTips')" icon="warning" class="mb-20" />
    </div>
    <div class="p-25 bg-white round-4">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="auto">
            <!-- 订单商品可评价节点 -->
            <el-form-item :label="$t('commodityEvaluationSettings.orderItemCanBeEvaluatedNode')">
                <span>{{ $t("commodityEvaluationSettings.evaluationSet") }}</span>
            </el-form-item>
            <!-- 系统默认商品评价时间 -->
            <el-form-item :label="$t('commodityEvaluationSettings.sysDefcommentsDay')" prop="evaluateTime">
                <el-input v-model="form.evaluateTime" type="number" max="100" min="1" @blur="timeCheck">
                    <template #append>
                        {{ $t("commodityEvaluationSettings.day") }}
                    </template>
                </el-input>
            </el-form-item>
            <!-- 系统默认商品评价时间提示-->
            <el-form-item>
                <span>{{ $t("commodityEvaluationSettings.sysDefcommentsDayTips") }}</span>
            </el-form-item>
            <!-- 商品评价标签 -->
            <el-form-item :label="$t('commodityEvaluationSettings.productCommentsLabels')">
                <span class="block">
                    {{ $t("commodityEvaluationSettings.productCommentsLabelsTips") }}
                    <div style="600px" v-for="(item, index) in form.evaluateLabelList" :key="index">
                        <el-input class="mb-10 mr-30" style="width:400px" v-model="form.evaluateLabelList[index]" maxlength="15" show-word-limit> </el-input>
                        <el-button v-permission="'operationalSettings_commodityEvaluationSettings_del'" type="text" @click="handleDelLabel(index)">{{ $t("status.delete") }}</el-button>
                    </div>
                </span>
                <el-button v-permission="'operationalSettings_commodityEvaluationSettings_add'" @click="handleAdd">{{ $t("commodityEvaluationSettings.add") }}</el-button>
            </el-form-item>
            <!-- 系统默认商品评价语 -->
            <el-form-item v-if="form.sysDefcommentsWords" :label="$t('commodityEvaluationSettings.sysDefcommentsWords')">
                <span class="block">
                    {{ $t("commodityEvaluationSettings.sysDefcommentsWordsTips") }}
                    <!-- 一星 -->
                    <div class="flex">
                        <span style="width:60px">{{ $t("commodityEvaluationSettings.oneStar") }}</span>
                        <el-input maxlength="30" show-word-limit v-model="form.ontStarsContent"></el-input>
                    </div>
                    <!-- 二星 -->
                    <div class="flex">
                        <span style="width:60px">{{ $t("commodityEvaluationSettings.twoStar") }}</span>
                        <el-input maxlength="30" show-word-limit v-model="form.twoStarsContent"></el-input>
                    </div>
                    <!-- 三星 -->
                    <div class="flex">
                        <span style="width:60px">{{ $t("commodityEvaluationSettings.threeStar") }}</span>
                        <el-input maxlength="30" show-word-limit v-model="form.threeStarsContent"></el-input>
                    </div>
                    <!-- 四星 -->
                    <div class="flex">
                        <span style="width:60px">{{ $t("commodityEvaluationSettings.fourStar") }}</span>
                        <el-input maxlength="30" show-word-limit v-model="form.fourStarsContent"></el-input>
                    </div>
                    <!-- 五星 -->
                    <div class="flex">
                        <span style="width:60px">{{ $t("commodityEvaluationSettings.fiveStar") }}</span>
                        <el-input maxlength="30" show-word-limit v-model="form.fiveStarsContent"></el-input>
                    </div>
                </span>
            </el-form-item>
            <!-- 商品审核设置 -->
            <el-form-item :label="$t('commodityEvaluationSettings.productCommentsCheckset')">
                <!-- 无图 -->
                <div class="flex">
                    <span style="width:5%">{{ $t("commodityEvaluationSettings.noPicture") }}</span>
                    <div style="width:10%">
                        <el-select v-model="form.noPicManualAudit">
                            <el-option v-for="item in starSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <span>{{ $t("commodityEvaluationSettings.manualReviewConditions") }}</span>
                </div>
                <!-- 有图 -->
                <div class="flex">
                    <span style="width:5%">{{ $t("commodityEvaluationSettings.havePicture") }}</span>
                    <div style="width:10%">
                        <el-select v-model="form.hasPicManualAudit">
                            <el-option v-for="item in starSelectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <span style="width:85%">{{ $t("commodityEvaluationSettings.manualReviewConditions") }}</span>
                </div>
            </el-form-item>
        </el-form>
    </div>
    <div class="button flex center mt-20">
        <el-button v-permission="'operationalSettings_commodityEvaluationSettings_save'" type="primary" @click="handleSave">{{ $t("commodityEvaluationSettings.saveEdit") }}</el-button>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { goodsSettingsInfo, editGoodsSettingsInfo } from "@/api/base";
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
            goodsSettingsInfo()
                .then((res) => {
                    form.value = res.data || {};
                    // 将商品评价标签转为数组，用于循环
                    form.value.evaluateLabel = (form.value.evaluateLabel && form.value.evaluateLabel.split(",")) || [];
                })
                .catch(() => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        const rules = {
            evaluateTime: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        // 添加商品评价标签dom节点
        const handleAdd = () => {
            // 最多只能添加6个评价标签
            if (form.value.evaluateLabelList.length < 6) {
                form.value.evaluateLabelList.push("");
            } else {
                proxy.$message.warning(proxy.$t("commodityEvaluationSettings.productCommentsLabelsTips"));
            }
        };
        // 星级选择select数据
        const starSelectList = computed(() => [
            {
                label: proxy.$t("commodityEvaluationSettings.oneStar"),
                value: "1"
            },
            {
                label: proxy.$t("commodityEvaluationSettings.twoStar"),
                value: "2"
            },
            {
                label: proxy.$t("commodityEvaluationSettings.threeStar"),
                value: "3"
            },
            {
                label: proxy.$t("commodityEvaluationSettings.fourStar"),
                value: "4"
            },
            {
                label: proxy.$t("commodityEvaluationSettings.fiveStar"),
                value: "5"
            }
        ]);
        // 评价标签删除按钮的监听事件
        const handleDelLabel = (index) => {
            form.value.evaluateLabelList.splice(index, 1);
        };
        // 系统默认商品评价时间数据校验
        const timeCheck = () => {
            if (form.value.evaluateTime >= 1 && form.value.evaluateTime <= 100 && form.value.evaluateTime.toString().indexOf(".") == -1) {
            } else {
                form.value.evaluateTime = "";
                proxy.$message.warning(proxy.$t("commodityEvaluationSettings.timeSaveTip"));
            }
        };
        const formRef = ref(null);
        // 保存与修改
        const handleSave = () => {
            proxy
                .$confirm(proxy.$t("platformInfo.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    // 将商品评价标签转为字符串，用于请求
                    form.value.evaluateLabel = (form.value.evaluateLabel && form.value.evaluateLabel.join(",")) || "";
                    formRef.value.validate((valid) => {
                        if (valid) {
                            editGoodsSettingsInfo(form.value)
                                .then((res) => {
                                    proxy.$message.success(res.msg);
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
            rules,
            handleSave,
            formRef,
            handleAdd,
            starSelectList,
            handleDelLabel,
            timeCheck
        };
    }
};
</script>
