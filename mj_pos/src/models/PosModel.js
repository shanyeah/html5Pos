import queryString from 'query-string';
import * as posService from '../services/PosService';

export default {
    namespace: 'pos',
    state: {
        list: [],
        orderList:[]
    },
    reducers: {
        save(state, { payload: { data: list, orderList } }) {
            return { ...state, list, orderList };
        },
    },
    effects: {
        *fetchGoods({ payload: {} }, { call, put }) {
            var orderList = window.localStorage['mjOrderList'];
            if (orderList) {
                orderList = JSON.parse(orderList);
            } else {
                orderList = [];
            }

            if (window.mjGetCacheData) {
                var cacheList = window.mjGetCacheData('cache.all.goods');
                if (cacheList) {
                    var data = JSON.parse(cacheList);
                    var resultArray = new Array();
                    var allGoodsList = new Array();
                    var allCategory = { "categoryId": 0, "categoryName": "全部", "goodsList": allGoodsList };
                    resultArray.push(allCategory);
                    var categories = data.categories;
                    for (let i = 0; i < categories.length; i++) {
                        const category = categories[i];
                        var goodsList = category.goodsList;
                        for (let j = 0; j < goodsList.length; j++) {
                            var item = goodsList[j];
                            item.categoryId = category.categoryId;
                            item.categoryName = category.categoryName;
                            item.changeFlag = 0;
                            item.remark = "";
                            item.staticRemark = "";
                            allGoodsList.push(item);
                        }
                        resultArray.push(category);
                    }
                    window.localStorage["mjGoodsList"] = JSON.stringify(resultArray);
                }
            }

            var goodsList = window.localStorage['mjGoodsList'];
            if (goodsList) {
                goodsList = JSON.parse(goodsList);
            } else {
                goodsList = [];
            }
            yield put({
                type: 'save',
                payload: {
                    data: goodsList,
                    orderList: orderList
                },
            });
            try {
                const { data, err } = yield call(posService.fetchAllGoods);
                if (data) {
                    var resultArray = new Array();
                    var allGoodsList = new Array();
                    var allCategory = { "categoryId": 0, "categoryName": "全部", "goodsList": allGoodsList};
                    resultArray.push(allCategory);
                    var categories = data.data.categories;
                    for (let i = 0; i < categories.length; i++) {
                        const category = categories[i];
                        var goodsList = category.goodsList;
                        for (let j = 0; j < goodsList.length; j++) {
                            var item = goodsList[j];
                            item.categoryId = category.categoryId;
                            item.categoryName = category.categoryName;
                            item.changeFlag = 0;
                            item.remark = "";
                            item.staticRemark = "";
                            allGoodsList.push(item);
                        }
                        resultArray.push(category);
                    }
                    window.localStorage["mjGoodsList"] = JSON.stringify(resultArray);
                    yield put({
                        type: 'save',
                        payload: {
                            data: resultArray,
                            orderList: orderList
                        },
                    });
                } else {
                    yield put({
                        type: 'tips/handleErrorMsg',
                        payload: {
                            msg: err
                        },
                    });
                }
            } catch (error) {
                yield put({
                    type: 'tips/handleErrorMsg',
                    payload: {
                        msg: error
                    },
                });
            }
        },
        *addGood({ payload: { item } }, { call, put, select }) {
            item.count = 1;
            var list = yield select(state => state.pos.list);
            var orderList = yield select(state => state.pos.orderList);
            var newOrderList = new Array();
            
            for (let i = 0; i < orderList.length; i++)  {
                newOrderList.push(orderList[i]);
            }

            var exist = false;
            for (let i = 0; i < newOrderList.length; i++) {
                var element = newOrderList[i];
                if (element.goodsId == item.goodsId) {
                    // 如果有口味或套餐
                    if (element.goodsTagCategories || element.goodsPackList) { 
                        continue;
                    }
                    element.count = element.count+1;
                    if (element.discountFlag == 0) {
                         // 以折扣为准
                         item.incomeAmount = item.price * item.count * element.discount;
                    } else {
                         // 以输入金额为准
                         item.incomeAmount = item.itemPrice * item.count;
                    }
                    exist = true;
                    break;
                }
            }

            if (!exist) {
                var date = new Date();
                item.uniqueId = date.getTime();
                item.discount = 100;
                item.dicountFlag = 0;
                item.itemPrice = item.price;
                item.incomeAmount = item.price;
                
                newOrderList.push(item);           
            }
            window.localStorage["mjOrderList"] = JSON.stringify(newOrderList);
            yield put({
                type: 'save',
                payload: {
                    data: list,
                    orderList: newOrderList
                },
            });

        },
        *removeGood({ payload: { item } }, { call, put, select }) {
            var list = yield select(state => state.pos.list);
            var orderList = yield select(state => state.pos.orderList);
            var newOrderList = new Array();
            for (let i = 0; i < orderList.length; i++) {
                newOrderList.push(orderList[i]);
            }
            var index = -1;
            for (let i = 0; i < newOrderList.length; i++) {
                var element = newOrderList[i];
                if (element.goodsId == item.goodsId) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                var element = newOrderList[index];
                if (element.count > 1) {
                    element.count = element.count - 1;
                } else {
                    newOrderList.splice(index, 1);
                }

                if (newOrderList.length == 0) {
                    window.localStorage.removeItem("mjOrderList");
                } else {
                    window.localStorage["mjOrderList"] = JSON.stringify(newOrderList);
                }
                yield put({
                    type: 'save',
                    payload: {
                        data: list,
                        orderList: newOrderList
                    },
                });
            }

        },
        *updateGood({ payload: { item } }, { call, put, select }) {
            var list = yield select(state => state.pos.list);
            var orderList = yield select(state => state.pos.orderList);
            var newOrderList = new Array();

            for (let i = 0; i < orderList.length; i++) {
                var element = orderList[i];
                if (element.uniqueId == item.uniqueId) {
                    newOrderList.push(item);  
                } else {
                    newOrderList.push(element);  
                }
            }
            
            
            window.localStorage["mjOrderList"] = JSON.stringify(newOrderList);
            
            yield put({
                type: 'save',
                payload: {
                    data: list,
                    orderList: newOrderList
                },
            });
        },
        *clearOrderList({ payload: { } }, { call, put, select }) {
            var list = yield select(state => state.pos.list);
            window.localStorage.removeItem("mjOrderList");
            yield put({
                type: 'save',
                payload: {
                    data: list,
                    orderList: []
                },
            });
        },
        *cacheOrderList({ payload: {} }, { call, put, select }) {
            var orderList = yield select(state => state.pos.orderList);
            // console.log(orderList);
            if (orderList.length > 0) {
                window.localStorage["mjOrderList"] = JSON.stringify(orderList);
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                
            });
        },
    },
};
