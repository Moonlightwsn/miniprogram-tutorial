// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    messageList: [/* {
      friendID: '100001',
      nickName: '程然',
      lastMessage: '等下你去看开幕式么?',
      avatar: '/images/avatar/avatar_chengran.jpeg',
      lastTime: '晚上8:20',
      unread: 3,
    }, {
      friendID: '100002',
      nickName: '伟国',
      lastMessage: '[图片]',
      avatar: '/images/avatar/avatar_weiguo.jpeg',
      lastTime: '晚上8:20',
      bellringOff: true,
      unread: 10,
    }, {
      friendID: '100003',
      nickName: '广爷',
      lastMessage: '有熟悉NFT的吗？请教一个实物上链的手法',
      avatar: '/images/avatar/avatar_guangye.jpeg',
      lastTime: '晚上8:20',
      unread: 5,
    }, {
      friendID: '100004',
      nickName: '智博',
      lastMessage: '你这放的是ppt吗',
      avatar: '/images/avatar/avatar_zhibo.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100005',
      nickName: '斌斌',
      lastMessage: '笔直向上，一天11倍',
      avatar: '/images/avatar/avatar_binbin.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100006',
      nickName: '守毅',
      lastMessage: '卧槽，忘记打卡了',
      avatar: '/images/avatar/avatar_shouyi.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100007',
      nickName: '峰峰',
      lastMessage: '我第几次了[看]今天请大家喝下午茶',
      avatar: '/images/avatar/avatar_fengfeng.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100008',
      nickName: '晨阳',
      lastMessage: '[动画表情]',
      avatar: '/images/avatar/avatar_chenyang.jpeg',
      lastTime: '晚上8:20',
    }, {
      friendID: '100009',
      nickName: '光瑞',
      lastMessage: '[动画表情]',
      avatar: '/images/avatar/avatar_guangrui.jpeg',
      lastTime: '晚上8:20',
    } */],
    count: 1,
  },
  onReady() {
    const that = this;
    wx.request({
      url: 'http://localhost:7281/json/messages.json',
      timeout: 1000,
      success(res) {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          that.setData({ messageList: res.data });
        }
      },
      fail(error) {
        console.log(1234, error);
      }
    })
  },
  clickMe(e) {
    console.log('click me', e.target.dataset.hi);
    console.log('count', this.data.count);
    this.setData({ count: this.data.count + 1 });
  },
})
