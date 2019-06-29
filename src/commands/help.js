"use strict";
const {RichEmbed} = require('discord.js');
const embeds = require("../embeds.js")

function help(message, args) {
    let helpEmbed = new RichEmbed(Object.assign({}, embeds.help));
    helpEmbed.description = helpEmbed.description.replace(/%username/g, message.author.username);

    let commands = require("./commands.js");
    helpEmbed.description += `❓ ***> ${commands.help_name}*** \n \`\`\`fix\n${commands.help_description}\n\`\`\``;
    helpEmbed.description += `🤖 ***> ${commands.ping_name}*** \n \`\`\`css\n${commands.ping_description}\n\`\`\``;
    helpEmbed.description += `✨ ***> ${commands.fortune_name}*** \n \`\`\`fix\n${commands.fortune_description}\n\`\`\``;

    message.channel.send(helpEmbed);
}

module.exports = help;