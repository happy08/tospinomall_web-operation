import { nextTick } from "vue";
import router from "@/router/index";

export default (app) => {
    // 按钮权限相关的自定义指令
    app.directive("permission", (el, binding) => {
        const btnPermission = Array.isArray(binding.value) ? binding.value[0] : binding.value;
        //获取当前路由需要权限的按钮组
        const btnGroup = router.currentRoute.value.meta.hasOwnProperty("btnGroup") ? router.currentRoute.value.meta.btnGroup : [];
        let permission = false;
        //是否存在按钮权限
        if (btnGroup.indexOf(btnPermission) === -1) {
            permission = true;
        }
        nextTick(() => {
            if (permission) {
                //不显示
                if (binding.value[1] && binding.value[1] === "none") {
                    el.style.display = "none";
                } else {
                    // 禁用
                    el.disabled = true;
                    el.classList.add("is-disabled");
                }
            }
        });
    });
};
