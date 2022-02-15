import { createStore } from "vuex";

import user from "./modules/user";
import router from "./modules/router";
import app from "./modules/app";
import column from "./modules/column";

export default createStore({
    modules: {
        user,
        router,
        app,
        column
    }
});
