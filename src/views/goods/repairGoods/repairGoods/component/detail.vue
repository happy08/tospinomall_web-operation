<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" :width="1000" @close="cancel" top="10vh">
        <div class="p-20 bg-white round-4">
            <div class="flex">
                <BmImage :src="form.goodsPicture" style="width:60px" />
                <div class="flex1 ml-20">
                    <div class="fw fs-14">{{ form.goodTitle }}</div>
                    <div>TSIN:{{ form.tsin }}</div>
                </div>
            </div>
        </div>

        <div class="p-20 bg-white round-4">
            <!-- 选择您要修复的内容 -->
            <BmBaseTitle :title="$t('repairGoods.choiceRepair')"> </BmBaseTitle>
            <el-form :model="form" ref="formRef" label-width="auto">
                <el-form-item prop="type" :label="$t('repairGoods.type')">
                    <el-checkbox-group v-model="form.type" disabled>
                        <el-checkbox :label="1">ksu{{ $t("repairGoods.code") }}</el-checkbox>
                        <el-checkbox :label="2">{{ $t("repairGoods.attributeName") }}</el-checkbox>
                        <el-checkbox :label="3">{{ $t("repairGoods.attributeValue") }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <!-- ksu编码 -->
                <template v-if="form.type.includes(1)">
                    <div class="mb-5 fw green">SKU{{ $t("repairGoods.code") }}</div>
                    <BmTable :data="form.skus" class="mb-20">
                        <BmTableColumn :label="$t('image')" width="100px">
                            <template #default="scope">
                                <BmImage :src="scope.row.picture" style="width:60px;height:60px" />
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="fnsku" label="FNSKU"></BmTableColumn>
                        <BmTableColumn prop="repairFnSku" :label="`FNSKU(${$t('repairGoods.afterModification')})`">
                            <template #default="scope">
                                {{ scope.row.repairFnSku }}
                            </template>
                        </BmTableColumn>
                    </BmTable>
                </template>

                <!-- 属性名称 -->
                <template v-if="form.type.includes(2)">
                    <div class="mb-5 fw green">{{ $t("repairGoods.attributeName") }}</div>
                    <BmTable :data="form.specs" class="mb-20">
                        <BmTableColumn prop="cnSpecName" :label="$t('repairGoods.attributeName')"></BmTableColumn>
                        <BmTableColumn prop="repairCnSpecName" :label="`${$t('repairGoods.attributeName')}(${$t('repairGoods.afterModification')})`">
                            <template #default="scope">
                                {{ scope.row.repairCnSpecName }}
                            </template>
                        </BmTableColumn>
                    </BmTable>
                </template>

                <!-- 属性值名称 -->
                <template v-if="form.type.includes(3)">
                    <div class="mb-5 fw green">{{ $t("repairGoods.attributeValue") }}</div>
                    <BmTable :data="form.specValues" class="mb-20">
                        <BmTableColumn prop="cnName" :label="$t('repairGoods.attributeValue')"></BmTableColumn>
                        <BmTableColumn prop="repairCnName" :label="`${$t('repairGoods.attributeValue')}(${$t('repairGoods.afterModification')})`">
                            <template #default="scope">
                                {{ scope.row.repairCnName }}
                            </template>
                        </BmTableColumn>
                    </BmTable>
                </template>

                <!-- 提交证据 -->
                <div v-if="form.type.length > 0">
                    <BmBaseTitle :title="$t('repairGoods.submitEvidence')"></BmBaseTitle>
                    <div v-if="form.pictures">
                        <BmImage v-for="(item, index) in form.pictures.split(',')" :key="index" :src="item" :preview-src-list="form.pictures.split(',')" class="m-5" style="width:60px;height:60px" />
                    </div>
                    <el-form-item v-if="form.remark" :label="$t('remark')">
                        {{ form.remark }}
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="cancel">{{ $t("cancel") }}</el-button>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, watch } from "vue";

export default {
    name: "repairGoodsDetail",
    components: {},
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = { ...nVal, id: nVal.id };
            }
        );
        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            form,
            cancel
        };
    }
};
</script>
