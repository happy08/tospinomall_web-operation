<template>
    <svg class="icon" aria-hidden="true" :style="`width:${width};height:${height}`">
        <use :xlink:href="'#icon' + name" :fill="color"></use>
    </svg>
</template>

<script>
export default {
    name: "BmIcon",
    props: {
        name: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        },
        width: {
            type: String,
            default: "20px"
        },
        height: {
            type: String,
            default: "20px"
        }
    }
};
</script>
<style lang="scss" scoped>
.icon {
    max-height: 100%;
    max-width: 100%;
}
</style>
