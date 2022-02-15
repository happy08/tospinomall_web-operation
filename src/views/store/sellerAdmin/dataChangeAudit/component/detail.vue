<template>
    <BmDialog v-model:visible="visible" :title="$t('permissionUser.memberList')" :confirm="confirm" :cancel="cancel" @close="cancel" :width="1200" top="10vh">
        <BmDialog v-model:visible="auditVisible" :title="$t('table.checkGoods')" :confirm="auditSub" :cancel="cancelAudit" :width="500" top="10vh">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
                <el-form-item :label="$t('status.status')">
                    <el-radio v-model="result" label="1">{{ $t("status.pass") }}</el-radio>
                    <el-radio v-model="result" label="0">{{ $t("status.reject") }}</el-radio>
                </el-form-item>

                <!-- 驳回原因 -->
                <el-form-item v-if="result === '0'" :label="$t('withdrawalManagement.viewDismissal')" prop="reason">
                    <el-input type="textarea" v-model="form.reason" maxlength="500" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </BmDialog>

        <div class="content-wrap p-20 bg-white">
            <!-- 店铺基本信息 -->
            <BmBaseTitle :title="$t('register.storeBascInfo')" />

            <BmAlert :title="$t('register.storeInfoAuditTip')" icon="warning" class="mb-15 ml-20" />
            <el-form :model="ruleForm" label-width="auto">
                <!-- 店铺类型: -->
                <el-form-item :label="$t('register.storeType')" prop="storeType ">
                    <!-- "1专业卖家" "2普通卖家"-->
                    {{ ruleForm.sellerType == 2 ? $t("register.ProfessionalSellers") : $t("register.OrdinarySeller") }}
                </el-form-item>
                <!-- 贸易形式 -->
                <el-form-item :label="$t('register.tradePattern')" prop="tradeForm">
                    <!-- 1本地贸易 2跨境贸易-->
                    {{ ruleForm.tradeForm == 1 ? $t("register.localTrade") : $t("register.crossBorderTrade") }}
                </el-form-item>
                <!-- 店铺名称 -->
                <el-form-item :label="$t('register.storeName') + ':'" prop="storeName">
                    {{ ruleForm.storeName }}
                </el-form-item>
                <!-- 店铺简介 -->
                <el-form-item :label="$t('register.ShopIntroduction') + ':'" prop="storeDesc">
                    {{ ruleForm.storeDesc }}
                </el-form-item>
                <!-- 主营类目 -->
                <!-- <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                    <template v-for="(item, i) in category" :key="i">
                        <span v-if="ruleForm.mainBusinessType && ruleForm.mainBusinessType.includes(item.id)" class="p-5"> {{ item.name }} /</span>
                    </template>
                </el-form-item> -->
                <!-- 登录(主)账号 -->
                <!-- <el-form-item :label="$t('register.setAccountMain') + ':'" prop="account" >
                    {{ ruleForm.account }}
                </el-form-item> -->

                <!-- 联系地址 -->
                <el-form-item :label="$t('register.contactAddress') + ':'" prop="storeAddress"> {{ ruleForm.address }} {{ ruleForm.storeAddressDetail }} </el-form-item>
                <!-- 邮箱账户 -->
                <!-- <el-form-item :label="$t('register.EmailAccount') + ':'" prop="email" >
                    {{ ruleForm.email }}
                </el-form-item> -->

                <!-- <el-form-item :label="$t('register.CheckInInvitationCode') + ':'" prop="invitationCode" >
                    {{ ruleForm.invitationCode }}
                </el-form-item> -->

                <BmBaseTitle :title="$t('register.certificateInfo')" />

                <!-- 证件类型 -->
                <el-form-item :label="$t('register.certificateType') + ':'" prop="papersType" style="margin-bottom: 10px;">
                    <!-- 1中国大陆身份证 2ID证件-->
                    {{ ruleForm.papersType == 1 ? $t("register.ChineseMainCard") : $t("register.idCard") }}
                </el-form-item>
                <!-- 姓名 -->
                <el-form-item :label="$t('register.name') + ':'" prop="papersName">
                    {{ ruleForm.papersName }}
                </el-form-item>
                <!-- 证件号码 -->
                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" v-if="ruleForm.papersType == 1">
                    <div class="flex">
                        <div>
                            <span>{{ storeData.papersNumber }}</span> <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                        </div>
                        <div class="ml-20">
                            <span>{{ storeData.papersNumber }}</span> <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                        </div>
                    </div>
                </el-form-item>
                <!-- 证件号码 -->
                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" v-if="ruleForm.papersType == 2">
                    <div class="flex">
                        <div>
                            {{ storeData.papersNumber }} <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                        </div>
                        <div class="ml-20">
                            {{ storeData.papersNumber }} <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                        </div>
                    </div>
                </el-form-item>
                <!-- 证件有效期 -->
                <el-form-item :label="$t('register.validityCertificate') + ':'" prop="papersExpired">
                    {{ ruleForm.papersExpired && ruleForm.papersExpired.join(" ~ ") }}
                    <!-- 长期 -->
                    {{ ruleForm.expiredIsForever == 1 ? $t("register.longTerm") : "" }}
                </el-form-item>
                <!-- 手持证件照 -->
                <el-form-item :label="$t('register.HandHeldPhoto') + ':'" prop="papersPictureUrl">
                    <div class="flex">
                        <div>
                            <BmImage
                                :src="storeData.papersPictureUrl"
                                :preview-src-list="[storeData.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                style="width:120px;height:120px"
                            />
                            <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                        </div>
                        <div class="ml-20">
                            <BmImage
                                :src="ruleForm.papersPictureUrl"
                                :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                style="width:120px;height:120px"
                            />
                            <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                        </div>
                    </div>
                </el-form-item>
                <!-- 法定代表人证件正面照 -->
                <el-form-item :label="$t('register.statutoryCertificateFront') + ':'" prop="papersProsPictureUrl">
                    <div class="flex">
                        <div>
                            <BmImage
                                :src="storeData.papersProsPictureUrl"
                                :preview-src-list="[ruleForm.papersPictureUrl, storeData.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                style="width:120px;height:120px"
                            />
                            <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                        </div>
                        <div class="ml-20">
                            <BmImage
                                :src="ruleForm.papersProsPictureUrl"
                                :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                style="width:120px;height:120px"
                            />
                            <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                        </div>
                    </div>
                </el-form-item>
                <!-- 法定代表人证件反面照 -->
                <el-form-item :label="$t('register.statutoryCertificateAgainst') + ':'" prop="papersConsPictureUrl">
                    <div class="flex">
                        <div>
                            <BmImage
                                :src="storeData.papersConsPictureUrl"
                                :preview-src-list="[ruleForm.papersPictureUrl, storeData.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                style="width:120px;height:120px"
                            />
                            <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                        </div>
                        <div class="ml-20">
                            <BmImage
                                :src="ruleForm.papersConsPictureUrl"
                                :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                style="width:120px;height:120px"
                            />
                            <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                        </div>
                    </div>
                </el-form-item>
                <div v-if="ruleForm.sellerType == 2">
                    <!-- 企业信息 -->
                    <BmBaseTitle :title="$t('register.enterpriseInfo')" />

                    <el-form :model="ruleForm" label-width="auto">
                        <!-- 公司名称 -->
                        <el-form-item :label="$t('register.BusinessName') + ':'" prop="name">
                            {{ ruleForm.name }}
                        </el-form-item>
                        <!-- 公司经营地址 -->
                        <el-form-item :label="$t('register.BusinessAddress') + ':'" prop="companyAddress"> {{ ruleForm.address }} {{ ruleForm.companyAddressDetail }} </el-form-item>
                        <!-- 营业执照 -->
                        <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicense">
                            {{ ruleForm.businessLicense }}
                        </el-form-item>
                        <!-- 营业期限 -->
                        <el-form-item :label="$t('register.businessTerm') + ':'" prop="businessExpired">
                            {{ ruleForm.businessExpired && ruleForm.businessExpired.join(" ~ ") }}
                            <!-- 长期 -->
                            {{ ruleForm.companyExpiredIsForever == 1 ? $t("register.longTerm") : "" }}
                        </el-form-item>
                        <!-- 营业执照 -->
                        <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicensePictureUrl">
                            <div class="flex">
                                <div>
                                    <BmImage :src="company.businessLicensePictureUrl" :preview-src-list="[company.businessLicensePictureUrl]" style="width:120px;height:120px" />
                                    <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                                </div>
                                <div class="ml-20">
                                    <BmImage :src="ruleForm.businessLicensePictureUrl" :preview-src-list="[ruleForm.businessLicensePictureUrl]" style="width:120px;height:120px" />
                                    <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-form>
        </div>
        <template #footer>
            <div class="flex hcenter vcenter">
                <div v-if="status == 1">
                    <el-button @click="cancel">
                        {{ $t("cancel") }}
                    </el-button>
                    <!-- 审核 -->
                    <el-button type="primary" @click="auditVisible = true"> {{ $t("table.checkGoods") }} </el-button>
                </div>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick } from "vue";
