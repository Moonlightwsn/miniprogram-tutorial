const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async () => {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    try {
        const res = await db.collection('user').where({
            _openid: OPENID, 
        }).get();
        const { data = [] } = res || {};
        if (Array.isArray(data) && data.length === 1) {
            return {
                success: true,
                friends: data[0].friends,
            };
        }
    } catch (e) {
        return {
            success: false,
            error: e,
            errorMsg: e.message,
        };
    }
    return {
        success: false,
        errorMsg: 'Unknown error',
    }
};