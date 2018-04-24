import mockjs from 'mockjs';

export default {
    'POST /pos/queryUserRechangeList.do': mockjs.mock({
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
                    "payTypeName": "微信支付",
                    "allowRefund": 1,
                    "idNumber": "400***18566",
                    "memberName": "李四",
                    "mobile": "188****4567",
                    "createAdminName": "张三",
                    "createTime": 10.2,
                    "remark": "备注信息"
                }
            ]
        },
        "message": "成功"
    })
};