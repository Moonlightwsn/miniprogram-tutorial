// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    loading: true,
    messageList: [/* {
      friendID: '100001',
      nickName: '程然',
      lastMessage: '等下你去看开幕式么?',
      avatar: '/assets/images/avatar/avatar_chengran.jpeg',
      lastTime: '晚上8:20',
      unread: 3,
    }, {
      friendID: '100002',
      nickName: '伟国',
      lastMessage: '[图片]',
      avatar: '/assets/images/avatar/avatar_weiguo.jpeg',
      lastTime: '晚上8:20',
      bellringOff: true,
      unread: 10,
    }, {
      friendID: '100003',
      nickName: '广爷',
      lastMessage: '有熟悉NFT的吗？请教一个实物上链的手法',
      avatar: '/assets/images/avatar/avatar_guangye.jpeg',
      lastTime: '晚上8:20',
      unread: 5,
    }, {
      friendID: '100004',
      nickName: '智博',
      lastMessage: '你这放的是ppt吗',
      avatar: '/assets/images/avatar/avatar_zhibo.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100005',
      nickName: '斌斌',
      lastMessage: '笔直向上，一天11倍',
      avatar: '/assets/images/avatar/avatar_binbin.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100006',
      nickName: '守毅',
      lastMessage: '卧槽，忘记打卡了',
      avatar: '/assets/images/avatar/avatar_shouyi.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100007',
      nickName: '峰峰',
      lastMessage: '我第几次了[看]今天请大家喝下午茶',
      avatar: '/assets/images/avatar/avatar_fengfeng.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100008',
      nickName: '晨阳',
      lastMessage: '[动画表情]',
      avatar: '/assets/images/avatar/avatar_chenyang.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100009',
      nickName: '光瑞',
      lastMessage: '[动画表情]',
      avatar: '/assets/images/avatar/avatar_guangrui.jpeg',
      lastTime: '晚上8:20',
    } */],
  },
  _friendMap: {},
  onLoad() {
    console.log('index onLoad');
    // this.init();
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
          this._friendMap[friendID] = {
            user: item,
            messages: [],
          };
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
      messages.forEach(item => {
        const friendID = item.from === mySelf ? item.to : item.from;
        if (this._friendMap[friendID]) {
          // 将消息按照归属好友分类
          const friend = this._friendMap[friendID].user;
          const updateData = {};
          if (!friend.lastMessage) {
            updateData.lastMessage = item.message;
            updateData.lastTimestamp = item.timestamp;
            const t = new Date(item.timestamp);
            updateData.lastTime = `${t.getMonth() + 1}-${t.getDate()}`;
          }
          updateData.unread = (friend.unread || 0) + 1;
          this._friendMap[friendID].user = {
            ...friend,
            ...updateData,
          };

          // 将与对应好友的消息编进一个集合（数组）内
          this._friendMap[friendID].messages.unshift();
        }
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
