<template>
    <BmDialog v-model:visible="visible" :title="$t('businessMessageSettings.messageTemplateSet')" :confirm="confirm" :cancel="cancel" :width="800">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="custom-tabs-green" type="card">
                <!-- 消息盒子模板 -->
                <el-tab-pane :label="$t('businessMessageSettings.messageBoxTemplate')" name="messageBox">
                    <!-- switch开关 -->
                    <div class="flex">
                        <span class="mr-20">{{ $t("businessMessageSettings.isStationSwitch") }}</span>
                        <el-switch class="mb-30" v-model="form.isStationSwitch" :active-value="1" :inactive-value="0"> </el-switch>
                    </div>
                    <!-- 消息内容 -->
                    <el-form-item :label="$t('businessMessageSettings.stationContent')" prop="stationContent">
                        <el-input v-model="form.stationContent" type="textarea" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-tab-pane>
                <!-- 邮件模板 -->
                <el-tab-pane :label="$t('businessMessageSettings.emailTemplate')" name="email">
                    <!-- switch开关 -->
                    <div class="flex">
                        <span class="mr-20">{{ $t("businessMessageSettings.isMailSwitch") }}</span>
                        <el-switch class="mb-30" v-model="form.isMailSwitch" :active-value="1" :inactive-value="0"> </el-switch>
                    </div>
                    <!-- 邮件标题 -->
                    <el-form-item :label="$t('businessMessageSettings.mailTitle')" prop="mailTitle">
                        <el-input v-model="form.mailTitle" type="textarea" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                    <!-- 邮件内容 -->
                    <el-form-item :label="$t('businessMessageSettings.mailContent')" prop="mailContent">
                        <el-input v-model="form.mailContent" type="textarea" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-tab-pane>
                <!-- 短消息模板 -->
                <el-tab-pane :label="$t('businessMessageSettings.shortMessageTemplate')" name="shortMessage">
                    <!-- switch开关 -->
                    <div class="flex">
                        <span class="mr-20">{{ $t("businessMessageSettings.isNoteSwitch") }}</span>
                        <el-switch class="mb-30" v-model="form.isNoteSwitch" :active-value="1" :inactive-value="0"> </el-switch>
                    </div>
                    <!-- 变量说明 -->
                    <div class="messageBox">
                        <!-- 商品审核驳回 -->
                        <div class="mb-15" v-if="form.id == 1">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.storeName") }}: ${storeName}</li>
                                    <li>{{ $t("businessMessageSettings.productName") }}: ${goodTitle}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- 验证码 -->
                        <div class="mb-15" v-if="form.id == 3">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.storeName") }}: ${storeName}</li>
                                    <li>{{ $t("businessMessageSettings.code") }}: ${code}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- FBM新订单提醒 -->
                        <div class="mb-15" v-if="form.id == 8">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.storeName") }}: ${storeName}</li>
                                    <li>{{ $t("businessMessageSettings.code") }}: ${code}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- FBM订单仅退款提醒 -->
                        <div class="mb-15" v-if="form.id == 4">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.orderSn") }}: ${orderSn}</li>
                                    <li>{{ $t("businessMessageSettings.productName") }}: ${goodTitle}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- FBM订单退货退款提醒 -->
                        <div class="mb-15" v-if="form.id == 5">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.orderSn") }}: ${orderSn}</li>
                                    <li>{{ $t("businessMessageSettings.productName") }}: ${goodTitle}</li>
                                </ul>
                            </div>
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.actualRefundAmount") }}: ${actualRefundAmount}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- 订单提交成功提醒 -->
                        <div class="mb-15" v-if="form.id == 9">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.orderSn") }}: ${orderSn}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- 验证码 -->
                        <div class="mb-15" v-if="form.id == 2">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.code") }}: ${code}</li>
                                </ul>
                            </div>
                        </div>
                        <!-- 余额变动提醒 -->
                        <div class="mb-15" v-if="form.id == 11">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.time") }}: ${time}</li>
                                    <li>{{ $t("businessMessageSettings.amount") }}: ${amount}</li>
                                </ul>
                            </div>
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.changeType") }}: ${changeType}</li>
                                </ul>
                            </div>
                        </div>
                        <!--付款成功提醒 -->
                        <div class="mb-15" v-if="form.id == 12">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.time") }}: ${time}</li>
                                    <li>{{ $t("businessMessageSettings.amount") }}: ${amount}</li>
                                </ul>
                            </div>
                        </div>
                        <!--退款失败提醒 -->
                        <div class="mb-15" v-if="form.id == 7">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.orderSn") }}: ${orderSn}</li>
                                    <li>{{ $t("businessMessageSettings.afterSaleType") }}: ${afterSaleType}</li>
                                </ul>
                            </div>
                        </div>
                        <!--退款成功提醒 -->
                        <div class="mb-15" v-if="form.id == 6">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.orderSn") }}: ${orderSn}</li>
                                    <li>{{ $t("businessMessageSettings.afterSaleType") }}: ${afterSaleType}</li>
                                </ul>
                            </div>
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.actualRefundAmount") }}: ${actualRefundAmount}</li>
                                </ul>
                            </div>
                        </div>
                        <!--订单发货提醒/订单催付提醒 -->
                        <div class="mb-15" v-if="form.id == 17 || form.id == 10">
                            {{ $t("businessMessageSettings.variableDescription") }}
                            <div>
                                <ul class="flex">
                                    <li>{{ $t("businessMessageSettings.username") }}: ${username}</li>
                                    <li>{{ $t("businessMessageSettings.orderSn") }}: ${orderSn}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- 通用短信 -->
                    <div style="border-bottom: 1px solid #e6e6e6;">
                        <div class="mtb-10">
                            {{ $t("businessMessageSettings.genericSMS") }}
                        </div>
                        <div class="mb-15 light-grey" style="fontSize:6px">
                            {{ $t("businessMessageSettings.smsTip") }}
                        </div>
                        <!-- 消息内容 -->
                        <el-form-item :label="$t('businessMessageSettings.noteContent')" prop="noteContent">
                            <el-input v-model="form.noteContent" type="textarea" maxlength="500" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <!-- 阿里中国短信 -->
                    <div style="border-bottom: 1px solid #e6e6e6;">
                        <div class="mtb-10">
                            {{ $t("businessMessageSettings.aliChinaSMS") }}
                        </div>
                        <div class="mb-15 light-grey" style="fontSize:6px">
                            {{ $t("businessMessageSettings.aliChinaSMSTip") }}
                        </div>
                        <!-- 阿里中国短信模板ID -->
                        <el-form-item :label="$t('businessMessageSettings.templateId')" prop="aliTemplateCode">
                            <el-input v-model="form.aliTemplateCode" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                        <!-- 阿里中国短信内容 -->
                        <el-form-item :label="$t('businessMessageSettings.noteContent')" prop="aliTemplateContent">
                            <el-input v-model="form.aliTemplateContent" type="textarea" :placeholder="$t('pleaseEnter')" maxlength="500" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <!-- 阿里国际短信 -->
                    <div>
                        <div class="mtb-10">
                            {{ $t("businessMessageSettings.aliInternationalSMS") }}
                        </div>
                        <div class="mb-15 light-grey" style="fontSize:6px">
                            {{ $t("businessMessageSettings.aliInternationalSMSTip") }}
                        </div>
                        <!-- 阿里国际短信模板ID -->
                        <el-form-item :label="$t('businessMessageSettings.templateId')" prop="aliForeignTemplateCode">
                            <el-input v-model="form.aliForeignTemplateCode" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                        <!-- 阿里国际短信内容 -->
                        <el-form-item :label="$t('businessMessageSettings.noteContent')" prop="aliForeignTemplateContent">
                            <el-input v-model="form.aliForeignTemplateContent" type="textarea" :placeholder="$t('pleaseEnter')" maxlength="500" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { editMessageTemplate } from "@/api/base";

export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object
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
            }
        );
        const rules = {
            stationContent: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            mailContent: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            noteContent: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        const formRef = ref(null);
        // table卡片激活页控制变量
        let activeName = ref("messageBox");
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    delete form.value.createTime;
                    delete form.value.updateTime;
                    editMessageTemplate(form.value)
                        .then((res) => {
                            proxy.$message.success("ok");
                            emit("reloadData");
                            emit("update:visible", false);
                            formRef.value.resetFields();
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            emit("update:visible", false);
            formRef.value.resetFields();
        };

        return {
            form,
            rules,
            formRef,
            confirm,
            cancel,
            activeName
        };
    }
};
</script>
<style lang="scss" scoped>
.messageBox {
    margin-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
    li {
        margin-top: 10px;
        margin-bottom: 3px;
        width: 200px;
        text-align: left;
    }
}
</style>
