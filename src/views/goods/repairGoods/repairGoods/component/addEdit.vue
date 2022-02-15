<!-- 商品信息修复 -->
<template v-if="visible">
    <div class="top-search-form">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <!-- 您要修复的商品 -->
        <BmBaseTitle :title="$t('repairGoods.youRepairGoods')"> </BmBaseTitle>
        <!-- 搜索 -->
        <el-form :model="searchFrom" ref="searchFromRef" label-width="auto">
            <el-form-item :label="$t('repairGoods.enterTSIN')" prop="tsin" :rules="rulesCommon.required" style="width:50%">
                <template #label>
                    <span class="fs-14 orange lh-12">{{ $t("repairGoods.enterTSIN") }}</span>
                </template>
                <el-input v-model="searchFrom.tsin" oninput="value=value.replace(/[^\w\.\ \/]/ig,'')" :placeholder="`${$t('pleaseEnter')}TSIN`" clearable>
                    <template #append><el-button @click="handleSearch" icon="el-icon-search"></el-button></template>
                </el-input>
            </el-form-item>
        </el-form>

        <div v-if="form.skus || form.spec || form.specValues" class="flex">
            <BmImage :src="form.goodsPicture" style="width:60px" />
            <div class="flex1 ml-20">
                <div class="fw fs-14">{{ form.goodTitle }}</div>
                <div>TSIN:{{ form.tsin }}</div>
            </div>
        </div>
    </div>

    <div v-if="form.skus || form.spec || form.specValues" class="p-25 mt-15 bg-white round-4">
        <!-- 选择您要修复的内容 -->
        <BmBaseTitle :title="$t('repairGoods.choiceRepair')"> </BmBaseTitle>
        <el-form :model="form" ref="formRef" label-width="auto">
            <el-form-item prop="type" :label="$t('repairGoods.type')">
                <el-checkbox-group v-model="form.type">
                    <el-checkbox :label="1">SKU{{ $t("repairGoods.code") }}</el-checkbox>
                    <el-checkbox :label="2">{{ $t("repairGoods.attributeName") }}</el-checkbox>
                    <el-checkbox :label="3">{{ $t("repairGoods.attributeValue") }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <!-- SKU编码 -->
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
                            <span v-if="!scope.row.isUpdate"> {{ scope.row.repairFnSku }}</span>
                            <el-input
                                v-else
                                v-model="scope.row.repairFnSku"
                                oninput="value=value.replace(/[^\w\.\ \/]/ig,'')"
                                :placeholder="`${$t('pleaseEnter')}(${$t('required')})`"
                                clearable
                            ></el-input>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                        <template #default="scope">
                            <el-button v-if="!scope.row.isUpdate" @click="handleEdit(scope.row)" type="text">
                                {{ $t("table.modify") }}
                            </el-button>
                            <el-button v-else @click="handleEdit(scope.row)" type="text" class="red">
                                {{ $t("cancel") }}
                            </el-button>
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
                            <span v-if="!scope.row.isUpdate"> {{ scope.row.repairCnSpecName }}</span>
                            <el-input
                                v-else
                                v-model="scope.row.repairCnSpecName"
                                oninput="value=value.replace(/[^\w\.\ \/]/ig,'')"
                                :placeholder="`${$t('pleaseEnter')}(${$t('required')})`"
                                clearable
                            ></el-input>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                        <template #default="scope">
                            <el-button v-if="!scope.row.isUpdate" @click="handleEdit(scope.row)" type="text">
                                {{ $t("table.modify") }}
                            </el-button>
                            <el-button v-else @click="handleEdit(scope.row)" type="text" class="red">
                                {{ $t("cancel") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </template>

            <!-- 属性值名称 -->
            <template v-if="form.type.includes(3)">
                <div class="mb-5 fw green">{{ $t("repairGoods.attributeValue") }}</div>
                <div v-for="(item, index) in form.specValues" :key="index">
                    <BmTable :data="item.specValuesItem" class="mb-20">
                        <BmTableColumn prop="cnName" :label="$t('repairGoods.attributeValue')">
                            <template #header> ({{ item.cnSpecName }}) {{ $t("repairGoods.attributeValue") }} </template>
                        </BmTableColumn>
                        <BmTableColumn prop="repairCnName" :label="`${$t('repairGoods.attributeValue')}(${$t('repairGoods.afterModification')})`">
                            <template #default="scope">
                                <span v-if="!scope.row.isUpdate"> {{ scope.row.repairCnName }}</span>
                                <el-input
                                    v-else
                                    v-model="scope.row.repairCnName"
                                    oninput="value=value.replace(/[^\w\.\ \/]/ig,'')"
                                    :placeholder="`${$t('pleaseEnter')}(${$t('required')})`"
                                    clearable
                                ></el-input>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn :label="$t('table.operation')" width="100" align="center">
                            <template #default="scope">
                                <el-button v-if="!scope.row.isUpdate" @click="handleEdit(scope.row)" type="text">
                                    {{ $t("table.modify") }}
                                </el-button>
                                <el-button v-else @click="handleEdit(scope.row)" type="text" class="red">
                                    {{ $t("cancel") }}
                                </el-button>
                            </template>
                        </BmTableColumn>
                    </BmTable>
                </div>
            </template>

            <!-- 提交证据 -->
            <div v-if="form.type.length > 0">
                <BmBaseTitle :title="$t('repairGoods.submitEvidence')">
                    <template #subtitle>
                        {{ $t("repairGoods.updateTips") }}
                    </template>
                </BmBaseTitle>
                <div class="flex m-20">
                    <BmUpload @change="form.pictures = $event" :fileList="form.pictures" :multiple="true" :limitSize="5" :limit="5" />
                    <div class="flex1 ml-20 mt-5">
                        {{ $t("uploadTip", { type: "jpg,png", limit: 5 }) }}
                    </div>
                </div>
                <el-form-item :label="$t('remark')" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :placeholder="$t('remark')" rows="5" :maxlength="500" show-word-limit></el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>

    <div class="flex center p-25 bg-white">
        <el-button @click="cancel">{{ $t("cancel") }}</el-button>
        <el-button v-if="form.type.length > 0" type="primary" @click="confirm">
            {{ $t("repairGoods.saveSubmit") }}
        </el-button>
    </div>
</template>

<script>
import { ref, getCurrentInstance, toRaw, reactive } from "vue";
import { goodsRepairFindTsin, goodsRepairSubmit } from "@/api/goods";
import { deepClone } from "@/utils/";

export default {
    name: "repairGoodsAddEdit",
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //搜索
        let searchFrom = reactive({
            tsin: ""
        });

        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" }
        });

        // 修复的内容
        let form = ref({
            type: [], //修复类型， 1SKU编码, 2规格/属性名称, 3规格/属性值名称
            pictures: [], //图片
            remark: "" //备注
        });

        //商品信息
        let searchFromRef = ref(null);
        const handleSearch = () => {
            searchFromRef.value.validate((valid) => {
                if (valid) {
                    goodsRepairFindTsin(searchFrom)
                        .then((res) => {
                            if (res.data) {
                                let specValues = [];
                                res.data.specs.forEach((sItem) => {
                                    // 属性值分组
                                    let values = [];
                                    res.data.specValues.forEach((svItem) => {
                                        if (sItem.id === svItem.specId) {
                                            values.push(svItem);
                                        }
                                    });
                                    specValues.push({ cnSpecName: sItem.cnSpecName, specValuesItem: values });
                                });
                                res.data.specValues = specValues;

                                form.value = {
                                    ...res.data,
                                    type: form.value.type,
                                    pictures: [] //图片
                                };
                            } else {
                                proxy.$message.error(proxy.$t("repairGoods.TSINErroe"));
                            }
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };

        //修改属性
        const handleEdit = (row) => {
            row.isUpdate = !row.isUpdate;
        };

        //  提交
        const confirm = () => {
            const params = deepClone(toRaw(form.value));
            // 未勾选sku编码 清空修改后的值
            if (params.type.indexOf(1) === -1) {
                params.skus.forEach((item) => {
                    item.repairFnSku = "";
                });
            }
            // 未勾选属性 清空修改后的值
            if (params.type.indexOf(2) === -1) {
                params.specs.forEach((item) => {
                    item.repairCnSpecName = "";
                });
            }
            // 未勾选属性值 清空修改后的值
            if (params.type.indexOf(3) === -1) {
                params.specValues.forEach((item) => {
                    item.specValuesItem.forEach((sitem) => {
                        sitem.repairCnName = "";
                    });
                });
            }

            //规格/属性值名称 平铺
            if (params.specValues && params.specValues.length) {
                params.specValues = params.specValues.map((item) => item.specValuesItem).flat(Infinity);
            }

            //图片
            const pictures = params.pictures;
            if (pictures && Array.isArray(pictures)) {
                params.pictures = pictures.map((item) => item.url).join(",");
            }

            goodsRepairSubmit({ goodsRepairVO: params, repairUpdateTypeList: params.type })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    emit("reloadData");
                    emit("update:visible", false);
                })
                .catch((err) => {});
        };

        // 取消
        const cancel = () => {
            emit("update:visible", false);
        };
        return {
            searchFrom,
            rulesCommon,
            searchFromRef,
            handleSearch,
            handleEdit,
            form,

            cancel,
            confirm
        };
    }
};
</script>
<style lang="scss" scoped></style>
