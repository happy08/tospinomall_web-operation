<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('cashOnDeliveryArea.cashOnDeliveryAreaTips')" icon="warning" class="mb-20" />
    </div>
    <!-- 地区选择 -->
    <div class="p-20 bg-white round-4">
        <div class="flex border" v-for="item in form" :key="item.id" style="position:relative">
            <div class="p-20">
                <el-checkbox @change="handleCheckChange(item)" v-model="item.isCod" :label="item.name" :checked="item.isCod" :true-label="1" :false-label="0">
                    <div class="w-120">{{ item.name }}</div>
                </el-checkbox>
            </div>
            <div>
                <div v-for="cityItem in item.aresChilds" :key="cityItem.id" class="flex border-bottom border-left">
                    <el-checkbox class="p-15" @change="handleCheckChange(cityItem, item)" v-model="cityItem.isCod" :label="cityItem.name" :checked="cityItem.isCod" :true-label="1" :false-label="0">
                        <div class="w-120">{{ cityItem.name }}</div>
                    </el-checkbox>
                    <div class="p-15 border-left">
                        <span v-for="areaItem in cityItem.aresChilds" :key="areaItem.id" class="mw-150 plr-10 iblock">
                            <el-checkbox
                                @change="handleCheckChange(areaItem, cityItem, item)"
                                v-model="areaItem.isCod"
                                :label="areaItem.name"
                                :checked="areaItem.isCod"
                                :true-label="1"
                                :false-label="0"
                            ></el-checkbox>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="button flex center mt-20">
            <el-button v-permission="'logistics_cashOnDeliveryArea_edit'" type="primary" @click="handleSave()">{{ $t("commodityEvaluationSettings.saveEdit") }}</el-button>
        </div>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import { getCashOnDeliveryArea, editCashOnDeliveryArea } from "@/api/base";
export default {
    name: "baseInfoArea",
    components: {},
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });
        // 平台信息表单数据对象
        let form = ref({});
        //获取列表
        const getListPage = () => {
            getCashOnDeliveryArea()
                .then((res) => {
                    // 1.将返回数据分别转为省、市、区三级
                    let arrObj = {
                        province: [],
                        city: [],
                        area: []
                    };
                    res.data.map((item) => {
                        switch (item.level) {
                            // 地区层级，0表示国家 1表示省 2表示市 3县/区
                            case 1:
                                item.aresChilds = [];
                                arrObj.province.push(item);
                                break;
                            case 2:
                                item.aresChilds = [];
                                arrObj.city.push(item);
                                break;
                            case 3:
                                arrObj.area.push(item);
                                break;
                        }
                    });

                    // 2.将县/区一级放入市级
                    arrObj.area.map((areaItem) => {
                        arrObj.city.forEach((cityItem) => {
                            if (areaItem.parentId == cityItem.id) {
                                cityItem.aresChilds.push(areaItem);
                                return;
                            }
                        });
                    });

                    // 3.将市级放入省级
                    arrObj.city.map((cityItem) => {
                        arrObj.province.forEach((provinceItem) => {
                            if (cityItem.parentId == provinceItem.id) {
                                provinceItem.aresChilds.push(cityItem);
                                return;
                            }
                        });
                    });

                    form.value = arrObj.province;
                })
                .catch(() => {});
        };
        //初始化
        const initData = () => {
            getListPage();
        };
        initData();
        // 地区选择变化发生的事件
        const handleCheckChange = (val, valParent, valGrandfather) => {
            // 首先判断是否支持货到付款地区 0不支持 1支持
            // 支持
            // 再判断点击的哪一级地区 地区层级，0表示国家 1表示省 2表示市 3县/区
            // debugger
            switch (val.level) {
                case 1:
                    val.aresChilds.forEach((item) => {
                        item.isCod = val.isCod;
                        item.aresChilds.map((areaItem) => {
                            areaItem.isCod = val.isCod;
                        });
                    });
                    break;
                case 2:
                    val.aresChilds.forEach((item) => {
                        item.isCod = val.isCod;
                    });
                    checkBoxJudge(val, valParent);
                case 3:
                    checkBoxJudge(val, valParent);
                    checkBoxJudge(valParent, valGrandfather);
            }
        };
        // checkbox选择判断函数
        const checkBoxJudge = (val, valParent) => {
            // 如果市级区域只有一个
            if (valParent.aresChilds.length == 1) {
                valParent.isCod = val.isCod;
            } else {
                let num = 0;
                for (let i = 0; i < valParent.aresChilds.length - 1; i++) {
                    // 判断当前区域的选择状态，如果全等，则让上级的状态也随之改变
                    if (valParent.aresChilds[i].isCod != valParent.aresChilds[i + 1].isCod) {
                        // 判断当前区域选择的状态是否有不支持货到付款的
                        // 只有有一个不支持，则上级区域也不勾选
                        if (valParent.aresChilds[i].isCod == 0 || valParent.aresChilds[i + 1].isCod == 0) {
                            num++;
                        }
                    } else {
                        valParent.isCod = val.isCod;
                    }
                }
                if (num) {
                    valParent.isCod = 0;
                }
            }
        };

        // 保存与修改
        const handleSave = () => {
            proxy
                .$confirm(proxy.$t("platformInfo.saveTips"), {
                    confirmButtonText: proxy.$t("confirm"),
                    cancelButtonText: proxy.$t("cancel"),
                    type: "warning"
                })
                .then(() => {
                    // 递归循环，将数据拆分
                    let data = [];
                    const dataSplit = (val) => {
                        val.forEach((item, index) => {
                            if (item.aresChilds.length > 0) {
                                data.push({
                                    id: item.id,
                                    isCod: item.isCod
                                });
                                dataSplit(item.aresChilds);
                            } else {
                                data.push({
                                    id: item.id,
                                    isCod: item.isCod
                                });
                            }
                        });
                    };
                    dataSplit(form.value);

                    editCashOnDeliveryArea(data.flat(Infinity))
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            initData();
                        })
                        .catch(() => {
                            initData();
                        });
                });
        };

        return {
            dict,
            initData,
            form,
            handleSave,
            handleCheckChange,
            checkBoxJudge
        };
    }
};
</script>
<style lang="scss" scoped>
.w-120 {
    width: 120px;
}
.mw-150 {
    min-width: 150px;
}
.border-bottom {
    border-bottom: solid 1px #f2f2f2;
}
.border-left {
    border-left: solid 1px #f2f2f2;
}
</style>
