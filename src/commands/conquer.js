"use strict"

const colors = require('colors');
const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const {getTurn, passTurn} = require("../game_logic/turn.js");
const conquered = require("../game_logic/conquered.js")
const {RichEmbed} = require('discord.js');

async function conquer(message, args, parties, client, frame)  {
	if(args[1] != undefined) {
		try {
			 parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
				 if(docs.length == 1) {
					if(docs[0].status === "STARTED") {
						let fPlayer = findByID(docs[0].players, message.author.id);
						if(fPlayer != null) {
							let tPlayer = await getTurn(docs[0]._id, parties);
							if(tPlayer != null && tPlayer.id === message.author.id) {
                                if(args[2] != undefined) {
                                    let vsCountry;
                                    vsCountry = docs[0].map.countries[args[2].toUpperCase()];
                                    if(vsCountry === undefined) {
                                        let inverse = JSON.parse(await readFile("../src/resources/inverse.json"));
                                        vsCountry = docs[0].map.countries[inverse[args[2][0].toUpperCase() + args[2].slice(1).replace(/-|_/g, " ")]];
                                    }
                                    if(vsCountry != undefined) {
                                        let attackPoints = 0;
                                        for(let i = 0; i < tPlayer.countries.length; i++) attackPoints += docs[0].map.countries[tPlayer.countries[i]].stats.attack_points;
                                        let oi = findCountryOwner(docs[0].players, vsCountry.id);
                                        if(oi != null) {
                                            let owner = oi.player;
                                            if(owner.id != message.author.id) {
                                                let defendPoints = 0;
                                                let guardCapital = owner.capital;
                                                for(let i = 0; i < owner.countries.length; i++) defendPoints += docs[0].map.countries[owner.countries[i]].stats.defend_points;
                                                if(attackPoints > defendPoints && (await conquered(frame,parties,client,fPlayer.index,vsCountry.id,true,oi.index,docs[0]) && await passTurn(docs[0]._id, parties, client))) {
                                                    // SUCCESS
                                                    let nEmbed = new RichEmbed()
                                                        .setColor(fPlayer.player.color)
                                                        .setAuthor(fPlayer.player.tag,fPlayer.player.avatar)
                                                        .setThumbnail(`https://www.countryflags.io/${vsCountry.id}/flat/64.png`)
                                                        .setDescription(`(\`${fPlayer.player.empire}\`) **\`${attackPoints}\` ⚔️ VS 🛡️ \`${defendPoints}\`** (\`${owner.empire}\`)\n\`${vsCountry.name}\` ${(vsCountry.id === guardCapital? "**\`(Capital)\`**": "")} was **conquered**! ✔️ From \`${owner.tag}\``)
                                                    message.channel.send(nEmbed);
                                                }
                                                else {
                                                    // NOT ENOUGH ATTACK POINTS
                                                    await passTurn(docs[0]._id, parties, client);
                                                    let nEmbed = new RichEmbed()
                                                        .setColor(fPlayer.player.color)
                                                        .setAuthor(fPlayer.player.tag,fPlayer.player.avatar)
                                                        .setThumbnail(`https://www.countryflags.io/${vsCountry.id}/flat/64.png`)
                                                        .setDescription(`(\`${fPlayer.player.empire}\`) **\`${attackPoints}\` ⚔️ VS 🛡️ \`${defendPoints}\`** (\`${owner.empire}\`)\n\`${vsCountry.name}\` ${(vsCountry.id === owner.capital? "**\`(Capital)\`**": "")} was **not conquered**! ❌`)
                                                    message.channel.send(nEmbed);
                                                }
                                            } else message.channel.send("**You can't conquer on your own territory!** 😤");
                                        } else {
                                            if(attackPoints > vsCountry.stats.defend_points && (await conquered(frame,parties,client,fPlayer.index,vsCountry.id,false,null,docs[0]) && await passTurn(docs[0]._id, parties, client))) {
                                                // SUCCESS
                                                let nEmbed = new RichEmbed()
                                                    .setColor(fPlayer.player.color)
                                                    .setAuthor(fPlayer.player.tag,fPlayer.player.avatar)
                                                    .setThumbnail(`https://www.countryflags.io/${vsCountry.id}/flat/64.png`)
                                                    .setDescription(`(\`${fPlayer.player.empire}\`) **\`${attackPoints}\` ⚔️ VS 🛡️ \`${vsCountry.stats.defend_points}\`** (\`Self country\`)\n\`${vsCountry.name}\` was **conquered**! ✔️`)
                                                message.channel.send(nEmbed);
                                            } else {
                                                // NOT ENOUGH ATTACK POINTS
                                                await passTurn(docs[0]._id, parties, client);
                                                let nEmbed = new RichEmbed()
                                                    .setColor(fPlayer.player.color)
                                                    .setAuthor(fPlayer.player.tag,fPlayer.player.avatar)
                                                    .setThumbnail(`https://www.countryflags.io/${vsCountry.id}/flat/64.png`)
                                                    .setDescription(`(\`${fPlayer.player.empire}\`) **\`${attackPoints}\` ⚔️ VS 🛡️ \`${vsCountry.stats.defend_points}\`** (\`Self country\`)\n\`${vsCountry.name}\` was **not conquered**! ❌`)
                                                message.channel.send(nEmbed);
                                            }
                                        }
                                    } else {
                                        message.channel.send("No country found with that **\`ISO code\`** or **\`name\`** 🤔");
                                    }
                                } else {
                                    message.channel.send(`No **\`[Country ISO code/name]\`** specified for ***> conquer*** order! <@${message.author.id}>, type ** *> help* ** .`);
                                }
							} else {
								message.channel.send("**It's not your turn!** 😤");
							}
						} else {
						message.channel.send("**You are not in this party!** 😅");
					}
					} else if(docs[0].status === "WAITING") {
						message.channel.send("**This party has not started yet!** 😅");
					} else {
						message.channel.send("**This party has already finished!** 😅");
					}
				 } 
				 else if(docs.length > 1) {
					 let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
					 for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
						 msg += `\`> conquer ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
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
		 message.channel.send(`No **\`[Party name/id]\`** specified for ***> conquer*** order! <@${message.author.id}>, type ** *> help* ** .`);
	 }
}

function findByID(players,id) {
    for(let i = 0; i < players.length; i++)
            if(players[i].id === id) return {index: i, player: players[i]};
    return null;
}

function findCountryOwner(players,country) {
    for(let i = 0; i < players.length; i++)
        for(let j = 0; j < players[i].countries.length; j++)
            if(players[i].countries[j] === country) return {index: i, player: players[i]};
    return null;
}

module.exports = conquer;