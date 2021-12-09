// index.js
const { classifyMessages, friendMap: _friendMap } = require('../../utils/util');
// 获取应用实例
const app = getApp();

Page({
  data: {
    loading: true,
    messageList: [],
  },
  onLoad() {
    console.log('index onLoad');
    this.init();
  },
  onUnload() {
    app.unWatchMessagesChange();
  },
  async init() {
    let { wxid } = app.globalData;
    if (!wxid) {
      wxid = await app.init();
    }
    if (wxid) {
      await this.updateFriends();
      const { recentMessages = [] } = app.globalData;
      const { friendMessageList } = classifyMessages(app, recentMessages);
      app.watchMessagesChange(this.onMessagesChange.bind(this));
      this.setData({ loading: false, messageList: friendMessageList });
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }
  },
  async updateFriends() {
    const { result: { friends = [], success } = {} } = (await wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getFriends',
      },
    }).catch(e => {
      console.warn(e);
      return {};
    })) || {};
    if (success && Array.isArray(friends)) {
      friends.forEach(item => {
        const { friendID } = item;
        if (friendID) {
          if (!_friendMap[friendID]) {
            _friendMap[friendID] = {
              user: item,
              messages: [],
            };
          } else {
            _friendMap[friendID] = {
              ..._friendMap[friendID],
              ...item,
              unread: _friendMap[friendID].unread || 0,
            }
          }
        }
      });
    }
  },
  async onMessagesChange(newMessages = []) {
    console.log('onMessagesChange', newMessages);
    await this.updateFriends();
    const { friendMessageList } = classifyMessages(app, newMessages);
    this.setData({
      messageList: friendMessageList,
    });
  },
  gotoNewFriend() {
    wx.navigateTo({
      url: '/pages/newFriend/newFriend',
    });
  },
  gotoConversation(event) {
    console.log(event);
    wx.navigateTo({
      url: `/pages/conversation/conversation?friendID=${event.target.dataset.hi}`,
    });
;  },
})
