"use strict";

const party_scheme = {
    id: null,           // Party id, if searching by name matches multiples options it's required to search by id
    name: null,         // Party name, general search term
    slots: null,        // Number of players that the party will have. The game doesn't start until it reaches that number
    status: null,       // WAITING (Until the slots are filled), STARTED, FINISHED (If someone wins or it's closed)
    password: null,     // Null for no password, anything else it's the password
    players: [],        // Array of players in the party
    map: {
        path: null,     // Path to world map image of the party
        countries: {}   // 
    }
}

const player_scheme = {
    id: null,
    name: null,
    empire: null,
    color: null,
    flag: null,
    money: null,
    capital: null,
    countries: []
}

const country_scheme = {
    id: null,
    name: null,
    color: null,
    flag: null,
    area: null,
    stats: {
        population: null,
        attack_points: null,
        defend_points: null
    }
}

module.exports = {
    party_scheme: party_scheme,
    player_scheme: player_scheme,
    country_scheme: country_scheme
}