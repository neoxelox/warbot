"use strict"

const colors = require('colors');

async function getTurn(IDParty, parties) {
    try {
        let result = new Promise((resolve) => {
            parties.find({_id: IDParty}, async (err, docs) => {
                if(!err) for(let i = 0; i < docs[0].players.length; i++) if(docs[0].players[i].turn) resolve(docs[0].players[i]);
                resolve(null);
            });
        });
        return result;
    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" XX ") + colors.bgGreen.white("GAME LOGIC") + colors.bgBlack.white(` ${error} `));
        return null;
    }   
}

async function passTurn(IDParty, parties, client) {
    try {
        let result = new Promise((resolve) => {
            parties.find({_id: IDParty}, async (err, docs) => {
                if(!err) {
                    if(docs[0].status === "STARTED") {
                        for(let i = 0; i < docs[0].players.length; i++) if(docs[0].players[i].turn) {
                            let conds = {$set:{}}; conds.$set[`players.${i}.turn`] = false; 
                            
                            let nextI = (i != docs[0].players.length - 1? i + 1 : 0);
                            let notFound = true;
                            for(let j = nextI; j < docs[0].players.length && notFound; j++) {if(!docs[0].players[j].fold) {nextI = j; notFound = false;} if(j === docs[0].players.length - 1){j = 0;}}

                            conds.$set[`players.${nextI}.turn`] = true;
                            parties.update({_id: IDParty}, conds, {}, async (err) => {
                                if(!err) {
                                    let user = await client.users.find(find => find.id == docs[0].players[nextI].id);
                                    if(user != undefined) user.send(`**Hey \`${docs[0].players[nextI].name}\`** 👋, it's **your turn** in the party \`${docs[0].name}\` with id \`${docs[0].id}\`.`);
                                    resolve(true);
                                }
                                else resolve(false);
                            });
                        }
                    } else resolve(true);
                    // THIS FUNCTIONS NEVER EXPECTS A PARTY WITHOUT A PLAYER WITH TURN
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

module.exports = {
    getTurn: getTurn,
    passTurn: passTurn
};