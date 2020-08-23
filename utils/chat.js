const moment = require('moment');

function chatMessage(username, chatMsg){
    return {
        username, chatMsg,  time: moment().format('h:mm a')
    };
}

module.exports = chatMessage;