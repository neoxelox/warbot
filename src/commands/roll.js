"use strict";
const fs = require('fs');
const {promisify} = require('util');
const {RichEmbed} = require('discord.js');
const readFile = promisify(fs.readFile);
const {getTurn, passTurn} = require("../game_logic/turn.js");

async function roll(message, args, parties, client) {
	if(args[1] != undefined) {
		try {
			 parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
				 if(docs.length == 1) {
					if(docs[0].status === "STARTED") {
						let fPlayer = findByID(docs[0].players, message.author.id);
						if(fPlayer != null) {
							let tPlayer = await getTurn(docs[0]._id, parties);
							if(tPlayer != null && tPlayer.id === message.author.id) {
								if(tPlayer.capital != null) {
									let dices = JSON.parse(await readFile("../src/resources/dices.json"));
									let dice = dices[dices.length * Math.random() << 0];
									let capital = docs[0].map.countries[tPlayer.capital];
									if((2 * Math.random() << 0) === 1) capital.stats.defend_points += dice.number;
									else capital.stats.attack_points += dice.number;

									let dEmbed = new RichEmbed()
										.setColor(tPlayer.color)
										.setThumbnail(dice.url)
										.setAuthor(`DICE ROLLED - ${dice.number}`, `https://www.countryflags.io/${capital.id}/flat/64.png`)
										.setTitle(`**\`${capital.name}\` has now: **`)
										.addField("**ATTACK POINTS**", capital.stats.attack_points, true)
										.addField("**DEFEND POINTS**", capital.stats.defend_points, true)
									
									let conds = {$set:{}}; conds.$set[`map.countries.${capital.id}`] = capital;
									parties.update({_id: docs[0]._id}, conds, {}, async (err) => {
										if(!err && await passTurn(docs[0]._id, parties, client)) {
											message.channel.send(dEmbed);
										}
									});
								} else {
									if(await passTurn(docs[0]._id, parties, client)) message.channel.send("**Sadly you lost your capital, so you can't roll for points, passing turn...**");
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
						 msg += `\`> roll ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
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
		 message.channel.send(`No **\`[Party name/id]\`** specified for ***> roll*** order! <@${message.author.id}>, type ** *> help* ** .`);
	 }
}

function findByID(players,id) {
    for(let i = 0; i < players.length; i++)
            if(players[i].id === id) return {index: i, player: players[i]};
    return null;
}

module.exports = roll;

/*

let dices = JSON.parse(await readFile("../src/resources/dices.json"));
    let dice = dices[dices.length * Math.random() << 0];
    let dEmbed = new RichEmbed()
            //.setColor("ffffff") // PLAYER EMPIRE COLOR
            .setThumbnail(dice.url)
            //.setAuthor("Dice Rolled")
            .setTitle(`**DICE** \n**\`${dice.number}\`**`)
            //.setDescription(`__Area:__ \`${country.area} km²\` \n __Population:__ \`${country.stats.population} humans\` \n __Attack Points:__ \`${country.stats.attack_points}\` \n __Defend Points:__ \`${country.stats.defend_points}\``)

        message.channel.send(dEmbed);

*/