"use strict"

const {RichEmbed} = require('discord.js');
const colors = require('colors');
const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const {table} = require('table');

async function status(message, args, parties) {
    if(args[1] != undefined) {
        try {
             parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
                 if(docs.length == 1) {
                    if(args[2] === undefined) {
                        let gblConf = {columns: {0: {alignment: 'left', width: 25}, 1: {alignment: 'left', width: 9}, 2: {alignment: 'left', width: 5}}};
                        let globalTable = []; globalTable[0] = ['PLAYER TAG', 'COUNTRIES', 'POWER'];
                        let tPlayer = null;
                        let wPlayer = null;
                        for(let i = 0; i < docs[0].players.length; i++) {
                            let temp = [];
                            let playerPower = 0;
                            let playerCountries = "";
                            for(let j = 0; j < docs[0].players[i].countries.length; j++) {
                                let currentCountry = docs[0].map.countries[docs[0].players[i].countries[j]];
                                playerCountries += `${currentCountry.id} `;
                                playerPower += currentCountry.stats.attack_points;
                                playerPower += currentCountry.stats.defend_points;
                            }
                            if(!docs[0].players[i].fold) {
                                temp[0] = docs[0].players[i].tag;
                                temp[1] = playerCountries;
                                temp[2] = playerPower;
                                if(docs[0].status === "FINISHED") wPlayer = docs[0].players[i];
                                if(docs[0].players[i].turn) tPlayer = docs[0].players[i];
                            } else {
                                temp[0] = strikethroughText(docs[0].players[i].tag);
                                temp[1] = "---------";
                                temp[2] = "-----";
                            }
                            
                            globalTable[i+1] = temp;
                        }
                        let oEmbed = new RichEmbed()
                            .setColor((docs[0].status === "STARTED" ? "#00c853" : ( docs[0].status === "WAITING" ? "#ff6d00" : "#d50000")))
                            .setAuthor(`${docs[0].name} #${docs[0].id}\nCreated by ${docs[0].creator.name} at ${docs[0].createdAt.toLocaleString()}`,docs[0].creator.avatar) //(tPlayer != null ? `` : "")
                            .setDescription('```null\n' + table(globalTable, gblConf) + '\n```\`Type\` **\`> status ' + docs[0].id + ' p [Player TAG]\`** \`for a detailed player view.\`\n' + (wPlayer != null ? `**🎊 <@${wPlayer.id}> HAS WON THIS PARTY! 🎊**`: (tPlayer != null? `It's <@${tPlayer.id}>'s turn!` : "")))
                            .setImage(docs[0].map.link) // The footer is so large because Discord doesn't like \t...
                            .setFooter(`Current status: ${docs[0].status}                                                           ${(docs[0].password === null ? "Public" : "Private")}                                                        Players: ${docs[0].players.length}/${docs[0].slots}`)
                        message.channel.send(oEmbed);
                    } else if(args[2] === "c") {
                        if(args[3] != undefined) {
                            let country;
                            country = docs[0].map.countries[args[3].toUpperCase()];
                            if(country === undefined) {
                                let inverse = JSON.parse(await readFile("../src/resources/inverse.json"));
                                country = docs[0].map.countries[inverse[args[3][0].toUpperCase() + args[3].slice(1).replace(/-|_/g, " ")]];
                            }
                            if(country != undefined) {
                                let owner = findCountryOwner(docs[0].players, country.id);
                                let defCon = JSON.parse(await readFile("../src/resources/countries.json"))[country.id];
                                let cEmbed = new RichEmbed()
                                    .setColor((owner != null ? owner.color : country.color))
                                    .setThumbnail((owner != null ? owner.flag: `https://www.countryflags.io/${country.id}/flat/64.png`)) // I realized Discord doesn't have preview for .svg images... so this is a workaround
                                    .setAuthor(country.name + (owner != null ? "of the " + owner.empire + " Empire" : ""), (owner != null ? owner.avatar:""))
                                    .setTitle(`**\`${country.id}\` :flag_${country.id.toLowerCase()}: ${(owner != null ? `${(country.id === owner.capital ? "*capital* and ":"")}property of \`` + owner.name + "\`" : "unclaimed")}**`)
                                    .setDescription(`**__Area:__ \`${country.area} km²\` \n __Population:__ \`${country.stats.population} humans\` of which the \`${((country.stats.population/defCon.stats.population)-1) * 100}%\` are dead\n __Attack Points:__ \`${country.stats.attack_points}\` \n __Defend Points:__ \`${country.stats.defend_points}\`**`)
                        
                                message.channel.send(cEmbed);
                            } else message.channel.send("No country found with that **\`ISO code\`** or **\`id\`** 🤔");
                        } else {
                            message.channel.send(`No **\`[Country ISO code/name]\`** specified for ***> status*** order! <@${message.author.id}>, type ** *> help* ** .`);
                        }
                    } else if(args[2] === "p") {
                        if(args[3] != undefined) {
                            let player = findByTAG(docs[0].players, args[3]);
                            if(player != undefined) {
                                let playerAttackP = 0;
                                let playerDefendP = 0;
                                let playerPopulation = 0;
                                let playerCountries = "";
                                for(let i = 0; i < player.countries.length; i++) {
                                    let currentCountry = docs[0].map.countries[player.countries[i]];
                                    playerCountries += `${currentCountry.id} `;
                                    playerAttackP += currentCountry.stats.attack_points;
                                    playerDefendP += currentCountry.stats.defend_points;
                                    playerPopulation += currentCountry.stats.population;
                                }

                                let pEmbed = new RichEmbed()
                                    .setColor(player.color)
                                    .setAuthor(`${player.tag} ${(player.fold? `${player.name} [LOST ❌]`:(docs[0].status === "FINISHED" ? `[WINNER 🏆]` : (player.turn ? `[TURN ⏳]`: "")))}`, player.avatar)
                                    .setThumbnail(player.flag)
                                    
                                    .addField("**EMPIRE**", `\`${player.empire}\``, true)
                                    .addField("**CAPITAL**", `\`${(player.capital != null ? docs[0].map.countries[player.capital].name : "-")}\``, true)
                                    
                                    .addField("**COUNTRIES**", `\`${player.countries.length}\``, true)
                                    .addField("**POPULATION**", `\`${playerPopulation}\``, true)

                                    .addField("**ATTACK POINTS**", `\`${playerAttackP}\``, true)
                                    .addField("**DEFEND POINTS**", `\`${playerDefendP}\``, true)
                                    
                                    .setImage(player.mapLink)

                                    .setFooter(`Country List: ${(playerCountries != "" ? playerCountries : "-")}`, `http://www.singlecolorimage.com/get/${player.color}/50x50.png`)

                                message.channel.send(pEmbed);
                            } else message.channel.send("No player found with that **\`Player TAG\`** 🤔");
                        } else {
                            message.channel.send(`No **\`[Player TAG]\`** specified for ***> status*** order! <@${message.author.id}>, type ** *> help* ** .`);
                        }
                    } else {
                        message.channel.send(`No **\`[c/p]\`** specified for ***> status*** order! <@${message.author.id}>, type ** *> help* ** .`);
                    }
                 } 
                 else if(docs.length > 1) {
                     let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
                     for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
                         msg += `\`> status ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
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
         message.channel.send(`No **\`[Party name/id]\`** specified for ***> status*** order! <@${message.author.id}>, type ** *> help* ** .`);
     }
}

function findCountryOwner(players,country) {
    for(let i = 0; i < players.length; i++)
        for(let j = 0; j < players[i].countries.length; j++)
            if(players[i].countries[j] === country) return players[i];
    return null;
}

function findByTAG(players,tag) {
    for(let i = 0; i < players.length; i++)
            if(players[i].tag === tag) return players[i];
    return null;
}

function strikethroughText(text) {
    return text.split('').reduce(function(acc, char) {
      return acc + char + '\u0336';
    }, '');
}

module.exports = status;