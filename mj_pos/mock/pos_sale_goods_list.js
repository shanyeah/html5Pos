import mockjs from 'mockjs';

export default {
    'POST /pos/querySaleGoodsList.do': mockjs.mock({
        "code": 0, 
        "data": {
            "total": 5,
            "pages": 1,
            "pageNum": 1,
            "pageSize": 15,
            "list": [
                {
                    "saleBillId": 100001,
                    "orderNo": "PSG1000001",
                    "typeName": "支付",
                    "incomeAmount": 300,
                    "allowRefund": 1,
                    "payTypeName": "微信支付",
                    "createAdminName": "张三",
                    "createTime": 10.2,
                    "remark": "备注信息"
                }
            ]
        }, 
        "message": "成功"
    })
};