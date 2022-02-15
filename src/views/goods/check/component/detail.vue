<template>
    <BmDialog v-model:visible="visible" @close="$emit('update:visible', false)" :title="$t('table.detail')" width="80vw">
        <div class="mb-25 bg-white round-4">
            <el-tabs v-model="activeName" type="card" class="custom-tabs-green">
                <!-- 基本信息 -->
                <el-tab-pane name="title1" class="pane-1">
                    <template #label>
                        <el-badge type="danger">{{ $t("releaseGoods.basicInfo") }}</el-badge>
                    </template>
                    <div>
                        <EditCategory :option="categoryOption" />
                        <el-form :model="formPane1" :rules="rulePane1" ref="formPane1Ref" label-position="top">
                            <el-form-item prop="goodTitle">
                                <template #label>
                                    <span class="fs-16 fw">{{ $t("releaseGoods.commodityTitle") }}</span>
                                </template>
                                <el-input v-model="formPane1.goodTitle" disabled type="textarea" :rows="3" :placeholder="$t('pleaseEnter')"></el-input>
                            </el-form-item>
                            <el-form-item prop="goodCode">
                                <template #label>
                                    <span class="fs-16 fw">{{ $t("releaseGoods.goodsCode") }}</span>
                                </template>
                                <el-input v-model="formPane1.goodCode" disabled :placeholder="$t('pleaseEnter')"></el-input>
                            </el-form-item>
                            <el-form-item prop="brandId">
                                <!-- 商品品牌 -->
                                <template #label>
                                    <span class="fs-16 fw">{{ $t("releaseGoods.goodsBrand") }}</span>
                                </template>
                                <el-select v-model="formPane1.brandId" disabled :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="videoUrl">
                                <template #label>
                                    <span class="fs-16 fw">{{ $t("releaseGoods.goodsSlideshow") }}</span>
                                </template>
                                <div class="flex">
                                    <video v-if="formPane1.videoUrl" :src="formPane1.videoUrl" width="148" height="148" controls></video>
                                    <div v-else style="width:148px;height:148px" class="border round-4 bg-light-grey"></div>

                                    <div class="ml-25 lh-12">
                                        <div class="fs-14">
                                            {{ $t("releaseGoods.cover") }}
                                        </div>
                                        <div class="mt-5">1.{{ $t("releaseGoods.size") }}</div>
                                        <div class="mt-5">2.{{ $t("releaseGoods.burningTime") }}</div>
                                        <div class="mt-5">3.{{ $t("releaseGoods.content") }}</div>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item prop="carouselMapUrls">
                                <template #label>
                                    <span class="fs-16 fw">
                                        {{ $t("releaseGoods.goodsBanner") }}
                                    </span>
                                </template>

                                <div>
                                    <div class="fl">
                                        <BmImage
                                            v-for="item in formPane1.carouselMapUrls"
                                            :src="item.imgUrl"
                                            :key="item.id"
                                            style="width:120px;height:120px"
                                            class="mr-10 mb-10 border"
                                            :preview-src-list="formPane1.carouselMapUrls.map((item) => item.imgUrl)"
                                        />
                                    </div>
                                    <div class="m-15" style="line-height: 1.6;" v-html="$t('releaseGoods.imageLimit')"></div>
                                    <div class="clear"></div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- 销售规格 -->
                <el-tab-pane name="title2" class="sell">
                    <template #label>
                        <el-badge type="danger">{{ $t("releaseGoods.salesSpecifications") }}</el-badge>
                    </template>
                    <EditCategory :option="categoryOption" />

                    <div class="mb-15">
                        <span class="title">*{{ $t("releaseGoods.goodsSpec") }}</span
                        ><span class="ml-15">{{ $t("releaseGoods.goodsSpecTips") }}</span
                        ><span class="ml-15">{{ $t("releaseGoods.imgPropertySize") }}: **X**</span>
                    </div>

                    <el-form :model="specDataList" ref="specForm" class="spec-form">
                        <div class="mb-25" v-for="(item, index) in specDataList.form" :key="index">
                            <div class="flex between vcenter mb-25 plr-25 ptb-15 bg-light-grey">
                                <div class="flex between vcenter " style="width: 50%;">
                                    <el-form-item :prop="`form.${index}.cnSpecName`" :rules="rulesCommon.required">
                                        <el-select v-model="item.cnSpecName" disabled filterable allow-create :placeholder="$t('pleaseSelect')" style="width: 96%;">
                                            <el-option v-for="itemS in specOptionList" :key="itemS.id" :label="itemS.cnSpecName" :value="itemS.cnSpecName"> </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 是否可 属性自定义添加 -->
                                    <i :class="!item.isEdit ? 'el-icon-lock' : 'el-icon-unlock'" class="fs-18"></i>
                                </div>
                                <div>
                                    <el-checkbox v-if="index === 0" v-model="item.isPictureUpload" disabled :true-label="1" :false-label="0">
                                        {{ $t("releaseGoods.addImg") }}
                                    </el-checkbox>
                                </div>
                            </div>

                            <el-row :gutter="40">
                                <el-col v-for="(itemSpec, i) in item.specValues" :key="i" :span="12">
                                    <div class="flex vcenter mb-25">
                                        <el-checkbox v-model="itemSpec.isChecked" disabled :true-label="1" :false-label="0" class="mr-10"></el-checkbox>
                                        <div class="flex flex1">
                                            <el-form-item :prop="`form.${index}.specValues.${i}.cnName`" :rules="rulesCommon.required" class="w-100 mb-0">
                                                <el-input v-model="itemSpec.cnName" disabled />
                                            </el-form-item>
                                            <el-input
                                                v-if="!itemSpec.isCustom"
                                                disabled
                                                type="text"
                                                :placeholder="$t('remark')"
                                                v-model="itemSpec.remarks"
                                                maxlength="15"
                                                class="ml-10"
                                                show-word-limit
                                            />
                                        </div>
                                        <!-- index=0 只能第一个有图片 -->
                                        <BmImage v-if="item.isPictureUpload && index === 0" :src="itemSpec.picture" style="width:30px;height:30px" class="ml-10" />
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                    <!-- 批量设置 -->
                    <el-form :model="specTableList" ref="formPane2Ref" class="spec-table-form">
                        <el-table :data="specTableList.form" ref="multipleTable" border :row-class-name="tableRowClassName" class="table-bg-grey">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column width="80">
                                <template #header>
                                    <div>{{ $t("releaseGoods.preview") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        <BmImage :src="scope.row.picture" style="width:50px;height:50px" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-for="(item, index) in specColumnList" :key="index" :label="item.cnSpecName" min-width="120px">
                                <template #default="scope">
                                    <span :class="scope.row.isDelete ? 'through grey' : ''">
                                        {{ getSpecAttr(index, scope.$index)["cnName"] }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.goodsSkuCode") }}</div>
                                </template>
                                <template #default="scope">
                                    {{ scope.row.skuCode }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="isEdit" width="160">
                                <template #header>
                                    TSIN/FNSKU
                                </template>
                                <template #default="scope">
                                    TSIN: {{ scope.row.tsin }} <br />
                                    FNSKU: {{ scope.row.fnsku }} <br />
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.internationalCode") }}</div>
                                </template>
                                <template #default="scope">
                                    {{ scope.row.internationalCode }}
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.quantityInStock") }}</div>
                                </template>
                                <template #default="scope">
                                    {{ scope.row.stockNum }}
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.unitPrice") }}</div>
                                </template>
                                <template #default="scope">
                                    {{ scope.row.price }}
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.condition") }}</div>
                                </template>
                                <template #default="scope">
                                    {{ scope.row.type == 1 ? $t("releaseGoods.wholeNew") : $t("releaseGoods.secondHand") }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160px">
                                <template #header>
                                    <div>{{ $t("releaseGoods.shipment") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :{{ scope.row.sendWeight }}
                                        {{ scope.row.sendWeightUnit }}
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :{{ scope.row.sendVolumeLength }} X {{ scope.row.sendVolumeWidth }} X {{ scope.row.sendVolumeHeight }} =
                                        {{ scope.row.sendVolumeLength * scope.row.sendVolumeWidth * scope.row.sendVolumeHeight }}
                                        {{ scope.row.sendVolumeUnit }}³
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160px">
                                <template #header>
                                    <div>{{ $t("releaseGoods.packageWV") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :{{ scope.row.packingWeight }}
                                        {{ scope.row.packingWeightUnit }}
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :{{ scope.row.packingVolumeLength }} X {{ scope.row.packingVolumeWidth }} X {{ scope.row.packingVolumeHeight }} =
                                        {{ scope.row.packingVolumeLength * scope.row.packingVolumeWidth * scope.row.packingVolumeHeight }}
                                        {{ scope.row.packingVolumeUnit }}³
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160px">
                                <template #header>
                                    <div>{{ $t("releaseGoods.netWeightVolume") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :{{ scope.row.cleanWeight }}
                                        {{ scope.row.cleanWeightUnit }}
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :{{ scope.row.cleanVolumeLength }} X {{ scope.row.cleanVolumeWidth }} X {{ scope.row.cleanVolumeHeight }} =
                                        {{ scope.row.cleanVolumeLength * scope.row.cleanVolumeWidth * scope.row.cleanVolumeHeight }}
                                        {{ scope.row.cleanVolumeUnit }}³
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </el-tab-pane>

                <!-- 描述详情 -->
                <el-tab-pane name="title3" class="pane-3">
                    <template #label>
                        <el-badge type="danger">{{ $t("releaseGoods.describeTheDetails") }}</el-badge>
                    </template>
                    <el-form :model="formPane3" ref="formPane3Ref" label-position="top">
                        <EditCategory :option="categoryOption" />

                        <el-form-item prop="description">
                            <template #label>
                                <span class="fs-16 fw">
                                    {{ $t("releaseGoods.describeTheDetails") }}
                                </span>
                            </template>
                            <div class="components-container">
                                <div v-html="formPane3.description" style="height:300px;overflow: auto;" class="p-15 round-4 border"></div>
                            </div>
                        </el-form-item>
                        <el-form-item prop="detailsPics">
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.detailImg") }}</span>
                            </template>
                            <div class="flex">
                                <BmImage
                                    v-for="item in formPane3.detailsPics"
                                    :src="item.imgUrl"
                                    :key="item.id"
                                    style="width:120px;height:120px"
                                    class="m-10 border"
                                    :preview-src-list="formPane3.detailsPics.map((item) => item.imgUrl)"
                                />
                                <div class="flex1 m-15" style="line-height: 1.6;min-width: 300px;" v-html="$t('releaseGoods.imageLimit')"></div>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <!-- 合规信息 -->
                <el-tab-pane name="title4" class="pane-4">
                    <template #label>
                        <el-badge type="danger">{{ $t("releaseGoods.complianceInformation") }}</el-badge>
                    </template>
                    <div>
                        <EditCategory :option="categoryOption" />

                        <el-form :model="formPane4" ref="formPane4Ref" label-width="120px">
                            <el-form-item prop="isCharge" :rules="rulesCommon.required" :label="$t('goodsListTable.isCharge')">
                                <el-radio-group v-model="formPane4.isCharge" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="isHazardousArticle" :rules="rulesCommon.required" :label="$t('goodsListTable.isHazardousArticle')">
                                <el-radio-group v-model="formPane4.isHazardousArticle" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="isContainsPowder" :rules="rulesCommon.required" :label="$t('goodsListTable.isContainsPowder')">
                                <el-radio-group v-model="formPane4.isContainsPowder" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="isFluid" :rules="rulesCommon.required" :label="$t('goodsListTable.isFluid')">
                                <el-radio-group v-model="formPane4.isFluid" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="isPorcelain" :rules="rulesCommon.required" :label="$t('goodsListTable.isMagnetism')">
                                <el-radio-group v-model="formPane4.isPorcelain" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="maxBuy" :rules="rulesCommon.required" :label="$t('goodsList.orderMaxNum')">
                                <el-input type="number" style="width: 594px;" v-model="formPane4.maxBuy" disabled></el-input>
                                <small> “ 0 ” {{ $t("goodsList.dontPurchase") }}</small>
                            </el-form-item>
                            <el-form-item prop="countryId" :label="$t('goodsList.country')">
                                <el-select v-model="formPane4.countryId" disabled :placeholder="$t('pleaseSelect')" style="width: 594px;">
                                    <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- 关键字 -->
                <el-tab-pane :name="$t('releaseGoods.keyword')">
                    <template #label>
                        <el-badge type="danger">
                            {{ $t("releaseGoods.keyword") }}
                        </el-badge>
                    </template>
                    <EditCategory :option="categoryOption" />

                    <el-form :model="formPane5" ref="formPane5Ref" label-position="top">
                        <el-form-item>
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.searchKeyword") }}</span>
                            </template>
                            <el-input type="textarea" :rows="3" resize="none" v-model="formPane5.keyword" disabled :placeholder="$t('releaseGoods.moreKeyword')"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.purpose") }}</span>
                            </template>
                            <el-input show-word-limit maxlength="200" v-model="formPane5.specialPurpose" disabled :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.fitPeople") }}</span>
                            </template>
                            <el-select v-model="formPane5.forPeople" disabled :placeholder="$t('pleaseSelect')">
                                <el-option v-for="item in dictsList.intended_for" :value="item.value" :label="item.label" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <!-- 服务与承诺 -->
                <el-tab-pane name="title6" class="pane-6">
                    <template #label>
                        <el-badge type="danger">
                            {{ $t("releaseGoods.serviceAndCommitment") }}
                        </el-badge>
                    </template>
                    <EditCategory :option="categoryOption" />

                    <el-form :model="formPane6" :rules="rulePane6" ref="formPane6Ref" label-width="120px">
                        <el-form-item :label="$t('goodsList.type')" prop="goodsType">
                            <el-radio-group v-model="formPane6.goodsType" disabled>
                                <el-radio v-for="item in dictsList.product_type" :label="item.value" :key="item.id">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('releaseGoods.distribution')" prop="deliveryType">
                            <el-radio-group v-model="formPane6.deliveryType" disabled>
                                <el-radio v-for="item in dictsList.distribution_type" :label="item.value" :key="item.id">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('goodsList.isPresell')" prop="isOpenPresell">
                            <el-radio-group v-model="formPane6.isOpenPresell" disabled>
                                <el-radio label="1">{{ $t("releaseGoods.notPresell") }}</el-radio>
                                <!-- <el-radio label="2">{{$t('goodsList.presell')}}</el-radio> -->
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-show="formPane6.deliveryType == 1" :label="$t('releaseGoods.promisedDelivery')" prop="promisedDeliveryTime">
                            <el-radio-group v-model="formPane6.promisedDeliveryTime" disabled>
                                <el-radio v-for="item in dictsList.promised_delivery_time" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('releaseGoods.inventoryPiece')" prop="stockDeductType">
                            <el-radio-group v-model="formPane6.stockDeductType" disabled>
                                <el-radio :label="1">
                                    {{ $t("releaseGoods.paymentDestocking") }}
                                </el-radio>
                            </el-radio-group>
                            <!-- <div class="bg-light-grey plr-15">
                                (下单减库存,
                                <span class="orange"> 存在恶拍风险</span>
                                付款减库存,
                                <span class="orange">
                                    存在超卖风险 
                                </span>
                                FBT商品默认付款减库存
                            </div> -->
                        </el-form-item>
                        <el-form-item :label="$t('releaseGoods.payDelivery')" prop="isCashDelivery">
                            <el-radio-group v-model="formPane6.isCashDelivery" disabled>
                                <el-radio :label="0">{{ $t("status.notSupport") }}</el-radio>
                                <el-radio :label="1">{{ $t("status.support") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('releaseGoods.transport')" prop="transportMode">
                            <el-checkbox-group v-model="formPane6.transportMode" disabled>
                                <el-checkbox :label="1">{{ $t("releaseGoods.air") }}</el-checkbox>
                                <el-checkbox :label="2">{{ $t("releaseGoods.sea") }}</el-checkbox>
                                <el-checkbox :label="3">{{ $t("releaseGoods.land") }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item :label="$t('releaseGoods.freight')">
                            <template #label>
                                <span class="fs-14 fw">{{ $t("releaseGoods.freight") }}</span>
                            </template>
                            <div v-for="item in freightTemplateList" :key="item.id" class="bg-light-grey mb-15 p-15">
                                <div
                                    v-html="
                                        $t('releaseGoods.fees', {
                                            name: '<span class=orange> ' + item.remark + ' </span>'
                                        })
                                    "
                                ></div>
                                <el-table :data="item.payAreas" border :show-header="false">
                                    <el-table-column prop="weightMin" width="200">
                                        <template #default="scope"> {{ scope.row.weightMin }}kg &#60; {{ $t("releaseGoods.weight") }} ≤ {{ scope.row.weightMax }} kg </template>
                                    </el-table-column>
                                    <el-table-column prop="firstWeight">
                                        <template #default="scope">
                                            {{ $t("releaseGoods.firstWeight") }}{{ scope.row.firstWeight }}kg,
                                            {{ $t("releaseGoods.firstCharge") }}
                                            {{ $store.state.app.currencySymbol }}{{ scope.row.firstWeightFreight }} ;
                                            {{ $t("releaseGoods.toContinue") }}
                                            {{ scope.row.addUnitWeight }}kg, {{ $t("releaseGoods.renew") }}{{ $store.state.app.currencySymbol }}{{ scope.row.addWeightFreight }};
                                            {{ $t("releaseGoods.packaging") }}
                                            {{ $store.state.app.currencySymbol }}{{ scope.row.materialsCost }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-form-item>

                        <el-form-item :label="$t('releaseGoods.inventoryPiece')">
                            <template #label>
                                <span class="fs-14 fw">{{ $t("releaseGoods.inventoryPiece") }}</span>
                            </template>
                            <div class="flex mb-10">
                                <div class="serve-item">{{ $t("goodsList.common") }}</div>
                                <div class="serve-item ml-10">
                                    {{ $t("releaseGoods.notPresell") }}
                                </div>
                                <div v-show="formPane6.deliveryType == 1" class="serve-item ml-10">
                                    {{
                                        $t("releaseGoods.promisedTime", {
                                            time: formPane6.promisedDeliveryTime
                                        })
                                    }}
                                </div>
                            </div>

                            <el-checkbox-group v-model="formPane6.servicesSelected" disabled>
                                <el-checkbox v-for="item in formPane6.services" :key="item.id" :label="item.id"> {{ item.title }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <!-- 更多信息 -->
                <el-tab-pane name="title7" class="pane-7">
                    <template #label>
                        <el-badge type="danger">
                            {{ $t("releaseGoods.moreInformation") }}
                        </el-badge>
                    </template>
                    <EditCategory :option="categoryOption" />

                    <div class="mb-25">
                        {{ $t("releaseGoods.accurateFill") }}
                    </div>

                    <el-form :model="formPane7" ref="formPane7Ref" label-position="top">
                        <!-- 1 字符串 2自然数 3日期 4货币 5浮点数 6 select单选 7布尔 8 时间 9select多选-->
                        <el-form-item v-for="(item, index) in formPane7.attrs" :key="index" :prop="`attrs.${index}.attrValue`">
                            <template #label>
                                <span class="fs-14 fw">{{ item.title }}</span>
                            </template>
                            <el-input
                                v-if="item.mode === 1"
                                v-model="item.attrValue"
                                disabled
                                :class="{ 'w-50': item.isUnit }"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('pleaseEnter')"
                            ></el-input>
                            <el-input
                                v-if="item.mode === 2"
                                v-model="item.attrValue"
                                disabled
                                type="number"
                                step="1"
                                :class="{ 'w-50': item.isUnit }"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('pleaseEnter')"
                            ></el-input>
                            <el-date-picker
                                v-if="item.mode === 3"
                                v-model="item.attrValue"
                                disabled
                                type="date"
                                :class="item.isUnit ? 'w-50' : 'w-100'"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('releaseGoods.selectDate')"
                            >
                            </el-date-picker>
                            <el-input
                                v-if="item.mode === 4"
                                v-model="item.attrValue"
                                disabled
                                type="number"
                                step="0.01"
                                :min="0"
                                :class="{ 'w-50': item.isUnit }"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('pleaseEnter')"
                            ></el-input>
                            <el-input
                                v-if="item.mode === 5"
                                v-model="item.attrValue"
                                disabled
                                type="number"
                                step="0.1"
                                :class="{ 'w-50': item.isUnit }"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('pleaseEnter')"
                            ></el-input>
                            <el-select
                                v-if="item.mode === 6"
                                v-model="item.attrValue"
                                disabled
                                :class="{ 'w-50': item.isUnit }"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('pleaseSelect')"
                            >
                                <el-option v-for="value in item.paramValueArr" :key="value" :label="value" :value="value"> </el-option>
                            </el-select>
                            <el-radio-group v-if="item.mode === 7" v-model="item.attrValue" disabled :class="{ 'w-50': item.isUnit }" :rules="item.isRequired ? rulesCommon.required : ''">
                                <el-radio v-for="value in item.paramValueArr" :key="value" :label="value">
                                    {{ value }}
                                </el-radio>
                            </el-radio-group>
                            <el-date-picker
                                v-if="item.mode === 8"
                                v-model="item.attrValue"
                                disabled
                                type="datetime"
                                :class="item.isUnit ? 'w-50' : 'w-100'"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('releaseGoods.selectDateTime')"
                            >
                            </el-date-picker>
                            <el-select
                                v-if="item.mode === 9"
                                v-model="item.attrValue"
                                disabled
                                multiple
                                :class="{ 'w-50': item.isUnit }"
                                :rules="item.isRequired ? rulesCommon.required : ''"
                                :placeholder="$t('pleaseSelect')"
                            >
                                <el-option v-for="value in item.paramValueArr" :key="value" :label="value" :value="value"> </el-option>
                            </el-select>

                            <!-- 单位 -->
                            <el-select v-if="item.isUnit" v-model="item.unit" disabled :placeholder="$t('pleaseSelect')" class="w-50 pl-15">
                                <el-option v-for="value in item.paramValueArr" :key="value" :label="value" :value="value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="$emit('update:visible', false)" class="mr-10">
                    {{ $t("close") }}
                </el-button>

                <!-- （row.examineStatus 1待审核 2已通过 3驳回） -->
                <template v-if="row.examineStatus == 1">
                    <el-button
                        @click="
                            examineStatus = 3;
                            auditVisible = true;
                        "
                        type="primary"
                        plain
                    >
                        {{ $t("status.auditRejected") }}
                    </el-button>
                    <el-button
                        @click="
                            examineStatus = 2;
                            auditVisible = true;
                        "
                        type="primary"
                    >
                        {{ $t("status.auditPass") }}
                    </el-button>
                </template>
            </div>
        </template>
    </BmDialog>

    <!-- 批量审核 -->
    <Audit v-model:visible="auditVisible" :rows="[row]" :examineStatus="examineStatus" @reloadData="reloadData" />
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import {
    listGoodsSpecModelByCategoryId,
    getDictsByTypes,
    baseAreaFindByParentId,
    findFreightTemplateList,
    mmsGoodsAttributeListGoodsAttributeByCategoryId,
    isRightful,
    goodsMallGet,
    brandListCanUse,
    categoryGetPath
} from "@/api/goods";
import { deepClone } from "@/utils/index";

import EditCategory from "./editCategory";
import Audit from "./audit";

export default {
    name: "goodsInfoDetail",
    components: { EditCategory, Audit },
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        const isEdit = props.row.goodsId ? true : false;

        let activeName = ref("title1");

        let categoryOption = reactive({
            lable: "", //分类标题
            id: props.row.categoryId, //分类id
            percentage: "" //分类抽佣比例
        });

        function initData() {
            getListGoodsSpec();
            getMmsGoodsAttributeListGoodsAttributeByCategoryId();
        }
        initData();

        const getData = (id) => {
            return new Promise(function(reslove, reject) {
                goodsMallGet(id).then((res) => {
                    console.log(res);
                    let data = res.data;
                    formPane1.goodTitle = data.goodTitle;
                    formPane1.goodCode = data.goodCode;
                    formPane1.brandId = data.brandId;

                    formPane1.mainPictureUrl = data.mainPictureUrl;
                    formPane1.videoUrl = data.videoUrl;

                    specOptionList.value = deepClone(data.specs);
                    specColumnList.value = specOptionList.value;

                    specDataList.form = data.specs;
                    specTableList.form = data.skus;
                    //data.specs

                    formPane3.description = data.description;

                    formPane4.isCharge = data.isCharge;
                    formPane4.isContainsPowder = data.isContainsPowder;
                    formPane4.isFluid = data.isFluid;
                    formPane4.isHazardousArticle = data.isHazardousArticle;
                    formPane4.isPorceLain = data.isPorcelain;
                    formPane4.maxBuy = data.maxBuy;
                    formPane4.countryId = data.countryId;

                    formPane5.keyword = data.keyword;
                    formPane5.specialPurpose = data.specialPurpose;
                    formPane5.forPeople = data.forPeople;

                    formPane6.goodsType = data.goodsType + "";
                    formPane6.deliveryType = data.deliveryType + "";
                    formPane6.isOpenPresell = data.isOpenPresell + "";
                    formPane6.promisedDeliveryTime = data.promisedDeliveryTime;
                    formPane6.stockDeductType = data.stockDeductType;
                    formPane6.isCashDelivery = data.isCashDelivery;
                    formPane6.shippingFeeId = data.shippingFeeId;
                    formPane6.transportMode = data.transportMode.split(",").map((item) => Number(item));
                    formPane6.services = data.services;

                    let servicesTmp = [];
                    data.services.forEach((item) => {
                        if (item.isRequired == 1) servicesTmp.push(item.id);
                    });
                    formPane6.servicesSelected = servicesTmp;

                    formPane7.attrs.forEach((item) => {
                        data.attrs.forEach((aitem) => {
                            if (item.modelAttrId === aitem.modelAttrId) {
                                item.attrValue = item.mode === 9 ? aitem.attrValue.split(",") : aitem.attrValue;
                            }
                        });
                    });

                    formPane1.carouselMapUrls = res.data.carouselMapUrls.map((item) => {
                        item.url = item.imgUrl;
                        return item;
                    });

                    formPane3.detailsPics = data.detailsPics.map((item) => {
                        item.url = item.imgUrl;
                        return item;
                    });

                    reslove();
                });
            });
        };
        //初始化
        const AsyncList = () => {
            let goodsId = props.row.goodsId;
            getData(goodsId).then(() => {
                getBrandListCanUse(); //品牌
                getFindFreightTemplateList(); //运费模板
                getCategoryGetPath(); //分类路径
            });
        };
        AsyncList();

        //获取数据字典
        let dictsList = ref([]);
        const getDictsList = () => {
            //适用人群/承诺发货时间/配送类型/商品类型
            getDictsByTypes("intended_for,promised_delivery_time,distribution_type,product_type")
                .then((res) => {
                    dictsList.value = res.data;
                })
                .catch((err) => {});
        };
        getDictsList();

        //获取品牌列表
        let brandList = ref([]);
        function getBrandListCanUse() {
            brandListCanUse()
                .then((res) => {
                    brandList.value = res.data;
                    const brandIds = res.data.map((item) => item.id);
                    if (brandIds.indexOf(formPane1.brandId) === -1) {
                        formPane1.brandId = "";
                    }
                })
                .catch((err) => {});
        }
        // getBrandListCanUse();

        //获取原产国/地区列表
        let countryList = ref([]);
        const getBaseAreaFindByParentId = () => {
            baseAreaFindByParentId()
                .then((res) => {
                    countryList.value = res.data;
                })
                .catch((err) => {});
        };
        getBaseAreaFindByParentId();

        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" },
            isSelect: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" }
        });

        const checkisRightful = () => {
            if (formPane1.goodTitle === "") {
                proxy.$message.error(proxy.$t("pleaseEnter"));
                return;
            }
            isRightful({ content: formPane1.goodTitle }).then((res) => {
                console.log(res);
                if (res.code === 0) {
                    proxy.$message.success(proxy.$t(res.msg));
                } else {
                    proxy.$message.error(proxy.$t(res.msg));
                }
            });
        };

        //------------------------------基本信息---------------------------

        let formPane1Ref = ref(null);
        const formPane1 = reactive({
            goodTitle: "",
            goodCode: "",
            brandId: "",
            videoUrl: "",
            carouselMapUrls: [], //轮播图
            mainPictureUrl: "" //主图
        });
        const rulePane1 = {
            goodTitle: [{ required: true, message: proxy.$t("required"), trigger: "blur" }],
            brandId: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            // videoUrl: [{ required: true, message: proxy.$t('pleaseSelect'), trigger: "change" }],
            carouselMapUrls: [
                {
                    type: "array",
                    required: true,
                    message: proxy.$t("pleaseSelect"),
                    trigger: "change"
                }
            ]
        };

        //-----------------------------销售规格-----------------------------

        let specOptionList = ref([]); //规格选项下拉
        let specDataList = reactive({
            form: [] //规格表单集合
        });
        //默认规格
        const specValues = {
            isCustom: true, //是否自定义
            isChecked: 1, //是否选中
            cnName: "",
            enName: "",
            id: "",
            picture: "",
            remarks: "",
            sort: 0,
            specId: ""
        };
        const specDefault = {
            id: "",
            cnSpecName: "",
            enSpecName: "",
            isEdit: 1,
            isPicture: 1, //是否允许添加图片
            isPictureUpload: 0, //卖家是否必传图片
            isSellerUploadPicture: 0, //卖家是否可更换图片
            remarks: "",
            sort: 0,
            specValues: [deepClone(specValues)]
        };
        function getListGoodsSpec() {
            listGoodsSpecModelByCategoryId({ categoryId: categoryOption.id })
                .then((res) => {
                    if (res.data.length > 0) {
                        const data = res.data.map((item) => {
                            (item.isPictureUpload = 1), //卖家是否必传图片
                                (item.specValues = item.specValues.map((item) => {
                                    item.isChecked = 1;
                                    return item;
                                }));
                            return item;
                        });
                        specDataList.form = [deepClone(data[0])];
                        specOptionList.value = data;
                    } else {
                        specDataList.form.push(deepClone(specDefault));
                    }
                })
                .catch((err) => {});
        }

        //SKU添加
        let specForm = ref(null);
        let formPane2Ref = ref(null);
        let specTableList = reactive({ form: [] });
        let specColumnList = ref([]);

        const getSpecAttr = (specIndex, index) => {
            // 获取当前规格项目下的属性值
            const currentValues = specColumnList.value[specIndex].specValues;
            let indexCopy;
            // 判断是否是最后一个规格项目
            if (specColumnList.value[specIndex + 1] && specColumnList.value[specIndex + 1].specValues.length) {
                indexCopy = index / countSum(specIndex + 1);
            } else {
                indexCopy = index;
            }
            const i = Math.floor(indexCopy % currentValues.length);
            if (i.toString() !== "NaN") {
                return {
                    ...currentValues[i],
                    cnName: currentValues[i].cnName,
                    enName: currentValues[i].cnName
                };
            } else {
                return {};
            }
        };

        // 计算规格的乘积
        const countSum = (index) => {
            let num = 1;
            specDataList.form.forEach((item, j) => {
                if (j >= index && item.specValues.length) {
                    num *= item.specValues.length;
                }
            });
            return num;
        };

        //批量修改-重量/体积
        let batchWeightVisible = ref(false);
        let batchWeightTitle = ref("");

        //批量删除/恢复
        const tableRowClassName = ({ row, rowIndex }) => {
            if (row.isDelete === 1) {
                return "bg-light-grey";
            }
            return "";
        };

        //-----------------------------描述详情-----------------------------

        let formPane3Ref = ref(null);
        const formPane3 = reactive({
            description: "",
            detailsPics: []
        });

        //------------------------------合规信息-----------------------------

        let formPane4Ref = ref(null);
        const formPane4 = reactive({
            isCharge: 0,
            isContainsPowder: 0,
            isFluid: 0,
            isHazardousArticle: 0,
            isPorcelain: 0,
            maxBuy: 0, //订单商品最大数量 (0不限购 其他数限购数量)
            countryId: "" //原产国id
        });

        //------------------------------------关键字----------------------------------

        const formPane5 = reactive({
            keyword: "",
            specialPurpose: "",
            forPeople: "1"
        });

        //------------------------------------服务与承诺----------------------------------

        let formPane6Ref = ref(null);
        const formPane6 = reactive({
            goodsType: "1", //商品类型（1 普通商品 2虚拟商品）
            deliveryType: "1", //配送类型
            isOpenPresell: "1", //是否支持预售( 0否 1是)
            promisedDeliveryTime: "24", //承诺发货时间（24小时 48小时 72小时）
            stockDeductType: 1, //库存扣减类型（ 1付款减库存）
            isCashDelivery: 0, //货到付款
            transportMode: [1, 2, 3], //运输方式（1空运 2海运 3 陆运 ）多个用逗号隔开
            shippingFeeId: "", //运费模板id 多个用逗号隔开
            servicesSelected: [], //选中的集合
            services: [] //售后服务承诺
        });

        //获取运费模板
        let freightTemplateList = ref([]);
        function getFindFreightTemplateList() {
            if (formPane6.shippingFeeId) {
                findFreightTemplateList({
                    ids: formPane6.shippingFeeId,
                    deliveryType: formPane6.deliveryType
                })
                    .then((res) => {
                        freightTemplateList.value = res.data;
                    })
                    .catch((err) => {});
            }
        }

        const rulePane6 = reactive({
            goodsType: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            deliveryType: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            isOpenPresell: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            promisedDeliveryTime: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            stockDeductType: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            isCashDelivery: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            transportMode: [
                {
                    type: "array",
                    required: true,
                    message: proxy.$t("pleaseSelect"),
                    trigger: "change"
                }
            ]
        });

        //------------------------------------更多信息----------------------------------

        let formPane7 = reactive({
            attrs: []
        });
        let formPane7Ref = ref(null);
        function getMmsGoodsAttributeListGoodsAttributeByCategoryId() {
            mmsGoodsAttributeListGoodsAttributeByCategoryId({ categoryId: categoryOption.id })
                .then((res) => {
                    formPane7.attrs = res.data.map((item) => {
                        let paramValueArr = [];
                        if (item.paramValue) {
                            paramValueArr = item.paramValue.split(",");
                        }
                        item = {
                            ...item,
                            attrName: item.title, //属性名
                            attrValue: "", //属性值
                            paramValueArr: paramValueArr, //单位或值 的选项
                            id: "",
                            modelAttrId: item.id, //商品参数模板id
                            unit: item.paramValue ? item.paramValue.split(",")[0] : "" //单位
                        };
                        return item;
                    });
                })
                .catch((err) => {});
        }

        //获取分类路径、抽佣比例
        function getCategoryGetPath() {
            categoryGetPath(props.row.categoryId)
                .then((res) => {
                    categoryOption.lable = res.data.map((item) => item.cnName).join(">");
                    categoryOption.percentage = res.data[res.data.length - 1].commissionPercentage;
                })
                .catch((err) => {});
        }

        //审核
        let auditVisible = ref(false);
        let examineStatus = ref(""); //审核状态
        const reloadData = () => {
            emit("reloadData");
            emit("update:visible", false);
        };

        return {
            isEdit,

            activeName,
            rulesCommon,

            categoryOption,

            dictsList,
            brandList,
            countryList,
            formPane1Ref,
            formPane1,
            rulePane1,

            specOptionList,
            specDataList,
            specForm,
            formPane2Ref,
            specTableList,
            specColumnList,
            getSpecAttr,
            batchWeightVisible,
            batchWeightTitle,
            tableRowClassName,

            formPane3Ref,
            formPane3,

            formPane4Ref,
            formPane4,

            formPane5,

            formPane6Ref,
            formPane6,
            rulePane6,
            freightTemplateList,

            formPane7,
            formPane7Ref,

            checkisRightful,

            auditVisible,
            examineStatus,
            reloadData
        };
    }
};
</script>

<style lang="scss" scoped>
.sell {
    .title {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    .avatar-uploader {
        height: 33px;
    }

    ::v-deep(.avatar-uploader .el-upload) {
        border: 1px solid #cccccc;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .items_1 {
        flex-wrap: wrap;
    }
}
.pane-4 {
    .name {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
}
.pane-6 {
    .tips {
        // height: 48px;
        background: #fafafa;
        padding: 17px 11px 15px 18px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 17px;
    }

    .orange {
        color: #ff8248;
    }

    .serve-title {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    .serve-item {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        height: 31px;
        line-height: 31px;
        padding: 0px 15px 0px 15px;
        border: 1px solid #e8e8e8;
        border-radius: 2px;
    }
}
.pane-7 {
    .title-name {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
}

.editor-content {
    margin-top: 20px;
}
::v-deep(.avatar-uploader-icon_2) {
    font-size: 12px;
    color: #cccccc;
    width: 31px;
    height: 31px;
    line-height: 31px;
}
.avatar_2 {
    width: 31px;
    height: 31px;
    display: block;
}

.spec-form {
    ::v-deep(.el-form-item) {
        width: 100%;
        margin-bottom: 0;
    }
    ::v-deep(.el-form-item__content) {
        line-height: 1;
    }
}
.spec-table-form {
    ::v-deep(.el-form-item) {
        width: 100%;
        margin-bottom: 0;
        .el-form-item__error {
            display: none;
        }
    }
}
</style>
