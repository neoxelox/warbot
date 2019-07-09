"use strict"
const colors = require('colors');

async function invite(client,message,args,parties) {
    if(args[1] != undefined) {
        try {
            parties.find({$or: [{ id: parseInt(args[1]) }, { name: args[1].replace(/-|_/g, " ") }]}, async (err, docs) => {
                if(docs.length == 1) {
                    if(args[2] != undefined){
                        let user = await client.users.find(find => find.tag == args[2]);
                        if(user != undefined) {
                            user.send(`**Hey \`${user.username}\`** 👋, \`${message.author.username}\` has invited you to **join** the ${(docs[0].password != null ? "private" : "public")} party \`${docs[0].name}\`!\n**Type:**\n\`> join ${docs[0].id} ${(docs[0].password != null ? docs[0].password : "")}\` to join now!\n\`> status ${docs[0].id}\` to see the current status of the party.`);
                            // MAYBE SEND A RICHEMBED LIKE STATUS PARTY
                            
                            message.channel.send(`Successfully sent an invitation to **\`${user.username}\`** to join party **\`${docs[0].name}\`**! 📤`);
                        } else message.channel.send("No user found with that **\`User TAG\`** 🤔. Does the user have **access** to a Discord Server with **WARBOT**?");
                    } else message.channel.send(`No **\`[User TAG]\`** specified for ***> invite*** order! <@${message.author.id}>, type ** *> help* ** .`);
                } 
                else if(docs.length > 1) {
                    let msg = "**Multiple parties found!** 🧐 Please specify with the **\`id\`**: \n";
                    for (let i in docs) { // MAYBE PUT ALSO THE PLAYERS TO HELP SEARCHING
                        msg += `\`> invite ${docs[i].id}\` **Created by** \`${docs[i].creator.name}\` **Created at** \`${docs[i].createdAt.toLocaleString()}\` **Status** \`${docs[i].status}\` \n`;
                    }
                    message.channel.send(msg);
                } else message.channel.send("No party found with that **\`name\`** or **\`id\`** 🤔");
            });   
       } catch (error) {
            console.log(colors.bgRed.white.bold(" ERROR ") + colors.bgMagenta.white("", message.createdAt.toLocaleString(), "") + colors.bgCyan.white(" TO ") + colors.bgGreen.white("", message.author.username,"") + colors.bgBlack.white(` ${error} `));
            message.channel.send("Sorry, something went wrong 😓");
       }
    } else {
        message.channel.send(`No **\`[Party name/id]\`** specified for ***> invite*** order! <@${message.author.id}>, type ** *> help* ** .`);
    }
}

module.exports = invite;