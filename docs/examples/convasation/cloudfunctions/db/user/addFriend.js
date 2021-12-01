const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const _ = db.command;

exports.main = async (payload) => {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    const { wxid } = payload;
    const res = { success: true };
    if (wxid) {
        /**
         * 在小程序页面交互中保证：
         * 1. 搜索的wxid对应的用户确实存在
         * 2. 搜索的wxid并不在当前好友关系中
         * 满足上述条件后，才调用此接口
         * 因此此接口只需要处理添加用户的逻辑，而不去关心wxid是否存在
         *  */ 
        try {
            const newFriend = await db.collection('user').doc(wxid).get();
            const { nickName }
            await db.collection('user').where({
                _openid: OPENID,
            }).update({
                data: {
                    friends: _.push({
                        friends: wxid,

                    }),
                },
            });
        } catch (e) {
            res.error = e;
            res.errorMsg = e.message;
        }
    } else {
        res.errorMsg = 'Parameter incomplete';
    }
};