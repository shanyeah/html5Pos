export default {
    namespace: 'home',
    state: {
    },
    reducers: {
        save(state, { payload: {} }) {
            return { ...state};
        },
    },
    effects: {
       
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                let storage = window.localStorage;
                let organId = 8001;
                if (organId) {
                    storage['mjdjOrganId'] = organId;
                }
            });
        },
    },
};
