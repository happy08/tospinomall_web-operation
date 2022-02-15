const storage = {
    //存储
    set(key, value) {
        let v = value;
        if (typeof value !== "string" && typeof value !== "number") {
            v = JSON.stringify(value);
        }
        localStorage.setItem(key, v);
    },

    //取出数据
    get(key) {
        const value = localStorage.getItem(key);
        if (value === null || value === undefined || value === "") {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch (err) {
            return value;
        }
    },

    // 删除数据
    remove(key) {
        localStorage.removeItem(key);
    }
};

export default storage;
