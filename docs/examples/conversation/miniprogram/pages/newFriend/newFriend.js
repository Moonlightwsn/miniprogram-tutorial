// pages/newFriend/newFriend.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            searchFunc: this.searchFunc.bind(this)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    // 搜索结果
    searchFunc: function (value) {
        return new Promise((resolve) => {
            if (value) resolve([{ text: `添加用户: ${value.substr(0, 16)}...`, value }]);
            else resolve([]);
        })
    },
    selectResult: async function (e) {
        const { item: { value } = {} } = e.detail || {};
        if (value) {
            wx.showLoading({
                title: '正在添加好友',
            });
            const res = await wx.cloud.callFunction({
                name: 'db',
                data: {
                    type: 'addFriend',
                    payload: {
                        wxid: value,
                    },
                },
            }).catch(e => {
                console.warn(e);
                return {};
            });
            wx.hideLoading();
            if (res && res.result && res.result.success) {
                wx.showToast({
                  title: '添加好友成功',
                });
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '添加好友失败',
                });
            }
        }
    },
})