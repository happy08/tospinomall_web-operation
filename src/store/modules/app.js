import { getCurrentRate, getPlatformInfo, getLocales, adminFindWebsite } from "@/api/user";
import storage from "@/utils/storage";

const app = {
    namespaced: true,
    state: {
        sidebarOpened: true,
        breadcrumbList: [], //面包屑

        site: "", //站点ID

        currency: {}, //货币
        currencySymbol: {}, //货币符号
        phonePrefix: "", //手机前缀

        platform: {}, //平台信息
        lang: "", //默认语言
        langList: [], //语言列表

        website: [] //所有站点
    },
    getters: {
        getSidebarOpened: (state) => state.sidebarOpened
    },
    mutations: {
        //slider切换
        TOGGLE_SIDEBAR: (state) => {
            state.sidebarOpened = !state.sidebarOpened;
        },

        //面包屑切换
        CHANGE_BREADCRUMB: (state, v) => {
            state.breadcrumbList = v;
        },

        // 货币
        SET_RATE: (state, v) => {
            state.currency = v;
            state.currencySymbol = v.currency;
            state.phonePrefix = v.code;
            state.site = v.site || "";
        },

        // 平台信息
        SET_PLATFORM: (state, v) => {
            state.platform = v;
        },

        //默认语言列表
        SET_LANG: (state, v) => {
            const lang = storage.get("lang");
            if (lang) {
                state.lang = lang;
            } else {
                state.lang = v.defaultLocale;
                storage.set("lang", v.defaultLocale);
            }
            state.langList = v.localeList.map((item) => {
                return {
                    label: item.label,
                    value: item.value
                };
            });
        },

        //语言切换
        CHANGE_LANG: (state, v) => {
            state.lang = v;
            storage.set("lang", v);
        },

        //所有站点
        SET_WEBSITE: (state, v) => {
            state.website = v;
        }
    },
    actions: {
        // 货币
        getCurrentRate({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                getCurrentRate()
                    .then((res) => {
                        commit("SET_RATE", res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        // 平台信息
        getPlatformInfo({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                getPlatformInfo()
                    .then((res) => {
                        commit("SET_PLATFORM", res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        // 默认语言列表
        getLocales({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                getLocales()
                    .then((res) => {
                        commit("SET_LANG", res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        // 获取所有站点
        getWebsite({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                adminFindWebsite()
                    .then((res) => {
                        //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                        commit("SET_WEBSITE", res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    }
};
export default app;
