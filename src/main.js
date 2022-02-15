import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Elcomponents, Elplugins } from "./plugins/element-plus";
import ElementLocale from "element-plus/lib/locale";
import VueClipboard from "vue3-clipboard";

import i18n from "./plugins/i18n";
ElementLocale.i18n((key, value) => i18n.global.t(key, value));

import "./permission"; //路由守卫-页面权限
import "./assets/css/index.scss"; // global css

import globalComponents from "./components/_global/index.js"; //自定义全局组件
import directive from "./utils/directive"; //自定义全局指令
import * as utils from "./utils/index.js"; //工具函数
import "@/assets/iconfont/iconfont.js"; //icon
import "@/assets/iconfont/iconfont.css"; // icon css

const app = createApp(App);
app.use(store);
app.use(router);

//element 全局组件
Elcomponents.forEach((component) => {
    app.component(component.name, component);
});

//element 插件
Elplugins.forEach((plugin) => {
    app.use(plugin);
});

globalComponents(app);

app.use(i18n);

app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true
});

directive(app);

app.config.globalProperties.$t = i18n.global.t;
app.config.globalProperties.utils = utils;

app.mount("#app");
