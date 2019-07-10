"use strict"
const colors = require('colors');
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const imgur = require('imgur');

const svg2png = require("svg2png");

const window = require('svgdom');
const fab = require('svg.js')(window);
const doc = window.document;
const frame = fab(doc.documentElement);

async function colorMapPlayer(player) {
    try {
        const svgRaw = await readFile("./resources/img/map.svg", "utf8");
        frame.svg(svgRaw);
        
        for(let i = 0; i < player.countries.length; i++) {
            let country = findByISO(frame, player.countries[i].toLowerCase());
            if(country != null) country.style({fill: `#${player.color}`})
        }

        let buffer = await svg2png(frame.svg(), { width: 1404.7773, height: 600.81262 });
        
        await writeFile(player.mapPath, buffer);
        let bdy = await imgur.uploadFile(player.mapPath);

        return bdy.data.link; // This function does not update the DB, only gets the link to player's map!
        //return "https://www.google.com/img.png";
    
    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", player.name,"") + colors.bgBlack.white(` ${error} `));    
        return null;
    }
}

function findByISO(svgO,ISO) {
    let countries = svgO.children()[2].children()[0].children();
    for(let i = 0; i < countries.length; ++i) if(countries[i].attr("id") === ISO) return countries[i];
    return null;
}

module.exports = {
    colorMapPlayer: colorMapPlayer
};