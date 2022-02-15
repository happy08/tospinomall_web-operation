<template>
    <div :class="['alert grey', type]">
        <slot>
            <div v-if="icon" class="icon mr-10">
                <BmIcon :name="icon" />
            </div>
            <div class="ml-25" v-html="title"></div>
        </slot>
    </div>
</template>

<script>
export default {
    name: "BmAlert",
    props: {
        type: {
            type: String,
            default: "warning"
        },
        title: {
            type: String,
            default: ""
        },
        icon: {
            type: String,
            default: ""
        }
    },
    setup() {}
};
</script>
<style lang="scss" scoped>
.alert {
    padding: 6px 15px;
    border-style: solid;
    border-width: 2px;
    border-radius: 2px;
    line-height: 1.4;
    .icon {
        float: left;
        width: 16px;
        height: 16px;
    }
    &.warning {
        border-color: #ffe58f;
        background-color: #fffbe6;
        .icon {
            fill: #faad14;
        }
    }
    &.primary {
        border-color: #53b6f5;
        background-color: #f6fbfe;
        .icon {
            color: #14b3fa;
        }
    }
}
</style>
