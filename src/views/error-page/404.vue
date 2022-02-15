<template>
    <div class="error404">
        404
    </div>
</template>

<script>
export default {
    name: "Error404",
    methods: {
        backPage() {
            this.$router.go(-1);
        },
        goHome() {
            this.$router.push({
                path: "/"
            });
        }
    }
};
</script>
