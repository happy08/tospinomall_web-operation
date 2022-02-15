<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" @close="cancel" :width="700">
        <div class="plr-50 mlr-50 mt-20 mb-50">
            <el-steps :active="1" class="custom-step mlr-50" finish-status="success">
                <el-step>
                    <template #title>{{ $t("status.create") }} / {{ $t("status.update") }}</template>
                </el-step>
                <el-step :title="form.examineStatusName"></el-step>
            </el-steps>
        </div>
        <BmAlert :title="$t('brand.detailAlert')" icon="warning" class="mb-20" />

        <el-form :model="form" label-width="auto">
            <!-- 注册类型 -->
            <el-form-item :label="$t('brandTable.type')" prop="type">
                <el-radio-group v-model="form.type" disabled>
                    <el-radio v-for="item in dict.brandType" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 商标注册人类型 -->
            <el-form-item :label="$t('brand.registerType')" prop="registerType">
                <el-radio-group v-model="form.registerType" disabled>
                    <el-radio v-for="item in dict.brandRegistrant" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 品牌名称 -->
            <el-form-item :label="$t('brandTable.brandName')">
                {{ form.brandName }}
            </el-form-item>
            <el-form-item label="LOGO">
                <BmImage :src="form.logo" :preview-src-list="[form.logo]" style="width: 100px; height: 100px" />
            </el-form-item>
            <!-- 商标注册号 -->
            <el-form-item :label="$t('brandTable.registerNumber')">
                {{ form.registerNumber }}
            </el-form-item>
            <!-- 商标注册证明 -->
            <el-form-item :label="$t('brand.registerProve')">
                <BmImage v-for="(item, index) in form.registerProveList" :src="item" :key="index" :preview-src-list="form.registerProveList" style="width: 100px; height: 100px" />
            </el-form-item>
            <!-- 商标注册有效期 -->
            <el-form-item :label="$t('brand.registerEndTime')">
                {{ form.registerEndTime }}
            </el-form-item>
            <!-- 商标授权证明 -->
            <el-form-item :label="$t('brand.authProve')">
                <BmImage v-for="(item, index) in form.authProveList" :src="item" :key="index" :preview-src-list="form.authProveList" style="width: 100px; height: 100px" />
            </el-form-item>
            <!-- 商品授权有效期 -->
            <el-form-item :label="$t('brand.authEndTime')">
                {{ form.authEndTime }}
            </el-form-item>
            <!-- 商标持有人身份证明 -->
            <el-form-item :label="$t('brand.identity')">
                <BmImage v-for="(item, index) in form.holderIdentityList" :src="item" :key="index" :preview-src-list="form.holderIdentityList" style="width: 100px; height: 100px" />
            </el-form-item>
            <!-- 商家备注 -->
            <el-form-item :label="$t('brand.sellerRemarks')">
                {{ form.remarks }}
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="cancel">{{ $t("cancel") }}</el-button>
                <el-button v-if="form.examineStatus == 1" type="primary" @click="auditVisible = true">
                    {{ $t("status.audit") }}
                </el-button>
            </div>
        </template>
    </BmDialog>

    <!-- 审核 -->
    <Audit v-model:visible="auditVisible" :rows="[form]" @reloadData="reloadData" />
</template>

<script>
import { ref, inject, watch } from "vue";
import { ElSteps, ElStep } from "element-plus";
import Audit from "./audit";
import { brandInfo } from "@/api/goods";

export default {
    name: "BrandDetail",
    components: { Audit, ElSteps, ElStep },
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        const dict = inject("dict"); //数据字典

        let form = ref({});
        watch(
            () => props.row,
            (nVal, oVal) => {
                if (nVal.id !== oVal.id) {
                    getBrandInfo();
                }
            }
        );

        //获取详情
        const getBrandInfo = () => {
            brandInfo(props.row.id)
                .then((res) => {
                    form.value = res.data;
                    //审核状态（1待审核 2已通过 3未通过 4屏蔽中 5待更新）
                    for (let i in dict.value.auditStatus) {
                        if (dict.value.auditStatus[i].value === res.data.examineStatus) {
                            form.value.examineStatusName = dict.value.auditStatus[i].name;
                            break;
                        }
                    }
                })
                .catch((err) => {});
        };

        //审核
        let auditVisible = ref(false);
        const confirm = () => {
            auditVisible.value = true;
        };

        const reloadData = () => {
            emit("reloadData");
            emit("update:visible", false);
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            dict,
            form,
            auditVisible,
            reloadData,
            confirm,
            cancel
        };
    }
};
</script>
