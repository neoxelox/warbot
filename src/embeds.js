"use strict";

const {RichEmbed} = require('discord.js');

const help = new RichEmbed()
    .setColor('BLACK')
    .setDescription('Hi Sergeant **%username**!, \n These are all your available **orders**: 👇\n \`Spaces equals _ or -\`\n')
    .setFooter('Made with ❤ by @neoxelox                                                                                                                                                                   Neoxelox#9588', "https://cdn.discordapp.com/avatars/157613064810790912/9433f4e07c9a766c6a28feeb0978a155.png?size=2048")


module.exports = {
    help: help
};