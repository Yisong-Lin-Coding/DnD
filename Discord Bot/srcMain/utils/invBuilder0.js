const fs = require('fs')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = (player) =>{
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
        return {totalPages: pages.length}
}