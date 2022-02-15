<template>
    <BmDialog v-model:visible="visible" :title="$t('entryAudit.look')" width="60%" custom-class="fixdDialog">
        <div class="p-25 bg-white">
            <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
                <!-- 基础信息 -->
                <el-tab-pane :label="$t('sellerList.baseInfo')" name="first">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" verticalGap>
                        <!-- 店铺信息区域 -->
                        <BmBaseTitle :title="$t('sellerList.baseInfo')" />
                        <!-- <BmAlert :title="$t('attribute.alert')" icon="warning" class="mb-20" /> -->
                        <!-- 卖家身份 -->
                        <el-form-item :label="$t('entryAuditTable.sellerType')">
                            <span>{{ form.sellerTypeName }}</span>
                        </el-form-item>
                        <!-- 账户名 -->
                        <el-form-item :label="$t('sellerList.account')">
                            <span>{{ form.sellerUser.account }}</span>
                        </el-form-item>
                        <!-- 联系方式 -->
                        <el-form-item :label="$t('entryAudit.contactMethod')">
                            <span>{{ form.sellerUser.phonePrefix }} {{ form.sellerUser.phone }}</span>
                        </el-form-item>
                        <!-- 邮箱 -->
                        <el-form-item :label="$t('entryAuditTable.email')">
                            <span>{{ form.sellerUser.email }}</span>
                        </el-form-item>
                        <!-- 贸易形式 -->
                        <el-form-item :label="$t('entryAuditTable.tradeForm')">
                            <span>{{ form.tradeFormName }}</span>
                        </el-form-item>
                        <!-- 店铺类型 -->
                        <el-form-item :label="$t('entryAuditTable.storeType')">
                            <span>{{ form.storeTypeName }}</span>
                        </el-form-item>
                        <!-- 店铺编号 -->
                        <el-form-item :label="$t('entryAuditTable.storeCode')">
                            <span>{{ form.storeCode }}</span>
                        </el-form-item>
                        <!-- 店铺名称 -->
                        <el-form-item :label="$t('sellerList.storeName')">
                            <span>{{ form.storeName }}</span>
                        </el-form-item>
                        <!-- 主营类目 -->
                        <el-form-item :label="$t('entryAuditTable.mainBusinessTypeNames')">
                            <span>{{ form.mainBusinessTypeName }}</span>
                        </el-form-item>
                        <!-- 店铺联系人 -->
                        <!-- <el-form-item :label="$t('sellerList.contactName')">
                            <span>{{ form.contactName }}</span>
                        </el-form-item> -->
                        <!-- 店铺简介 -->
                        <el-form-item :label="$t('sellerList.storeDesc')">
                            <span>{{ form.storeDesc }}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- （主体）证件信息 -->
                <el-tab-pane :label="$t('sellerList.certificatesInfo')" name="second">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" verticalGap>
                        <!-- 专业买家 -->
                        <template v-if="form.sellerType == '2'">
                            <BmBaseTitle :title="$t('sellerList.subjectInfo')" />
                            <!-- 企业法人身份信息 -->
                            <span class="fs-16 block mb-20">
                                {{ $t("entryAudit.enterpriseLegalInfo") }}
                            </span>
                            <!-- 法定代表人姓名 -->
                            <el-form-item :label="$t('entryAuditTable.papersName')">
                                <span>{{ form.papersName }}</span>
                            </el-form-item>
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
                            <!-- 法定代表人证件正面照 -->
                            <el-form-item :label="$t('entryAuditTable.papersProsPictureUrl')">
                                <BmImage
                                    :src="form.papersProsPictureUrl"
                                    :alt="$t('entryAuditTable.papersProsPictureUrl')"
                                    style="width: 100px"
                                    :preview-src-list="form.papersProsPictureUrl.split(',')"
                                />
                            </el-form-item>
                            <!-- 法定代表人证件背面照 -->
                            <el-form-item :label="$t('entryAuditTable.papersConsPictureUrl')">
                                <BmImage
                                    :src="form.papersConsPictureUrl"
                                    :alt="$t('entryAuditTable.papersConsPictureUrl')"
                                    style="width: 100px"
                                    :preview-src-list="form.papersConsPictureUrl.split(',')"
                                />
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
                            <!--详细地址-->
                            <el-form-item :label="$t('entryAuditTable.detailAddress')">
                                <span>{{ form.umsSellerCompany.addressDetail }}</span>
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
                                    style="width: 100px"
                                    :preview-src-list="[form.umsSellerCompany.businessLicensePictureUrl]"
                                />
                            </el-form-item>
                        </template>
                        <!-- 个人买家 -->
                        <template v-if="form.sellerType == '1'">
                            <!-- 证件信息 -->
                            <BmBaseTitle :title="$t('sellerList.naturalPersonInfo')" />
                            <!-- 提示 -->
                            <BmAlert type="warning" :title="$t('entryAudit.tips')" icon="warning" />
                            <!-- 姓名 -->
                            <el-form-item :label="$t('entryAudit.name')">
                                <span>{{ form.papersName }}</span>
                            </el-form-item>
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
                                <BmImage :src="form.papersPictureUrl" :alt="$t('entryAuditTable.papersPictureUrl')" style="width: 100px" :preview-src-list="form.papersPictureUrl.split(',')" />
                            </el-form-item>
                            <!-- 证件正面照-->
                            <el-form-item :label="$t('entryAudit.prosPictureUrl')">
                                <BmImage :src="form.papersProsPictureUrl" :alt="$t('entryAudit.consPictureUrl')" style="width: 100px" :preview-src-list="form.papersProsPictureUrl.split(',')" />
                            </el-form-item>
                            <!-- 证件正面照-->
                            <el-form-item :label="$t('entryAudit.consPictureUrl')">
                                <BmImage :src="form.papersConsPictureUrl" :alt="$t('entryAudit.consPictureUrl')" style="width: 100px" :preview-src-list="form.papersConsPictureUrl.split(',')" />
                            </el-form-item>
                            <!-- 联系地址 -->
                            <el-form-item :label="$t('entryAudit.contactArea')">
                                <span>{{ form.address }}{{ form.addressDetail }}</span>
                            </el-form-item>
                        </template>
                    </el-form>
                </el-tab-pane>
                <!-- 银行结算信息 -->
                <el-tab-pane :label="$t('sellerList.bankSettlementInfo')" name="third">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" verticalGap>
                        <!-- 状态 -->
                        <el-form-item :label="$t('sellerList.status')">
                            <!-- <span>{{
                                form.bankSettlementInfo.payoneerStatusName
                            }}</span> -->
                        </el-form-item>
                        <!-- Payee_id -->
                        <el-form-item :label="$t('sellerList.Payee_id')">
                            <!-- <span>{{
                                form.bankSettlementInfo.payoneerAccount
                            }}</span> -->
                        </el-form-item>
                        <!-- 收款联系人名称 -->
                        <el-form-item :label="$t('sellerList.receivingContactName')">
                            <!-- <span>{{ form.bankSettlementInfo.holder }}</span> -->
                        </el-form-item>
                        <!-- 最近更新时间 -->
                        <el-form-item :label="$t('sellerList.lastUpdateTime')">
                            <!-- <span>{{
                                form.bankSettlementInfo.updateTime
                            }}</span> -->
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- 销售权限 -->
                <el-tab-pane :label="$t('sellerList.salesAuthority')" name="fourth"></el-tab-pane>
            </el-tabs>
        </div>
        <template #footer>
            <div class="flex hcenter vcenter">
                <!-- 返回 -->
                <el-button @click="handelCancel" class="mr-20">{{ $t("cancel") }}</el-button>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { getSellersAllAccount, getBankSettlementInfo } from "@/api/store";
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
        watch(
            () => props.row,
            (nVal) => {
                form.value = props.row;
                // 调用财务-当前卖家所有账户查询接口
                getSellersAllAccount({ sellerId: form.value.userId }).then((res) => {
                    let bankSettlementInfo = res.data;
                    // 卖家收款账号payoneer账号状态(数字转文字 0未激活 1已激活)
                    for (let i in dict.value.payoneerStatus) {
                        if (dict.value.payoneerStatus[i].value == bankSettlementInfo.payoneerStatus) {
                            bankSettlementInfo.payoneerStatusName = dict.value.payoneerStatus[i].name;
                            break;
                        }
                    }
                    form.value.bankSettlementInfo = bankSettlementInfo;
                });
            }
        );
        const formRef = ref(null);
        const handelCancel = () => {
            emit("update:visible", false);
        };
        // tab首屏显示内容控制变量
        const activeName = "first";
        return {
            dict,
            form,
            formRef,
            handelCancel,
            activeName
        };
    }
};
</script>
<style lang="scss">
.fixdDialog .el-dialog__body {
    height: 500px !important;
}
</style>
