module.exports = {
    name : 'dmgive',
    description : 'Gives an item to a player',
    devOnly : true,
    options:[
        {
            name: 'user',
            description: 'The user to give the item to',
            type: 6, // ApplicationCommandOptionType.User
            required: true
        }
        ,
        {
            name: 'item',
            description: 'The item to give',
            type: 3, // ApplicationCommandOptionType.String
            required: false
        },
        {
            name: 'amount',
            description: 'The amount of the item to give',
            type: 4, // ApplicationCommandOptionType.Integer
            required: false
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
        let user = interaction.options.getUser('user')
        let item = interaction.options.getString('item')
       
        if(item && item.toLowerCase() === "gp") {
            let amount = interaction.options.getInteger('amount')
    
            let userid = user.id.toString()
            let player = userdata2[userid]


            playerdata2[player].inv.gp += amount
            fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8")
            interaction.reply({
                content: `Gave ${amount} gold to ${player}.`,
            })
            return
        }
        if(item && item.toLowerCase() === "xp") {
            let amount = interaction.options.getInteger('amount')
    
            let userid = user.id.toString()
            let player = userdata2[userid]

            playerdata2[player].exp[0] += amount
            fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8")
            interaction.reply({
                content: `Gave ${amount} Exp to ${player}.`,
            })
            return
        }

            const mergedItems = Object.assign({}, ...Object.values(itemdata2))
            item = item.toLowerCase()
        if (!mergedItems[item]) {
            interaction.reply({
                content: `Item ${item} does not exist. Try again.`,
                ephemeral: true
            })
            return}
            
                let amount = interaction.options.getInteger('amount')
                if (!amount) {
                    amount = 1                   
                }
                let userid = user.id.toString()
                let player = userdata2[userid]        
                if (!playerdata2[player].inv.items[item]) {
                    playerdata2[player].inv.items[item] = 0
                
                } 
                playerdata2[player].inv.items[item] += amount
                fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8")
                interaction.reply({
                    content: `Gave ${amount} ${item} to ${player}.`,
                })
            }
            
    }

