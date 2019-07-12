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
    helpEmbed.description += `🔎 ***> ${commands.see_name}*** \`[${commands.see_arg_1}]\` \n \`\`\`css\n${commands.see_description}\n\`\`\``;
    helpEmbed.description += `➕ ***> ${commands.create_name}*** \`[${commands.create_arg_1}]\` \`[${commands.create_arg_2}]\` \`[${commands.create_arg_3}]\` \n \`\`\`fix\n${commands.create_description}\n\`\`\``;
    helpEmbed.description += `➖ ***> ${commands.delete_name}*** \`[${commands.delete_arg_1}]\` \`[${commands.delete_arg_2}]\` \n \`\`\`css\n${commands.delete_description}\n\`\`\``;
    helpEmbed.description += `🌐 ***> ${commands.status_name}*** \`[${commands.status_arg_1}]\` \`[${commands.status_arg_2}]\` \`[${commands.status_arg_3}]\`\n \`\`\`fix\n${commands.status_description}\n\`\`\``;
    helpEmbed.description += `🕹️ ***> ${commands.join_name}*** \`[${commands.join_arg_1}]\` \`[${commands.join_arg_2}]\` \n \`\`\`css\n${commands.join_description}\n\`\`\``;
    helpEmbed.description += `👋 ***> ${commands.leave_name}*** \`[${commands.leave_arg_1}]\`\n \`\`\`fix\n${commands.leave_description}\n\`\`\``;
    helpEmbed.description += `🖊️ ***> ${commands.change_name}*** \`[${commands.change_arg_1}]\` \`[${commands.change_arg_2}]\` \`[${commands.change_arg_3}]\`\n \`\`\`css\n${commands.change_description}\n\`\`\``;
    helpEmbed.description += `✉️ ***> ${commands.invite_name}*** \`[${commands.invite_arg_1}]\` \`[${commands.invite_arg_2}]\`\n \`\`\`fix\n${commands.invite_description}\n\`\`\``;
    helpEmbed.description += `📜 ***> ${commands.list_name}*** \`[${commands.list_arg_1}]\`\n \`\`\`css\n${commands.list_description}\n\`\`\``;
    helpEmbed.description += `⚔️ ***> ${commands.conquer_name}*** \`[${commands.conquer_arg_1}]\` \`[${commands.conquer_arg_2}]\`\n \`\`\`fix\n${commands.conquer_description}\n\`\`\``;
    helpEmbed.description += `🎲 ***> ${commands.roll_name}*** \`[${commands.roll_arg_1}]\`\n \`\`\`css\n${commands.roll_description}\n\`\`\``;
    
    message.channel.send(helpEmbed);
}

module.exports = help;