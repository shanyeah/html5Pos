import pathToRegexp from 'path-to-regexp'
import * as loginService from '../services/LoginService';

export default {
    namespace: 'login',

    state: {
        extData: {}
    },

    reducers: {
        save(state,{ payload: {extData} }) {
            return {...state,extData};
        },
    },
    effects: {
        *login({ payload, }, { call, put }) {
            console.log('values of form: ', payload);
            yield put({
                type: 'save',
                payload: {
                    extData: {}
                },
            });

            try {
                const { data, err } = yield call(loginService.login, payload);

                if (data.code == 0) {
                    window.mjSetLoginInfo(data.data);               
                    yield put({
                        type: 'save',
                        payload: {
                            extData: data,
                        },
                    });

                    console.log("loginData12",data);

                    // yield put(routerRedux.push('/'))

                } else {
                    var message = data.message;
                    if (!message || message.length == 0) {
                        message = "登陆异常";
                    }
                    yield put({
                        type: 'tips/handleErrorMsg',
                        payload: {
                            msg: message
                        },
                    });
                    // throw data.message;
                }
                
            } catch (error) {
                yield put({
                    type: 'tips/handleErrorMsg',
                    payload: {
                        msg: error
                    },
                });
            }
        }

    },
    
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                
            });
        },
    },
}
