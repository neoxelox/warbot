"use strict";
const colors = require('colors');
const {RichEmbed} = require('discord.js');

async function change(message, args, parties) {
    if(args[1] != undefined) {
       try {
            parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
                if(docs.length == 1) {
                    if(docs[0].status != "FINISHED") {
                        if(args[2] === "c") {
                            if(args[3] != undefined) {
                                let is6Hex = /[0-9A-Fa-f]{6}/g;
                                if(is6Hex.test(args[3])) {
                                    let fPlayer = findByID(docs[0].players, message.author.id);
                                    if(fPlayer != null) {
                                        let conds = {$set:{}}; conds.$set[`players.${fPlayer.index}.color`] = args[3];
                                        parties.update({_id: docs[0]._id}, conds, {}, (err) => {
                                        if(!err) {
                                            let pEmbed = new RichEmbed()
                                                .setColor(args[3])
                                                .setThumbnail(`http://www.singlecolorimage.com/get/${args[3]}/50x50.png`)
                                                .setDescription(`**Successfully updated your \`${docs[0].name}\` Empire's Color! 😀\nIf this message doesn't show your requested color, try again! 🔄**`)
                                            message.channel.send(pEmbed);
                                        }
                                    });
                                    } else {
                                        message.channel.send("**You are not in this party!** 😅");
                                    }                                
                                } else {
                                    message.channel.send("**HEX Color not valid! Remember, do not put '#'!** 😤");
                                }           
                            } else {
                                message.channel.send(`No **\`[HEX Color]\`** specified for ***> change*** order! <@${message.author.id}>, type ** *> help* ** .`);
                            }
                        } else if(args[2] === "e") {
                            if(args[3] != undefined) {
                                let fPlayer = findByID(docs[0].players, message.author.id);
                                if(fPlayer != null) {
                                    let conds = {$set:{}}; conds.$set[`players.${fPlayer.index}.empire`] = args[3].replace(/-|_/g, " ");
                                    parties.update({_id: docs[0]._id}, conds, {}, (err) => {
                                        if(!err) message.channel.send(`**Successfully updated your \`${docs[0].name}\` Empire's Name to \`${args[3].replace(/-|_/g, " ")}\`! 😀**`);
                                    });
                                } else {
                                        message.channel.send("**You are not in this party!** 😅");
                                }  
                            } else {
                                message.channel.send(`No **\`[Empire Name]\`** specified for ***> change*** order! <@${message.author.id}>, type ** *> help* ** .`);
                            }
                        } else if(args[2] === "f") {
                            if(args[3] != undefined) {
                                if(validURL(args[3])) {
                                    let fPlayer = findByID(docs[0].players, message.author.id);
                                    if(fPlayer != null) {
                                        let conds = {$set:{}}; conds.$set[`players.${fPlayer.index}.flag`] = args[3];
                                        parties.update({_id: docs[0]._id}, conds, {}, (err) => {
                                        if(!err) {
                                            let pEmbed = new RichEmbed()
                                                .setThumbnail(args[3])
                                                .setDescription(`**Successfully updated your \`${docs[0].name}\` Empire's Flag! 😀\nIf this message doesn't show your flag, try again! 🔄**`)
                                            message.channel.send(pEmbed);
                                        }
                                    });
                                    } else {
                                        message.channel.send("**You are not in this party!** 😅");
                                    }
                                } else {
                                    message.channel.send("**URL not valid! Remember to put full image url with final .png extension!** 😤");
                                } 
                            } else {
                                message.channel.send(`No **\`[PNG Flag URL]\`** specified for ***> change*** order! <@${message.author.id}>, type ** *> help* ** .`);
                            }
                        } else {
                            message.channel.send(`No **\`[c/e/f]\`** specified for ***> change*** order! <@${message.author.id}>, type ** *> help* ** .`);
                        }
                } else message.channel.send("**You cannot change anything if the party has already finished!** 😅");
                } 
                else if(docs.length > 1) {
                    let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
                    for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
                        msg += `\`> change ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
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
        message.channel.send(`No **\`[Party name/id]\`** specified for ***> change*** order! <@${message.author.id}>, type ** *> help* ** .`);
    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}

function findByID(players,id) {
    for(let i = 0; i < players.length; i++)
            if(players[i].id === id) return {index: i, player: players[i]};
    return null;
}

module.exports = change;