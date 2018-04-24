import request from '../utils/request';

export function login(param) {
    let body = JSON.stringify(param)
    return request(`/pos/login.do`, { method: "POST", body: body});
}


export function loginData(param, callback) {
    let body = JSON.stringify(param);
    return request(`/pos/login.do`, { method: "POST", body: body}, callback);
}