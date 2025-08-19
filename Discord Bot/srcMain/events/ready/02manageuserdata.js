const fs = require('fs');

const effectUpdate = require("../../../srcMain/utils/effectUpdate.js")


module.exports = async (client) => {
    effectUpdate()

    let playerdata = fs.readFileSync("./Data/Player/playersheets.json","utf-8")
    let playerdata2 = JSON.parse(playerdata)
    let playerstat = fs.readFileSync("./Data/Player/playerstats.json","utf-8")
    let platerstat2 = JSON.parse(playerstat)
    let effects = fs.readFileSync("./Data/effects.json")
    let effects2 = JSON.parse(effects)
    
    results = []
    const effecttitle = (obj) => {
        
        Object.keys(obj).forEach(key => {
            results.push(key)
            if (obj[key] && typeof obj[key] === "object" && Object.keys(obj[key]).length > 0){
                effecttitle(obj[key])
            }
        })
        return results
    }
    effect = effecttitle(effects2)
    console.log(effect) 

    console.log(Object.keys(playerdata2).map(key =>{
        key
    }))
    
}