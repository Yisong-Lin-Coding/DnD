const { options } = require("../dnd/rng");

module.exports = {
    name : 'give',
    description : 'Gives an item to a player',
    devonly: false,
    options: [
            {
                name: "user",
                description: "The player you want to give an item to",
                type:6,
                required: true
            },
            {
                name:"item",
                description: "What you want to give",
                type: 3,
                required: true
            },
            {
                name: "amount",
                description: "How much you want to give",
                type: 4
            }
    ],
    callback: (client, interaction) => {
        const fs = require('fs')
        let itemdata = fs.readFileSync("./Data/Items/items.json","utf-8")
        let itemdata2 = JSON.parse(itemdata)
        let playerdata = fs.readFileSync("./Data/Player/playersheets.json","utf-8")
        let playerdata2 = JSON.parse(playerdata)
        let userdata = fs.readFileSync("./Data/Player/userToPlayer.json","utf-8")
        let userdata2 = JSON.parse(userdata)
        user = interaction.options.getUser("user")
        item = interaction.options.getString("item")
        amount = interaction.options.getInteger("amount")
        player = userdata2[interaction.user.id]
        player2 = userdata2[user.id]
        trueinv = playerdata2[player].inv.items
        trueinv2 = playerdata2[player2].inv.items

        const mergedItems = Object.assign({}, ...Object.values(itemdata2));
        for (let itm of Object.keys(trueinv)) {
            if (!mergedItems[itm]) {
                delete trueinv[itm];
                delete playerdata2[player].inv.items[itm];
                fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8");               
            }
        }
        if (user.id === interaction.user.id) {
            interaction.reply({
                content: "You cannot target yourself with this command.", 
                ephemeral: true });
            return;
            }

        if (!trueinv[item] && (!item && item.toLowerCase() == "gp") ) {
            interaction.reply({
                content: "You don't have this item"
            })
            return
        }
        if (!amount) {
            amount=1
        }
        if (amount <= 0){
            interaction.reply({
                content: "You cannot give a negative amount",
                ephemeral:true
            })
            return
        }
        
        if (amount > trueinv[item]){
            interaction.reply({
                content: `You don't have enough ${item} to give.`,
                ephemeral: true
            });
            return;
        }

        if (item && item.toLowerCase() == "gp"){
            playerdata2[player].inv.gp -=amount
            if (!playerdata2[player2].inv.gp) {
            playerdata2[player2].inv.gp = 0;
        }
            playerdata2[player2].inv.gp += amount;
            try {
                fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8");
        } 
            catch (err) {
                console.error("Error writing to playersheets.json:", err);
                interaction.reply({
                    content: "There was an error saving player data. Please try again later.",
                    ephemeral: true
                });
                return;
        }
            interaction.reply({
                content: `${player} have given ${player2} ${amount} ${item}`
            })
            return
        }
        

        playerdata2[player].inv.items[item] -= amount
        if (playerdata2[player].inv.items[item] <= 0) {
            delete playerdata2[player].inv.items[item]
            
        }

        if (!playerdata2[player2].inv.items[item]) {
            playerdata2[player2].inv.items[item] = 0;
        }
        playerdata2[player2].inv.items[item] += amount;

        try {
            fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8");
        } 
        catch (err) {
            console.error("Error writing to playersheets.json:", err);
            interaction.reply({
                content: "There was an error saving player data. Please try again later.",
                ephemeral: true
            });
            return;
        }
            interaction.reply({
                content: `${player} have given ${player2} ${amount} ${item}`
            })
    }
}