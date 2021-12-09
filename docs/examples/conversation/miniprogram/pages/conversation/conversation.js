const { classifyMessages } = require('../../utils/util');
// 获取应用实例
const app = getApp();
Page({
    myMessageId: 0,
    data: {
        message: '',
        sending: false,
        messageList: [/* {
            _id: 'c462c81061a887c200001d4111f4058b',
            form: 'wxid45075572460805221638363503575',
            to: 'wxid79201362545624311638363495411',
            // nickName: 'NoNo',
            avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKCU4vsySzsQwrJ4uupHo3R4f6KiaicU3Pn95Mnmx7ygBS4sBZx5l2WHZo941tn9dGOgejEMxyPMeYw/132',
            timestamp: 1638434754116,
            message: '我们已经是新的朋友啦，开始跟我聊天吧~',
        }, {
            _id: 'c462c81061aee9c900ec37fb492cfc6c',
            form: 'wxid79201362545624311638363495411',
            to: 'wxid45075572460805221638363503575',
            // nickName: 'MoMo',
            avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiaRjuFX2cwtosUibeqAcm2ticLyYwl7cBXIYYktYSRUx80TicmK4AwXNg0iarS0waWFdNBeVOGdo2piaw/132',
            timestamp: 1638849047200,
            message: '我来啦',
            isMySelf: true,
        } */],
    },
    onLoad(options) {
        console.log('conversation onLoad', options);
        const { friendID } = options;
        this.friendID = friendID;
        this.init();
    },
    onUnload() {
        app.unWatchMessagesChange();
    },
    init() {
        if (this.friendID) {
            const newMessages = [];
            const { messageList } = classifyMessages(app, newMessages, this.friendID);
            app.watchMessagesChange(this.onMessagesChange.bind(this));
            this.setData({ messageList });
        }
    },
    async sendMessage() {
        if (this.data.message && this.friendID) {
            const msg = this.data.message;
            this.setData({ sending: true });
            this.myMessageId += 1;
            const { messageList } = classifyMessages(app, [{
                _id: `my-self-${this.myMessageId}`,
                from: app.globalData.wxid,
                to: this.friendID,
                message: msg,
                avatar: app.globalData.avatarUrl,
                isMySelf: true,
            }], this.friendID);
            this.setData({ message: '', messageList });
            const res = await wx.cloud.callFunction({
                name: 'db',
                data: {
                    type: 'sendMessage',
                    payload: {
                        from: app.globalData.wxid,
                        to: this.friendID,
                        message: msg,
                    },
                },
            }).catch(e => {
                console.warn(e);
                return {};
            });
            this.setData({ sending: false });
            if (res && res.result && res.result.success) {
                console.log(`消息发送成功`);
            }
        }
    },
    async onMessagesChange(newMessages = []) {
        console.log('onMessagesChange', newMessages);
        const { messageList } = classifyMessages(app, newMessages, this.friendID);
        this.setData({
          messageList,
        });
    },
})