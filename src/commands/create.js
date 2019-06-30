"use strict";
const utility = require("../utilities.js");
const colors = require('colors');

function create(message, args) {
    let newParty = { // CHANGE ALL OF THIS (PLACEHOLDER)
        "test": args[1]
    };
    utility.saveDatasaves(newParty, (result) => {
        if(result instanceof Error) {
            console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${result} `));
        } else { // CHANGE MESSAGE
            console.log(colors.bgRed.white.bold(" INFO ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgBlack.white(` Created new party with id ${newParty.id}`));
        }
    });
}

module.exports = create;