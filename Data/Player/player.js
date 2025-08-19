const fs = require('fs');
const effects = require('../Effects/effects')

function datafile(path){
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}
const log = require("../Data/logs/log")

const playerdata2 = datafile("./Data/Player/playersheets.json")
const itemsheet = datafile("./Data/Items/items.json");
const MODdata2 = datafile("./Data/Player/playerMODs.json")
const reactiondata2 = datafile("./Data/Actions/reactions.json")
const unqiueitemsheet = datafile("./Data/Items/unqiueItems.json")
const runesheet = datafile("./Data/Items/runes.json")

class Player {
    constructor(playersheet) {
        this.playersheet = playersheet;
    }
    static createAll(playersheet) {
        return Object.entries(playersheet).map(
            ([name, sheet]) => new Player({ name, ...sheet })
        );
    }
    save(){
        const allSheets = {};
        players.forEach(player => {
            allSheets[player.playersheet.name] = player.playersheet;
        });

        fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(allSheets, null, 2), "utf-8")
    }

    characterSetting(nameofthing = "name", change){
        try{
            this.playersheet[nameofthing] = change

        }
        catch(error){
            console.log(error)
            log(`ERROR in chacterSetting command ${error}`, `error`)
        }
    }
    initiatveRoll() {
        const rng = (num) => {
            return Math.floor(Math.random() * num) + 1;
        }
        let reroll  = (MODdata2[this.playersheet.name]?.advantage || 0)
                    + (MODdata2[this.playersheet.name]?.initiativeadvantageMOD || 0) 
                    + (MODdata2[this.playersheet.name]?.advantageACSTATMOD || 0);

        let rolls = []
        if (reroll > 0) {

        for (let i = 0; i < reroll + 1; i++) {
            rolls.push(rng(20));
        }
        rolls.sort((a, b) => b - a); 
    } else if (reroll < 0) {

        for (let i = 0; i < Math.abs(reroll) + 1; i++) {
            rolls.push(rng(20));
        }
        rolls.sort((a, b) => a - b); 
    } else {

        rolls.push(rng(20));
    }
        let initiative  = rolls[0] 
                        + (MODdata2[this.playersheet.name]?.initiativeMOD || 0) 
                        + (Math.round(((playerdata2[this.playersheet.name]?.stats[2])-10)/2) || 0)
        
        
        log(`${this.name} rolled a ${initiative.toString} on their initiative. (Rolls: ${rolls.join(', ')})`, `combat`)
        return {
            result: 'success',
            message: `Initiative roll for ${this.playersheet.name}: ${initiative} (Rolls: ${rolls.join(', ')})`,
            initiative: initiative.toString()
        };
    }
}

module.exports = Player