const register = require('./user/register');

// 云函数入口函数
exports.main = async (event) => {
    const { type, payload } = event;
    switch (type) {
        case 'register':
            return await register.main(payload);
    }
}