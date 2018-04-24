import mockjs from 'mockjs';

export default {
    'POST /pos/queryPassCategory.do': mockjs.mock({
        'code': 0,
        'data': {
            'list': [
                {
                    "id": 0,
                    "name": "水吧",
                    "printer": "Xprinter XP-360B",
                    "printTemplet": 0,
                    "printTempletName": "默认打印",
                    "remark": "备注说明"
                }
            ]
        }
    })
};