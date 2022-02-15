<template>
    <el-breadcrumb separator="/" class="mb-15">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="v in breadcrumbList" :key="v.path">
                {{ v.title }}
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "BmBreadcrumb",
    data() {
        return {};
    },
    computed: {
        ...mapState({
            breadcrumbList: (state) => state.app.breadcrumbList
        })
    },
    created() {}
};
</script>
<style lang="scss" scoped>
// .breadcrumb-enter-active,
// .breadcrumb-leave-active {
//     transition: all 0.5s;
// }

// .breadcrumb-enter-from,
// .breadcrumb-leave-active {
//     opacity: 0;
//     transform: translateX(20px);
// }

// .breadcrumb-move {
//     transition: all 0.5s;
// }

// .breadcrumb-leave-active {
//     position: absolute;
// }
</style>