import { adminUmsSellerFindLastUpdateAudit, adminUmsSellerStoreUpdateAudit } from "@/api/store";
import { find } from "@/api/goods";
import { useStore } from "vuex";
import storage from "@/utils/storage";
export default {
    name: "merchantInfoAudit",
    props: {
        visible: Boolean,
        storeId: String,
        status: String
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        const store = useStore();

        let ruleForm = reactive({});
        let company = ref({});
        let companyUpdateAudit = ref({});
        let storeData = ref({});
        let storeUpdateAudit = ref({});
        const getSroreInfo = () => {
            adminUmsSellerFindLastUpdateAudit(props.storeId)
                .then((res) => {
                    company.value = res.data.company;
                    companyUpdateAudit.value = res.data.companyUpdateAudit;
                    storeData.value = res.data.store;
                    storeUpdateAudit.value = res.data.storeUpdateAudit;

                    ruleForm.sellerType = res.data.storeUpdateAudit.sellerType; // 卖家类型

                    ruleForm.account = res.data.storeUpdateAudit.sellerUser.account;

                    ruleForm.invitationCode = res.data.storeUpdateAudit.invitationCode; // 邀请码
                    ruleForm.mainBusinessType = (res.data.storeUpdateAudit.mainBusinessType && res.data.storeUpdateAudit.mainBusinessType.split(",").map(Number)) || []; // 主营类目ID

                    ruleForm.storeAddressDetail = res.data.storeUpdateAudit.addressDetail; // 详细地址
                    ruleForm.storeDesc = res.data.storeUpdateAudit.storeDesc; // 店铺简介
                    ruleForm.storeLogoUrl = res.data.storeUpdateAudit.storeLogoUrl; // 店铺logo url
                    ruleForm.storeName = res.data.storeUpdateAudit.storeName; //  店铺名称
                    ruleForm.storeType = Number(res.data.storeUpdateAudit.storeType); // 店铺类型 1: 普通
                    ruleForm.tradeForm = Number(res.data.storeUpdateAudit.tradeForm); // 贸易行驶: 1: 本地贸易 2:跨境贸易
                    ruleForm.storeAddress = [res.data.storeUpdateAudit.countryCode, res.data.storeUpdateAudit.provinceCode, res.data.storeUpdateAudit.cityCode, res.data.storeUpdateAudit.districtCode]; //	国家编码 省编码 市编码 区编码
                    if (res.data.storeUpdateAudit.papersExpiredStart) {
                        ruleForm.papersExpired = [res.data.storeUpdateAudit.papersExpiredStart, res.data.storeUpdateAudit.papersExpiredEnd]; // 证件有效期
                    }

                    ruleForm.papersConsPictureUrl = res.data.storeUpdateAudit.papersConsPictureUrl; // 证件反面图片url
                    ruleForm.papersName = res.data.storeUpdateAudit.papersName; // 证件上姓名
                    ruleForm.papersNumber = res.data.storeUpdateAudit.papersNumber; // 证件号码
                    ruleForm.papersPictureUrl = res.data.storeUpdateAudit.papersPictureUrl; // 证件图片url
                    ruleForm.papersType = Number(res.data.storeUpdateAudit.papersType); // 证件类型: 1:大陆身份证, 2.ID证件
                    ruleForm.papersProsPictureUrl = res.data.storeUpdateAudit.papersProsPictureUrl; // 证件正面图片url
                    ruleForm.expiredIsForever = res.data.storeUpdateAudit.expiredIsForever; // 身份证是否长期

                    ruleForm.businessExpired = [res.data.companyUpdateAudit.businessExpiredStart, res.data.companyUpdateAudit.businessExpiredEnd];
                    ruleForm.businessLicense = res.data.companyUpdateAudit.businessLicense; // 营业执照
                    ruleForm.businessLicensePictureUrl = res.data.companyUpdateAudit.businessLicensePictureUrl; // 营业执照图片id
                    // 公司经营地址
                    ruleForm.companyAddress = [
                        res.data.companyUpdateAudit.countryCode,
                        res.data.companyUpdateAudit.provinceCode,
                        res.data.companyUpdateAudit.cityCode,
                        res.data.companyUpdateAudit.districtCode
                    ]; //	国家编码 省编码 市编码 区编码
                    ruleForm.address = res.data.companyUpdateAudit.address; // 地址
                    ruleForm.companyAddressDetail = res.data.companyUpdateAudit.addressDetail; // 详情地址
                    ruleForm.name = res.data.companyUpdateAudit.name; // 企业名称
                    ruleForm.companyExpiredIsForever = res.data.companyUpdateAudit.expiredIsForever; // 营业期限是否长期
                })
                .catch((err) => {});
        };
        getSroreInfo();

        const onChangeUploadPicture = (url) => {
            console.log(url);
            ruleForm.storeLogoUrl = url;
        };

        const saveAvatar = () => {
            adminUmsSellerUpdateStore({ storeLogoUrl: ruleForm.storeLogoUrl })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    store.dispatch("user/getStoreInfo");
                })
                .catch((error) => {});
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        // 审核
        const formRef = ref(null);
        let auditVisible = ref(false);
        let result = ref(""); // 1通过 0驳回
        let form = ref({ reason: "" });
        const rules = {
            reason: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        // 提交审核
        const auditSub = () => {
            if (result.value == "") {
                proxy.$message.error(proxy.$t("pleaseSelect"));
                return;
            }
            adminUmsSellerStoreUpdateAudit({ storeId: props.storeId, result: result.value, companyId: company.value.id, userId: storeData.value.userId })
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                })
                .catch((err) => {});
        };

        const cancelAudit = () => {
            auditVisible.value = false;
        };
        return {
            ruleForm,
            onChangeUploadPicture,
            saveAvatar,
            storeData,
            company,
            cancel,
            auditSub,
            formRef,
            auditVisible,
            result,
            cancelAudit,
            rules,
            form
        };
    }
};
</script>
