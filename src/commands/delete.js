"use strict";
const fs = require('fs');
const {promisify} = require('util');
const colors = require('colors');

const deleteFile = promisify(fs.unlink);
const deleteDir = promisify(fs.rmdir);
const existsFile = promisify(fs.exists);
const readDir = promisify(fs.readdir);

async function remove(message, args, parties) {
    if(args[1] != undefined) {
       try {
            parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
                if(docs.length == 1) {
                    if(docs[0].status === "WAITING" || message.author.id == "157613064810790912") {
                        if((docs[0].password === null) || (docs[0].password === args[2])) {
                            if(await existsFile(docs[0].map.path)) {
                                let files = await readDir(docs[0].map.path);
                                for(let i = 0; i < files.length; i++) await deleteFile(docs[0].map.path + "/" + files[i]);
                                deleteDir(docs[0].map.path);
                            }                            
                            let remId = docs[0].id;
                            let remName = docs[0].name;
                            parties.remove({_id: docs[0]._id}, (err, nRemoved) => {
                                if(!err) message.channel.send(`**Successfully deleted party** \`${remName}\` **with id** \`${remId}\`**.** 💥`);
                            });
                        } else {
                            message.channel.send("**Wrong password for the party!** 🤨");
                        }
                    } else if(docs[0].status === "STARTED") {
                        message.channel.send("**Only ADMINISTRATORS can delete a STARTED party, DM to Neoxelox#9588** 😅");
                    } else message.channel.send("**You cannot delete a FINISHED party** 😅");
                } 
                else if(docs.length > 1) {
                    let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
                    for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
                        msg += `\`> delete ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
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
        message.channel.send(`No **\`[Party name/id]\`** specified for ***> delete*** order! <@${message.author.id}>, type ** *> help* ** .`);
    }
}

module.exports = remove;