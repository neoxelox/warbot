"use strict";

const colors = require('colors');
const {player_scheme} = require("../schemes.js");
var randomColor = require('randomcolor');
const {RichEmbed} = require('discord.js');

async function join(message, args, parties) {
    if(args[1] != undefined) {
       try {
            parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
                if(docs.length == 1) {
                    if((docs[0].password === null) || (docs[0].password === args[2])) {
                        if(docs[0].players.length < docs[0].slots) {
                            if(!findByID(docs[0].players, message.author.id)) {
                                // JOIN
                                let newPlayer = Object.assign({}, player_scheme);
                                newPlayer.id = message.author.id;
                                newPlayer.name = message.author.username;
                                newPlayer.tag = message.author.tag;
                                newPlayer.avatar = message.author.avatarURL;
                                newPlayer.turn = false;
                                newPlayer.fold = false;
                                newPlayer.empire = newPlayer.name + "'s Empire";
                                newPlayer.color = randomColor().slice(1);
                                newPlayer.flag = message.author.avatarURL;
                                newPlayer.mapPath = docs[0].map.path + `/${message.author.tag}.png`;
                                newPlayer.mapLink = docs[0].map.link;

                                parties.update({_id: docs[0]._id}, { $push: { players: newPlayer } }, {}, (err) => {
                                    if(!err) {
                                        let pEmbed = new RichEmbed()
                                            .setColor(newPlayer.color)
                                            .setAuthor(newPlayer.empire, `http://www.singlecolorimage.com/get/${newPlayer.color}/50x50.png`)
                                            .setThumbnail(newPlayer.flag)
                                            .setDescription(`**Successfully joined party** \`${docs[0].name}\` **with id** \`${docs[0].id}\`**.** 👍\nTo change the default/random profile values **type:**\n\`> change ${docs[0].id} c [HEX Color]\` to change your profile/map color.\n\`> change ${docs[0].id} e [Empire Name]\` to change your Empire's name.\n\`> change ${docs[0].id} f [Flag URL]\` to change your Empire's Flag.`)
                                        message.channel.send(pEmbed);
                                        // if(docs[0].players.length + 1 === docs[0].slots) trigger START game logic!
                                    }                                    
                                });
                            } else {
                                message.channel.send("**You have already joined that party!** 😤");
                            }
                        } else {
                            message.channel.send("**This party is already full!** 😅");
                        }
                    } else {
                        message.channel.send("**Wrong password for the party!** 🤨");
                    }
                } 
                else if(docs.length > 1) {
                    let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
                    for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
                        msg += `\`> join ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
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
        message.channel.send(`No **\`[Party name/id]\`** specified for ***> join*** order! <@${message.author.id}>, type ** *> help* ** .`);
    }
}

function findByID(players,id) {
    for(let i = 0; i < players.length; i++)
            if(players[i].id === id) return true;
    return false;
}

module.exports = join;