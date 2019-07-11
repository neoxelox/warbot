"use strict"
const colors = require('colors');

async function finish(client, IDParty, parties) {
    try {
        parties.update({_id: IDParty}, {$set: {status: "FINISHED"}}, {returnUpdatedDocs: true}, async (err, nA, aDoc) => {
            if(!err) {
                let wPlayer = null; let notFound = true;
                for(let i = 0; i < aDoc.players.length && notFound; i++) if(!aDoc.players[i].fold) { wPlayer = aDoc.players[i]; notFound = false; }
                for(let i = 0; i < aDoc.players.length; i++) {
                    let dm = await client.users.find(find => find.id == aDoc.players[i].id);
                    dm.send(`**Hey \`${dm.username}\`** 👋, the party \`${aDoc.name}\` with id \`${aDoc.id}\` has just **finished**!\n${(wPlayer != null &&  aDoc.players[i].id === wPlayer.id ? `**🎊 Congratulations! 🎊 You won the party! 🏆**` : `**\`${wPlayer.name}\`** Has won the party!`)}`);
                }
            }                                    
        });                  
    } catch (error) {
        console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", Date.now().toLocaleString(), "") + colors.bgCyan.white(" XX ") + colors.bgGreen.white("GAME LOGIC") + colors.bgBlack.white(` ${error} `));    
    }
}

module.exports = finish;