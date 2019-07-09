"use strict";

const colors = require('colors');

async function leave(message, args, parties) {
    if(args[1] != undefined) {
       try {
            parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
                if(docs.length == 1) {
                    let fPlayer = findByID(docs[0].players, message.author.id);
                    if(fPlayer != null) {
                        //let conds = {$set:{}}; conds.$set[`players.${fPlayer.index}.fold`] = true;
                        let conds = {$unset:{}}; conds.$unset[`players.${fPlayer.index}`] = true;
                        parties.update({_id: docs[0]._id}, conds, {}, (err) => {
                            if(!err) message.channel.send(`**Successfully leaved party** \`${docs[0].name}\` **with id** \`${docs[0].id}\`**.** 😥`);
                        });
                    } else {
                        message.channel.send("**You are not in this party!** 😅");
                    }
                } 
                else if(docs.length > 1) {
                    let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
                    for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
                        msg += `\`> leave ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
                    }
                    message.channel.send(msg);
                } else message.channel.send("No party found with that **\`name\`** or **\`id\`** 🤔");
            });   
       } catch (error) {
            console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${error} `));
            message.channel.send("Sorry, something went wrong 😓");
       }
    }
    else {
        message.channel.send(`No **\`[Party name/id]\`** specified for ***> leave*** order! <@${message.author.id}>, type ** *> help* ** .`);
    }
}

function findByID(players,id) {
    for(let i = 0; i < players.length; i++)
            if(players[i].id === id) return {index: i, player: players[i]};
    return null;
}

module.exports = leave;