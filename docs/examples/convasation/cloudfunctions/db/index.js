const register = require('./user/register');
const addFriend = require('./user/addFriend');

// 云函数入口函数
exports.main = async (event) => {
    const { type, payload } = event;
    switch (type) {
        case 'register':
            return await register.main(payload);
        case 'addFriend':
            return await addFriend.main(payload);
    }
}