"use strict";

require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();
const PREFIX = '> '
const embeds = require("./embeds.js")

client.on('ready', () => {
  console.log('Assembling weapons...');
  console.log('Setting up the terrain...');
  console.log(`Captain! ${client.user.tag} At your orders!`);
});

client.on('message', (message) => {
    if(message.author.equals(client.user)) return;
    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "owo":
            message.channel.sendMessage("UwU");
            break;
    
        default:
            // Unknown message
            message.channel.send("Unknown command!");
            break;
    }
});


client.login(process.env.USER_TOKEN);