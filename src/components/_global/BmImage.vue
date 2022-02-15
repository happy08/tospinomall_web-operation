<template>
    <el-image :src="w_src" :fit="fit" v-bind="$attrs" ref="ElImage">
        <template #error>
            <slot name="error">
                <div class="image-slot flex center">
                    <i class="el-icon-picture-outline fs-20 grey"></i>
                </div>
            </slot>
        </template>
    </el-image>
</template>

<script>
import { ref, onMounted, nextTick, watch } from "vue";
export default {
    name: "BmImage",
    props: {
        src: {
            type: String,
            default: ""
        },
        fit: {
            type: String,
            default: "cover"
        }
    },
    setup(props) {
        let ElImage = ref(null);
        let w_src = ref("");
        onMounted(() => {
            nextTick(() => {
                changeImgSrc();
            });
        });
        watch(
            () => props.src,
            () => {
                changeImgSrc();
            }
        );
        function changeImgSrc() {
            // 阿里云图片裁剪
            if (ElImage.value.$el.offsetWidth > 0) {
                w_src.value = props.src.startsWith("https://") ? props.src + "?x-oss-process=image/resize,w_" + parseFloat(ElImage.value.$el.offsetWidth) * 2 : props.src;
            } else {
                w_src.value = props.src;
            }
        }

        return {
            ElImage,
            w_src
        };
    }
};
</script>
<style lang="scss" scoped>
.image-slot {
    height: 100%;
    background-color: #f2f2f2;
}
</style>
