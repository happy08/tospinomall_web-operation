<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="800">
        <el-form ref="formRef" :model="form" label-width="auto">
            <el-form-item :label="$t('contentMsg.category')" prop="categoryId" :rules="rulesCommon.required">
                <el-select v-model="form.categoryId" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in treeData" :key="item.id" :label="item.categoryName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('contentManage.title')" prop="title" :rules="rulesCommon.required">
                <el-input v-model="form.title" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <!-- 内容 -->
            <el-form-item :label="$t('contentManage.content')" prop="content" :rules="rulesCommon.required">
                <el-input v-model="form.content" type="textarea" maxlength="1500" show-word-limit></el-input>
            </el-form-item>
            <div class="p-20 bg-light-grey">
                <!-- 消息对象 -->
                <el-form-item :label="$t('contentMsg.objectType')" prop="objectType" :rules="rulesCommon.required">
                    <el-radio-group v-model="form.objectType">
                        <el-radio v-for="(item, index) in objectTypeList" :key="index" :label="index" @click="changeObjectType(index)"
                            >{{ item }} <span v-if="index == 2">({{ form.objectIds.length }})</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 接收平台 -->
                <el-form-item :label="$t('contentMsg.receivePlatform')" prop="receivePlatform" :rules="rulesCommon.required">
                    <el-checkbox-group v-model="form.receivePlatform">
                        <el-checkbox v-for="(item, index) in receivePlatformList" :key="index" :label="index">{{ item }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!-- 发布方式 -->
                <el-form-item :label="$t('contentMsg.releaseType')" prop="releaseType" :rules="rulesCommon.required">
                    <el-radio-group v-model="form.releaseType">
                        <el-radio v-for="(item, index) in releaseTypeList" :key="index" :label="index">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.releaseType == 2" :label="$t('contentMsg.setTime')" prop="setTime" :rules="rulesCommon.required">
                    <el-date-picker v-model="form.setTime" type="datetime" :placeholder="$t('contentMsg.setTime')" :disabled-date="disabledDate" format="YYYY-MM-DD HH:mm:ss"> </el-date-picker>
                </el-form-item>
            </div>
        </el-form>
    </BmDialog>

    <!-- 指定会员列表 -->
    <SelectionMemberList v-model:visible="memberVisible" :ids="form.objectIds" @change="onChangeObjectIds" />
</template>

<script>
import { ref, getCurrentInstance, watch, computed } from "vue";
import { messagePushMallAddMsg, messagePushMallUpdateById } from "@/api/operation";
import SelectionMemberList from "@/components/selectionMemberList";
import dayjs from "dayjs";

export default {
    name: "storeDesignAdd",
    components: { SelectionMemberList },
    props: {
        visible: Boolean,
        row: Object,
        treeData: Array
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        //消息对象
        const objectTypeList = computed(() => {
            return {
                1: proxy.$t("contentMsg.allMemeber"),
                2: proxy.$t("contentMsg.assignMemeber")
            };
        });
        //接收平台
        const receivePlatformList = computed(() => {
            return {
                1: "Android",
                2: "IOS",
                3: "H5",
                4: "PC"
            };
        });
        //发布方式
        const releaseTypeList = computed(() => {
            return {
                1: proxy.$t("contentMsg.publish"),
                2: proxy.$t("contentMsg.timing"),
                3: proxy.$t("contentMsg.drafts")
            };
        });

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = {
                    ...nVal,
                    objectIds: (nVal.objectIds && nVal.objectIds.split(",")) || []
                };
            }
        );

        const rulesCommon = {
            required: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        //禁用今日以前日期
        const disabledDate = (time) => {
            return time.getTime() < Date.now() - 8.64e7;
        };

        // 指定会员列表
        let memberVisible = ref(false);
        const changeObjectType = (type) => {
            if (type == 2) {
                memberVisible.value = true;
            }
        };
        const onChangeObjectIds = (ids) => {
            form.value.objectIds = ids;
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    //立即发布 会员未选择
                    if (form.value.releaseType == 1 && form.value.objectType == 2 && form.value.objectIds == "") {
                        proxy.$message.error(proxy.$t("contentMsg.selectMemeber"));
                        return;
                    }
                    let type = messagePushMallUpdateById;
                    if (updateType.value === "add") {
                        type = messagePushMallAddMsg;
                    }
                    const params = {
                        ...form.value,
                        objectIds: form.value.objectIds.join(","),
                        receivePlatform: form.value.receivePlatform.join(","),
                        setTime: dayjs(form.value.setTime).format("YYYY-MM-DD HH:mm:ss") //formatStandardDate(form.value.setTime, true),
                    };
                    type(params)
                        .then((res) => {
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
        };

        return {
            objectTypeList,
            receivePlatformList,
            releaseTypeList,
            updateType,
            form,
            rulesCommon,
            disabledDate,
            formRef,
            memberVisible,
            changeObjectType,
            onChangeObjectIds,
            confirm,
            cancel
        };
    }
};
</script>
