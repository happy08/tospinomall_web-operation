import { getToken, logout, getCurrentUserInfo } from "@/api/user";
import storage from "@/utils/storage";

const user = {
    namespaced: true,
    state: {
        token: "", //token
        refreshToken: "", //refresh_token
        userInfo: null //用户
    },
    mutations: {
        SET_TOKEN(state, { token, refresh_token }) {
            state.token = token;
            state.refreshToken = refresh_token;
            if (token) {
                storage.set("token", token);
                storage.set("refreshToken", refresh_token);
            } else {
                storage.remove("token");
                storage.remove("refreshToken");
            }
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
        }
    },
    getters: {},
    actions: {
        // 登录
        getToken({ commit, dispatch }, params) {
            return new Promise((resolve, reject) => {
                getToken(params)
                    .then(async (res) => {
                        const refresh_token = res.data.refresh_token;
                        const token = res.data.token_type + " " + res.data.access_token;

                        commit("SET_TOKEN", { token, refresh_token });

                        //获取用户信息
                        await dispatch("getUserInfo");

                        //生成响应的路由
                        await dispatch("router/GenerateRoutes", null, { root: true });

                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        // 获取用户信息
        getUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getCurrentUserInfo()
                    .then((res) => {
                        commit("SET_USERINFO", res.data);
                    })
                    .catch(() => {});
                resolve();
            });
        },

        //退出登录
        LogOut({ commit, state }) {
            return new Promise(async (resolve, reject) => {
                try {
                    await logout();
                } catch (error) {}
                commit("SET_TOKEN", { token: "", refresh_token: "" });
                commit("SET_USERINFO", "");
                commit("router/CLEAR_ADDROUTERS", [], { root: true }); //清除动态注入的路由

                resolve();
            });
        }
    }
};
export default user;
