<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 收件人 -->
            <el-form-item :label="$t('receiveAddressTable.name')" prop="name">
                <el-input v-model="form.name" :placeholder="$t('pleaseEnter')" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item :label="$t('receiveAddressTable.phone')" prop="phone">
                <el-input :placeholder="$t('pleaseEnter')" v-model="form.phone" @blur="handlePhone()" type="number" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="form.prefixPhone" @change="handlePhone()" :placeholder="$t('pleaseSelect')" style="width:85px">
                            <el-option v-for="item in prefixPhone" :label="item.phonePrefix" :value="item.phonePrefix" :key="item.phonePrefix"></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 验证码 -->
            <!-- <el-form-item :label="$t('receiveAddress.verificationCode')" prop="verificationCode" v-if="updateType === 'add'">
                <el-input v-model="uPhoneCode" style="width: 40%" class="fl" :placeholder="$t('pleaseEnter')" maxlength="6" @blur="verificationCodeOfVerify()"></el-input>
                <el-button style="width:100px" :type="buttonType" class="fr" @click="geCodetHandle" :disabled="getCodeButtonDisable">{{ buttonText }}</el-button>
            </el-form-item> -->
            <!-- 收货地址 -->
            <el-form-item :label="$t('receiveAddress.receivingAddress')" prop="chooseAreaCodeInfo">
                <el-cascader v-model="form.chooseAreaCodeInfo" :props="addressListOptions" ref="areaCascaderRef" @visible-change="getChooseAreaValue($event)" filterable />
                <!-- <el-cascader v-model="form.chooseAreaCodeInfo" :options="areaTree" :props="areaChooseProps" ref="areaCascaderRef" @visible-change="getChooseAreaValue($event)"></el-cascader> -->
            </el-form-item>
            <!-- 国家 -->
            <!-- <el-form-item :label="$t('receiveAddressTable.countryName')" prop="countryName">
                <el-input v-model="form.countryName" :placeholder="$t('pleaseEnter')" maxlength="50" show-word-limit></el-input>
            </el-form-item> -->
            <!-- 省 -->
            <!-- <el-form-item :label="$t('receiveAddress.provinceName')" prop="provinceName">
                <el-input v-model="form.provinceName" :placeholder="$t('pleaseEnter')" maxlength="50" show-word-limit></el-input>
            </el-form-item> -->
            <!-- 市 -->
            <!-- <el-form-item :label="$t('receiveAddress.cityName')" prop="cityName">
                <el-input v-model="form.cityName" :placeholder="$t('pleaseEnter')" maxlength="50" show-word-limit></el-input>
            </el-form-item> -->
            <!-- 区 -->
            <!-- <el-form-item :label="$t('receiveAddress.regionName')" prop="regionName">
                <el-input v-model="form.regionName" :placeholder="$t('pleaseEnter')" maxlength="50" show-word-limit></el-input>
            </el-form-item> -->
            <!-- 详细地址 -->
            <el-form-item :label="$t('receiveAddressTable.detailAddress')" prop="detailAddress">
                <el-input v-model="form.detailAddress" :placeholder="$t('pleaseEnter')" maxlength="500" type="textarea" rows="3" show-word-limit></el-input>
            </el-form-item>
            <!-- FBT收货地址/退货地址 -->
            <!-- <el-form-item :label="$t('receiveAddress.type')" prop="type" v-if="updateType === 'add'">
                <el-radio v-model="form.type" :label="1">{{ $t("receiveAddress.FBTReceiveAddress") }}</el-radio>
                <el-radio v-model="form.type" :label="2">{{ $t("receiveAddress.FBTReturnGoodsAddress") }}</el-radio>
            </el-form-item> -->
            <!-- 是否设为默认地址 -->
            <el-form-item :label="$t('receiveAddress.isDefault')" prop="isDefault" v-if="updateType === 'add'">
                <el-checkbox v-model="form.isDefault" @change="changeDefaultHandle"></el-checkbox>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { attributeAdd, attributeUpdateById, attributeListGoodsCategoryByAttrId } from "@/api/goods";
