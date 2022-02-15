<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 收件人 -->
            <el-form-item :label="$t('receiveAddressTable.name')" prop="name">
                <el-input v-model="form.name" maxlength="255" show-word-limit :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item :label="$t('receiveAddressTable.phone')" prop="phone">
                <el-input :placeholder="$t('pleaseEnter')" maxlength="20" show-word-limit @blur="handlePhone()" v-model="form.phone" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="form.prefixPhone" :placeholder="$t('pleaseSelect')" style="width:85px">
                            <el-option v-for="item in prefixPhone" :label="item.phonePrefix" :value="item.phonePrefix" :key="item.phonePrefix"></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 验证码 -->
            <!-- <el-form-item :label="$t('receiveAddress.verificationCode')" prop="verificationCode" v-if="updateType === 'add'">
                <el-input v-model="uPhoneCode" style="width: 40%" class="fl" :placeholder="$t('pleaseEnter')"></el-input>
                <el-button :type="buttonType" class="fr" @click="geCodetHandle" :disabled="getCodeButtonDisable">{{ buttonText }}</el-button>
            </el-form-item> -->
            <!-- 收货地址 -->
            <el-form-item :label="$t('receiveAddress.receivingAddress')" prop="chooseAreaCodeInfo">
                <el-cascader v-model="form.chooseAreaCodeInfo" :props="addressListOptions" ref="areaCascaderRef" @visible-change="getChooseAreaValue($event)" filterable />
            </el-form-item>

            <!-- 详细地址 -->
            <el-form-item :label="$t('receiveAddressTable.detailAddress')" prop="detailAddress">
                <el-input type="textarea" v-model="form.detailAddress" maxlength="1000" show-word-limit :placeholder="$t('pleaseEnter')"></el-input>
            </el-form-item>
            <!-- FBT收货地址/退货地址 -->
            <!-- <el-form-item
        :label="$t('receiveAddress.type')"
        prop="type"
        v-if="updateType === 'add'"
      >
        <el-radio v-model="form.type" :label="1">{{
          $t("receiveAddress.FBTReceiveAddress")
        }}</el-radio>
        <el-radio v-model="form.type" :label="2">{{
          $t("receiveAddress.FBTReturnGoodsAddress")
        }}</el-radio>
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
import { editReceiveAddress, addReceiveAddress, basicsAreaFindByParentId } from "@/api/base";
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
                    form.value.prefixPhone = proxy.$store.state.app.phonePrefix;
                } else {
                    form.value.chooseAreaCodeInfo = [form.value.countryCode, form.value.provinceCode, form.value.cityCode, form.value.regionCode];
                }
            }
            //{ immediate: true }
        );
        // 手机号前缀：
        const prefixPhone = ref([]);
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
        const formRef = ref(null);
        // 是否默认地址按钮监听事件
        // 默认不设为默认地址
        form.isDefault = 0;
        const changeDefaultHandle = () => {
            // 反选
            form.isDefault = !form.isDefault;
        };
        // 地区级联选择框隐藏时触发的监听事件
        const getChooseAreaValue = (val) => {
            if (!val) {
                setTimeout(() => {
                    chooseAreaNameInfo.value = proxy.$refs.areaCascaderRef.getCheckedNodes()[0].text;
                }, 1000);
            }
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
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    // 手动将类型设置为FBT退货地址
                    form.value.type = 2;
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
                        type = attributeAdd;
                        addReceiveAddress(form.value)
                            .then((res) => {
                                // 添加用户成功
                                console.log(res.data);
                                emit("reloadData");
                                emit("update:visible", false, form.value.type);
                                proxy.$message.success(proxy.$t("receiveAddress.addSuccess"));
                            })
                            .catch(() => {
                                // 添加用户失败
                                proxy.$message.error(proxy.$t("receiveAddress.addFail"));
                            });
                    } else if (updateType.value === "edit") {
                        // 编辑操作
                        editReceiveAddress(form.value)
                            .then((res) => {
                                emit("reloadData");
                                emit("update:visible", false);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
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
            changeDefaultHandle,
            prefixPhone,
            addressListOptions,
            areaChooseProps,
            getChooseAreaValue,
            areaCascaderRef,
            chooseAreaNameInfo,
            handlePhone
        };
    }
};
</script>
