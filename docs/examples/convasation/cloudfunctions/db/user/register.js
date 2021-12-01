const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (payload) => {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    const { nickName, avatarUrl } = payload;
    const res = { wxid: '' };
    if (OPENID && nickName) {
        try {
            const wxid = `wxid${Math.random() * 10000000000000000}${new Date().getTime()}`;
            await db.collection('user').add({
                data: {
                    id: wxid,
                    _openid: OPENID,
                    nickName,
                    avatarUrl,
                    wxid,
                    friends: [],
                },
            });
            res.wxid = wxid;
        } catch (e) {
            res.error = e;
            res.errorMsg = e.message;
        }
    } else {
        res.errorMsg = 'Parameter incomplete';
    }
    return res;
};