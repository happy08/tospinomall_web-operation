<template>
    <BmDialog v-model:visible="visible" width="60%" :title="updateType === 'audit' ? $t('entryAudit.examine') : $t('entryAudit.look')">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-if="updateType === 'look'" verticalGap>
            <!-- 审核状态 -->
            <el-form-item :label="$t('entryAudit.examineStatus')">
                <span>{{ form.statusName }}</span>
            </el-form-item>
            <!-- 审核备注 -->
            <el-form-item :label="$t('entryAudit.auditRemark')">
                <span>{{ form.reason }}</span>
            </el-form-item>
        </el-form>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" verticalGap>
            <!-- 店铺信息区域 -->
            <BmBaseTitle :title="$t('entryAudit.storeInfo')" />
            <!-- 店铺编号 -->
            <el-form-item :label="$t('entryAuditTable.storeCode')">
                <span>{{ form.storeCode }}</span>
            </el-form-item>
            <!-- 卖家身份 -->
            <el-form-item :label="$t('entryAuditTable.sellerType')">
                <span>{{ form.sellerTypeName }}</span>
            </el-form-item>
            <!-- 贸易形式 -->
            <el-form-item :label="$t('entryAuditTable.tradeForm')">
                <span>{{ form.tradeFormName }}</span>
            </el-form-item>
            <!-- 店铺名称 -->
            <el-form-item :label="$t('shop.name')">
                <span>{{ form.storeName }}</span>
            </el-form-item>
            <!-- 店铺类型 -->
            <el-form-item :label="$t('entryAuditTable.storeType')">
                <span>{{ form.storeTypeName }}</span>
            </el-form-item>
            <!-- 店铺简介 -->
            <el-form-item :label="$t('sellerList.storeDesc')">
                <span>{{ form.storeDesc }}</span>
            </el-form-item>
            <!-- 主营类目 -->
            <el-form-item :label="$t('entryAuditTable.mainBusinessTypeNames')">
                <span>{{ form.mainBusinessTypeName }}</span>
            </el-form-item>
            <!-- 详细地址 -->
            <el-form-item :label="$t('entryAuditTable.detailAddress')">
                <span>{{ form.address }}{{ form.addressDetail }}</span>
            </el-form-item>
            <!-- 入驻邀请码 -->
            <el-form-item :label="$t('entryAuditTable.invitationCode')">
                <span>{{ form.invitationCode }}</span>
            </el-form-item>
            <!-- 注册用户名 -->
            <el-form-item :label="$t('entryAudit.account')">
                <span>{{ form.sellerUser.account }}</span>
            </el-form-item>
            <!-- 注册手机号 -->
            <el-form-item :label="$t('entryAudit.phone')">
                <span>{{ form.sellerUser.phonePrefix }}{{ form.sellerUser.phone }}</span>
            </el-form-item>
            <!-- 联系人 -->
            <!-- <el-form-item :label="$t('entryAudit.contactName')">
                <span>{{ form.contactName }}</span>
            </el-form-item> -->
            <!-- 联系邮箱 -->
            <el-form-item :label="$t('entryAudit.contactEmail')">
                <span>{{ form.sellerUser.email }}</span>
            </el-form-item>

            <!-- (主体)证件信息区域 -->
            <!-- 专业买家 -->
            <template v-if="form.sellerType == '2'">
                <BmBaseTitle :title="$t('entryAudit.certificatesInfo')" />
                <!-- (主体)证件信息区域 -->
                <span class="fs-20 block mb-20">
                    {{ $t("entryAudit.certificatesInfo") }}
                </span>
                <!-- 企业法人身份信息 -->
                <span class="fs-16 block mb-20">
                    {{ $t("entryAudit.enterpriseLegalInfo") }}
                </span>
                <!-- 法定代表人姓名 -->
                <!-- <el-form-item :label="$t('entryAuditTable.papersName')">
                    <span>{{ form.papersName }}</span>
                </el-form-item> -->
                <!-- 法定代表人邮箱 -->
                <!-- <el-form-item :label="$t('entryAudit.enterpriseLegalEmail')">
                    <span>{{ form.sellerUser.email }}</span>
                </el-form-item> -->
                <!-- 法定代表人电话 -->
                <!-- <el-form-item :label="$t('entryAudit.enterpriseLegalPhone')">
                    <span>{{ form.sellerUser.phone }}</span>
                </el-form-item> -->
                <!-- 法定证件类型 -->
                <el-form-item :label="$t('entryAuditTable.papersType')">
                    <span>{{ form.papersTypeName }}</span>
                </el-form-item>
                <!-- 法定代表人证件号 -->
                <el-form-item :label="$t('entryAuditTable.papersNumber')">
                    <span>{{ form.papersNumber }}</span>
                </el-form-item>
                <!-- 法定代表人证件有效期 -->
                <el-form-item :label="$t('entryAuditTable.papersExpired')">
                    <span>{{ form.papersExpiredStart + " ── " + form.papersExpiredEnd }}</span>
                </el-form-item>
                <!-- 法定代表人手持证件照 -->
                <el-form-item :label="$t('entryAuditTable.papersPictureUrl2')">
                    <BmImage :src="form.papersPictureUrl" :alt="$t('entryAudit.papersPictureUrl')" :preview-src-list="[form.papersPictureUrl]" style="width: 100px" />
                </el-form-item>
                <!-- 法定代表人证件正面照 -->
                <el-form-item :label="$t('entryAuditTable.papersProsPictureUrl')">
                    <BmImage :src="form.papersProsPictureUrl" :alt="$t('entryAuditTable.papersProsPictureUrl')" :preview-src-list="[form.papersProsPictureUrl]" style="width: 100px" />
                </el-form-item>
                <!-- 法定代表人证件背面照 -->
                <el-form-item :label="$t('entryAuditTable.papersConsPictureUrl')">
                    <BmImage :src="form.papersConsPictureUrl" :alt="$t('entryAuditTable.papersConsPictureUrl')" :preview-src-list="[form.papersConsPictureUrl]" style="width: 100px" />
                </el-form-item>
                <!-- 企业证件信息 -->
                <span class="fs-16 block mb-20">
                    {{ $t("entryAudit.enterpriseCertificateInfo") }}
                </span>
                <span>{{ $t("entryAudit.enterpriseCertificateInfoTips") }}</span>
                <!-- 公司注册国家 -->
                <!-- <el-form-item :label="$t('entryAuditTable.countryCode')">
                    <span>{{ form.countryCode }}</span>
                </el-form-item> -->
                <!-- 公司名称 -->
                <el-form-item :label="$t('entryAuditTable.name')">
                    <span>{{ form.umsSellerCompany.name }}</span>
                </el-form-item>
                <!--统一社会代码-->
                <el-form-item :label="$t('entryAuditTable.businessLicense')">
                    <span>{{ form.umsSellerCompany.businessLicense }}</span>
                </el-form-item>
                <!--公司登记状态-->
                <el-form-item :label="$t('entryAudit.companyRegistrationStatus')">
                    <span>{{ form.umsSellerCompany.companyStatus }}</span>
                </el-form-item>
                <!--公司经营地址-->
                <el-form-item :label="$t('entryAuditTable.address')">
                    <span>{{ form.umsSellerCompany.address + form.umsSellerCompany.addressDetail }}</span>
                </el-form-item>
                <!--营业期限-->
                <el-form-item :label="$t('entryAuditTable.businessExpired')">
                    <span>{{ form.umsSellerCompany.businessExpiredStart + " ── " + form.umsSellerCompany.businessExpiredEnd }}</span>
                </el-form-item>
                <!-- 营业执照-->
                <el-form-item :label="$t('entryAudit.businessLicense')">
                    <BmImage
                        :src="form.umsSellerCompany.businessLicensePictureUrl"
                        :alt="$t('entryAudit.businessLicense')"
                        :preview-src-list="[form.umsSellerCompany.businessLicensePictureUrl]"
                        style="width: 100px"
                    />
                </el-form-item>
            </template>
            <!-- 个人买家 -->
            <template v-if="form.sellerType == '1'">
                <!-- 证件信息 -->
                <BmBaseTitle :title="$t('entryAudit.cardInfo')" />
                <!-- 提示 -->
                <BmAlert type="warning" :title="$t('entryAudit.tips')" icon="warning" />
                <!-- 姓名 -->
                <!-- <el-form-item :label="$t('entryAudit.name')">
                    <span>{{ form.papersName }}</span>
                </el-form-item> -->
                <!-- 邮箱 -->
                <!-- <el-form-item :label="$t('entryAuditTable.email')">
                    <span>{{ form.sellerUser.email }}</span>
                </el-form-item> -->
                <!-- 联系方式 -->
                <!-- <el-form-item :label="$t('entryAudit.contactMethod')">
                    <span>{{ form.sellerUser.phonePrefix }} {{ form.sellerUser.phone }}</span>
                </el-form-item> -->
                <!-- 证件类型 -->
                <el-form-item :label="$t('entryAudit.cardType')">
                    <span>{{ form.papersTypeName }}</span>
                </el-form-item>
                <!-- 证件号 -->
                <el-form-item :label="$t('entryAudit.cardNum')">
                    <span>{{ form.papersNumber }}</span>
                </el-form-item>
                <!-- 证件号有效期 -->
                <el-form-item :label="$t('entryAudit.validityCertificate')">
                    <span>{{ form.papersExpiredStart + " ── " + form.papersExpiredEnd }}</span>
                </el-form-item>
                <!-- 手持证件照 -->
                <el-form-item :label="$t('entryAuditTable.papersPictureUrl')">
                    <BmImage :src="form.papersPictureUrl" :alt="$t('entryAudit.papersPictureUrl')" :preview-src-list="[form.papersPictureUrl]" style="width: 100px" />
                </el-form-item>
                <!-- 证件正面照-->
                <el-form-item :label="$t('entryAudit.prosPictureUrl')">
                    <BmImage :src="form.papersProsPictureUrl" :alt="$t('entryAudit.prosPictureUrl')" :preview-src-list="[form.papersProsPictureUrl, form.papersConsPictureUrl]" style="width: 100px" />
                </el-form-item>
                <!-- 证件反面照-->
                <el-form-item :label="$t('entryAudit.consPictureUrl')">
                    <BmImage :src="form.papersConsPictureUrl" :alt="$t('entryAudit.consPictureUrl')" :preview-src-list="[form.papersProsPictureUrl, form.papersConsPictureUrl]" style="width: 100px" />
                </el-form-item>
                <!-- 联系地址 -->
                <el-form-item :label="$t('entryAudit.contactArea')">
                    <span>{{ form.address }}</span>
                </el-form-item>
            </template>
            <!--审核备注-->
            <el-form-item prop="reason" :label="$t('entryAudit.auditRemark')">
                <el-input v-model="form.reason" :placeholder="$t('pleaseEnter')" :disabled="updateType !== 'audit'" maxlength="50" show-word-limit></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="flex hcenter vcenter">
                <!-- 取消 -->
                <el-button @click="handelCancel" class="mr-20">{{ $t("cancel") }}</el-button>
                <el-button-group v-if="updateType === 'audit'">
                    <!-- 驳回 -->
                    <el-button @click="handelConfirm(0)">{{ $t("status.reject") }}</el-button>
                    <!-- 通过 -->
                    <el-button type="primary" @click="handelConfirm(1)">{{ $t("status.pass") }}</el-button>
                </el-button-group>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { attributeAdd, attributeUpdateById, attributeListGoodsCategoryByAttrId } from "@/api/goods";
import { editOrderReason, addOrderReason } from "@/api/base";
import { getAuditResult } from "@/api/store";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object,
        selectData: Array
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典
        let form = ref({});
        //标题
        let updateType = ref("");
        watch(
            () => props.row,
            (nVal) => {
                form.value = props.row;
                updateType.value = props.row.updateType;
            }
        );
        const rules = {
            reason: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };

        const formRef = ref(null);

        const handelConfirm = (result) => {
            const params = {
                reason: form.value.reason,
                result: result,
                storeId: form.value.id,
                userId: form.value.sellerUser.id
            };

            formRef.value.validate((valid) => {
                if (valid) {
                    getAuditResult(params)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        };

        const handelCancel = () => {
            emit("update:visible", false);
        };

        return {
            dict,
            updateType,
            form,
            rules,
            formRef,
            handelConfirm,
            handelCancel
        };
    }
};
</script>
