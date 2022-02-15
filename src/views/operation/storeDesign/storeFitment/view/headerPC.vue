<template>
    <div
        class="top-header"
        :style="
            `background-image:url( ${require('@/assets/img/top-header-pc.jpg')});
            height: ${isPreview ? '150px' : '100px'}`
        "
    ></div>
</template>

<script>
import { inject, ref } from "vue";
export default {
    name: "storeDesignHeaderPC",
    props: ["datas"],
    setup(props) {
        const isPreview = inject("isPreview");

        return {
            isPreview
        };
    }
};
</script>

<style lang="scss" scoped>
.top-header {
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f5f5f5;
    background-size: auto 100%;
}
</style>
