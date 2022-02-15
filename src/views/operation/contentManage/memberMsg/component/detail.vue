<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" :cancel="cancel" :cancelText="$t('close')" noConfirm :width="800">
        <el-form :model="form" label-width="auto">
            <el-form-item :label="$t('contentMsg.category')">
                {{ form.categoryName }}
            </el-form-item>

            <el-form-item :label="$t('contentManage.title')">
                {{ form.title }}
            </el-form-item>
            <!-- 内容 -->
            <el-form-item :label="$t('contentManage.content')">
                {{ form.content }}
            </el-form-item>
            <div class="p-20 bg-light-grey">
                <!-- 消息对象 -->
                <el-form-item :label="$t('contentMsg.objectType')">
                    <el-radio-group v-model="form.objectType" disabled>
                        <el-radio v-for="(item, index) in objectTypeList" :key="index" :label="index"
                            >{{ item }} <span v-if="index == 2">({{ form.objectIds && form.objectIds.length }})</span></el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <!-- 接收平台 -->
                <el-form-item :label="$t('contentMsg.receivePlatform')">
                    <el-checkbox-group v-model="form.receivePlatform">
                        <el-checkbox v-for="(item, index) in receivePlatformList" :key="index" :label="index" disabled>{{ item }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!-- 发布方式 -->
                <el-form-item :label="$t('contentMsg.releaseType')">
                    <el-radio-group v-model="form.releaseType" disabled>
                        <el-radio v-for="(item, index) in releaseTypeList" :key="index" :label="index">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.releaseType == 2" :label="$t('contentMsg.setTime')">
                    <el-date-picker v-model="form.setTime" type="datetime" :placeholder="$t('contentMsg.setTime')" disabled> </el-date-picker>
                </el-form-item>
            </div>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, getCurrentInstance, watch, computed } from "vue";
import SelectionMenuTree from "@/components/selectionMenuTree";

export default {
    name: "memberMsgDetail",
    components: { SelectionMenuTree },
    props: {
        visible: Boolean,
        row: Object,
        treeData: Array
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

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
                form.value = nVal;
            }
        );

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            objectTypeList,
            receivePlatformList,
            releaseTypeList,
            form,
            cancel
        };
    }
};
</script>
