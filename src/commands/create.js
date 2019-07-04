"use strict";
const fs = require('fs');
const {promisify} = require('util');
const {party_scheme} = require("../schemes.js");
const colors = require('colors');

const readFile = promisify(fs.readFile);
const existsDir = promisify(fs.exists);
const createDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

async function create(message, args, parties) {
    if(args[1] != undefined) {
        if(args[2] != undefined) {
            try {
                parties.find({}).sort({ id: -1 }).limit(1).exec( async (err, docs) => {
                    let newParty = Object.assign({}, party_scheme);
                    newParty.id = (docs.length === 1 ? docs[0].id + 1 : 0);

                    newParty.name = args[1];
                    newParty.slots = args[2];
                    newParty.password = (args[3] != undefined ? args[3] : null);
                    newParty.status = "WAITING";
                    
                    let newSaveDir = `../saves/${newParty.id}`;
                    if(! await existsDir(newSaveDir)) await createDir(newSaveDir);
                    await copyFile("../src/resources/img/map.svg", newSaveDir + "/map.svg");
                    newParty.map.path = newSaveDir;
                    newParty.map.countries = JSON.parse(await readFile("../src/resources/countries.json"));
                    
                    parties.insert(newParty, (err, newDoc) => {
                        if(!err) message.channel.send(`**Successfully created a new WARBOT Party \`${newParty.name}\` with id \`${newParty.id}\` and maximum \`${newParty.slots}\` players. 😀 \n Type: \n \`> join ${newParty.id}\` (or with the name) to join the party \n \`> status ${newParty.id}\` (or with the name) to see the current status of the party**`);
                    });
                });
            } catch (error) {
                console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${error} `));
                message.channel.send("Sorry, something went wrong 😓");
            }
        }
        else {
            message.channel.send(`No \`[Slots]\` specified for ***> create*** order! <@${message.author.id}>, type ** *> help* ** .`);
        }
    }
    else {
        message.channel.send(`No \`[Party name]\` specified for ***> create*** order! <@${message.author.id}>, type ** *> help* ** .`);
    }
}

module.exports = create;