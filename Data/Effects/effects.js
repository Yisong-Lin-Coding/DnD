const fs = require('fs')
const playerjs = require('../Player/player')

function datafile(path){
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}
const log = require('../logs/log')

const playerdata2 = datafile("./Data/Player/playersheets.json")
const itemsheet = datafile("./Data/Items/items.json");
const MODdata2 = datafile("./Data/Player/playerMODs.json")
const reactiondata2 = datafile("./Data/Actions/reactions.json")


function applyEffect(target, duration, options, effectName) {
    if (!playersheet[target]) {
        console.error(`Target ${target} not found in playersheet`);
        return;
    }
    if (!playersheet[target].skills) {
        playersheet[target].skills = {};
    }
    if (!playersheet[target].skills.effects) {
        playersheet[target].skills.effects = {};
    }

    if (!playersheet[target].skills.effects[effectName]) {
        playersheet[target].skills.effects[effectName] = {
            duration: duration,
            options: options
        };
    } else {
        playersheet[target].skills.effects[effectName].duration += duration;
    }
}
function effectBaseMod(playername, modifierName, amount = 1){
    if(!MODdata2[playername]){
        log(`ERROR ${playername} does not have a modifier file.`, `error`)
        return{result:`fail`}
    }

}

module.exports = {
    poison001: {
        name: "poison",
        description: "",
        onApply:function(target, duration = 5, options = {}){
            try{
                applyEffect(target, duration, options, this.name)
                

                log(`${this.name} has been applied to ${target}`,`combat`)
            }
            catch(error){
                if(!playersheet[target]){
                log(`ERROR in adding effect: ${this.name}, ${target} does not exist. ${error}`, 'error')
                }
                else{
                    log(`ERROR: ${error}`, 'error')
                }
            }
            
        },
        onTick: (target) => {
            console.log(`${target.name} is still marked.`);
        },
        onRemove: (target) => {
            console.log(`${target.name} is no longer marked.`);
        }
    },
    Blessed: {
        onApply: (target) => {
            target.blessed = true;
        },
        onTick: (target) => {
            console.log(`${target.name} feels holy energy.`);
        },
        onRemove: (target) => {
            target.blessed = false;
        }
    },
}
