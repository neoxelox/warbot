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

/*
"use strict"
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const imgur = require('imgur');

const svg2png = require("svg2png");

const window = require('svgdom')
const fab = require('svg.js')(window)
const doc = window.document
const frame = fab(doc.documentElement)

try {
	const svgRaw = await readFile("./map.svg", "utf8");
	frame.svg(svgRaw);

	let spain = findByISO(frame,"es");
	if(spain != null) {
		spain.style({fill: "red"});
	} else {
		// Country not found
	}

	let buffer = await svg2png(frame.svg(), { width: 1404.7773, height: 600.81262 });
	await writeFile("./test.png", buffer);
	let link = await imgur.uploadFile("./test.png").data.link;
	// Do something with link

} catch (error) {
	console.log(error)
}

function findByISO(svgO,ISO) {
    	let countries = svgO.children()[2].children()[0].children();
    	for(let i = 0; i < countries.length; ++i) if(countries[i].attr("id") === ISO) return countries[i];
    	return null;
}
*/