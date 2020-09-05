const moment = require('moment');

const formatMessage = (username, content, userType) => {
    return {
        username,
        content,
        userType,
        time: moment().format('h:mm a')
    }
};

module.exports = formatMessage;