"use strict"
const colors = require('colors');
const {colorMapPlayer, colorMapPlayers} = require("../util.js");
const gameFinish = require("./finish.js");

async function conquered(frame, parties, client, newOwnerIndex, country, hasOwner, oldOwnerIndex, party) {
    try {
        let result = new Promise(async (resolve) => {
            let finished = false;

            party.players[newOwnerIndex].countries.push(country);
            party.players[newOwnerIndex].mapLink = await colorMapPlayer(frame, party.players[newOwnerIndex]);
            if(hasOwner) {
                party.players[oldOwnerIndex].countries.splice(party.players[oldOwnerIndex].countries.findIndex((ctr) => ctr === country), 1);

                if(party.players[oldOwnerIndex].capital === country) party.players[oldOwnerIndex].capital = null;
                if(party.players[oldOwnerIndex].countries.length === 0) party.players[oldOwnerIndex].fold = true;
                party.players[oldOwnerIndex].mapLink = await colorMapPlayer(frame, party.players[oldOwnerIndex]);

                let notFoldedCounter = 0;
                for(let i = 0; i < party.players.length; i++) if(!party.players[i].fold) notFoldedCounter++;
                finished = (notFoldedCounter === 1);
            }
            party.map.link = await colorMapPlayers(frame, party.players, party.map.path + "/map.png");

            parties.update({_id: party._id}, party, {}, async (err) => {
                if(!err) { 
                    if(finished) await gameFinish(client, party._id, parties); 
                    resolve(true);
                }
                else resolve(false);
            });
        });
        return result;
    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" XX ") + colors.bgGreen.white("GAME LOGIC") + colors.bgBlack.white(` ${error} `));
        return false;
    }
}

module.exports = conquered;