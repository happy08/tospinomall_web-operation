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
                                <div v-if="updateGoodsInfo.goodTitle">
                                    <span class="grey">{{ $t("releaseGoods.beforeChange") }}：</span>
                                    {{ updateGoodsInfo.goodTitle }}
                                </div>
                            </el-form-item>
                            <el-form-item prop="goodCode">
                                <template #label>
                                    <span class="fs-16 fw">{{ $t("releaseGoods.goodsCode") }}</span>
                                </template>
                                <el-input v-model="formPane1.goodCode" disabled :placeholder="$t('pleaseEnter')"></el-input>
                                <div v-if="updateGoodsInfo.goodCode">
                                    <span class="grey"> {{ $t("releaseGoods.beforeChange") }}： </span>
                                    {{ updateGoodsInfo.goodCode }}
                                </div>
                            </el-form-item>
                            <el-form-item prop="brandId">
                                <template #label>
                                    <span class="fs-16 fw">{{ $t("releaseGoods.goodsBrand") }}</span>
                                </template>
                                <el-select v-model="formPane1.brandId" disabled :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                                </el-select>
                                <div v-if="updateGoodsInfo.brandId">
                                    <span class="grey"> {{ $t("releaseGoods.beforeChange") }}： </span>
                                    <el-select v-model="updateGoodsInfo.brandId" disabled :placeholder="$t('pleaseSelect')">
                                        <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <!-- 商品视频 -->
                            <el-form-item prop="videoUrl">
                                <template #label>
                                    <span class="fs-16 fw">
                                        {{ $t("releaseGoods.goodsSlideshow") }}
                                    </span>
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
                                <div v-if="updateGoodsInfo.videoUrl" class="flex p-20 bg-light-grey">
                                    <span class="grey"> {{ $t("releaseGoods.beforeChange") }}： </span>
                                    <div class="flex flex1">
                                        <video v-if="updateGoodsInfo.videoUrl" :src="updateGoodsInfo.videoUrl" width="148" height="148" controls></video>
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
                                </div>
                            </el-form-item>
                            <!-- 商品轮播图 -->
                            <el-form-item prop="carouselMapUrls">
                                <template #label>
                                    <span class="fs-16 fw">
                                        {{ $t("releaseGoods.goodsBanner") }}
                                    </span>
                                </template>
                                <div class="flex">
                                    <div>
                                        <BmImage
                                            v-for="item in formPane1.carouselMapUrls"
                                            :src="item.imgUrl"
                                            :key="item.id"
                                            style="width:120px;height:120px"
                                            class="mr-10 mb-10 border"
                                            :preview-src-list="formPane1.carouselMapUrls.map((item) => item.imgUrl)"
                                        />
                                    </div>
                                    <div class="flex1 m-15" style="line-height: 1.6;min-width: 300px;" v-html="$t('releaseGoods.imageLimit')"></div>
                                </div>

                                <div v-if="updateGoodsInfo.carouselMapUrls" class="plr-20 bg-light-grey">
                                    <div class="grey">{{ $t("releaseGoods.beforeChange") }}：</div>
                                    <BmImage
                                        v-for="item in updateGoodsInfo.carouselMapUrls"
                                        :src="item.imgUrl"
                                        :key="item.id"
                                        style="width:120px;height:120px"
                                        class="mr-10 mb-10 border"
                                        :preview-src-list="updateGoodsInfo.carouselMapUrls.map((item) => item.imgUrl)"
                                    />
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
                    <!-- 商品规格 -->
                    <el-form :model="specDataList" ref="specForm" class="spec-form">
                        <div class="mb-25" v-for="(item, index) in specDataList.form" :key="index">
                            <div class="flex between vcenter mb-25 plr-25 ptb-15 bg-light-grey">
                                <div class="flex between vcenter " style="width: 50%;">
                                    <el-form-item :prop="`form.${index}.cnSpecName`" :rules="rulesCommon.required">
                                        <el-select v-model="item.cnSpecName" disabled filterable allow-create :placeholder="$t('pleaseSelect')" style="width: 96%;">
                                            <el-option v-for="itemS in specOptionList" :key="itemS.id" :label="itemS.cnSpecName" :value="itemS.cnSpecName"> </el-option>
                                        </el-select>
                                    </el-form-item>
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
                                        <BmImage
                                            v-if="item.isPictureUpload && index === 0"
                                            :src="itemSpec.picture"
                                            :preview-src-list="[itemSpec.picture]"
                                            style="width:30px;height:30px"
                                            class="ml-10"
                                        />
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>

                    <!-- 批量设置 -->
                    <el-form :model="specTableList" ref="formPane2Ref" class="spec-table-form">
                        <el-table :data="specTableList.form" ref="multipleTable" border :row-class-name="tableRowClassName" class="table-bg-grey">
                            <el-table-column v-if="isChange" width="100">
                                <template #default="scope"> {{ scope.row.updateTypeName }}</template>
                            </el-table-column>
                            <el-table-column width="80">
                                <template #header>
                                    <div>{{ $t("releaseGoods.preview") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        <BmImage :src="scope.row.picture" :preview-src-list="[scope.row.picture]" style="width:50px;height:50px" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-for="(item, index) in specColumnList" :key="index" :label="item.cnSpecName" min-width="120px">
                                <template #default="scope">
                                    <span :class="scope.row.isDelete ? 'through grey' : ''">
                                        {{ getSpecAttrDetail(index, scope.$index) }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.goodsSkuCode") }}</div>
                                </template>
                                <template #default="scope">
                                    <span
                                        :class="{
                                            red: scope.row.updateField && scope.row.updateField.includes('skuCode')
                                        }"
                                    >
                                        {{ scope.row.skuCode }}
                                    </span>
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
                                    <span
                                        :class="{
                                            red: scope.row.updateField && scope.row.updateField.includes('internationalCode')
                                        }"
                                    >
                                        {{ scope.row.internationalCode }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.quantityInStock") }}</div>
                                </template>
                                <template #default="scope">
                                    <span
                                        :class="{
                                            red: scope.row.updateField && scope.row.updateField.includes('stockNum')
                                        }"
                                    >
                                        {{ scope.row.stockNum }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.unitPrice") }}</div>
                                </template>
                                <template #default="scope">
                                    <span
                                        :class="{
                                            red: scope.row.updateField && scope.row.updateField.includes('price')
                                        }"
                                    >
                                        {{ scope.row.price }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column width="160">
                                <template #header>
                                    <div>{{ $t("releaseGoods.condition") }}</div>
                                </template>
                                <template #default="scope">
                                    <span
                                        :class="{
                                            red: scope.row.updateField && scope.row.updateField.includes('type')
                                        }"
                                    >
                                        {{ scope.row.type == 1 ? $t("releaseGoods.wholeNew") : $t("releaseGoods.secondHand") }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160px">
                                <template #header>
                                    <div>{{ $t("releaseGoods.shipment") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('sendWeight')
                                            }"
                                        >
                                            {{ scope.row.sendWeight }}
                                        </span>
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('sendWeightUnit')
                                            }"
                                        >
                                            {{ scope.row.sendWeightUnit }}
                                        </span>
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('sendVolumeLength')
                                            }"
                                            >{{ scope.row.sendVolumeLength }}
                                        </span>
                                        X
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('sendVolumeWidth')
                                            }"
                                        >
                                            {{ scope.row.sendVolumeWidth }}
                                        </span>
                                        X
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('sendVolumeHeight')
                                            }"
                                        >
                                            {{ scope.row.sendVolumeHeight }}
                                        </span>
                                        =
                                        {{ scope.row.sendVolumeLength * scope.row.sendVolumeWidth * scope.row.sendVolumeHeight }}
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('sendVolumeUnit')
                                            }"
                                        >
                                            {{ scope.row.sendVolumeUnit }}³
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160px">
                                <template #header>
                                    <div>{{ $t("releaseGoods.packageWV") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('packingWeight')
                                            }"
                                        >
                                            {{ scope.row.packingWeight }}
                                        </span>
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('packingWeightUnit')
                                            }"
                                        >
                                            {{ scope.row.packingWeightUnit }}
                                        </span>
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('packingVolumeLength')
                                            }"
                                        >
                                            {{ scope.row.packingVolumeLength }}
                                        </span>
                                        X
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('packingVolumeWidth')
                                            }"
                                        >
                                            {{ scope.row.packingVolumeWidth }}
                                        </span>
                                        X
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('packingVolumeHeight')
                                            }"
                                        >
                                            {{ scope.row.packingVolumeHeight }}
                                        </span>
                                        =
                                        {{ scope.row.packingVolumeLength * scope.row.packingVolumeWidth * scope.row.packingVolumeHeight }}
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('packingVolumeUnit')
                                            }"
                                        >
                                            {{ scope.row.packingVolumeUnit }}³
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160px">
                                <template #header>
                                    <div>{{ $t("releaseGoods.netWeightVolume") }}</div>
                                </template>
                                <template #default="scope">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('cleanWeight')
                                            }"
                                        >
                                            {{ scope.row.cleanWeight }}
                                        </span>
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('cleanWeightUnit')
                                            }"
                                        >
                                            {{ scope.row.cleanWeightUnit }}
                                        </span>
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('cleanVolumeLength')
                                            }"
                                        >
                                            {{ scope.row.cleanVolumeLength }}
                                        </span>
                                        X
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('cleanVolumeWidth')
                                            }"
                                        >
                                            {{ scope.row.cleanVolumeWidth }}
                                        </span>
                                        X
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('cleanVolumeHeight')
                                            }"
                                        >
                                            {{ scope.row.cleanVolumeHeight }}
                                        </span>
                                        =
                                        {{ scope.row.cleanVolumeLength * scope.row.cleanVolumeWidth * scope.row.cleanVolumeHeight }}
                                        <span
                                            :class="{
                                                red: scope.row.updateField && scope.row.updateField.includes('cleanVolumeUnit')
                                            }"
                                        >
                                            {{ scope.row.cleanVolumeUnit }}³
                                        </span>
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
                                <div v-html="formPane3.description" style="height:300px;overflow: auto;" class="p-15 border"></div>
                            </div>
                            <div v-if="updateGoodsInfo.description" class="mt-20">
                                <span class="grey" style="white-space white-space"> {{ $t("releaseGoods.beforeChange") }}：</span>
                                <div v-html="updateGoodsInfo.description" style="height:300px;overflow: auto;" class="p-15 border"></div>
                            </div>
                        </el-form-item>
                        <el-form-item prop="detailsPics">
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.detailImg") }}</span>
                            </template>
                            <div class="flex">
                                <div>
                                    <BmImage
                                        v-for="item in formPane3.detailsPics"
                                        :src="item.imgUrl"
                                        :key="item.id"
                                        style="width:120px;height:120px"
                                        class="m-10 border"
                                        :preview-src-list="formPane3.detailsPics.map((item) => item.imgUrl)"
                                    />
                                </div>
                                <div class="flex1 m-15" style="line-height: 1.6;min-width: 300px;" v-html="$t('releaseGoods.imageLimit')"></div>
                            </div>
                            <div v-if="updateGoodsInfo.detailsPics" class=" plr-20 bg-light-grey">
                                <div class="grey">{{ $t("releaseGoods.beforeChange") }}：</div>
                                <BmImage
                                    v-for="item in updateGoodsInfo.detailsPics"
                                    :src="item.imgUrl"
                                    :key="item.id"
                                    style="width:120px;height:120px"
                                    class="mr-10 mb-10 border"
                                    :preview-src-list="updateGoodsInfo.detailsPics.map((item) => item.imgUrl)"
                                />
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
                            <el-form-item
                                v-if="typeof updateGoodsInfo.isCharge != 'undefined' && updateGoodsInfo.isCharge !== ''"
                                prop="isCharge"
                                :rules="rulesCommon.required"
                                :label="$t('goodsListTable.isCharge')"
                                class="bg-light-grey"
                            >
                                <el-radio-group v-model="updateGoodsInfo.isCharge" disabled>
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
                            <el-form-item
                                v-if="typeof updateGoodsInfo.isHazardousArticle != 'undefined' && updateGoodsInfo.isHazardousArticle !== ''"
                                :rules="rulesCommon.required"
                                :label="$t('goodsListTable.isHazardousArticle')"
                                class="bg-light-grey"
                            >
                                ({{ $t("releaseGoods.beforeChange") }}) ：
                                {{ updateGoodsInfo.isHazardousArticle == 1 ? $t("yes") : $t("no") }}
                            </el-form-item>

                            <el-form-item prop="isContainsPowder" :rules="rulesCommon.required" :label="$t('goodsListTable.isContainsPowder')">
                                <el-radio-group v-model="formPane4.isContainsPowder" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item
                                v-if="typeof updateGoodsInfo.isContainsPowder != 'undefined' && updateGoodsInfo.isContainsPowder !== ''"
                                prop="isContainsPowder"
                                :rules="rulesCommon.required"
                                :label="$t('goodsListTable.isContainsPowder')"
                                class="bg-light-grey"
                            >
                                ({{ $t("releaseGoods.beforeChange") }}) ：
                                {{ updateGoodsInfo.isContainsPowder == 1 ? $t("yes") : $t("no") }}
                            </el-form-item>

                            <el-form-item prop="isFluid" :rules="rulesCommon.required" :label="$t('goodsListTable.isFluid')">
                                <el-radio-group v-model="formPane4.isFluid" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item
                                v-if="typeof updateGoodsInfo.isFluid != 'undefined' && updateGoodsInfo.isFluid !== ''"
                                prop="isFluid"
                                :rules="rulesCommon.required"
                                :label="$t('goodsListTable.isFluid')"
                                class="bg-light-grey"
                            >
                                ({{ $t("releaseGoods.beforeChange") }}) ：
                                {{ updateGoodsInfo.isFluid == 1 ? $t("yes") : $t("no") }}
                            </el-form-item>

                            <el-form-item prop="isPorcelain" :rules="rulesCommon.required" :label="$t('goodsListTable.isMagnetism')">
                                <el-radio-group v-model="formPane4.isPorcelain" disabled>
                                    <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                    <el-radio :label="0">{{ $t("no") }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item
                                v-if="typeof updateGoodsInfo.isCharge != 'undefined' && updateGoodsInfo.isPorcelain !== ''"
                                :rules="rulesCommon.required"
                                :label="$t('goodsListTable.isMagnetism')"
                                class="bg-light-grey"
                            >
                                ({{ $t("releaseGoods.beforeChange") }}) ：
                                {{ updateGoodsInfo.isPorcelain == 1 ? $t("yes") : $t("no") }}
                            </el-form-item>

                            <el-form-item prop="maxBuy" :rules="rulesCommon.required" :label="$t('goodsList.orderMaxNum')">
                                <el-input type="number" style="width: 594px;" v-model="formPane4.maxBuy" disabled></el-input>
                                <small> “ 0 ” {{ $t("goodsList.dontPurchase") }}</small>
                            </el-form-item>
                            <el-form-item v-if="updateGoodsInfo.maxBuy" prop="maxBuy" :rules="rulesCommon.required" :label="$t('goodsList.orderMaxNum')" class="bg-light-grey">
                                ({{ $t("releaseGoods.beforeChange") }}) ：
                                {{ updateGoodsInfo.maxBuy }}
                            </el-form-item>

                            <el-form-item prop="countryId" :label="$t('goodsList.country')">
                                <el-select v-model="formPane4.countryId" disabled :placeholder="$t('pleaseSelect')" style="width: 594px;">
                                    <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="updateGoodsInfo.countryId" prop="countryId" :label="$t('goodsList.country')" class="bg-light-grey">
                                <span class="grey">{{ $t("releaseGoods.beforeChange") }}：</span>
                                <template v-for="item in countryList" :key="item.value">
                                    <span v-if="updateGoodsInfo.countryId === item.id">
                                        {{ item.name }}
                                    </span>
                                </template>
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
                            <div v-if="updateGoodsInfo.keyword">
                                <span class="grey">{{ $t("releaseGoods.beforeChange") }}：</span>
                                {{ updateGoodsInfo.keyword }}
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.purpose") }}</span>
                            </template>
                            <el-input show-word-limit maxlength="200" v-model="formPane5.specialPurpose" disabled :placeholder="$t('pleaseEnter')"></el-input>
                            <div v-if="updateGoodsInfo.specialPurpose">
                                <span class="grey">{{ $t("releaseGoods.beforeChange") }}：</span>
                                {{ updateGoodsInfo.specialPurpose }}
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.fitPeople") }}</span>
                            </template>
                            <el-select v-model="formPane5.forPeople" disabled :placeholder="$t('pleaseSelect')">
                                <el-option v-for="item in dictsList.intended_for" :value="item.value" :label="item.label" :key="item.value"></el-option>
                            </el-select>
                            <div v-if="updateGoodsInfo.forPeople" class="flex">
                                <span class="grey">{{ $t("releaseGoods.beforeChange") }}：</span>
                                <template v-for="item in dictsList.intended_for" :key="item.value">
                                    <span v-if="updateGoodsInfo.forPeople === item.value">
                                        {{ item.label }}
                                    </span>
                                </template>
                            </div>
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
                        <el-form-item v-if="updateGoodsInfo.goodsType" :rules="rulesCommon.required" :label="$t('goodsList.type')" class="bg-light-grey">
                            ({{ $t("releaseGoods.beforeChange") }}) ：
                            <el-radio-group v-model="updateGoodsInfo.goodsType" disabled>
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
                        <el-form-item v-if="updateGoodsInfo.deliveryType" :rules="rulesCommon.required" :label="$t('releaseGoods.distribution')" class="bg-light-grey">
                            ({{ $t("releaseGoods.beforeChange") }}) ：
                            <el-radio-group v-model="updateGoodsInfo.deliveryType" disabled>
                                <el-radio v-for="item in dictsList.distribution_type" :label="item.value" :key="item.id">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('goodsList.isPresell')" prop="isOpenPresell">
                            <el-radio-group v-model="formPane6.isOpenPresell" disabled>
                                <el-radio label="0">{{ $t("releaseGoods.notPresell") }}</el-radio>
                                <!-- <el-radio label="1">{{$t('goodsList.presell')}}</el-radio> -->
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="updateGoodsInfo.isOpenPresell" :rules="rulesCommon.required" :label="$t('goodsList.isPresell')" class="bg-light-grey">
                            ({{ $t("releaseGoods.beforeChange") }}) ：
                            {{ updateGoodsInfo.isOpenPresell == 1 ? $t("releaseGoods.notPresell") : $t("goodsList.presell") }}
                        </el-form-item>
                        <el-form-item v-show="formPane6.deliveryType == 1" :label="$t('releaseGoods.promisedDelivery')" prop="promisedDeliveryTime">
                            <el-radio-group v-model="formPane6.promisedDeliveryTime" disabled>
                                <el-radio v-for="item in dictsList.promised_delivery_time" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            v-show="updateGoodsInfo.deliveryType == 1"
                            v-if="updateGoodsInfo.promisedDeliveryTime"
                            :rules="rulesCommon.required"
                            :label="$t('releaseGoods.promisedDelivery')"
                            class="bg-light-grey"
                        >
                            ({{ $t("releaseGoods.beforeChange") }}) ：
                            <el-radio-group v-model="updateGoodsInfo.promisedDeliveryTime" disabled>
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
                        <el-form-item v-if="updateGoodsInfo.stockDeductType" :rules="rulesCommon.required" :label="$t('releaseGoods.inventoryPiece')" class="bg-light-grey">
                            ({{ $t("releaseGoods.beforeChange") }}) ：
                            {{ updateGoodsInfo.stockDeductType }}
                        </el-form-item>

                        <el-form-item :label="$t('releaseGoods.payDelivery')" prop="isCashDelivery">
                            <el-radio-group v-model="formPane6.isCashDelivery" disabled>
                                <el-radio :label="0">{{ $t("status.notSupport") }}</el-radio>
                                <el-radio :label="1">{{ $t("status.support") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            v-if="typeof updateGoodsInfo.isCashDelivery != 'undefined' && updateGoodsInfo.isCashDelivery !== ''"
                            :rules="rulesCommon.required"
                            :label="$t('releaseGoods.payDelivery')"
                            class="bg-light-grey"
                        >
                            ({{ $t("releaseGoods.beforeChange") }}) ：
                            {{ updateGoodsInfo.isCashDelivery == 0 ? $t("status.notSupport") : $t("status.support") }}
                        </el-form-item>

                        <el-form-item :label="$t('releaseGoods.transport')" prop="transportMode">
                            <el-checkbox-group v-model="formPane6.transportMode" disabled>
                                <el-checkbox :label="1">{{ $t("releaseGoods.air") }}</el-checkbox>
                                <el-checkbox :label="2">{{ $t("releaseGoods.sea") }}</el-checkbox>
                                <el-checkbox :label="3">{{ $t("releaseGoods.land") }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item v-if="updateGoodsInfo.transportMode" :rules="rulesCommon.required" :label="$t('releaseGoods.transport')" class="bg-light-grey"
                            ><div class="flex">
                                ({{ $t("releaseGoods.beforeChange") }}) ：
                                <el-checkbox-group v-model="updateGoodsInfo.transportMode" disabled>
                                    <el-checkbox :label="1">{{ $t("releaseGoods.air") }}</el-checkbox>
                                    <el-checkbox :label="2">{{ $t("releaseGoods.sea") }}</el-checkbox>
                                    <el-checkbox :label="3">{{ $t("releaseGoods.land") }}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>

                        <!-- 运费模板 -->
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
                                            {{ $store.state.app.currencySymbol }}{{ scope.row.firstWeightFreight }};
                                            {{ $t("releaseGoods.toContinue") }}
                                            {{ scope.row.addUnitWeight }}kg, {{ $t("releaseGoods.renew") }}{{ $store.state.app.currencySymbol }}{{ scope.row.addWeightFreight }};
                                            {{ $t("releaseGoods.packaging") }}
                                            {{ $store.state.app.currencySymbol }}{{ scope.row.materialsCost }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="updateGoodsInfo.shippingFeeId" :label="$t('releaseGoods.freight')" class="bg-light-grey">
                            <template #label>
                                <span class="fs-14 fw">{{ $t("releaseGoods.freight") }}</span>
                            </template>
                            {{ $t("releaseGoods.beforeChange") }} ：
                            <div v-for="item in freightTemplateListOld" :key="item.id" class="bg-light-grey mb-15 pb-15 plr-15">
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
                                            {{ scope.row.addUnitWeight }}kg, {{ $t("releaseGoods.renew") }}{{ $store.state.app.currencySymbol }}{{ scope.row.addWeightFreight }} ;
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
                        <el-form-item v-if="updateGoodsInfo.services" :label="$t('releaseGoods.inventoryPiece')" class="pt-10 bg-light-grey">
                            <template #label>
                                <span class="fs-14 fw">{{ $t("releaseGoods.inventoryPiece") }}</span>
                            </template>
                            {{ $t("releaseGoods.beforeChange") }} ：
                            <div class="flex mb-10">
                                <div class="serve-item">{{ $t("goodsList.common") }}</div>
                                <div class="serve-item ml-10">
                                    {{ $t("releaseGoods.notPresell") }}
                                </div>
                                <div v-show="updateGoodsInfo.deliveryType == 1" class="serve-item ml-10">
                                    {{
                                        $t("releaseGoods.promisedTime", {
                                            time: updateGoodsInfo.promisedDeliveryTime
                                        })
                                    }}
                                </div>
                            </div>
                            <el-checkbox-group v-model="updateGoodsInfo.servicesSelected" disabled>
                                <el-checkbox v-for="item in updateGoodsInfo.services" :key="item.id" :label="item.id"> {{ item.title }}</el-checkbox>
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
                            <template #label v-if="item.updateType !== 'edit'">
                                <span class="fs-14 fw">{{ item.title }}</span>
                            </template>
                            <template v-if="item.updateType !== 'edit'">
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
                            </template>
                            <!-- 变更前 -->
                            <template v-else>
                                <span class="grey">{{ $t("releaseGoods.beforeChange") }}：</span>
                                <span v-if="item.mode === 3 || item.mode === 8">
                                    {{ utils.formatStandardDate(item.attrValue, item.mode === 8 ? true : "") }}
                                </span>
                                <span v-else>{{ item.attrValue }}</span>
                                <span v-if="item.isUnit"> {{ item.unit }}</span>
                            </template>
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
    goodsGetExamineGoodDetail,
    brandListCanUse,
    categoryGetPath
} from "@/api/goods";
import { deepClone } from "@/utils/index";

import EditCategory from "./editCategory";
import Audit from "./audit";

export default {
    name: "goodsInfoDetailChange",
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

        const isEdit = props.row.id ? true : false;
        const isChange = props.row.isChange ? true : false; //是否对比

        let activeName = ref("title1");

        console.log("props.row", props.row);
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

        let updateGoodsInfo = ref({});
        const getData = (id) => {
            return new Promise(function(reslove, reject) {
                goodsGetExamineGoodDetail(id).then((res) => {
                    let data = res.data;
                    formPane1.goodTitle = data.goodTitle;
                    formPane1.goodCode = data.goodCode;
                    formPane1.brandId = data.brandId;
                    formPane1.mainPictureUrl = data.mainPictureUrl;
                    formPane1.videoUrl = data.videoUrl;
                    formPane1.carouselMapUrls = data.carouselMapUrls.map((item) => {
                        item.url = item.imgUrl;
                        return item;
                    });

                    specOptionList.value = deepClone(data.specs);
                    specColumnList.value = specOptionList.value;

                    specDataList.form = data.specs;

                    if (isChange) {
                        specTableList.form = compareDataSpecTable(data.skus, data.updateGoodsInfo.skus); //比较销售规格
                    } else {
                        specTableList.form = data.skus;
                    }

                    formPane3.description = data.description;
                    formPane3.detailsPics = data.detailsPics.map((item) => {
                        item.url = item.imgUrl;
                        return item;
                    });

                    formPane4.isCharge = data.isCharge;
                    formPane4.isContainsPowder = data.isContainsPowder;
                    formPane4.isFluid = data.isFluid;
                    formPane4.isHazardousArticle = data.isHazardousArticle;
                    formPane4.isPorcelain = data.isPorcelain;
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
                    formPane6.services = data.services;

                    //运输方式
                    formPane6.transportMode = (data.transportMode && data.transportMode.split(",").map(Number)) || [];

                    //售后服务承诺-默认必选中
                    let servicesTmp = [];
                    data.services.forEach((item) => {
                        if (item.isRequired == 1) servicesTmp.push(item.id);
                    });
                    formPane6.servicesSelected = servicesTmp;

                    //更多信息
                    let attrsTmp = [];
                    formPane7.attrs.forEach((item, index) => {
                        let tmpAttrs = {};
                        data.attrs.forEach((aitem) => {
                            if (item.modelAttrId === aitem.modelAttrId) {
                                tmpAttrs = item;
                                item.attrValue = item.mode === 9 ? aitem.attrValue.split(",") : aitem.attrValue;
                            }
                        });
                        attrsTmp.push({ ...item });
                        if (isChange) {
                            //比较修改字段
                            if (item.attrValue != data.updateGoodsInfo.attrs[index].attrValue) {
                                attrsTmp.push({
                                    ...tmpAttrs,
                                    ...{ ...data.updateGoodsInfo.attrs[index], updateType: "edit" }
                                });
                            }
                        }
                    });
                    formPane7.attrs = attrsTmp;

                    if (isChange && JSON.stringify(data.updateGoodsInfo) !== "{}") {
                        compareData(data, "goodTitle");
                        compareData(data, "goodCode");
                        compareData(data, "brandId");
                        compareData(data, "mainPictureUrl");
                        compareData(data, "videoUrl");
                        compareData(data, "carouselMapUrls", ["imgUrl"]);
                        compareData(data, "description");
                        compareData(data, "detailsPics", ["imgUrl"]);
                        compareData(data, "isCharge");
                        compareData(data, "isContainsPowder");
                        compareData(data, "isFluid");
                        compareData(data, "isHazardousArticle");
                        compareData(data, "isPorcelain");
                        compareData(data, "maxBuy");
                        compareData(data, "countryId");
                        compareData(data, "keyword");
                        compareData(data, "specialPurpose");
                        compareData(data, "forPeople");

                        data.updateGoodsInfo.goodsType = data.updateGoodsInfo.goodsType + "";
                        data.updateGoodsInfo.deliveryType = data.updateGoodsInfo.deliveryType + "";
                        data.updateGoodsInfo.isOpenPresell = data.updateGoodsInfo.isOpenPresell + "";

                        compareDataFee(data, "shippingFeeId"); //运费模板 如果不一样要调接口查运费模板
                        compareData(data, "goodsType");
                        compareData(data, "deliveryType");
                        compareData(data, "isOpenPresell");
                        compareData(data, "promisedDeliveryTime");
                        compareData(data, "stockDeductType");
                        compareData(data, "isCashDelivery");
                        compareData(data, "transportMode");

                        data.updateGoodsInfo.transportMode = (data.updateGoodsInfo.transportMode && data.updateGoodsInfo.transportMode.split(",").map(Number)) || [];

                        let servicesTmp2 = [];
                        data.updateGoodsInfo.services.forEach((item) => {
                            if (item.isRequired == 1) servicesTmp2.push(item.id);
                        });
                        data.updateGoodsInfo.servicesSelected = servicesTmp2;

                        updateGoodsInfo.value = data.updateGoodsInfo; //所有旧数据
                    }

                    //console.log("formPane1", data);
                    reslove();
                });
            });
        };

        //比较哪些字段有修改
        const compareData = (data, key, arrayKey) => {
            if (arrayKey && arrayKey.length > 0) {
                if (!data.updateGoodsInfo[key] || data[key].length !== data.updateGoodsInfo[key].length) {
                    return;
                }
                let isFlag = false;
                for (let j = 0; j < data[key].length; j++) {
                    for (let i = 0; i < arrayKey.length; i++) {
                        //debugger
                        if (data[key][j][arrayKey[i]] != data.updateGoodsInfo[key][j][arrayKey[i]]) {
                            isFlag = true;
                        }
                    }
                }
                //未修改过
                if (isFlag === false) {
                    data.updateGoodsInfo[key] = "";
                }
            } else {
                if (data[key] == data.updateGoodsInfo[key]) {
                    data.updateGoodsInfo[key] = "";
                }
            }
        };
        //比较运费
        let freightTemplateListOld = ref([]);
        const compareDataFee = (data, key) => {
            if (data[key] == data.updateGoodsInfo[key]) {
                data.updateGoodsInfo[key] = "";
            } else {
                //如果修改过 需要查运费模板
                findFreightTemplateList({
                    ids: data.updateGoodsInfo.shippingFeeId,
                    deliveryType: data.updateGoodsInfo.deliveryType
                })
                    .then((res) => {
                        freightTemplateListOld.value = res.data;
                    })
                    .catch((err) => {});
            }
        };
        //比较销售规格table
        const compareDataSpecTable = (data, oldData) => {
            let tmpData = [];
            //如果不存在旧数据 则直接把新数据插入
            if (!oldData) {
                for (let i = 0, len = data.length; i < len; i++) {
                    data[i].updateType = "add";
                    tmpData.push({ ...data[i], updateTypeName: proxy.$t("status.add") });
                }
                return tmpData;
            }

            const dataIds = data.map((item) => item.id);

            let oldDataIds = [];
            oldDataIds = (oldData && oldData.map((item) => item.id)) || [];

            //新增的数据
            for (let i = 0, len = data.length; i < len; i++) {
                if (!oldDataIds.includes(data[i].id)) {
                    data[i].updateType = "add";
                    tmpData.push({ ...data[i], updateTypeName: proxy.$t("status.add") });
                }
            }
            //删除的数据
            for (let i = 0, len = oldData.length; i < len; i++) {
                if (!dataIds.includes(oldData[i].id)) {
                    oldData[i].updateType = "delete";
                    tmpData.push({ ...oldData[i], updateTypeName: proxy.$t("status.delete") });
                }
            }
            for (let i = 0, dlen = data.length; i < dlen; i++) {
                for (let j = 0, olen = oldData.length; j < olen; j++) {
                    if (data[i].id === oldData[j].id) {
                        //当前这条哪些字段被修改过
                        data[i].updateField = compareDataSpecKey(data[i], oldData[j], [
                            "cleanVolumeHeight",
                            "cleanVolumeLength",
                            "cleanVolumeWidth",
                            "cleanWeight",
                            "fnsku",
                            "internationalCode",
                            "packingVolumeHeight",
                            "packingVolumeLength",
                            "packingVolumeWidth",
                            "packingWeight",
                            "price",
                            "sendVolumeHeight",
                            "sendVolumeLength",
                            "sendVolumeWidth",
                            "sendWeight",
                            "skuCode",
                            "stockNum",
                            "tsin"
                        ]);
                        tmpData.push({
                            ...data[i],
                            updateType: data[i].updateField.length > 0 ? "update" : "keep",
                            updateTypeName: data[i].updateField.length > 0 ? proxy.$t("releaseGoods.afterChange") : proxy.$t("releaseGoods.noChange")
                        });
                        data[i].updateField.length > 0 &&
                            tmpData.push({
                                ...oldData[j],
                                updateType: "old",
                                updateTypeName: proxy.$t("releaseGoods.beforeChange")
                            });
                    }
                }
            }

            console.log("tmpData", tmpData);
            return tmpData;
        };
        //比较销售规格table 哪些字段修改过
        const compareDataSpecKey = (data, oldData, arrayKey) => {
            let field = [];
            for (let i = 0, len = arrayKey.length; i < len; i++) {
                if (data[arrayKey[i]] != oldData[arrayKey[i]]) {
                    field.push(arrayKey[i]);
                }
            }
            return field;
        };

        //初始化
        const AsyncList = () => {
            let id = props.row.id;
            getData(id).then(() => {
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
            // brandId: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }],
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

        const getSpecAttrDetail = (columnIndex, index) => {
            if (index < 0) return "";
            if (specTableList.form[index] && specTableList.form[index].goodsSkuSaleAttrValue[columnIndex]) {
                return specTableList.form[index].goodsSkuSaleAttrValue[columnIndex].attrValue;
            } else {
                return "";
            }
        };

        // const getSpecAttr = (specIndex, index) => {
        //     // 获取当前规格项目下的属性值
        //     const currentValues = specColumnList.value[specIndex].specValues;
        //     let indexCopy;
        //     // 判断是否是最后一个规格项目
        //     if (specColumnList.value[specIndex + 1] && specColumnList.value[specIndex + 1].specValues.length) {
        //         indexCopy = index / countSum(specIndex + 1);
        //     } else {
        //         indexCopy = index;
        //     }
        //     const i = Math.floor(indexCopy % currentValues.length);
        //     if (i.toString() !== "NaN") {
        //         return {
        //             ...currentValues[i],
        //             cnName: currentValues[i].cnName,
        //             enName: currentValues[i].cnName
        //         };
        //     } else {
        //         return {};
        //     }
        // };

        // // 计算规格的乘积
        // const countSum = (index) => {
        //     let num = 1;
        //     specDataList.form.forEach((item, j) => {
        //         if (j >= index && item.specValues.length) {
        //             num *= item.specValues.length;
        //         }
        //     });
        //     return num;
        // };

        //批量修改-重量/体积
        let batchWeightVisible = ref(false);
        let batchWeightTitle = ref("");

        //修改table行class
        const tableRowClassName = ({ row, rowIndex }) => {
            if (row.updateType === "old") {
                return "border-old";
            }
            if (row.updateType === "update") {
                return "bg-light-orange";
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
        let examineStatus = ref(0); //审核状态
        const reloadData = () => {
            emit("reloadData");
            emit("update:visible", false);
        };

        return {
            isEdit,
            isChange,

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
            getSpecAttrDetail,
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
            freightTemplateListOld,

            formPane7,
            formPane7Ref,

            updateGoodsInfo,

            checkisRightful,

            auditVisible,
            examineStatus,
            reloadData
        };
    }
};
</script>

<style lang="scss" scoped>
::v-deep(.border-old td) {
    border-bottom: solid 8px #ffffff;
}
::v-deep(.bg-light-orange td) {
    background-color: #f7f2e6;
}

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
