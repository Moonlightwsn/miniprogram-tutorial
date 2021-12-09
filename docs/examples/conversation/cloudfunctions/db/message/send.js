const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const _ = db.command;

exports.main = async (payload) => {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    const { from, to, message } = payload || {};
    console.log(1111, payload)
    if (from && OPENID) {
        const { data: user } = (await db.collection('user').doc(from).get()) || {};
        console.log(from, OPENID, user);
        if (user && user._openid === OPENID) {
            // wxid和openid对不上的话，不允许发送的消息
            await db.collection('messages').add({
                data: {
                    from,
                    to,
                    message,
                    timestamp: new Date().getTime(),
                },
            });
            return {
                success: true,
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