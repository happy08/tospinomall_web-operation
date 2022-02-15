const column = {
    namespaced: true,
    state: {
        columnList: []
    },
    getters: {},
    mutations: {
        //设置列
        SET_COLUMN: (state, v) => {
            state.columnList = v;
        }
    },
    actions: {}
};
export default column;
