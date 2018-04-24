import mockjs from 'mockjs';

export default {
    'POST /pos/queryPosCheckList.do': mockjs.mock({
        'code': 0,
        'data': {
            'list' : [
                {
                    "id": 10001,
                    "title": "02-12 12:00收银员(10001)",
                    "pettyCashAmount": 30.5,
                    "status": 0,    
                    "checkTime": "2018-03-20 10:03:12",
                    "checkAdminName": "交班人",
                    "createAdminName": "接班人",
                    "createTime": "2018-03-20 10:03:12",
                    "deviceName": "设备名称",
                    "remark": "备注信息"
                } 
            ]
        }
    })
};