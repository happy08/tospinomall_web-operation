<template>
    <div class="base-title flex between vcenter">
        <slot name="title">
            <div class="flex vcenter">
                <div class="title">{{ title }}</div>
                <slot name="subtitle"></slot>
            </div>
        </slot>
        <div>
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "BmBaseTitle",
    props: {
        title: {
            type: String,
            default: ""
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.base-title {
    position: relative;
    margin-bottom: 12px;
    .title {
        padding: 0 20px 0 10px;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
    }
    &::before {
        content: "";
        position: absolute;
        top: 50%;
        height: 50%;
        border-left: solid 2px $baseColor;
        transform: translateY(-50%);
    }
}
</style>
