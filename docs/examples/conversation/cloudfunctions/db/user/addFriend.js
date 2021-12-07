const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const _ = db.command;

exports.main = async (payload) => {
    const wxContext = cloud.getWXContext();
    const { OPENID } = wxContext;
    const { wxid } = payload || {};
    if (!wxid) return {
        success: false,
        errorMsg: 'Parameter incomplete'
    };
    /**
     * 1. 判断搜索的wxid对应的用户确实存在
     * 2. 判断搜索的wxid并不在当前好友关系中
    **/ 
    try {
        const newFriendDoc = db.collection('user').doc(wxid);
        const mySelfCollection = db.collection('user').where({
            _openid: OPENID,
        });

        const { data: newFriend } = (await newFriendDoc.get()) || {};
        if (!newFriend) return {
            success: false,
            errorMsg: 'User not exist',
        };
        let { data: mySelf = [] } = (await mySelfCollection.get()) || {};
        if (Array.isArray(mySelf) && mySelf.length === 1) mySelf = mySelf[0];

        // 不需要添加好友确认，直接给双方加上好友关系
        let newAction = 0;
        if (!newFriend.friends.some(item => item.friendID === mySelf.wxid)) {
            newAction += 1;
            await newFriendDoc.update({
                data: {
                    friends: _.push({
                        friendID: mySelf.wxid,
                        nickName: mySelf.nickName,
                        avatar: mySelf.avatarUrl,
                    }),
                },
            });
        }

        if (!mySelf.friends.some(item => item.friendID === wxid)) {
            newAction += 1;
            await mySelfCollection.update({
                data: {
                    friends: _.push({
                        friendID: wxid,
                        nickName: newFriend.nickName,
                        avatar: newFriend.avatarUrl,
                    }),
                },
            });
        }

        if (newAction === 2) {
            // 如果是新添加好友，则由主动加好友方给被加方发送一条消息
            await db.collection('messages').add({
                data: {
                    from: mySelf.wxid,
                    to: wxid,
                    message: '我们已经是新的朋友啦，开始跟我聊天吧~',
                    timestamp: new Date().getTime(),
                },
            });
        }

        return {
            success: true,
        };
    } catch (e) {
        return {
            success: false,
            error: e,
            errorMsg: e.message,
        };
    }
};