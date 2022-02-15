<template>
    <div class="flex between vcenter mb-15">
        <div>
            {{ option.lable }}
        </div>
        <div>{{ $t("releaseGoods.commissionRatio") }}: {{ option.percentage }}%</div>
    </div>
</template>

<script>
export default {
    name: "editCategory",
    components: {},
    props: {
        option: {
            type: Object,
            default: () => ({
                lable: "",
                percentage: ""
            })
        }
    }
};
</script>
