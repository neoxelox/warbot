"use strict";

const {RichEmbed} = require('discord.js');

const help = new RichEmbed()
    .setColor('BLACK')
    .setDescription('Hi Sergeant **%username**!, \n Theese are all your available **orders**: 👇 \n')


module.exports = {
    help: help
};