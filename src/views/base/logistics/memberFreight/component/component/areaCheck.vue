<template>
    <BmDialog v-model:visible="visible" :title="$t('memberShippingTemplate.chooseShippingArea')" :confirm="confirm" :cancel="cancel" @close="cancel" width="80vw">
        <!-- 地区选择 -->
        <div class="flex border" v-for="item in areasTree" :key="item.id" style="position:relative">
            <div @click="handleCheckChange(1, item)" :class="['area-item', { ck: !!item.ck }, { disabled: !!item.disabled }]">{{ item.name }}</div>
            <div class="flex1">
                <div v-for="cityItem in item.childs" :key="cityItem.id" class="flex border-bottom border-left">
                    <div @click="handleCheckChange(2, item, cityItem)" :class="['area-item', { ck: !!cityItem.ck }, { disabled: !!cityItem.disabled }]">{{ cityItem.name }}</div>
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
import { ref, getCurrentInstance, watch } from "vue";
import { areaFindAreasTree } from "@/api/base";

export default {
    name: "areaCheck",
    components: {},
    props: {
        visible: Boolean,
        chooseCode: Array,
        disabledCode: Array
    },
    emits: ["update:visible", "change"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let form = ref({});

        //监听选中的code
        watch(
            () => props.chooseCode,
            (nVal) => {
                areasTreeNew(nVal);
            },
            {
                deep: true
            }
        );

        //禁用选中的新树
        const areasTreeNew = (nVal) => {
            const disabledCode = props.disabledCode;
            let areasTreeTmp = areasTree.value;

            areasTreeTmp.forEach((item) => {
                if (nVal) {
                    if (nVal.includes(item.areaCode)) item.ck = 1;
                    if (disabledCode.includes(item.areaCode)) item.disabled = 1;
                } else {
                    item.ck = 0;
                    item.disabled = 0;
                }
                item.childs.forEach((cityItem) => {
                    if (nVal) {
                        if (nVal.includes(cityItem.areaCode)) cityItem.ck = 1;
                        if (disabledCode.includes(cityItem.areaCode)) cityItem.disabled = 1;
                    } else {
                        cityItem.ck = 0;
                        cityItem.disabled = 0;
                    }

                    cityItem.childs.forEach((areaItem, index) => {
                        if (nVal) {
                            if (nVal.includes(areaItem.areaCode)) areaItem.ck = 1;
                            if (disabledCode.includes(areaItem.areaCode)) areaItem.disabled = 1;
                        } else {
                            areaItem.ck = 0;
                            areaItem.disabled = 0;
                        }
                    });
                });
            });

            areasTree.value = areasTreeTmp;
            // debugger;
        };

        // 获取地区树信息
        let areasTree = ref([]);
        function getAreaData() {
            areaFindAreasTree({ isCurrentSite: 1 })
                .then((res) => {
                    if (res.data && res.data.length) {
                        const countryCode = res.data[0].code;
                        let areasTreeTmp = res.data[0].childs;

                        // 重新整理地区树
                        areasTreeTmp.forEach((item) => {
                            item.areaCode = item.code; // 城市code
                            item.cityCode = item.code; // 城市code
                            item.provinceCode = item.code; // 省份code
                            item.countryCode = countryCode; // 国家code
                            item.freightTempPayAreas = [];
                            item.ck = 0;
                            item.disabled = 0;
                            delete item.code;
                            delete item.id;
                            delete item.pid;
                            delete item.lev;
                            item.childs.forEach((cityItem) => {
                                cityItem.areaCode = cityItem.code; // 城市code
                                cityItem.cityCode = cityItem.code; // 城市code
                                cityItem.provinceCode = item.provinceCode; // 省份code
                                cityItem.countryCode = countryCode; // 国家code
                                cityItem.freightTempPayAreas = [];
                                cityItem.ck = 0;
                                cityItem.disabled = 0;
                                delete cityItem.code;
                                delete cityItem.id;
                                delete cityItem.pid;
                                delete cityItem.lev;
                                cityItem.childs.forEach((areaItem, index) => {
                                    areaItem.areaCode = areaItem.code; // 城市code
                                    areaItem.cityCode = cityItem.cityCode; // 城市code
                                    areaItem.provinceCode = item.provinceCode; // 省份code
                                    areaItem.countryCode = countryCode; // 国家code
                                    areaItem.freightTempPayAreas = [];
                                    areaItem.ck = 0;
                                    areaItem.disabled = 0;
                                    delete areaItem.code;
                                    delete areaItem.id;
                                    delete areaItem.pid;
                                    delete areaItem.lev;
                                });
                            });
                        });

                        areasTree.value = areasTreeTmp;
                        console.log("areasTreeTmp", areasTreeTmp);
                    }
                })
                .catch(() => {});
        }
        getAreaData();

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

        let areaCodeList = []; //新选中的code
        // 筛选选中的code
        const selectAreaCode = (val) => {
            val.forEach((item) => {
                if (item.ck == 1) {
                    areaCodeList.push(item);
                }
                if (Array.isArray(item.childs) && item.childs.length > 0) {
                    selectAreaCode(item.childs);
                }
            });
        };

        const confirm = () => {
            const loading = proxy.$loading();
            setTimeout(() => {
                // debugger;
                selectAreaCode(areasTree.value);

                emit("change", areaCodeList);
                emit("update:visible", false);

                areaCodeList = [];
                areasTreeNew(); //恢复数据
                loading.close();
            }, 100);
        };
        const cancel = () => {
            // debugger;
            areasTreeNew(); //恢复数据
            emit("update:visible", false);
        };

        return {
            areasTree,

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
