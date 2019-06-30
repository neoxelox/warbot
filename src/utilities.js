"use strict";
const fs = require('fs');

const datasave_scheme = { // Property name = server id
    "id": null,
    "server": null,
    "parties": {}
}

const party_scheme = { // Property name = party id
    "id": null,
    "name": null,
    "slots": null,
    "players": [],
    "map": {
        "path": null,
        "countries": {}
    } 
}

const player_scheme = { // Goes inside an array of objects
    "id": null,
    "name": null,
    "empire": null,
    "color": null,
    "money": null,
    "capital": null,
    "countries": []
}

const country_scheme = { // Property name = country id
    "id": null,
    "name": null,
    "color": null,
    "flag": null,
    "stats": {
        "population": null,
        "attack_points": null,
        "defend_points": null
    }
}

function loadDatasaves(callback) {
    fs.readFile('./res/datasaves.json', (err, data) => {  
        if (err) callback(err);
        else callback(JSON.parse(data));
    });
}

function saveDatasaves(newSave, callback) {
    loadDatasaves((datasaves) => {
        if(datasaves instanceof Error) callback(datasaves);
        else {
            datasaves["2"] = newSave; // CHANGE ALL OF THAT AND THINK HOW TO STORE ALL EFFICIENTLY
            let data = JSON.stringify(datasaves, null, 2);
            fs.writeFile('./res/datasaves.json', data, (err) => {  
                if (err) callback(err);
                else callback();
            });
        }
    });
}

module.exports = {
    loadDatasaves: loadDatasaves,
    saveDatasaves: saveDatasaves,

    datasave_scheme: datasave_scheme,
    party_scheme: party_scheme,
    player_scheme: player_scheme,
    country_scheme: country_scheme
}