"use strict";

module.exports = {
    ping: require("./ping.js"), // can also be done as a hole object named ping...
    ping_name: "ping",
    ping_description: "Shows the latency in milliseconds between responses of the WARBOT.", // Too long!

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
    delete_description: "Deletes an existing party of WARBOT.",

    status: require("./status.js"),
    status_name: "status",
    status_arg_1: "Party name/id",
    status_arg_2: "c/p",
    status_arg_3: "Country ISO code/name / Player TAG",
    status_description: "Shows the current status of a WARBOT party. 2 Last arguments are optional.",

    join: require("./join.js"),
    join_name: "join",
    join_arg_1: "Party name/id",
    join_arg_2: "Password if any",
    join_description: "Allows you to join an existing party of WARBOT.",

    leave: require("./leave.js"),
    leave_name: "leave",
    leave_arg_1: "Party name/id",
    leave_description: "Allows you to leave an existing party of WARBOT.",

    invite: require("./invite.js"),
    invite_name: "invite",
    invite_arg_1: "Party name/id",
    invite_arg_2: "User TAG",
    invite_description: "WARBOT will DM the user with an invitation to your party. IMPORTANT! By Discord's rules the targeted user has to be in a Server which has WARBOT. NOTE! The party password is also send.",

    // TO-DO
    roll: require("./roll.js"),
    roll_name: "roll",
    // ARGS...
    roll_description: "Rolls a 100 side dice. You will lose your turn with that."
};