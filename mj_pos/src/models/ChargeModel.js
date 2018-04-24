export default {
    namespace: 'charge',
    state: {
        currentMenu: 'index'
    },
    reducers: {
        save(state, { payload: { data: currentMenu } }) {
            return { ...state, currentMenu };
        },
    },
    effects: {
        *updateMenu({ payload: { menu } }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    data: menu
                },
            });
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                
            });
        },
    },
};