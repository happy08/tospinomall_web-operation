<template>
    <div class="p-20 tc lh-1">
        <BmImage :src="src" :style="{ width: width, height: height }" fit="contain" />
        <div class="mt-15 grey fs-12">{{ text }}</div>
    </div>
</template>

<script>
export default {
    name: "BmNoData",
    props: {
        text: {
            type: String,
            default: ""
        },
        src: {
            type: String,
            default: require("@/assets/img/no-data.png")
        },
        width: {
            type: String,
            default: "auto"
        },
        height: {
            type: String,
            default: "auto"
        }
    }
};
</script>
<style lang="scss" scoped></style>
