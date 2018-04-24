import mockjs from 'mockjs';

export default {
    'POST /pos/queryUserRechangeList.do': mockjs.mock({
        'code': 0,
        'data': {
            'pageSize': 15,
            'total': 5,
            'list' : [
                {
                    "key": 10001,
                    "orderNo": 10001,
                    "memberName": `李二`,
                    "saleBillId": 1,    
                    "idNumber": 45012219850425156,
                    "typeName": "充值",
                    "payTypeName": "微信支付",
                    "balance": "3",
                    "cashBalance": "2",
                    "presentBalance": 20,
                    "createAdminName": "李二",
                    "createTime": "2018-03-20 10:03:12",
                    "remark": "备注信息"
                } 
            ]
        }
    }),
    'POST /pos/queryUserList.do': mockjs.mock({
        'code': 0,
        'data': {
            'pageSize': 15,
            'total': 5,
            'list' : [
                {
                    "id": 10001,
                    "name": "李二",
                    "className": '会员卡',
                    "idTypeName":'身份证',
                    "idNumber": `45012219850425156`,
                    "balance":'20',
                    "cashBalance":'20',
                    "presentBalance":'20',
                    "createTime":'2018-05-25 12:20',
                    "key": 1,
                } 
            ]
        }
    }),
    'POST /pos/querySaleGoodsList.do': mockjs.mock({
        'code': 0,
        'data': {
            'pageSize': 15,
            'total': 5,
            'list' : [
                {
                    "key": 10001,
                    "orderNo": '10001',
                    "memberName": `李二`,
                    "saleBillId": 1,    
                    "typeName": "充值",
                    "payTypeName": "微信支付",
                    "incomeAmount": 3,
                    "allowRefund": 1,
                    "createAdminName": "李二",
                    "createTime": "2018-03-20 10:03:12",
                    "remark": "备注信息"
                } 
            ]
        }
    })
};
