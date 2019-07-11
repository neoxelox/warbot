"use strict"
const colors = require('colors');
const {colorMapPlayer, colorMapPlayers} = require("../util.js");

async function start(frame, client, IDParty, parties) {
    try {
        parties.find({_id: IDParty}, async (err, docs) => {
            if(!err) {
                docs[0].players[docs[0].players.length * Math.random() << 0].turn = true;
                let tmpCountries = Object.assign({}, docs[0].map.countries);
                for(let i = 0; i < docs[0].players.length; i++) {
                    let country = randomProperty(tmpCountries);
                    docs[0].players[i].capital = country.id;
                    docs[0].players[i].countries.push(country.id);
                    delete tmpCountries[country.id];
                    docs[0].players[i].mapLink = await colorMapPlayer(frame, docs[0].players[i]);
                }
                docs[0].status = "STARTED";
                docs[0].map.link = await colorMapPlayers(frame, docs[0].players, docs[0].map.path + "/map.png");

                parties.update({_id: docs[0]._id}, docs[0], {}, async (err) => {
                    if(!err) {
                        for(let i = 0; i < docs[0].players.length; i++) {
                            let dm = await client.users.find(find => find.id == docs[0].players[i].id);
                            dm.send(`**Hey \`${dm.username}\`** 👋, the party \`${docs[0].name}\` with id \`${docs[0].id}\` has just **started**!\nYou will be notified whenever it's your turn.`);
                            if(docs[0].players[i].turn) dm.send(`**Hey \`${dm.username}\`** 👋, it's **your turn** in the party \`${docs[0].name}\` with id \`${docs[0].id}\`.`);
                        }
                    }                                    
                });
            }                               
        });
    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" XX ") + colors.bgGreen.white("GAME LOGIC") + colors.bgBlack.white(` ${error} `));    
    }
}

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

module.exports = start;