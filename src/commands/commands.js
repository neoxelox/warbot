"use strict";

module.exports = {
    ping: require("./ping.js"), // can also be done as a hole object named ping...
    ping_name: "ping",
    ping_description: "Shows the latency in milliseconds between responses of the WARBOT.",

    fortune: require("./fortune.js"),
    fortune_name: "fortune",
    fortune_description: "Well... actually it seems more like a quoting system.",

    help: require("./help.js"),
    help_name: "help",
    help_description: "Well, you are actually here.",

    see: require("./see.js"),
    see_name: "see",
    see_arg_1: "Country ISO code/name or nothing, to be random",
    see_description: "Shows the starting stats for the specified country.",

    create: require("./create.js"),
    create_name: "create",
    create_arg_1: "Party name",
    create_arg_2: "Slots",
    create_arg_3: "Password if any",
    create_description: "Creates a new party of WARBOT.",

    delete: require("./delete.js"),
    delete_name: "delete",
    delete_arg_1: "Party name/id",
    delete_arg_2: "Password if any",
    delete_description: "Deletes an existing party of WARBOT."
};