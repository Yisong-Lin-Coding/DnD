


module.exports = {
       name: 'stat',
         description: 'Shows your current stats',

        callback: (client, interaction) => {

            const fs = require('fs')
            let playerdata = fs.readFileSync("./Data/Player/playersheets.json","utf-8")
            let playerdata2 = JSON.parse(playerdata)
            let userdata = fs.readFileSync("./Data/Player/userToPlayer.json","utf-8")
            let userdata2 = JSON.parse(userdata)
            let user = interaction.user

            player = userdata2[user.id]
            playersheet = playerdata2[player]
            console.log(playersheet)
            statname = ["STR", "CON", "DEX", "INT", "WIS", "CHA", "LUCK"]

            const embed = {
        color: 0x0099ff,
        title: `${player}'s Stat Page`,
        description: `**Health**: ${playersheet["HP"][0]}/${playersheet["HP"][1]}\n**Stamina**: ${playersheet["STA"][0]}/${playersheet["STA"][1]}\n**Mana**: ${playersheet["MP"][0]}/${playersheet["MP"][1]}\n\n**Stats**:`,
        fields: statname.map((ano,i) => ({
                name: ano,
                value: String(playersheet["stats"][i]),
                inline: true
              })),
          
        timestamp: new Date(),
        footer: { text: 'Stats' }
        
    };

    interaction.reply({
      embeds: [embed],
  
    }); 
        
}}