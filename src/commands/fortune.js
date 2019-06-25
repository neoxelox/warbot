"use strict";
const fetch = require('node-fetch');
const colors = require('colors')

function fortune(message, args) {
    fetch("http://yerkee.com/api/fortune").then((res) => {
        res.json().then((body) => {
            message.channel.send(`||**${body.fortune}**|| <@${message.author.id}>`);
        }).catch((err) => {
            console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${err} `));
        });
    }).catch((err) => {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${err} `));
    });;
}

module.exports = fortune;