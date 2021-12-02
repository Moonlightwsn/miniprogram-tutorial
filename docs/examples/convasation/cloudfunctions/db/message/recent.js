const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const _ = db.command;

exports.main = async (payload) => {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    const { wxid, num = 50 } = payload || {};
    if (wxid && OPENID) {
        const { data: user } = (await db.collection('user').doc(wxid).get()) || {};
        console.log(wxid, OPENID, user);
        if (user && user._openid === OPENID) {
            // wxid和openid对不上的话，不允许查询最近的消息
            const { data: messages = [] } = (await db.collection('messages').orderBy('timestamp', 'desc')
                .limit(num)
                .where(_.or([
                    {
                        from: wxid,
                    },
                    {
                        to: wxid,
                    }
                ])).get()) || {};
            return {
                success: true,
                messages,
            };
        }
        return {
            success: false,
            errorMsg: 'illegal operation',
        };
    }
    return {
        success: false,
        errorMsg: 'Parameter incomplete',
    };
};