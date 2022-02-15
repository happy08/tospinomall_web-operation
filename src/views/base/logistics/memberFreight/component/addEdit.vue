<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" @close="cancel" width="80vw" :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 模板基础信息 -->
            <BmBaseTitle :title="$t('memberShippingTemplate.baseTemplateInfo')" />
            <!-- 模板名称 -->
            <el-form-item :label="$t('sellerFreightTable.tempName')" prop="tempName">
                <el-input v-model="form.tempName" type="text"></el-input>
            </el-form-item>
            <!-- 贸易形式 -->
            <el-form-item :label="$t('sellerFreightTable.tradeType')">
                <el-checkbox-group v-model="tradeType">
                    <el-checkbox v-for="(item, index) in dict.tradeTypeList" :key="index" :label="item.value">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- 商品配送方式 -->
            <el-form-item :label="$t('sellerFreightTable.freightType')">
                <el-radio-group v-model="freightType">
                    <el-radio :label="1">FBT</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 运输方式 -->
            <el-form-item :label="$t('sellerFreightTable.sendType')">
                <el-radio-group v-model="sendType">
                    <el-radio :label="1">{{ $t("sellerFreight.landCarriage") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 发货地 -->
            <el-form-item :label="$t('memberShippingTemplate.deliverType')" prop="deliverAddrCode">
                <!-- 手动设置收货地址 -->
                <el-cascader v-model="form.deliverAddrCode" :props="areaProps" ref="area" class="w-100"></el-cascader>
            </el-form-item>
            <!-- 发货时间 -->
            <el-form-item :label="$t('memberShippingTemplate.deliverTime')" prop="deliverTime">
                <el-select v-model="form.deliverTime" class="w-100">
                    <el-option v-for="item in deliveryTime" :key="item.id" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('sellerFreightTable.status')" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="(item, index) in dict.forbiddenEnableReverse" :key="index" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('remark')" prop="remarks">
                <el-input v-model="form.tempDesc" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <!-- 包邮配送区域 -->
            <div class="flex between" style="justrify:center">
                <!-- 标题 -->
                <BmBaseTitle :title="$t('memberShippingTemplate.freeShippingArea')" />
                <div class="flex between mt-5" style="width:90%;justrify:center">
                    <span class="light-grey">{{ $t("memberShippingTemplate.freeShippingTips") }}</span>
                </div>
            </div>
            <!-- 包邮配送区域选择 -->
            <el-form-item :label="$t('memberShippingTemplate.chooseShippingArea')">
                <!-- 包邮区域选择 -->
                <el-button type="primary" @click="handleAreaChecked">{{ $t("memberShippingTemplate.regionalSelection") }}</el-button>
                {{ $t("memberShippingTemplate.choose1", { num: freeAreaNum }) }}
            </el-form-item>
            <!-- 买家付邮配送区域 -->
            <div class="flex between">
                <!-- 标题 -->
                <BmBaseTitle :title="$t('memberShippingTemplate.buyerPayDeliveryArea')" />
                <div class="mt-10 light-grey">
                    {{ $t("memberShippingTemplate.buyerPayDeliveryAreaTips") }}
                </div>
            </div>
            <!-- 计价方式 -->
            <el-form-item :label="$t('sellerFreight.billing')" prop="pricingType">
                <!-- <el-radio-group v-model="true">
                    <el-radio
                        v-for="item in dict.postageBillingMethod"
                        :label="item.value"
                        :key="item.value"
                    >
                        {{ item.name }}
                    </el-radio>
                </el-radio-group> -->
                <el-radio disabled v-model="form.pricingType" :label="true">
                    {{ $t("memberShippingTemplate.billedByWeight") }}
                </el-radio>
                <span class="light-grey">
                    {{ $t("memberShippingTemplate.pricingTypeTips") }}
                </span>
            </el-form-item>
            <!-- 材积 -->
            <el-form-item>
                <!-- 材积 -->
                <el-checkbox v-model="form.volumeChecked">{{ $t("sellerFreight.volume") }}</el-checkbox>
                =
                <span
                    >{{ $t("sellerFreight.long") }}(cm) X {{ $t("sellerFreight.width") }}(cm) X {{ $t("sellerFreight.height") }}(cm) /
                    <span>
                        <el-input v-model="form.volumeVal" style="width:80px" type="number" min="0"></el-input>
                    </span>
                </span>
            </el-form-item>
            <!-- 运送方式 -->
            <div class="fs-14 ml-30">{{ $t("memberShippingTemplate.expressType") }}:</div>
            <!-- 快递 -->
            <div class="ml-40">
                {{ $t("memberShippingTemplate.expressDelivery") }}
            </div>
            <el-form-item>
                <!-- 计费资料table -->
                <div>
                    <!-- 新增 -->
                    <el-button type="primary" @click="handleAddEdit('expressTableAdd')">+{{ $t("status.add") }}</el-button>
                </div>

                <div v-for="(item, index) in expressTableArr" :key="index" class="mb-20">
                    <BmTable ref="multipleTable" :data="item.value" :span-method="objectSpanMethod">
                        <!-- 配送至 -->
                        <BmTableColumn prop="countryCode" :label="$t('memberShippingTemplate.shipTo')" align="center">
                            <!-- 已选择区域数量 -->
                            <div>{{ $t("memberShippingTemplate.choose1", { num: item.area.length }) }}</div>
                            <el-button type="text" @click="hanleNotFreeAreaChecked(item, 'express', index)">{{ $t("status.edit") }}</el-button>
                        </BmTableColumn>
                        <!-- 最小重量 -->
                        <BmTableColumn prop="weightMin" :label="$t('sellerShippingFeeTable.weightMin')">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.weightMin = clearNoNum(scoped.row.weightMin)" v-model="scoped.row.weightMin" type="number" min="0"></el-input>
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
                                <el-input @blur="scoped.row.weightMax = clearNoNum(scoped.row.weightMax)" v-model="scoped.row.weightMax" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 首重 -->
                        <BmTableColumn prop="firstWeight" :label="$t('sellerShippingFeeTable.firstWeight') + '(' + 'kg' + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.firstWeight = clearNoNum(scoped.row.firstWeight)" v-model="scoped.row.firstWeight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 首重运费 -->
                        <BmTableColumn prop="firstWeightFreight" :label="$t('sellerShippingFeeTable.firstWeightFreight') + '(' + $store.state.app.currencySymbol + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.firstWeightFreight = clearNoNum(scoped.row.firstWeightFreight)" v-model="scoped.row.firstWeightFreight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 续单位重量 -->
                        <BmTableColumn prop="addUnitWeight" :label="$t('sellerShippingFeeTable.addUnitWeight') + '(' + 'kg' + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.addUnitWeight = clearNoNum(scoped.row.addUnitWeight)" v-model="scoped.row.addUnitWeight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 续重运费 -->
                        <BmTableColumn prop="addWeightFreight" :label="$t('sellerShippingFeeTable.addWeightFreight') + '(' + $store.state.app.currencySymbol + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.addWeightFreight = clearNoNum(scoped.row.addWeightFreight)" v-model="scoped.row.addWeightFreight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 包材费用 -->
                        <BmTableColumn prop="materialsCost" :label="$t('sellerShippingFeeTable.materialsCost') + '(' + $store.state.app.currencySymbol + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.materialsCost = clearNoNum(scoped.row.materialsCost)" v-model="scoped.row.materialsCost" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 预计配送时间 -->
                        <BmTableColumn prop="deliveryTimeValue" :label="$t('sellerShippingFeeTable.deliveryTimeValue') + '(' + $t('sellerFreight.day') + ')'">
                            <template #default="scoped">
                                <el-select v-model="scoped.row.deliveryTimeValue">
                                    <el-option v-for="item in estimatedDeliveryTime" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </BmTableColumn>
                        <!-- 操作 -->
                        <BmTableColumn :label="$t('table.operation')">
                            <template #default="scope">
                                <!-- 删除 -->
                                <el-button type="text" @click="handleAddEdit('expressListDel', scope.$index, index)">{{ $t("status.delete") }}</el-button>
                                <!-- 新增 -->
                                <el-button type="text" @click="handleAddEdit('expressListAdd', scope.$index, index)">{{ $t("status.add") }}</el-button>
                            </template>
                        </BmTableColumn>
                    </BmTable>
                    <!-- 指定条件包邮 -->
                    <div class="w100 tc flex center ptb-20" style="backgroundColor:#F7F7F7">
                        <el-checkbox v-model="item.freeCondition" :true-label="1" :false-label="0">{{ $t("memberShippingTemplate.freeShippingOnSpecifiedConditions") }}</el-checkbox>
                        <!-- 包邮条件选择 条件类型，1：件数，2：重量，3：金额，4：重量+金额-->
                        <el-select v-model="item.itemType" class="mlr-20" style="width:140px;" @change="freeMailConditionChange($event, item)">
                            <el-option v-for="item in dict.freeShippingConditionsType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                        <!-- 选择重量/金额/件数的视图 -->
                        <div class="flex" v-if="item.itemType != 4">
                            <span class="mr-20">{{ $t("memberShippingTemplate.full") }}</span>
                            <!-- 条件类型，1：件数，2：重量，3：金额，4：重量+金额 -->
                            <el-input v-if="item.itemType == 1" class="mr-10" style="margin-top:3px;width:140px;" v-model="item.pieceCount"></el-input>
                            <el-input v-if="item.itemType == 2" class="mr-10" style="margin-top:3px;width:140px;" v-model="item.weightSize"></el-input>
                            <el-input v-if="item.itemType == 3" class="mr-10" style="margin-top:3px;width:140px;" v-model="item.amount"></el-input>

                            <el-select v-model="item.pricingType" style="margin-top:3px;width:140px;">
                                <el-option v-for="item in freeMailUnitSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span style="width:80px">{{ $t("memberShippingTemplate.freeMail") }}</span>
                            <span style="width:200px">(N{{ $store.state.app.currencySymbol }}{{ $t("memberShippingTemplate.freeMailTips") }})</span>
                        </div>
                        <!-- 选择重量+金额的视图 -->
                        <div class="flex" v-else>
                            <span class="mr-20">{{ $t("memberShippingTemplate.in") }}</span>
                            <el-input class="mr-10" style="margin-top:3px;width:140px;" v-model="item.weightSize"></el-input>
                            <span style="width:80px">KG {{ $t("memberShippingTemplate.inside") }}</span>
                            <el-input class="mr-10" style="margin-top:3px;width:140px;" v-model="item.amount"></el-input>
                            <span style="width:80px">{{ $store.state.app.currencySymbol }}{{ $t("memberShippingTemplate.above") }}</span>
                            <span style="width:60px">{{ $t("memberShippingTemplate.freeMail") }}</span>
                        </div>
                        <!-- 删除快递table -->
                        <el-button size="medium" type="text" @click="handleAddEdit('expressTableDel', index)">{{ $t("memberShippingTemplate.delThisTable") }}</el-button>
                    </div>
                </div>
            </el-form-item>
            <!-- 平邮 -->
            <div class="ml-40">
                {{ $t("memberShippingTemplate.surfaceMail") }}
            </div>
            <el-form-item>
                <!-- 计费资料table -->
                <div>
                    <!-- 新增 -->
                    <el-button type="primary" @click="handleAddEdit('emsTableAdd')">+{{ $t("status.add") }}</el-button>
                </div>
                <div v-for="(item, index) in emsTableArr" :key="index" class="mb-20">
                    <BmTable ref="multipleTable" :data="emsTableArr[index].value" :span-method="objectSpanMethod2">
                        <!-- 配送至 -->
                        <BmTableColumn prop="countryCode" :label="$t('memberShippingTemplate.shipTo')" align="center">
                            <!-- 已选择区域数量 -->
                            <div>{{ $t("memberShippingTemplate.choose1", { num: item.area.length }) }}</div>
                            <el-button type="text" @click="hanleNotFreeAreaChecked(item, 'ems', index)">{{ $t("status.edit") }}</el-button>
                        </BmTableColumn>
                        <!-- 最小重量 -->
                        <BmTableColumn prop="weightMin" :label="$t('sellerShippingFeeTable.weightMin')">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.weightMin = clearNoNum(scoped.row.weightMin)" v-model="scoped.row.weightMin" type="number" min="0"></el-input>
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
                                <el-input @blur="scoped.row.weightMax = clearNoNum(scoped.row.weightMax)" v-model="scoped.row.weightMax" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 首重 -->
                        <BmTableColumn prop="firstWeight" :label="$t('sellerShippingFeeTable.firstWeight') + '(' + 'kg' + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.firstWeight = clearNoNum(scoped.row.firstWeight)" v-model="scoped.row.firstWeight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 首重运费 -->
                        <BmTableColumn prop="firstWeightFreight" :label="$t('sellerShippingFeeTable.firstWeightFreight') + '(' + $store.state.app.currencySymbol + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.firstWeightFreight = clearNoNum(scoped.row.firstWeightFreight)" v-model="scoped.row.firstWeightFreight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 续单位重量 -->
                        <BmTableColumn prop="addUnitWeight" :label="$t('sellerShippingFeeTable.addUnitWeight') + '(' + 'kg' + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.addUnitWeight = clearNoNum(scoped.row.addUnitWeight)" v-model="scoped.row.addUnitWeight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 续重运费 -->
                        <BmTableColumn prop="addWeightFreight" :label="$t('sellerShippingFeeTable.addWeightFreight') + '(' + $store.state.app.currencySymbol + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.addWeightFreight = clearNoNum(scoped.row.addWeightFreight)" v-model="scoped.row.addWeightFreight" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 包材费用 -->
                        <BmTableColumn prop="materialsCost" :label="$t('sellerShippingFeeTable.materialsCost') + '(' + $store.state.app.currencySymbol + ')'">
                            <template #default="scoped">
                                <el-input @blur="scoped.row.materialsCost = clearNoNum(scoped.row.materialsCost)" v-model="scoped.row.materialsCost" type="number" min="0"></el-input>
                            </template>
                        </BmTableColumn>
                        <!-- 预计配送时间 -->
                        <BmTableColumn prop="deliveryTimeValue" :label="$t('sellerShippingFeeTable.deliveryTimeValue') + '(' + $t('sellerFreight.day') + ')'">
                            <template #default="scoped">
                                <el-select v-model="scoped.row.deliveryTimeValue">
                                    <el-option v-for="item in estimatedDeliveryTime" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </BmTableColumn>
                        <!-- 操作 -->
                        <BmTableColumn :label="$t('table.operation')">
                            <template #default="scope">
                                <!-- 删除 -->
                                <el-button type="text" @click="handleAddEdit('emsListDel', scope.$index, index)">{{ $t("status.delete") }}</el-button>
                                <!-- 新增 -->
                                <el-button type="text" @click="handleAddEdit('emsListAdd', scope.$index, index)">{{ $t("status.add") }}</el-button>
                            </template>
                        </BmTableColumn>
                    </BmTable>
                    <!-- 指定条件包邮 -->
                    <div class="w100 tc flex center ptb-20" style="backgroundColor:#F7F7F7">
                        <el-checkbox v-model="item.freeCondition" :true-label="1" :false-label="0">{{ $t("memberShippingTemplate.freeShippingOnSpecifiedConditions") }}</el-checkbox>
                        <!-- 包邮条件选择 -->
                        <el-select v-model="item.itemType" class="mlr-20" style="width:140px;" @change="freeMailConditionChange($event, item)">
                            <el-option v-for="item in dict.freeShippingConditionsType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                        <!-- 选择重量/金额/件数的视图 -->
                        <div class="flex" v-if="item.itemType != 4">
                            <span class="mr-20">{{ $t("memberShippingTemplate.full") }}</span>
                            <!-- 条件类型，1：件数，2：重量，3：金额，4：重量+金额 -->
                            <el-input v-if="item.itemType == 1" class="mr-10" style="margin-top:3px;width:140px;" v-model="item.pieceCount"></el-input>
                            <el-input v-if="item.itemType == 2" class="mr-10" style="margin-top:3px;width:140px;" v-model="item.weightSize"></el-input>
                            <el-input v-if="item.itemType == 3" class="mr-10" style="margin-top:3px;width:140px;" v-model="item.amount"></el-input>

                            <el-select v-model="item.pricingType" style="margin-top:3px;width:140px;">
                                <el-option v-for="item in freeMailUnitSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span style="width:80px">{{ $t("memberShippingTemplate.freeMail") }}</span>
                            <span style="width:200px">(N{{ $store.state.app.currencySymbol }}{{ $t("memberShippingTemplate.freeMailTips") }})</span>
                        </div>
                        <!-- 选择重量+金额的视图 -->
                        <div class="flex" v-else>
                            <span class="mr-20">{{ $t("memberShippingTemplate.in") }}</span>
                            <el-input class="mr-10" style="margin-top:3px;width:140px;" v-model="item.weightSize"></el-input>
                            <span style="width:80px">KG {{ $t("memberShippingTemplate.inside") }}</span>
                            <el-input class="mr-10" style="margin-top:3px;width:140px;" v-model="item.amount"></el-input>
                            <span style="width:80px">{{ $store.state.app.currencySymbol }}{{ $t("memberShippingTemplate.above") }}</span>
                            <span style="width:60px">{{ $t("memberShippingTemplate.freeMail") }}</span>
                        </div>
                        <!-- 删除快递table -->
                        <el-button size="medium" type="text" @click="handleAddEdit('emsTableDel', index)">{{ $t("memberShippingTemplate.delThisTable") }}</el-button>
                    </div>
                </div>
            </el-form-item>
            <!-- 不配送区域 -->
            <BmBaseTitle :title="$t('memberShippingTemplate.nonDeliveryArea')" />
            <!-- 新增 -->

            <!-- 地区 -->
            <div class="border mlr-20 mt-20 flex between p-10 round" style="wdith:90%;border;">
                <el-button type="text" @click="handleNotDeliveredAreaCheck">{{ $t("memberShippingTemplate.lookArea") }}</el-button>
                <span class="pl-20"> {{ $t("memberShippingTemplate.choose1", { num: notDeliveredAreaNum }) }}</span>
            </div>
        </el-form>

        <template #footer>
            <div class="flex hcenter vcenter">
                <template v-if="form">
                    <el-button @click="cancel">{{ $t("cancel") }}</el-button>
                    <el-button type="primary" @click="confirm">{{ $t("confirm") }}</el-button>
                </template>
            </div>
        </template>
    </BmDialog>

    <areaCheck v-model:visible="areaVisible" :chooseCode="currentChooseCode" :disabledCode="currentDisabledCode" @change="onChangeCode" />
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed, toRaw } from "vue";
import {
    logisticsBuyerUpdateSellerFreightTemplate,
    logisticsBuyerAddFreightTemplate,
    logisticsBuyerFindById,
    areaFindAreasTree,
    deliveryTimeType,
    getDayByType,
    basicsAreaFindByParentId
} from "@/api/base";
import areaCheck from "./component/areaCheck.vue";
import { deepClone } from "@/utils/";

export default {
    name: "sellerFreightTableAdd",
    components: { areaCheck },
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
        // 贸易形式，商品配送方式，运输方式写死
        const tradeType = [1, 2];
        const freightType = 1;
        const sendType = 1;

        // 获取地区树
        getAreaData();
        // 获取发货时间信息
        getDeliveryTimeType();
        // 获取预计时间信息
        getEstimatedDeliveryTime();

        // 发货地址级联选择框配置选项
        const areaProps = reactive({
            lazy: true,
            lazyLoad(node, resolve) {
                const { level, data } = node;
                basicsAreaFindByParentId({ parentId: data.id || 0, isCurrentSite: 1 })
                    .then((res) => {
                        const nodes = res.data.map((item) => ({
                            id: item.id,
                            value: item.code,
                            label: item.name,
                            leaf: item.hasChild !== 1
                        }));
                        resolve(nodes);
                    })
                    .catch((err) => {});
            }
        });

        const formRef = ref(null);

        let areaVisible = ref(false);
        let currentChooseCode = ref([]); //当前选中的code
        let currentDisabledCode = ref([]); //当前禁用的code

        // 包邮地区选择的code数组
        let freeAreaData = [];
        let freeAreaChooseCode = [];
        let freeAreaNum = ref(0);

        // 不包邮快递
        let expressTableArr = ref([]);
        // 不包邮平邮
        let emsTableArr = ref([]);

        // 不配送区域数据
        let notDeliveredAreaData = [];
        // 不配送区域code
        let notDeliveredAreaChooseCode = [];
        // 不配送区域选择的省
        let notDeliveredAreaNum = ref(0);

        if (updateType.value == "edit") {
            // 编辑
            logisticsBuyerFindById({ id: props.row.id })
                .then(async (res) => {
                    let volumeVal = ""; //材积的值 >0标识要勾选

                    // 循环遍历res.data.freightTempAreas，将其中包邮/不包邮/不配送的数据取出来
                    res.data.freightTempAreas.map((item) => {
                        // type: 运费类型，1：包邮，2：不包邮，3：不配送
                        item.name = item.areaName;
                        item.childs = [];

                        if (item.type == 1) {
                            //包邮配送区域
                            freeAreaData.push(item);
                            // 包邮配送区域code
                            freeAreaChooseCode.push(item.areaCode);
                        } else if (item.type == 2) {
                            // 	// 将预计配送时间的显示值加上去
                            // switch (item.deliveryTimeValue) {
                            // 	case 1017:
                            // 		item.deliveryTimeValueName = "1-3";
                            // 		break;
                            // 	case 1018:
                            // 		item.deliveryTimeValueName = "3-7";
                            // 		break;
                            // 	case 1019:
                            // 		item.deliveryTimeValueName = "7-14";
                            // 		break;
                            // 	case 1020:
                            // 		item.deliveryTimeValueName = "14-25";
                            // 		break;
                            // 	case 1021:
                            // 		item.deliveryTimeValueName = "25-30";
                            // 		break;
                            // }

                            // 过滤掉一些没用字段
                            let itemTmp = {
                                areaCode: item.areaCode,
                                cityCode: item.cityCode,
                                provinceCode: item.provinceCode,
                                countryCode: item.countryCode,
                                freightTempPayAreas: item.freightTempPayAreas,
                                type: item.type,
                                tempId: item.tempId
                            };

                            if (itemTmp.freightTempPayAreas.length > 0) {
                                let freightTempPayAreas = itemTmp.freightTempPayAreas[0];
                                // 快递
                                let tableArrt = expressTableArr.value;

                                //平邮
                                if (freightTempPayAreas.expressType == 2) {
                                    tableArrt = emsTableArr.value;
                                }

                                //插入外层整条数据
                                if (!tableArrt[freightTempPayAreas.areaSequenceNumber]) {
                                    //赋值里层每条数据，只要赋值一次就好，其他都相同的
                                    tableArrt[freightTempPayAreas.areaSequenceNumber] = {
                                        area: [],
                                        value: itemTmp.freightTempPayAreas,
                                        freeCondition: freightTempPayAreas.freeCondition * 1 || 0,
                                        itemType: freightTempPayAreas.itemType || 1,
                                        pieceCount: freightTempPayAreas.pieceCount,
                                        pricingType: freightTempPayAreas.pricingType || 4,
                                        weightSize: freightTempPayAreas.weightSize,
                                        amount: freightTempPayAreas.amount
                                    };

                                    //判断材积是否填写了 volume>0表示要勾选
                                    if (!volumeVal) {
                                        volumeVal = freightTempPayAreas.volume || "";
                                    }
                                }
                                //收集areaCode放各自的整条数据
                                tableArrt[freightTempPayAreas.areaSequenceNumber].area.push(itemTmp);
                            }
                        } else {
                            // 不配送区域数据
                            notDeliveredAreaData.push(item);
                            // 不配送区域code
                            notDeliveredAreaChooseCode.push(item.areaCode);
                        }
                    });
                    freeAreaNum.value = freeAreaChooseCode.length; // 包邮区域个数
                    notDeliveredAreaNum.value = notDeliveredAreaChooseCode.length; // 不配送区域个数

                    console.log("expressTableArr.value", expressTableArr.value);

                    form.value = {
                        deliverAddrCode: [res.data.deliverCountryCode, res.data.deliverProvinceCode, res.data.deliverCityCode, res.data.deliverRegionCode],
                        deliverCityCode: res.data.deliverCityCode,
                        deliverCountryCode: res.data.deliverCountryCode,
                        deliverProvinceCode: res.data.deliverProvinceCode,
                        deliverRegionCode: res.data.deliverRegionCode,
                        deliverTime: res.data.deliverTime,
                        deliverType: res.data.deliverType, //发货地类型(1仓库地址2手动设置）
                        id: res.data.id,
                        status: res.data.status,
                        tempDesc: res.data.tempDesc,
                        tempName: res.data.tempName,
                        pricingType: true, //按重量计费
                        volumeVal: volumeVal, //材积值
                        volumeChecked: !!volumeVal //选中材积
                    };
                })
                .catch(() => {});
        } else {
            //新增
            form.value = {
                freightTempAreas: [],
                deliverAddrCode: []
            };
        }

        const rules = {
            tempName: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            deliverAddrCode: {
                required: true,
                message: proxy.$t("required"),
                trigger: "change"
            },
            status: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };

        // 获取地区树信息
        let areasTreeNew = [];
        function getAreaData() {
            areaFindAreasTree({ isCurrentSite: 1 })
                .then((res) => {
                    const countryCode = res.data[0].code;
                    areasTreeNew = res.data[0].childs;
                    // 重新整理地区树
                    areasTreeNew.forEach((item) => {
                        item.areaCode = item.code; // 城市code
                        item.cityCode = item.code; // 城市code
                        item.provinceCode = item.code; // 省份code
                        item.countryCode = countryCode; // 国家code
                        //delete item.code;
                        delete item.id;
                        delete item.pid;
                        delete item.lev;
                        item.childs.forEach((cityItem) => {
                            cityItem.areaCode = cityItem.code; // 城市code
                            cityItem.cityCode = cityItem.code; // 城市code
                            cityItem.provinceCode = item.provinceCode; // 省份code
                            cityItem.countryCode = countryCode; // 国家code
                            //delete cityItem.code;
                            delete cityItem.id;
                            delete cityItem.pid;
                            delete cityItem.lev;
                            cityItem.childs.forEach((areaItem, index) => {
                                areaItem.areaCode = areaItem.code; // 城市code
                                areaItem.cityCode = cityItem.cityCode; // 城市code
                                areaItem.provinceCode = item.provinceCode; // 省份code
                                areaItem.countryCode = countryCode; // 国家code
                                //delete areaItem.code;
                                delete areaItem.id;
                                delete areaItem.pid;
                                delete areaItem.lev;
                            });
                        });
                    });
                })
                .catch(() => {});
        }

        let changeCodeType = ""; //正在修改哪种类型的code
        let changeCodeShip = ""; //正在修改不包邮配送区域的哪种code （express快递/ems平邮）
        let changeCodeShipIndex = "";

        // 改变了code
        const onChangeCode = (areaCodeList) => {
            const areaCodeTmp = areaCodeList.map((item) => item.areaCode);

            //包邮配送区域
            if (changeCodeType == 1) {
                areaCodeList.forEach((item) => {
                    item.type = 1;
                });
                freeAreaData = toRaw(areaCodeList);
                freeAreaChooseCode = areaCodeTmp;
                freeAreaNum.value = freeAreaChooseCode.length;
            }
            //不包邮配送区域
            else if (changeCodeType == 2) {
                areaCodeList.forEach((item) => {
                    item.type = 2;
                });
                //快递
                if (changeCodeShip == "express") {
                    expressTableArr.value[changeCodeShipIndex].area = toRaw(areaCodeList);
                    //平邮
                } else if (changeCodeShip == "ems") {
                    emsTableArr.value[changeCodeShipIndex].area = toRaw(areaCodeList);
                }
            }
            //不配送区域
            else if (changeCodeType == 3) {
                areaCodeList.forEach((item) => {
                    item.type = 3;
                });
                notDeliveredAreaData = toRaw(areaCodeList);
                notDeliveredAreaChooseCode = areaCodeTmp;
                notDeliveredAreaNum.value = notDeliveredAreaChooseCode.length;
            }
            // debugger;
        };

        // 发货时间类型数据
        let deliveryTime = ref([]);
        function getDeliveryTimeType() {
            deliveryTimeType()
                .then((res) => {
                    deliveryTime.value = res.data;
                })
                .catch(() => {});
        }
        // 包邮区域选择按钮处理函数
        const handleAreaChecked = () => {
            const loading = proxy.$loading();
            changeCodeType = 1; //1=正在修改包邮区域code

            setTimeout(() => {
                //当前选中的code
                currentChooseCode.value = freeAreaChooseCode;

                // 快递
                let expressCode = expressTableArr.value.map((item) => item.area.map((aItem) => aItem.areaCode));
                let allExpressCode = expressCode.flat(1);
                // 平邮
                let emsCode = emsTableArr.value.map((item) => item.area.map((aItem) => aItem.areaCode));
                let allEmsCode = emsCode.flat(1);

                //当前禁用的code
                currentDisabledCode.value = [...allExpressCode, ...allEmsCode, ...notDeliveredAreaChooseCode];
                // debugger;

                areaVisible.value = true;
                loading.close();
            }, 100);
        };

        // -----------------------------------买家付邮费--------------------------------

        // 包邮条件单位select
        const freeMailUnitSelect = [
            {
                label: "KG",
                value: 2
            },
            {
                label: proxy.$store.state.app.currencySymbol,
                value: 3
            },
            {
                label: "PSC",
                value: 4
            }
        ];
        // 包邮条件选择变化时的监听事件
        const freeMailConditionChange = (value, item) => {
            switch (value) {
                case 1:
                    item.pricingType = 4;
                    break;
                case 2:
                    item.pricingType = 2;
                    break;
                case 3:
                    item.pricingType = 3;
                    break;
            }
        };
        // 不包邮区域table的新增删除操作
        const handleAddEdit = (type, index, areaIndex) => {
            switch (type) {
                case "expressTableAdd": // 快递table新增
                    expressTableArr.value.push({
                        area: [],
                        value: [
                            {
                                areaSequenceNumber: 0,
                                sequenceNumber: 0
                            }
                        ]
                    });
                    break;
                case "expressTableDel": // 快递table删除
                    expressTableArr.value.splice(index, 1);
                    break;
                case "expressListAdd": // 快递运费配置list新增
                    expressTableArr.value[areaIndex].value.push({
                        areaSequenceNumber: 0,
                        sequenceNumber: 0
                    });
                    break;
                case "expressListDel": // 快递运费配置list删除
                    if (expressTableArr.value[areaIndex].value.length == 1) {
                        proxy.$message.warnning(proxy.$t("memberShippingTemplate.delListTip"));
                    } else {
                        expressTableArr.value[areaIndex].value.splice(index, 1);
                    }
                    break;
                case "emsTableAdd": // 平邮table新增
                    emsTableArr.value.push({
                        area: [],
                        value: [
                            {
                                areaSequenceNumber: 0,
                                sequenceNumber: 0
                            }
                        ]
                    });
                    break;
                case "emsTableDel": // 平邮table删除
                    emsTableArr.value.splice(index, 1);
                    break;
                case "emsListAdd": // 平邮运费配置list新增
                    emsTableArr.value[areaIndex].value.push({
                        areaSequenceNumber: 0,
                        sequenceNumber: 0
                    });
                    break;
                case "emsListDel": // 平邮运费配置list删除
                    if (emsTableArr.value[areaIndex].value.length == 1) {
                        proxy.$message.warning(proxy.$t("memberShippingTemplate.delListTip"));
                    } else {
                        emsTableArr.value[areaIndex].value.splice(index, 1);
                    }
                    break;
            }
        };
        // 不包邮地区快递/平邮点击的table索引
        let clickIndex = ref("");

        // 不包邮地区选择按钮监听事件
        const hanleNotFreeAreaChecked = (itemArea, type, index) => {
            const loading = proxy.$loading();
            changeCodeType = 2; //2=正在修改不包邮区域code
            changeCodeShip = type; //type=express/ems 正在修改不包邮区域code
            changeCodeShipIndex = index;

            setTimeout(() => {
                //当前选中的code
                currentChooseCode.value = (itemArea.area && itemArea.area.map((item) => item.areaCode)) || [];

                // 快递
                let expressCode = expressTableArr.value.map((item, i) => {
                    let area = item.area.map((aItem) => aItem.areaCode);
                    if (i === index && type == "express") {
                        area = [];
                    }
                    return area;
                });
                let allExpressCode = expressCode.flat(1);
                // 平邮
                let emsCode = emsTableArr.value.map((item, i) => {
                    let area = item.area.map((aItem) => aItem.areaCode);
                    if (i === index && type == "ems") {
                        area = [];
                    }
                    return area;
                });
                let allEmsCode = emsCode.flat(1);

                //当前禁用的code
                currentDisabledCode.value = [...freeAreaChooseCode, ...allExpressCode, ...allEmsCode, ...notDeliveredAreaChooseCode];
                // debugger;

                areaVisible.value = true;
                loading.close();
            }, 100);
        };

        // 预计配送时间
        let estimatedDeliveryTime = ref([]);
        function getEstimatedDeliveryTime() {
            getDayByType()
                .then((res) => {
                    estimatedDeliveryTime.value = res.data;
                })
                .catch(() => {});
        }

        // 快递行合并
        const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
            if (columnIndex === 0) {
                if (rowIndex % expressTableArr.value[0].value.length === 0) {
                    return {
                        rowspan: expressTableArr.value[0].value.length,
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
        // 平邮行合并
        const objectSpanMethod2 = ({ row, column, rowIndex, columnIndex }) => {
            if (columnIndex === 0) {
                if (rowIndex % emsTableArr.value[0].value.length === 0) {
                    return {
                        rowspan: emsTableArr.value[0].value.length,
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
        // 重量与金额正则验证
        const clearNoNum = (obj) => {
            //修复第一个字符是小数点 的情况.
            if (obj != "" && obj.substr(0, 1) == ".") {
                obj = "";
            }
            obj = obj.replace(/^0*(0\.|[1-9])/, "$1"); //解决 粘贴不生效
            obj = obj.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            obj = obj.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            obj = obj
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".");
            obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
            // obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/,'$1$2.$3');//只能输入4个小数
            if (obj.indexOf(".") < 0 && obj != "") {
                //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                if (obj.substr(0, 1) == "0" && obj.length == 2) {
                    obj = obj.substr(1, obj.length);
                }
            }
            return obj;
        };

        // -----------------------------------不配送-------------------------------

        // 不配送查看区域按钮监听事件
        const handleNotDeliveredAreaCheck = () => {
            const loading = proxy.$loading();
            changeCodeType = 3; //3=正在修改包邮区域code

            setTimeout(() => {
                //当前选中的code
                currentChooseCode.value = notDeliveredAreaChooseCode;

                // 快递
                let expressCode = expressTableArr.value.map((item) => item.area.map((aItem) => aItem.areaCode));
                let allExpressCode = expressCode.flat(1);
                // 平邮
                let emsCode = emsTableArr.value.map((item) => item.area.map((aItem) => aItem.areaCode));
                let allEmsCode = emsCode.flat(1);

                //当前禁用的code
                currentDisabledCode.value = [...freeAreaChooseCode, ...allExpressCode, ...allEmsCode];

                // debugger;
                areaVisible.value = true;
                loading.close();
            }, 100);
        };

        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    // 将不包邮区域数据进行组装
                    let notFreeAreaExpressData = [];
                    let notFreeAreaEmsData = [];
                    // 快递
                    let expressTableArrTmp = deepClone(expressTableArr.value);
                    expressTableArrTmp.forEach((item, index) => {
                        item.value.forEach((fitem, findex) => {
                            fitem.areaSequenceNumber = index; //外层排序
                            fitem.sequenceNumber = findex; //里层排序

                            fitem.expressType = 1;
                            fitem.freeCondition = item.freeCondition * 1 || 0; //是否选中指定条件包邮
                            fitem.itemType = item.itemType || 1; //类型
                            fitem.pieceCount = item.pieceCount || ""; //满N件包邮
                            fitem.pricingType = item.pricingType || 4; //类型单位
                            fitem.weightSize = item.weightSize || ""; //满N重量
                            fitem.amount = item.amount || ""; //满N金额
                            fitem.volume = form.value.volumeVal || ""; //材积
                        });
                        item.area.forEach((aItem) => {
                            aItem.freightTempPayAreas = item.value;
                        });

                        notFreeAreaExpressData.push(item.area);
                    });
                    notFreeAreaExpressData = notFreeAreaExpressData.flat(1);

                    // 平邮
                    let emsTableArrTmp = deepClone(emsTableArr.value);
                    emsTableArrTmp.forEach((item, index) => {
                        item.value.forEach((fitem, findex) => {
                            fitem.areaSequenceNumber = index; //外层排序
                            fitem.sequenceNumber = findex; //里层排序

                            fitem.expressType = 2;
                            fitem.freeCondition = item.freeCondition * 1 || 0; //是否选中指定条件包邮
                            fitem.itemType = item.itemType || 1; //类型
                            fitem.pieceCount = item.pieceCount || ""; //满N件包邮
                            fitem.pricingType = item.pricingType || 4; //类型单位
                            fitem.weightSize = item.weightSize || ""; //满N重量
                            fitem.amount = item.amount || ""; //满N金额
                            fitem.volume = form.value.volumeVal || ""; //材积值
                        });
                        item.area.forEach((aItem) => {
                            aItem.freightTempPayAreas = item.value;
                        });

                        notFreeAreaEmsData.push(item.area);
                    });
                    notFreeAreaEmsData = notFreeAreaEmsData.flat(1);

                    // 最终将包邮地区、不包邮地区、不配送地区的数据组合在一起
                    // 包邮地区 freeAreaData.value | 不包邮地区快递 notFreeAreaExpressData | 不包邮地区平邮 notFreeAreaEmsData | 不配送地区 notDeliveredAreaData.value
                    form.value.freightTempAreas = [...freeAreaData, ...notFreeAreaExpressData, ...notFreeAreaEmsData, ...notDeliveredAreaData];

                    form.value.deliverType = 2; //发货地类型(1仓库地址2手动设置）
                    form.value.deliverCountryCode = form.value.deliverAddrCode[0];
                    form.value.deliverProvinceCode = form.value.deliverAddrCode[1];
                    form.value.deliverCityCode = form.value.deliverAddrCode[2];
                    form.value.deliverRegionCode = form.value.deliverAddrCode[3];
                    //发货地名称
                    form.value.deliverAddr = proxy.$refs.area
                        .getCheckedNodes()[0]
                        .pathLabels.join(",")
                        .replace(/,/g, "");
                    console.log("form.value", form.value);

                    // 编辑模板
                    if (updateType.value == "edit") {
                        logisticsBuyerUpdateSellerFreightTemplate(form.value)
                            .then((res) => {
                                emit("update:visible", false);
                                emit("reloadData");
                            })
                            .catch((err) => {});
                    } else {
                        // 新增模板
                        logisticsBuyerAddFreightTemplate(form.value)
                            .then((res) => {
                                emit("update:visible", false);
                                emit("reloadData");
                            })
                            .catch(() => {});
                    }
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            dict,
            updateType,
            form,
            rules,
            formRef,
            confirm,
            cancel,
            deliveryTime,
            getDeliveryTimeType,
            estimatedDeliveryTime,
            getEstimatedDeliveryTime,
            handleAreaChecked,

            expressTableArr,
            emsTableArr,
            freeMailUnitSelect,
            handleAddEdit,

            hanleNotFreeAreaChecked,

            handleNotDeliveredAreaCheck,

            areaProps,

            freeMailConditionChange,
            objectSpanMethod,
            objectSpanMethod2,
            tradeType,
            freightType,
            sendType,
            clearNoNum,
            clickIndex,

            areaVisible,
            currentChooseCode,
            currentDisabledCode,
            onChangeCode,
            freeAreaNum,
            notDeliveredAreaNum
        };
    }
};
</script>
