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
        countries: {}   // Copy of the starting countries in resources
    }
}

const player_scheme = {
    id: null,           // Player Discord id
    name: null,         // Player Discord name
    empire: null,       // Name of Player's Empire
    color: null,        // Color in HEX of Player's Empire
    flag: null,         // Flag in PNG of Player's Empire
    money: null,        // Money of Player's Empire
    capital: null,      // Capital (Well actually starting country) of Player's Empire
    countries: []       // Country in posesion of the Player
}

const country_scheme = {
    id: null,           // Country ISO2 code
    name: null,         // Country name (in English)
    color: null,        // Country random color in HEX
    flag: null,         // Country flag (originally in SVG)
    area: null,         // Country total Area in KM²
    stats: {
        population: null,    // Total country population
        attack_points: null, // Attack Points based on 100 - Population/Area   
        defend_points: null  // Defend Points based on Population/Area
    }
}

module.exports = {
    party_scheme: party_scheme,
    player_scheme: player_scheme,
    country_scheme: country_scheme
}