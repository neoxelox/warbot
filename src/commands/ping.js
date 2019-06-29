"use strict";

function ping(message, args) {
    message.channel.send("🤖 __ping:__ **" + message.createdAt.getMilliseconds() + " ms**");
}

module.exports = ping;