<template>
    <div v-if="config">
        <h1 class="mb-10 fs-16 fw-600">{{ config.name }}</h1>
        <component :is="config.component" :config="config"></component>
    </div>
</template>

<script>
import HeaderMobile from "./headerMobile";
import ImageHot from "./imageHot";
import Banner from "./banner";
import goods2Column from "./goods2Column";
import goods3Column from "./goods3Column";
import goods6Column from "./goods6Column";
import topAdvertising from "./topAdvertising";

export default {
    name: "StoreDesignEditIndex",
    components: {
        HeaderMobile,
        ImageHot,
        Banner,
        goods2Column,
        goods3Column,
        goods6Column,
        topAdvertising
    },
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<style scoped lang="scss"></style>
