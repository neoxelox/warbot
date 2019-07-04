"use strict";
const fs = require('fs');
const {promisify} = require('util');
const {RichEmbed} = require('discord.js');

const readFile = promisify(fs.readFile);
//const writeFile = promisify(fs.writeFile);

async function see(message, args) {
    let countries = JSON.parse(await readFile("../src/resources/countries.json"));
    let country;
    if(args[1] === undefined) {country = randomProperty(countries);}
    else {
        country = countries[args[1].toUpperCase()];
        if(country === undefined) {
            let inverse = JSON.parse(await readFile("../src/resources/inverse.json"));
            country = countries[inverse[args[1][0].toUpperCase() + args[1].slice(1).replace(/-|_/g, " ")]];
        }
    }
    if(country != undefined) {
        let cEmbed = new RichEmbed()
            .setColor(country.color)
            .setThumbnail(`https://www.countryflags.io/${country.id}/flat/64.png`) // I realized Discord doesn't have preview for .svg images... so this is a workaround
            .setAuthor(country.name)
            .setTitle(`**\`${country.id}\`**`)
            .setDescription(`__Area:__ \`${country.area} km²\` \n __Population:__ \`${country.stats.population} humans\` \n __Attack Points:__ \`${country.stats.attack_points}\` \n __Defend Points:__ \`${country.stats.defend_points}\``)

        message.channel.send(cEmbed);
    }
}

var randomProperty = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

module.exports = see;