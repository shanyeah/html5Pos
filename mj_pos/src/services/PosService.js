import request from '../utils/request';

export function fetchAllGoods() {
    return request(`/pos/queryAllGoods.do`, { method: "GET", body: {} });
}

export function saveGoodsBill(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/saveGoodsSaleBill.do`, { method: "POST", body: body }, callback);
}

export function payGoodsBill(bodyParams, callback) {
    let body = JSON.stringify(bodyParams);
    return request(`/pos/payGoodsSaleBill.do`, { method: "POST", body: body }, callback);
}

export function queryGooodsBillDetail(saleBillId, callback) {
    return request(`/pos/queryGooodsBillDetail.do?saleBillId=` + saleBillId, { method: "GET" }, callback);
}

export function refundGoodsSaleBill(params, callback) {
    let body = JSON.stringify(params);
    return request(`/pos/refundGoodsSaleBill.do`, { method: "POST", body: body }, callback);
}

export function refundUserDepositBill(params, callback) {
    let body = JSON.stringify(params);
    return request(`/pos/refundUserDepositBill.do`, { method: "POST", body: body }, callback);
}

export function getGoodsBillMemberPrice(params, callback) {
    let body = JSON.stringify(params);
    return request(`/pos/getGoodsBillMemberPrice.do`, { method: "POST", body: body }, callback);
}

export function queryCustomerList(callback) {
    return request(`/pos/queryCustomerList.do`, { method: "GET"}, callback);
}

export function queryClassesList(callback) {
    return request(`/pos/queryUserClassList.do`, { method: "GET"}, callback);
}

export function queryMemberInfo(bodyParams, callback) {
    // var bodyParams = {input: input};
    let body = JSON.stringify(bodyParams);
    return request(`/pos/queryLikeMemberInfo.do`, { method: "POST", body: body}, callback);
}

export function queryPosCheckDetail(posCheckId, callback) {
    let body = posCheckId >= 0 ? JSON.stringify({ posCheckId: posCheckId}) : "{}";
    return request(`/pos/queryPosCheckDetail.do`, { method: "POST", body: body }, callback);
}

export function querySaleGoodsList(pageNum, callback) {
    var bodyParams = { pageNum: pageNum };
    let body = JSON.stringify(bodyParams);
    return request(`/pos/querySaleGoodsList.do`, { method: "POST", body: body }, callback);
}

export function queryUserRechangeList(pageNum, callback) {
    var bodyParams = { pageNum: pageNum };
    let body = JSON.stringify(bodyParams);
    return request(`/pos/queryUserRechangeList.do`, { method: "POST", body: body }, callback);
}

export function takePosCheck(pettyCashAmount, callback) {
    var bodyParams = { pettyCashAmount: pettyCashAmount };
    let body = JSON.stringify(bodyParams);
    return request(`/pos/takePosCheck.do`, { method: "POST", body: body }, callback);
}

export function submitPosCheck(callback) {
    return request(`/pos/submitPosCheck.do`, { method: "GET" }, callback);
}

export function queryPosCheckList(callback) {
    let body = JSON.stringify({});
    return request(`/pos/queryPosCheckList.do`, { method: "POST", body: body }, callback);
}

export function queryPrintTemplate(callback) {
    return request(`/pos/queryPrintTemplate.do`, { method: "GET" }, callback);
}

