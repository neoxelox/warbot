"use strict";

require('dotenv').config();
const Discord = require('discord.js');
const colors = require('colors');
const database = require('nedb');

const client = new Discord.Client();
const PREFIX = '> ';
const commands = require("./commands/commands.js");
const embeds = require("./embeds.js");
const parties = new database({
    filename: 'parties.db',
    timestampData: true
});

client.on('ready', () => {
    console.log(colors.bgRed.white(' Assembling weapons... '));
    parties.loadDatabase();
    console.log(colors.bgYellow.white(' Setting up the terrain... '));
    //...
    console.log(colors.bgGreen.white(` Sergeant! ${client.user.tag} At your orders! `));
    client.user.setActivity(`${PREFIX}help`); // Playing... status
});

client.on('message', (message) => {
    if(message.author.equals(client.user)) return;
    if(message.author.bot === true) return;
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
        case commands.see_name:
            commands.see(message,args);
            break;
        case commands.create_name:
            commands.create(message,args,parties);
            break;
        case commands.delete_name:
            commands.delete(message,args,parties);
            break;
        case commands.join_name:
            commands.join(message,args,parties);
            break;
        case commands.leave_name:
            commands.leave(message,args,parties);
            break;
        case commands.status_name:
            commands.status(message,args,parties);
            break;
        case commands.invite_name:
            commands.invite(client,message,args,parties);
            break;
        // TO-DO
        case commands.roll_name:
            commands.roll(message,args);
            break;
        default:
            // Unknown command
            message.channel.send(`**Unknown command!** <@${message.author.id}>, type ** *> help* ** .`);
            console.log(colors.bgYellow.white.bold(" WARNING ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(" Unknown command! "));
            break;
    }
});

client.login(process.env.USER_TOKEN);