const register = require('./user/register');
const addFriend = require('./user/addFriend');
const getFriends = require('./user/getFriends');
const getRecentMessages = require('./message/recent');
const sendMessage = require('./message/send');

// 云函数入口函数
exports.main = async (event) => {
    const { type, payload } = event;
    switch (type) {
        case 'register':
            return await register.main(payload);
        case 'addFriend':
            return await addFriend.main(payload);
        case 'getFriends':
            return await getFriends.main();
        case 'getRecentMessages':
            return await getRecentMessages.main(payload);
        case 'sendMessage':
            return await sendMessage.main(payload);
    }
}