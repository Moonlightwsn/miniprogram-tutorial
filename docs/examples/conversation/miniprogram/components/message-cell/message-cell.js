Component({
    properties: {
        avatar: {
            type: String,
            value: '',
        },
        unread: {
            type: Number,
            value: 0,
        },
        bellringOff: {
            type: Boolean,
            value: false,
        },
        nickName: {
            type: String,
            value: '',
        },
        message: {
            type: String,
            value: '',
        },
        tail: {
            type: String,
            value: '',
        }
    },
    data: {
        actions: [{
            text: '标记未读',
            extClass: 'action set-unread',
        }, {
            text: '不显示',
            extClass: 'action hide-message',
        }, {
            text: '删除',
            type: 'warn',
            extClass: 'action',
        }],
    },
    options: {
        styleIsolation: 'shared',
    }
})