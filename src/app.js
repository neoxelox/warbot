"use strict";

require('dotenv').config();
const Discord = require('discord.js');
const colors = require('colors')

const client = new Discord.Client();
const PREFIX = '> ';
const commands = require("./commands/commands.js");
const embeds = require("./embeds.js");

client.on('ready', () => {
  console.log(colors.bgRed.white(' Assembling weapons... '));
  console.log(colors.bgYellow.white(' Setting up the terrain... '));
  console.log(colors.bgGreen.white(` Sergeant! ${client.user.tag} At your orders! `));
  client.user.setActivity("> help"); // Playing... status
});

client.on('message', (message) => {
    if(message.author.equals(client.user)) return;
    if(!message.content.startsWith(PREFIX)) return;
    // LOG
    console.log(colors.bgBlue.white.bold(" MESSAGE ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" FROM ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white("", message.content, ""));
    
    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case commands.help_name:
            commands.help(message,args);
            break;
        case commands.ping_name:
            commands.ping(message,args);
            break;
        case commands.fortune_name:
            commands.fortune(message,args);
            break;
        default:
            // Unknown message
            message.channel.send(`**Unknown command!** <@${message.author.id}>, type ** *> help* ** .`);
            console.log(colors.bgYellow.white.bold(" WARNING ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(" Unknown command! "));
            break;
    }
});

client.login(process.env.USER_TOKEN);