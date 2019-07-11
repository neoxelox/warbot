"use strict"
const colors = require('colors');
const fs = require('fs');
const {promisify} = require('util');
const writeFile = promisify(fs.writeFile);
const imgur = require('imgur');
const svg2png = require("svg2png");

async function colorMapPlayer(frame, player) {
    try {
        let restoreItems = [];
        for(let i = 0; i < player.countries.length; i++) {
            let country = findByISO(frame, player.countries[i].toLowerCase());
            if(country != null) {
                country.style({fill: `#${player.color}`})
                restoreItems.push(country);
            }
        }

        let buffer = await svg2png(frame.svg(), { width: 1404.7773, height: 600.81262 });
        
        for(let i = 0; i < restoreItems.length; i++) restoreItems[i].style({fill: ``});

        await writeFile(player.mapPath, buffer);
        let bdy = await imgur.uploadFile(player.mapPath);

        return bdy.data.link; // This function does not update the DB, only gets the link to player's map!
        //return "https://www.google.com/img.png";
    
    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", player.name,"") + colors.bgBlack.white(` ${error} `));    
        return null;
    }
}

async function colorMapPlayers(frame, players, mapPath) {
    try {
        let restoreItems = [];
        for(let i = 0; i < players.length; i++) {
            for(let j = 0; j < players[i].countries.length; j++) {
                let country = findByISO(frame, players[i].countries[j].toLowerCase());
                if(country != null) {
                    country.style({fill: `#${players[i].color}`})
                    restoreItems.push(country);
                }
            }
        }

        let buffer = await svg2png(frame.svg(), { width: 1404.7773, height: 600.81262 });
        
        for(let i = 0; i < restoreItems.length; i++) restoreItems[i].style({fill: ``});

        await writeFile(mapPath, buffer);
        let bdy = await imgur.uploadFile(mapPath);

        return bdy.data.link; // This function does not update the DB, only gets the link party map!
        //return "https://www.google.com/img.png";

    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", players[0].name,"") + colors.bgBlack.white(` ${error} `));    
        return null;
    }
}

function findByISO(svgO,ISO) {
    let countries = svgO.children()[2].children()[0].children();
    for(let i = 0; i < countries.length; ++i) if(countries[i].attr("id") === ISO) return countries[i];
    return null;
}

module.exports = {
    colorMapPlayer: colorMapPlayer,
    colorMapPlayers: colorMapPlayers
};