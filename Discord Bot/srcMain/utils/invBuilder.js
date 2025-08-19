const fs = require('fs')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


module.exports = (player, page) =>{
    const itemdata = fs.readFileSync("./Data/Items/items.json","utf-8")
    let itemdata2 = JSON.parse(itemdata)
    const playerdata = fs.readFileSync("./Data/Player/playersheets.json","utf-8")
    let playerdata2 = JSON.parse(playerdata)
    trueinv = playerdata2[player].inv.items
    const mergedItems = Object.assign({}, ...Object.values(itemdata2));

    let totalWeight = 0;
    for (const [item, amount] of Object.entries(trueinv)) {
        const itemWeight = mergedItems[item]?.weight || 0;
        totalWeight += itemWeight * amount;
    }

    GP = playerdata2[player].inv.gp

    function chunkArray(array, chunkSize){
        chunks = []
        for (let i=0 ; i<array.length; i+= chunkSize){
            chunks.push(array.slice(i, i + chunkSize))
        }
        return chunks
    }

    const inventoryEntries = Object.entries(trueinv);
    const pageSize = 6; 
    const pages = chunkArray(inventoryEntries, pageSize);
    const embed = {
        color: 0x0099ff,
        title: `${player}'s Inventory (Page ${page + 1}/${pages.length})`,
        description: `**Total Weight:** ${totalWeight} \n **GP:** ${GP}`,
        fields: pages[page].map(([item, amount]) => ({
        name: `**${item.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}**`,
        value: `Amount: ${amount} \nWeight each: ${mergedItems[item]?.weight ?? 'N/A'}`,
        inline: true
        })),

        timestamp: new Date(),
        footer: { text: 'Inventory' }
    };
     
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`prev_page_${page}`)
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('equipment')
            .setLabel("Equipment Page")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`next_page_${page}`)
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
    );
    return { embed, row,}
}