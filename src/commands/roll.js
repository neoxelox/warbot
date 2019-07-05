"use strict";
const fs = require('fs');
const {promisify} = require('util');
const {RichEmbed} = require('discord.js');

const readFile = promisify(fs.readFile);

async function roll(message, args) {
    let dices = JSON.parse(await readFile("../src/resources/dices.json"));
    let dice = dices[dices.length * Math.random() << 0];
    let dEmbed = new RichEmbed()
            //.setColor("ffffff") // PLAYER EMPIRE COLOR
            .setThumbnail(dice.url)
            //.setAuthor("Dice Rolled")
            .setTitle(`**DICE** \n**\`${dice.number}\`**`)
            //.setDescription(`__Area:__ \`${country.area} km²\` \n __Population:__ \`${country.stats.population} humans\` \n __Attack Points:__ \`${country.stats.attack_points}\` \n __Defend Points:__ \`${country.stats.defend_points}\``)

        message.channel.send(dEmbed);
    
}

module.exports = roll;