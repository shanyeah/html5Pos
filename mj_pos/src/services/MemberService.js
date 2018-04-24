import request from '../utils/request';

export function queryMemberInfo(bodyParams, callback) {
    // var bodyParams = {input: input};
    let body = JSON.stringify(bodyParams);
    return request(`/pos/queryUserList.do`, { method: "POST", body: body}, callback);
}

export function queryChargeInfo(bodyParams, callback) {
    // var bodyParams = {input: input};
    let body = JSON.stringify(bodyParams);
    return request(`/pos/queryUserRechangeList.do`, { method: "POST", body: body}, callback);
}


export function queryGoodsList(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/querySaleGoodsList.do`, { method: "POST", body: body}, callback);
}

export function addMember(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/addUser.do`, { method: "POST", body: body}, callback);
}

export function queryCharge(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/userRechange.do`, { method: "POST", body: body}, callback);
}

export function queryRefundUser(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/refundUserDepositBill.do`, { method: "POST", body: body}, callback);
}



export function queryRechangeDetai(saleBillId, callback) {
    return request(`/pos/queryUserRechangeDetail.do?saleBillId=` + saleBillId, { method: "GET" }, callback);
}


export function queryWalletLog(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/queryUserWalletLog.do`, { method: "POST", body: body}, callback);
}




