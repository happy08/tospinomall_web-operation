<template>
    <!-- 搜索查询 -->
    <el-select v-model="value" :remote-method="remoteMethod" clearable filterable remote :placeholder="$t('pleaseSelect')">
        <el-option v-for="(item, index) in dataList" :key="index" :label="item[option.label]" :value="item[option.value]"> </el-option>
    </el-select>
</template>

<script>
import { ref } from "vue";

export default {
    name: "BmSelectRemote",
    props: {
        //接口api
        remoteApi: Function,
        //选项配置
        option: {
            type: Object,
            default: {
                label: "label",
                value: "id"
            }
        },
        //查询的关键字
        keyword: {
            type: [Array, String],
            default: "keyword"
        }
    },
    setup(props) {
        let value = "";

        //获取数据
        let dataList = ref([]);
        const remoteMethod = (query) => {
            if (query !== "") {
                let keyword = props.keyword;
                let obj = {};
                if (Array.isArray(keyword)) {
                    for (let i in keyword) {
                        obj[keyword[i]] = query;
                    }
                } else {
                    obj = { [keyword]: query };
                }
                const params = {
                    ...obj,
                    pageNum: 1,
                    pageSize: 99
                };
                props
                    .remoteApi(params)
                    .then((res) => {
                        dataList.value = res.data.records || res.data;
                    })
                    .catch((err) => {});
            }
        };

        return {
            value,
            dataList,
            remoteMethod
        };
    }
};
</script>