import { editReceiveAddress, addReceiveAddress, getPhoneCode, checkPhoneCode, areaFindAreasTree, basicsAreaFindByParentId } from "@/api/base";
import { basePhonePrefix } from "@/api/user";

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

        //const lang = computed(() => store.state.app.lang);
        // watch(lang, (nVal) => {
        //     initData();
        // });

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));
        let form = ref({});

        // 地区信息Code选择数据
        let chooseAreaCodeInfo = ref([]);
        // 地区信息name选择数据
        let chooseAreaNameInfo = ref("");
        // 地区信息级联选择配置
        const areaChooseProps = {
            value: "code",
            label: "name",
            children: "aresChilds"
        };
        let areaCascaderRef = ref(null);
        watch(
            () => props.row,
            (nVal) => {
                form.value = { ...nVal };
                if (form.value.type == "1") {
                } else {
                    form.value.chooseAreaCodeInfo = [form.value.countryCode, form.value.provinceCode, form.value.cityCode, form.value.regionCode];
                    form.value.prefixPhone = proxy.$store.state.app.phonePrefix;
                }
                // 请求地区信息数据
                // areaFindAreasTree().then((res) => {
                //     areaTree.value = res.data;
                // });
            }
            //{ immediate: true }
        );
        // 地区树信息数据
        const addressListOptions = reactive({
            lazy: true,
            lazyLoad(node, resolve) {
                const { level, data } = node;
                basicsAreaFindByParentId({ parentId: data.id || 0 })
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

        // 用户填写手机号验证码
        let uPhoneCode = ref("");
        // 手机号前缀：
        let prefixPhone = ref({});
        //获取手机前缀
        const getBasePhonePrefix = () => {
            basePhonePrefix(0)
                .then((res) => {
                    prefixPhone.value = res.data;
                })
                .catch((err) => {});
        };
        getBasePhonePrefix();

        const rules = {
            name: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            phone: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            phone: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            chooseAreaCodeInfo: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            detailAddress: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            }
        };
        // 手机号验证码获取与校验请求参数
        const params = reactive({
            phonePrefix: proxy.$store.state.app.phonePrefix,
            userType: "operator"
        });

        const formRef = ref(null);
        // 获取短信验证码按钮的type变量
        let buttonType = ref("sucssess");
        // 控制短信验证码按钮是否禁用变量
        let getCodeButtonDisable = ref(false);
        // 短信按钮显示内容变量
        let buttonText = ref(proxy.$t("receiveAddress.getVerificationCode"));
        // 获取短信验证码倒计时变量
        let countDownNumber = ref(59);
        // 倒计时定时器函数
        let countDownTime = null;
        const countDownTimeFn = () => {
            countDownNumber.value = 59;
            countDownTime = setInterval(() => {
                buttonText.value = countDownNumber.value;
                countDownNumber.value--;
                if (countDownNumber.value == 1) {
                    buttonText.value = proxy.$t("receiveAddress.getVerificationCode");
                    getCodeButtonDisable.value = false;
                    buttonType.value = "primary";
                    clearInterval(countDownTime);
                }
            }, 1000);
        };
        // 手机号input输入框失去焦点时候的监听事件
        const handlePhone = () => {
            // 判断手机前缀是否选择
            if (form.value.prefixPhone) {
                if (form.value.phone) {
                    buttonType.value = "primary";
                } else {
                    buttonType.value = "sucssess";
                }
            }
        };
        // 验证码input输入框失去焦点时候的监听事件
        const verificationCodeOfVerify = () => {
            if (uPhoneCode == "") {
                proxy.$message.warning(proxy.$t("receiveAddress.verifyCodeLengthMustSix"));
                flag.value = false;
            } else {
                flag.value = true;
            }
        };
        // 点击获取验证码按钮的监听事件
        const geCodetHandle = () => {
            // 首先判断手机号前缀是否选择
            if (form.value.prefixPhone) {
                if (form.value.phone) {
                    getCodeButtonDisable.value = true;
                    params.phone = form.value.phone;
                    params.phonePrefix = form.value.prefixPhone;
                    buttonType.value = "info";
                    countDownTimeFn();
                } else {
                    proxy.$message.warning(proxy.$t("receiveAddress.pleaseWritePhone"));
                    return;
                }
            } else {
                proxy.$message.warning(proxy.$t("warehouse.phoneEnterTip"));
                return;
            }
            getPhoneCode(params)
                .then((res) => {
                    proxy.$message.success(proxy.$t("receiveAddress.getPhoneCodeSuccess"));
                    uPhoneCode.value = res.data;
                })
                .catch((err) => {});
        };
        // 是否默认地址按钮监听事件
        // 默认不设为默认地址
        form.isDefault = 0;
        const changeDefaultHandle = () => {
            // 反选
            form.isDefault = !form.isDefault;
        };
        // 表单规范是否检验完成标识变量
        let flag = ref(false);
        // 地区级联选择框隐藏时触发的监听事件
        const getChooseAreaValue = (val) => {
            if (!val) {
                setTimeout(() => {
                    chooseAreaNameInfo.value = proxy.$refs.areaCascaderRef.getCheckedNodes()[0].text;
                }, 1000);
            }
        };
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    if (uPhoneCode) {
                        flag.value = true;
                    }
                    let type = attributeUpdateById;
                    // 将地区选择的code与name信息放进form
                    form.value.countryCode = form.value.chooseAreaCodeInfo[0];
                    form.value.provinceCode = form.value.chooseAreaCodeInfo[1];
                    form.value.cityCode = form.value.chooseAreaCodeInfo[2];
                    form.value.regionCode = form.value.chooseAreaCodeInfo[3];
                    chooseAreaNameInfo.value = chooseAreaNameInfo.value.split("/");
                    form.value.countryName = chooseAreaNameInfo.value[0];
                    form.value.provinceName = chooseAreaNameInfo.value[1];
                    form.value.cityName = chooseAreaNameInfo.value[2];
                    form.value.regionName = chooseAreaNameInfo.value[3];
                    // 添加操作
                    if (updateType.value === "add") {
                        if (!flag.value) {
                            proxy.$message.warning(proxy.$t("receiveAddress.PleaseFillInTheFormDataStandardly"));
                            return;
                        }
                        type = attributeAdd;
                        // 手机号验证码校验
                        params.code = uPhoneCode.value;
                        // checkPhoneCode(params)
                        //     .then((res) => {
                        // 验证成功 code = 0 , 失败 code = 1
                        if (form.value.isDefault) {
                            form.value.isDefault = 1;
                        } else {
                            form.value.isDefault = 0;
                        }
                        addReceiveAddress(form.value)
                            .then((res) => {
                                // 添加用户成功
                                emit("reloadData");
                                emit("update:visible", false, form.value.type);
                                proxy.$message.success(proxy.$t("receiveAddress.addSuccess"));
                            })
                            .catch(() => {
                                // 添加用户失败
                                proxy.$message.error(proxy.$t("receiveAddress.addFail"));
                            });
                        // })
                        // .catch((err) => {});
                    } else if (updateType.value === "edit") {
                        // 编辑操作
                        editReceiveAddress(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch((err) => {});
                    }
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            uPhoneCode.value = "";
            form.isDefault = "";
            buttonType.value = "sucssess";
            getCodeButtonDisable.value = false;
            buttonText.value = proxy.$t("receiveAddress.getVerificationCode");
            clearInterval(countDownTime);
            countDownNumber.value = 59;
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
            uPhoneCode,
            geCodetHandle,
            params,
            changeDefaultHandle,
            prefixPhone,
            buttonType,
            countDownNumber,
            buttonText,
            getCodeButtonDisable,
            handlePhone,
            verificationCodeOfVerify,
            flag,
            addressListOptions,
            chooseAreaCodeInfo,
            areaChooseProps,
            getChooseAreaValue,
            areaCascaderRef,
            chooseAreaNameInfo
        };
    }
};
</script>
