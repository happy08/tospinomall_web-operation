import { createI18n } from "vue-i18n";
import enLocale from "element-plus/lib/locale/lang/en";
import zhCNLocale from "element-plus/lib/locale/lang/zh-cn";
import viLocale from "element-plus/lib/locale/lang/vi";
import en from "./en";
import zhCN from "./zh-cn";
import vi from "./vi";
import storage from "@/utils/storage";

const messages = {
    en: {
        // el 这个属性很关键，一定要保证有这个属性，
        el: enLocale.el,
        // 定义您自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
        ...en
    },
    "zh-CN": {
        el: zhCNLocale.el,
        // 定义您自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
        ...zhCN
    },
    vi: {
        el: viLocale.el,
        // 定义您自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
        ...vi
    }
};

const i18n = createI18n({
    //legacy: false, // you must set `false`, to use Composition API
    locale: storage.get("lang") || "en",
    fallbackLocale: "en",
    messages
});

export default i18n;
