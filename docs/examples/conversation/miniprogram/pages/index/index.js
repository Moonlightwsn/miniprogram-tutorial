// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    loading: true,
    messageList: [],
  },
  _friendMap: {},
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
      this.classifyMessages(recentMessages);
      app.watchMessagesChange(this.onMessagesChange.bind(this));
      this.setData({ loading: false });
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
          if (!this._friendMap[friendID]) {
            this._friendMap[friendID] = {
              user: item,
              messages: [],
            };
          } else {
            this._friendMap[friendID] = {
              ...this._friendMap[friendID],
              ...item,
              unread: this._friendMap[friendID].unread || 0,
            }
          }
        }
      });
    }
  },
  async onMessagesChange(newMessages = []) {
    console.log('onMessagesChange', newMessages);
    await this.updateFriends();
    this.classifyMessages(newMessages);
  },
  classifyMessages(messages) {
    const { wxid: mySelf } = app.globalData;
    if (mySelf && Object.keys(this._friendMap).length > 0 && messages.length > 0) {
      messages.forEach(msg => {
        const friendID = msg.from === mySelf ? msg.to : msg.from;
        if (this._friendMap[friendID]) {
          // 将消息按照归属好友分类
          const friend = this._friendMap[friendID].user;
          const updateData = {};
          updateData.lastMessage = msg.message;
          updateData.lastTimestamp = msg.timestamp;
          const t = new Date(msg.timestamp);
          updateData.lastTime = `${t.getMonth() + 1}-${t.getDate()}`;
          updateData.unread = (friend.unread || 0) + 1;
          this._friendMap[friendID].user = {
            ...friend,
            ...updateData,
          };
        }
        // 将与对应好友的消息编进一个集合（数组）内
        // 新消息按照时间升序排列，遍历消息列表时往表尾插入
        const isMySelf = msg.from === app.globalData.wxid
        this._friendMap[friendID].messages.push({
          ...msg,
          isMySelf,
          avatar: isMySelf ? app.globalData.avatarUrl : this._friendMap[friendID].avatarUrl,
        });
      });

      const newMessageList = Object.keys(this._friendMap).map(fKey => this._friendMap[fKey].user);
      // 按最后一条消息时间倒序排序
      newMessageList.sort((a, b) => {
        return b.lastTimestamp - a.lastTimestamp;
      });
      this.setData({
        messageList: newMessageList,
      });
    }
  },
  gotoNewFriend() {
    wx.navigateTo({
      url: '/pages/newFriend/newFriend',
    });
  }
})
