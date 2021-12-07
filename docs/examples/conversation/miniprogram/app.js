// app.js

// init wx cloud
wx.cloud.init();

let messagesListener = null;
let messagesWather;

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
    // if (messagesWather) messagesWather.close();
  },
  async init() {
    if (!this.globalData.appInit) {
      this.globalData.appInit = true;
      const res = await wx.cloud.callFunction({
        name: 'common',
        data: {
          type: 'getIdentity',
        },
      }).catch(e => {
        console.warn(e);
        return {};
      });
      const { result: { wxid } = {} } = res || {};
      if (wxid) {
        this.globalData.wxid = wxid;
        // 初始化完成（即拿到自己的wxid）后，先获取最近的20条消息，然后开始监听实时消息
        const recent = await this.getRecentMessages(wxid);
        const { timestamp } = recent;
        this.messagesInit(timestamp);
      }
    }
    return this.globalData.wxid;
  },
  async getRecentMessages(wxid) {
    const res = await wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getRecentMessages',
        payload: {
          wxid,
          num: 20,
        },
      },
    }).catch(e => {
      console.warn(e);
      return {};
    }) || {};
    console.log('getRecentMessages', res);
    const { result: { success, messages = [] } = {} } = res || {};
    const now = new Date().getTime();
    if (success && Array.isArray(messages)) {
      this.globalData.recentMessages = messages;
      return {
        timestamp: messages[messages.length - 1] ? messages[messages.length - 1].timestamp : now,
        messages,
      };
    }
    return {
      timestamp: now,
      messages: [],
    };
  },
  _messageId: 0,
  messagesInit(timestamp) {
    const db = wx.cloud.database();
    const _ = db.command;
    const wxid = this.globalData.wxid;
    messagesWather = db.collection('messages').orderBy('timestamp', 'asc').limit(50).where({
      timestamp: _.gt(timestamp),
    }).where(_.or([
      {
        from: wxid,
      },
      {
        to: wxid,
      }
    ])).watch({
      onChange: (snapshot) => {
        const { id, docs = [] } = snapshot || {};
        console.log('snapshot', snapshot, id, docs, messagesListener);
        if (id > this._messageId && typeof messagesListener === 'function') {
          this._messageId += 1;
          messagesListener(docs);
        }
      },
      onError: (err) => {
        console.warn(err);
      }
    })
  },
  watchMessagesChange(listener) {
    messagesListener = listener;
  },
  unWatchMessagesChange() {
    messagesListener = null;
  },
  globalData: {
    appInit: false,
    wxid: '',
    recentMessages: [],
  },
})
