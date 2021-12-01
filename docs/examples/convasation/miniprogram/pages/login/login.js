// login.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    logging: false,
  },
  onLoad() {
    const { wxid } = app.globalData;
    if (wxid) {
      wx.redirectTo({
        url: '/pages/index/index',
      });
    }
  },
  gotoIndex() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  async getIdentity() {
    this.setData({ logging: true });
    const userProfile = await wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取用户昵称，用于用户注册'
    }).catch(e => {
      console.warn(e);
      return {};
    });
    const { userInfo: { nickName, avatarUrl } = {} } = userProfile || {};
    if (nickName) {
      const res = await wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'register',
          payload: {
            nickName,
            avatarUrl,
          },
        },
      });
      if (res && res.result && res.result.wxid) {
        app.globalData.wxid = res.result.wxid;
        setTimeout(() => {
          this.setData({ logging: false });
          wx.redirectTo({
            url: '../index/index',
          });
        }, 1500);
        return;
      }
    }
    // 注册失败，至于为啥会失败，俺也不知道
    wx.showToast({
      title: '用户注册失败',
      icon: 'error',
    });
    this.setData({ logging: false });
  },
})
