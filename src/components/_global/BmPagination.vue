<template>
    <div class="mt-20 tr">
        <el-pagination v-bind="$attrs" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage" :total="total * 1" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
</template>

<script>
export default {
    name: "BmPagination",
    props: {
        pageSizes: {
            type: Array,
            default: [10, 20, 50, 100]
        },
        pageSize: {
            type: Number,
            default: 10
        },
        currentPage: {
            type: Number,
            default: 1
        },
        total: {
            type: [Number, String],
            default: 0
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep(.el-pager li) {
    margin: 0 5px;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
    font-weight: normal;
    &.active {
        border-color: #42b7ae;
        + li {
            border: 1px solid #e8e8e8;
        }
    }
}
</style>
