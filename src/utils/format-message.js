const moment = require('moment');

const formatMessage = (username, content, isChatbot, room=null, userId = null) => {
    return {
        username,
        content,
        userId,
        room,
        isChatbot,
        time: moment().format('h:mm a')
    }
};

module.exports = formatMessage;