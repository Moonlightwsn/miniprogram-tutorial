const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
    const { type } = event || {};
    if (type === 'getIdentity') {
        const wxContext = cloud.getWXContext();
        const { OPENID } = wxContext;
        const res = await db.collection('user').where({
            _openid: OPENID,
        }).get();
        const { data = [] } = res || {};
        if (Array.isArray(data) && data.length === 1) {
            return {
                wxid: data[0].wxid,
                nickName: data[0].nickName,
                avatarUrl: data[0].avatarUrl,
            };
        }
        return {};
    }
    return {
        other: 'tbd',
    };
}