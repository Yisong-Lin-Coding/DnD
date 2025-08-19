const invBuilder = require("../../utils/invBuilder.js")
const fs = require('fs')
const invBuilder0 = require("../../utils/invBuilder0.js")

module.exports = async (client, interaction) => {
        
            let userdata = fs.readFileSync("./Data/Player/userToPlayer.json","utf-8")
            let userdata2 = JSON.parse(userdata)
            let user = interaction.user
            player = userdata2[user.id]
        

    if (!interaction.isButton()) return;
    
    const [action, , pageStr] = interaction.customId.split('_');
        let page = parseInt(pageStr, 10);
       
            

    if (interaction.customId.startsWith("next_page")) {
 
    page += 1;
    var { totalPages } = invBuilder0(player);
    if (page >= totalPages) {
        page = totalPages - 1; 

        let {embed, row} = invBuilder(player, page);

        await interaction.update({ embeds: [embed], components: [row] });
        return; 
    } 
    let { embed, row} = invBuilder(player, page);
    await interaction.update({ embeds: [embed], components: [row] });
    return;
}
    else if (interaction.customId.startsWith("prev_page")) {
        page -= 1;
        if (page < 0){
            page = 0
            const { embed, row } = invBuilder(player, page);
            await interaction.update({ embeds: [embed], components: [row] });
            return 
        } 
        const { embed, row } = invBuilder(player, page);
        await interaction.update({ embeds: [embed], components: [row] });
        return
    }


    
};