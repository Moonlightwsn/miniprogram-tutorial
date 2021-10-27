Page({

    /**
     * 页面的初始数据
     */
    data: {
        messages: [{
            friendID: '100001',
            friendTitle: '程然',
            lastMessage: '等下你去看开幕式么?',
            friendAvatar: '/images/avatar/avatar_chengran.jpeg'
        }, {
            friendID: '100002',
            friendTitle: '伟国',
            lastMessage: '[图片]',
            friendAvatar: '/images/avatar/avatar_weiguo.jpeg'
        }, {
            friendID: '100003',
            friendTitle: '广爷',
            lastMessage: '有熟悉NFT的吗？请教一个实物上链的手法',
            friendAvatar: '/images/avatar/avatar_guangye.jpeg'
        }, {
            friendID: '100004',
            friendTitle: '智博',
            lastMessage: '你这放的是ppt吗',
            friendAvatar: '/images/avatar/avatar_zhibo.jpeg'
        }, {
            friendID: '100005',
            friendTitle: '斌斌',
            lastMessage: '笔直向上，一天11倍',
            friendAvatar: '/images/avatar/avatar_binbin.jpeg'
        }, {
            friendID: '100006',
            friendTitle: '守毅',
            lastMessage: '卧槽，忘记打卡了',
            friendAvatar: '/images/avatar/avatar_shouyi.jpeg'
        }, {
            friendID: '100007',
            friendTitle: '峰峰',
            lastMessage: '我第几次了[看]今天请大家喝下午茶',
            friendAvatar: '/images/avatar/avatar_fengfeng.jpeg'
        }, {
            friendID: '100008',
            friendTitle: '晨阳',
            lastMessage: '[表情]',
            friendAvatar: '/images/avatar/avatar_chenyang.jpeg'
        }, {
            friendID: '100009',
            friendTitle: '光瑞',
            lastMessage: '[表情]',
            friendAvatar: '/images/avatar/avatar_guangrui.jpeg'
        }],
        messageActions: [{
            text: '标记未读',
            extClass: 'set-unread',
        }, {
            text: '不显示',
            extClass: 'hide-message',
        }, {
            text: '删除',
            type: 'warn',
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})