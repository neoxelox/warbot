"use strict"
const colors = require('colors');

async function list(message, args, parties) {
    parties.find((args[1] != undefined ? {status: args[1].toUpperCase()} : {}), async (err, docs) => {
        if(!err) {
            if(docs.length > 0) {
                let msg = `**📜 ${docs.length}** parties found! 😄\n`;
                for(let i = 0; i < docs.length; i++) {
                    msg += `\`${docs[i].name}#${docs[i].id}\``;
                    msg += " **|** ";
                    msg += `\`${docs[i].players.length}/${docs[i].slots} | ${docs[i].status} ${(docs[i].password === null ? "": "🔐")}\``;
                    msg += " **by** ";
                    msg += `\`${docs[i].creator.name} | ${docs[i].createdAt.toLocaleString()}\``;
                    msg += `\n**${'-'.repeat(102)}**\n`;
                }
                message.channel.send(msg);
            } else message.channel.send("No parties found... 😔");
        } else {
            console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${error} `));
            message.channel.send("Sorry, something went wrong 😓");    
        }
    });
}

module.exports = list;