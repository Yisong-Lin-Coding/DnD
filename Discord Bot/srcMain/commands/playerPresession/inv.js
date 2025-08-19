const invBuilder = require("../../utils/invBuilder.js")

module.exports = {
    name: 'inv',
    description: 'Displays your inventory',

        callback: (client, interaction) => {
            const fs = require('fs')
            let itemdata = fs.readFileSync("./Data/Items/items.json","utf-8")
            let itemdata2 = JSON.parse(itemdata)
            let playerdata = fs.readFileSync("./Data/Player/playersheets.json","utf-8")
            let playerdata2 = JSON.parse(playerdata)
            let userdata = fs.readFileSync("./Data/Player/userToPlayer.json","utf-8")
            let userdata2 = JSON.parse(userdata)
            let user = interaction.user
            player = userdata2[user.id]
            trueinv = playerdata2[player].inv.items

            const mergedItems = Object.assign({}, ...Object.values(itemdata2));
                for (let itm of Object.keys(trueinv)) {
                    if (!mergedItems[itm]) {
                        delete trueinv[itm];
                        delete playerdata2[player].inv.items[itm];
                        fs.writeFileSync(".//Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8");               
                    }
                }
                
                

            if (Object.keys(trueinv).length === 0) {
                interaction.reply({ content: "Your inventory is empty.", ephemeral: true });
                return;
            }
            else {
                const page = 0; 
                const { embed, row } = invBuilder(player, page);
                interaction.reply({ embeds: [embed], components: [row], ephemeral:true });

                }
                
            }
        }

