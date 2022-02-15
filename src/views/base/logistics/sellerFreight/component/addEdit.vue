<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :before-close="beforeClose" width="80vw">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 模板名称 -->
            <el-form-item :label="$t('sellerFreightTable.tempName')" prop="tempName">
                <el-input v-model="form.tempName" type="text"></el-input>
            </el-form-item>
            <!-- 贸易形式 -->
            <el-form-item :label="$t('sellerFreightTable.tradeType')" prop="tradeType">
                <el-radio-group v-model="form.tradeType" @change="sendTypeReset">
                    <el-radio v-for="(item, index) in dict.tradeTypeList" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 商品配送方式 -->
            <el-form-item :label="$t('sellerFreightTable.freightType')" prop="freightType">
                <el-radio-group v-model="form.freightType" @change="sendTypeReset">
                    <el-radio v-for="(item, index) in dict.freightTypeList" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 运输方式 -->
            <el-form-item :label="$t('sellerFreightTable.sendType')" prop="sendType">
                <el-radio-group v-model="form.sendType">
                    <!-- <el-radio
                        v-for="(item, index) in dict.sendTypeList"
                        :key="index"
                        :label="item.value"
                        >{{ item.name }}</el-radio
                    > -->
                    <!-- 空运 -->
                    <el-radio :label="1" v-show="form.tradeType != 1 && form.freightType != 2">{{ dict.sendTypeList[0].name }}</el-radio>
                    <!-- 海运 -->
                    <el-radio :label="2" v-show="form.tradeType != 1 && form.freightType != 2">{{ dict.sendTypeList[1].name }}</el-radio>
                    <!-- 陆运 -->
                    <el-radio :label="3" v-show="(form.tradeType != 2 && form.freightType != 1) || form.tradeType == form.freightType">{{ dict.sendTypeList[2].name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 计费方式 -->
            <el-form-item :label="$t('sellerFreight.billing')">
                <!-- 材积 -->
                <el-checkbox v-model="volumeChecked">{{ $t("sellerFreight.volume") }}</el-checkbox>
                =
                <span
                    >{{ $t("sellerFreight.long") }}(cm) X {{ $t("sellerFreight.width") }}(cm) X {{ $t("sellerFreight.height") }}(cm) /
                    <span>
                        <el-input v-model="volume" style="width:80px" type="number" min="0"></el-input>
                    </span>
                </span>
                <!-- 计费资料table -->
                <div>
                    <!-- 添加 -->
                    <el-button type="primary" @click="handleAddEdit('add')">+{{ $t("status.add") }}</el-button>
                </div>
                <BmTable ref="multipleTable" :data="form.freightTempPayAreaDTOS" :span-method="objectSpanMethod">
                    <!-- 站点国家 -->
                    <BmTableColumn prop="countryCode" :label="$t('sellerShippingFeeTable.countryCode')">
                        <template #default="scoped">
                            <span v-if="updateType == 'add'"> {{ $store.state.app.currency.site }}</span>
                            <span v-else>{{ scoped.row.countryName }}</span>
                        </template>
                    </BmTableColumn>
                    <!-- 最小重量 -->
                    <BmTableColumn prop="weightMin" :label="$t('sellerShippingFeeTable.weightMin')">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.weightMin" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 重量 -->
                    <BmTableColumn prop="weight" :label="$t('sellerShippingFeeTable.weight') + '(' + 'kg' + ')'">
                        &lt;
                        <span class="mrl-20">{{ $t("sellerFreight.weight") }}</span>
                        &le;
                    </BmTableColumn>
                    <!-- 最大重量 -->
                    <BmTableColumn prop="weightMax" :label="$t('sellerShippingFeeTable.weightMax')">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.weightMax" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 首重 -->
                    <BmTableColumn prop="firstWeight" :label="$t('sellerShippingFeeTable.firstWeight') + '(' + 'kg' + ')'">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.firstWeight" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 首重运费 -->
                    <BmTableColumn prop="firstWeightFreight" :label="$t('sellerShippingFeeTable.firstWeightFreight') + '(' + $store.state.app.currencySymbol + ')'">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.firstWeightFreight" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 续单位重量 -->
                    <BmTableColumn prop="addUnitWeight" :label="$t('sellerShippingFeeTable.addUnitWeight') + '(' + 'kg' + ')'">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.addUnitWeight" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 续重运费 -->
                    <BmTableColumn prop="addWeightFreight" :label="$t('sellerShippingFeeTable.addWeightFreight') + '(' + $store.state.app.currencySymbol + ')'">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.addWeightFreight" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 包材费用 -->
                    <BmTableColumn prop="materialsCost" :label="$t('sellerShippingFeeTable.materialsCost') + '(' + $store.state.app.currencySymbol + ')'">
                        <template #default="scoped">
                            <el-input v-model="scoped.row.materialsCost" type="number" min="0"></el-input>
                        </template>
                    </BmTableColumn>
                    <!-- 预计配送时间 -->
                    <BmTableColumn prop="deliveryTimeValue" :label="$t('sellerShippingFeeTable.deliveryTimeValue') + '(' + $t('sellerFreight.day') + ')'">
                        <template #default="scoped">
                            <el-select v-model="scoped.row.deliveryTimeValue">
                                <el-option v-for="item in dayData" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </BmTableColumn>
                    <!-- 操作 -->
                    <BmTableColumn :label="$t('table.operation')">
                        <template #default="scope">
                            <!-- 删除 -->
                            <el-button type="text" @click="handleAddEdit('del', scope.row.id)">{{ $t("status.delete") }}</el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </el-form-item>

            <!-- 状态 -->
            <el-form-item :label="$t('sellerFreightTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remark">
                <el-input v-model="form.remark" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { addSellerFreightTemplate, updateFreightTemplateList, logisticsSellerFindById, getDayByType } from "@/api/base";

export default {
    name: "sellerFreightTableAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        //标题
        let updateType = computed(() => (JSON.stringify(props.row) == "{}" ? "add" : "edit"));

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                console.log("store", proxy.$store.state.app.currency);

                if (updateType.value === "add") {
                    form.value = {};
                    form.value.freightTempPayAreaDTOS = [
                        {
                            id: 0,
                            tempId: null,
                            countryCode: proxy.$store.state.app.currency.countryAreaCode,
                            // countryCodeName: proxy.$store.state.app.currency.site, // 暂时写死，后面改
                            volume: null,
                            weightMin: null,
                            weightMax: null,
                            firstWeight: null,
                            firstWeightFreight: null,
                            addUnitWeight: null,
                            addWeightFreight: null,
                            materialsCost: null,
                            deliveryTimeValue: null
                        }
                    ];
                } else {
                    const params = {
                        id: nVal.id,
                        freightType: nVal.freightType
                    };
                    logisticsSellerFindById(params)
                        .then((res) => {
                            form.value = { ...res.data };
                            form.value.freightTempPayAreaDTOS = form.value.payAreas;
                        })
                        .catch(() => {});
                }
                // 获取运费模板时间数据
                getDayByType()
                    .then((res) => {
                        dayData.value = res.data;
                    })
                    .catch(() => {});
            }
        );
        const rules = {
            tempName: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            tradeType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            freightType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            sendType: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            status: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        // 材积是否选中
        let volumeChecked = ref(false);
        // 材积的值
        let volume = ref(0);
        // 运费模板时间数据
        let dayData = ref([]);
        // table行与列合并方法
        const objectSpanMethod = (row, column, rowIndex, columnIndex) => {
            // debugger
            if (columnIndex == 0) {
                if (rowIndex % form.value.freightTempPayAreaDTOS.length == 0) {
                    return {
                        rowspan: form.value.freightTempPayAreaDTOS.length,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        };
        // 新增/删除运费模板
        const handleAddEdit = (operate, id) => {
            if (operate == "add") {
                // 新增
                form.value.freightTempPayAreaDTOS.push({
                    id: form.value.freightTempPayAreaDTOS.length,
                    tempId: null,
                    countryCode: proxy.$store.state.app.currency.countryAreaCode,
                    // countryCodeName: "加纳", // 暂时写死，后面改
                    volume: null,
                    weightMin: null,
                    weightMax: null,
                    firstWeight: null,
                    firstWeightFreight: null,
                    addUnitWeight: null,
                    addWeightFreight: null,
                    materialsCost: null,
                    deliveryTimeValue: null
                });
            } else {
                // 删除
                // 循环freightTempPayAreaDTOS
                for (let i = 0; i <= form.value.freightTempPayAreaDTOS.length; i++) {
                    if (form.value.freightTempPayAreaDTOS[i].id == id) {
                        form.value.freightTempPayAreaDTOS.splice(i, 1);
                        break;
                    }
                }
            }
        };
        const formRef = ref(null);
        // 当贸易形式和商品配送方式发生变化的时候重置运输方式
        const sendTypeReset = () => {
            form.value.sendType = "";
        };
        const confirm = () => {
            proxy
                .$confirm(proxy.$t("sellerFreight.confirmTip1"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    formRef.value.validate((valid) => {
                        if (valid) {
                            delete form.value.createTime;
                            delete form.value.updateTime;
                            // form.value.freightTempPayAreaDTOS = form.value.payAreas
                            delete form.value.payAreas;
                            let type = updateFreightTemplateList;
                            if (updateType.value === "add") {
                                type = addSellerFreightTemplate;
                            }
                            type(form.value)
                                .then((res) => {
                                    emit("reloadData");
                                    emit("update:visible", false);
                                })
                                .catch(() => {});
                        } else {
                            return false;
                        }
                    });
                });
        };
        const beforeClose = () => {
            proxy
                .$confirm(proxy.$t("sellerFreight.cancelTip1"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    console.log("1123");

                    emit("update:visible", false);
                    return true;
                })
                .catch(() => {});
        };

        return {
            dict,
            updateType,
            form,
            rules,
            formRef,
            confirm,
            beforeClose,
            volumeChecked,
            volume,
            dayData,
            objectSpanMethod,
            handleAddEdit,
            sendTypeReset
        };
    }
};
</script>
