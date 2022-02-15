<template>
    <div class="body-bg">
        <!-- 登录界面主体部分 -->

        <!-- 左侧背景图 -->
        <div class="login-left">
            <!-- 背景图上的文字 -->
            <div class="login-title w-100 tc white">
                <div class="fs-22 mb-10">{{ $t("index.backGroundWord1") }}</div>
                <div>{{ $t("index.backGroundWord2") }}</div>
            </div>
        </div>
        <!-- 右侧登录框 -->
        <div class="login-right">
            <div class="login-lan">
                <ul class="flex vcenter">
                    <li class="ml-25">
                        <el-select v-model="site" @change="handleChangeSite" style="width:180px">
                            <el-option v-for="item in websiteList" :key="item.key" :value="item.key" :label="item.name"> </el-option>
                        </el-select>
                    </li>
                    <!-- 语言 $i18n.availableLocales $i18n.locale-->
                    <li class="ml-20">
                        <el-select v-model="$i18n.locale" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in $store.state.app.langList" :key="`locale-${item}`" :value="item.value" :label="item.label"> </el-option>
                        </el-select>
                    </li>
                </ul>
            </div>
            <!-- 账号密码输入框 -->
            <div class="login-wrap">
                <h2 class="mb-30 fs-20 tc fw">{{ $t("login.login") }}</h2>

                <el-form class="custom-big-input" :model="loginForm" :rules="loginRules" ref="loginFormRef">
                    <el-form-item class="fw" prop="username" :label="$t('login.userName')">
                        <el-input :placeholder="$t('login.username')" v-model="loginForm.username" class="input-with-select">
                            <template #prefix>
                                <i class="el-input__icon el-icon-user"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="fw" prop="password" :label="$t('login.passWord')">
                        <el-input :placeholder="$t('login.password')" v-model="loginForm.password" type="password">
                            <template #prefix>
                                <i class="el-input__icon el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="submitForm" :disabled="loginDisabled" :loading="loginDisabled" class="w-100 p-15 fs-16" type="primary">
                            {{ $t("login.login") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>
<script>
import { ref, reactive, unref, getCurrentInstance, watch, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
    name: "Login",
    setup() {
        const { proxy } = getCurrentInstance();
        const { locale } = useI18n();
        const store = useStore();
        const router = useRouter();

        // 监听语言
        watch(locale, (val) => {
            store.commit("app/CHANGE_LANG", val);
        });

        // 站点
        const site = computed(() => store.state.app.site);
        const websiteList = computed(() => store.state.app.website);
        const handleChangeSite = (item) => {
            websiteList.value.forEach((element) => {
                element.websiteDetails.forEach((element) => {
                    //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                    if (element.type == 1) {
                        window.open(element.websiteAddress, element.openMode || "_blank");
                    }
                });
            });
        };

        // 登录表单
        const loginForm = reactive({
            username: "",
            password: ""
        });

        const validateUsername = (rule, value, callback) => {
            if (value.length <= 0) {
                callback(new Error(proxy.$t("required")));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value.length <= 0) {
                callback(new Error(proxy.$t("required")));
            } else {
                callback();
            }
        };
        //校验规则
        const loginRules = {
            username: [
                {
                    required: true,
                    trigger: "blur",
                    validator: validateUsername
                }
            ],
            password: [{ required: true, trigger: "blur", validator: validatePass }]
        };

        // 登录表单提交
        const loginFormRef = ref(null);
        let loginDisabled = ref(false);
        const submitForm = () => {
            const form = unref(loginFormRef);
            if (!form) return;
            form.validate((valid) => {
                if (valid) {
                    loginDisabled.value = true;
                    store
                        .dispatch("user/getToken", loginForm)
                        .then((res) => {
                            loginDisabled.value = false;
                            console.log('store.getters["router/getFirstRouter"]', store.getters["router/getFirstRouter"]);
                            //登录成功，跳转到第一个权限路由
                            router.push(store.getters["router/getFirstRouter"]);
                        })
                        .catch(() => {
                            loginDisabled.value = false;
                        });
                } else {
                    return false;
                }
            });
        };

        return {
            site,
            websiteList,
            handleChangeSite,
            loginForm,
            loginRules,
            loginFormRef,
            loginDisabled,
            submitForm
        };
    }
};
</script>
<style lang="scss" scoped>
.login-left {
    position: relative;
    float: left;
    max-width: 668px;
    width: 30%;
    height: 100vh;
    background: url("../../assets/img/login-bg.jpg");
    background-size: cover;
    .login-title {
        position: absolute;
        z-index: 1;
        top: 32%;
        letter-spacing: 2px;
    }
}
.login-right {
    .login-lan {
        position: absolute;
        right: 10px;
        top: 10px;
    }
}
.body-bg {
    width: 100vw;
    min-height: 100vh;
}
.layout-header {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    background: #ffffff;
}
.login-wrap {
    position: fixed;
    top: 40%;
    right: 23%;
    width: 400px;
    padding: 30px;
    margin-top: -170px;
    border-radius: 4px;
    background: #ffffff;
}
@media screen and (max-width: 766px) {
    .login-left {
        width: 100%;
        max-width: 100%;
        .login-title {
            position: absolute;
            z-index: 1;
            top: 10%;
            letter-spacing: 2px;
        }
    }
    .login-wrap {
        max-width: 375px;
        right: auto;
        left: 50%;
        transform: translate(-50%, 20%);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
}
</style>
