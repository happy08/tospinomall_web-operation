<template>
    <div @click="handleCollapse">
        <slot>
            <el-button type="text" class="ml-10">
                <!-- 展开/收起 -->
                {{ $t(show ? "shrink" : "unfold") }}
                <i :class="show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
        </slot>
    </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { slide } from "@/utils/animate";

export default {
    name: "BmCollapse",
    props: {
        //展开的Dom id
        el: {
            type: String
        },
        //是否展开
        isShow: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        let show = ref(props.isShow);

        let el = null;
        nextTick(() => {
            el = document.querySelector(props.el);
        });
        const handleCollapse = () => {
            show.value = !show.value;
            slide(el, show.value);
            emit("change", show.value);
        };
        return {
            show,
            handleCollapse
        };
    }
};
</script>
