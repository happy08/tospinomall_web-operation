<template>
    <BmDialog v-model:visible="visible" :title="$t('memberShippingTemplate.chooseShippingArea')" :confirm="confirm" :cancel="cancel" width="80vw">
        <!-- 地区选择 -->
        <div class="flex border" v-for="item in form" :key="item.id" style="position:relative">
            <div @click="handleCheckChange(1, item)" :class="['area-item', { ck: !!item.ck }, { disabled: !!item.disabled }]">{{ item.name }}</div>
            <div class="flex1">
                <div v-for="cityItem in item.childs" :key="cityItem.id" class="flex border-bottom border-left">
                    <div @click="handleCheckChange(2, item, cityItem)" :class="['area-item', { ck: !!cityItem.ck }, { disabled: !!cityItem.disabled }]">
                        {{ cityItem.name }}
                    </div>
                    <div class="flex1 border-left">
                        <div
                            v-for="areaItem in cityItem.childs"
                            :key="areaItem.id"
                            @click="handleCheckChange(3, item, cityItem, areaItem)"
                            :class="['area-item', { ck: !!areaItem.ck }, { disabled: !!areaItem.disabled }]"
                        >
                            {{ areaItem.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 配送时间选择弹窗 -->
        <BmDialog v-model:visible="timeVisible" :title="$t('memberShippingTemplate.estimatedDeliveryTimeConfiguration')" :confirm="deliveryTimeConfirm" :cancel="deliveryTimeCancel" width="600px">
            <div class="flex">
                <div style="width:20%">
                    {{ $t("memberShippingTemplate.estimatedDeliveryTime") }}
                </div>
                <div>
                    <el-select v-model="copyAreaItem.deliveryTimeValue">
                        <el-option v-for="item in deliveryTimeArr" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
        </BmDialog>
    </BmDialog>
</template>

<script>
import { ref, inject, getCurrentInstance, watch } from "vue";
import { deepClone } from "@/utils/";
export default {
    name: "AttributeAdd",
    components: {},
    props: {
        visible: Boolean,
        row: Object,
        deliveryTime: Array
    },
    emits: ["update:visible", "updateProvinceNum"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = ref({});

        watch(
            () => props.row,
            (nVal) => {
                form.value = deepClone(nVal);
            },
            { deep: true }
        );

        // 配送时间对应数据
        let deliveryTimeArr = props.deliveryTime;
        // 选中省份的数量
        let provinceChooseNum = ref(0);
        // 地区选择的值发生变化的时候的监听事件
        const handleCheckChange = (num, item, cityItem, areaItem) => {
            // 首选判断点击的是哪一级地区
            switch (num) {
                case 1: // 省级
                    if (item.disabled) return;
                    item.ck = item.ck == 1 ? 0 : 1;
                    areaTypeChange(item);
                    break;
                case 2: // 市级
                    if (cityItem.disabled) return;
                    cityItem.ck = cityItem.ck == 1 ? 0 : 1;
                    areaTypeChange(cityItem);
                    areaTypeAllChange(cityItem, item);
                    break;
                case 3: // 区级
                    if (areaItem.disabled) return;
                    areaItem.ck = areaItem.ck == 1 ? 0 : 1;
                    areaTypeAllChange(areaItem, cityItem);
                    areaTypeAllChange(cityItem, item);
                    break;
            }
        };
        // 递归循环，将子级的选择状态变更为跟父级一样
        const areaTypeChange = (val) => {
            if (val.childs.length > 0) {
                val.childs.map((valSonItem) => {
                    // 禁用的地区状态不跟随父级变化
                    if (!valSonItem.disabled) {
                        valSonItem.ck = val.ck;
                    }
                    return areaTypeChange(valSonItem);
                });
            }
        };
        // 如果子级全选或者全不选，则父级的选择状态也随之改变
        const areaTypeAllChange = (val, valParent) => {
            if (valParent.childs.length == 1) {
                valParent.ck = val.ck;
                return;
            }
            for (let i = 0; i < valParent.childs.length - 1; i++) {
                if (valParent.childs[i].ck != valParent.childs[i + 1].ck) {
                    valParent.ck = 0;
                    break;
                } else {
                    valParent.ck = val.ck;
                }
            }
        };
        // 已选择的省份code数组
        let provinceChooseArr = ref([]);
        // 递归循环得出多少个省或下属区域有勾选
        // const proveinceChooseJudge = (val) => {
        //     val.map((item, index) => {
        //         // debugger
        //         // 如果父级有勾选，则直接进行终止当前循环下一次循环
        //         if (item.ck) {
        //             // if (item.childs.length == 0) {
        //             //     // debugger
        //             // }
        //             provinceChooseNum.value++
        //         } else {
        //             // 如果父级没有勾选，就循环子级，将每一个子级拿去判断是否有无勾选
        //             if (item.childs) {
        //                 return proveinceChooseJudge(item.childs)
        //             }
        //         }
        //     })
        // }
        const proveinceChooseJudge = (val) => {
            provinceChooseArr = [];
            for (let i = 0; i < val.length; i++) {
                // 省
                if (val[i].ck) {
                    provinceChooseArr.push(val[i].name);
                } else {
                    if (val[i].childs.length) {
                        for (let j = 0; j < val[i].childs.length; j++) {
                            // 市
                            if (val[i].childs[j].ck) {
                                provinceChooseArr.push(val[i].name);
                                break;
                            } else {
                                if (val[i].childs[j].childs.length) {
                                    for (let l = 0; l < val[i].childs[j].childs.length; l++) {
                                        // 区
                                        if (val[i].childs[j].childs[l].ck) {
                                            provinceChooseArr.push(val[i].name);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }
        };
        // 修改配送时间的桥接数据
        let copyAreaItem = ref({
            deliveryTimeValue: 1017
        });
        // 配送时间选择的关闭和显示框
        let timeVisible = ref(false);
        // 配送时间按钮的监听事件
        const handleDeliveryTime = (val) => {
            let tempDeliveryTimeValue = copyAreaItem.value.deliveryTimeValue;
            timeVisible.value = true;
            copyAreaItem.value = val;
            copyAreaItem.value.deliveryTimeValue = tempDeliveryTimeValue;
        };
        // 配送时间选择框关闭事件
        const deliveryTimeConfirm = () => {
            timeVisible.value = false;
        };
        // 配送事件选择框取消事件
        const deliveryTimeCancel = () => {
            deliveryTimeConfirm();
        };
        // 包邮地区未选择且可勾选地区code
        let freeAreaNotSelectCode = ref([]);
        // 使用loading,以免出现bug
        let flag = false;
        // 循环将每个地区重现启用
        const enableArea = (val) => {
            if (Array.isArray(val)) {
                val.forEach((item) => {
                    if (Array.isArray(item.childs) && item.childs.length > 0) {
                        return enableArea(item.childs);
                    }
                    item.disabled = 0;
                });
            }
        };
        const confirm = () => {
            const loading = proxy.$loading();
            setTimeout(() => {
                // 每次都先将省份选择的数量清空
                provinceChooseNum.value = 0;
                // proveinceChooseJudge(form.value);
                enableArea(form.value);
                emit("update:visible", false);
                emit("updateProvinceNum", provinceChooseArr, form.value);
                loading.close();
            }, 100);
        };
        const cancel = () => {
            // enableArea(form.value);
            emit("update:visible", false);
        };

        return {
            form,
            confirm,
            cancel,
            handleCheckChange,
            areaTypeChange,
            areaTypeAllChange,
            provinceChooseNum,
            deliveryTimeArr,
            copyAreaItem,
            handleDeliveryTime,
            timeVisible,
            deliveryTimeConfirm,
            deliveryTimeCancel,
            freeAreaNotSelectCode
        };
    }
};
</script>
<style lang="scss" scoped>
.area-item {
    padding-left: 20px;
    margin: 5px 10px 5px 10px;
    min-width: 150px;
    height: 20px;
    display: inline-block;
    cursor: pointer;
    position: relative;
    &::before {
        content: "√";
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -7px;
        width: 14px;
        height: 14px;
        border: solid 1px #c7caca;
        border-radius: 2px;
        color: #ffffff;
        line-height: 1;
        text-align: center;
    }
    &.disabled {
        color: #c7caca;
        cursor: not-allowed;
    }
    &.ck {
        color: #42b7ae;
        &::before {
            border: solid 1px #42b7ae;
            background-color: #42b7ae;
        }
    }
}
.border-bottom {
    border-bottom: solid 1px #f2f2f2;
}
.border-left {
    border-left: solid 1px #f2f2f2;
}
</style>
