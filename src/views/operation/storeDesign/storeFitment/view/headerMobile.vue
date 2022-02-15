<template>
    <BmImage :src="require('@/assets/img/top-header-mobile.jpg')" style="width:100%" />
</template>

<script>
import { inject, ref } from "vue";
export default {
    name: "storeDesignHeaderMobile",
    props: ["datas"],
    setup(props) {
        let input = ref("");
        return { input };
    }
};
</script>

<style lang="scss" scoped></style>
