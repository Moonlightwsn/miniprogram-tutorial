// app.js

// init wx cloud
wx.cloud.init();

App({
  onLaunch() {
    // 小程序初始化，全局只触发一次
    console.log('onLaunch');
  },
  onShow() {
    // 小程序启动，或从后台进入前台显示时触发
    console.log('onShow');
  },
  onHide() {
    // 小程序从前台进入后台时触发
    console.log('onHide');
  },
  globalData: {
    wxid: '',
  },
})
