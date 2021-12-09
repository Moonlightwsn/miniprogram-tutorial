const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const _friendMap = {};

const classifyMessages = (app, messages, fid) => {
  console.log('_friendMap', _friendMap);
  const { wxid: mySelf } = app.globalData;
  if (mySelf && Object.keys(_friendMap).length > 0) {
    messages.forEach(msg => {
      const friendID = msg.from === mySelf ? msg.to : msg.from;
      if (_friendMap[friendID]) {
        // 将消息按照归属好友分类
        const friend = _friendMap[friendID].user;
        const updateData = {};
        updateData.lastMessage = msg.message;
        updateData.lastTimestamp = msg.timestamp;
        const t = new Date(msg.timestamp);
        updateData.lastTime = `${t.getMonth() + 1}-${t.getDate()}`;
        updateData.unread = (friend.unread || 0) + 1;
        _friendMap[friendID].user = {
          ...friend,
          ...updateData,
        };
      }
      // 将与对应好友的消息编进一个集合（数组）内
      // 新消息按照时间升序排列，遍历消息列表时往表尾插入
      const isMySelf = msg.from === app.globalData.wxid
      _friendMap[friendID].messages.push({
        ...msg,
        isMySelf,
        avatar: isMySelf ? app.globalData.avatarUrl : _friendMap[friendID].user.avatar,
      });
    });

    const friendMessageList = Object.keys(_friendMap).map(fKey => _friendMap[fKey].user);
    // 按最后一条消息时间倒序排序
    friendMessageList.sort((a, b) => {
      return b.lastTimestamp - a.lastTimestamp;
    });

    const messageList = _friendMap[fid] ? _friendMap[fid].messages : [];

    return {
      friendMessageList,
      messageList,
    };
  }
  return { friendMessageList: [], messageList: [] };
};

module.exports = {
  formatTime,
  classifyMessages,
  friendMap: _friendMap,
}
