const fs = require('fs');
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

    setName(name){

    }
    setReaction(reaction, type = "main"){

        if(!this.playersheet.skills.reaction){
            this.playersheet.skills.reaction = {"main": [], "sub": []};
        }

        if (!reactiondata2[reaction]) {
            return { result: "fail", message: `${reaction} does not exist` }
        }

        if (this.playersheet.skills.reaction[type].length == 0) {
            this.playersheet.skills.reaction[type].push(reaction);
            this.save();
            return { result: "success", message: `Set ${reaction} as ${type} reaction` }

        }
        if (this.playersheet.skills.reaction[type].includes(reaction)) {
            this.save();
            return { result: "fail", message: `${reaction} is already set as ${type} reaction` }
        }
        if (this.playersheet.skills.reaction[type].length >= 1) {
           this.playersheet.skills.reaction[type].splice(0, this.playersheet.skills.reaction[type].length);
           this.playersheet.skills.reaction[type].push(reaction);
              this.save(); 
              return { result: "success", message: `Set ${reaction} as ${type} reaction, replacing previous reaction`}
        }
    }

    react(reaction = "dodge"){
      
    }
    equip(item){

        let slotMax = {
            "head": 1,
            "body": 1,
            "legs": 1,
            "feets": 1,
            "hands": 2,
            "fingers": 10,
            "weapons": 10
        }
        if (!itemsheet[item]) {
            return { result: "fail", message: `${item} does not exist` }
        }
        if (!this.playersheet.inv.items[item]) {
            return { result: "fail", message: `You do not have ${item} in your inventory` }
        }
        if (!itemsheet[item].class.includes("equipment")) {
            return { result: "fail", message: `${item} is not an equiable item`}}
        if (!this.playersheet.equipment) {
            this.playersheet.equipment = {
                "head": [],
                "body": [],
                "legs": [],
                "feets": [],
                "hands": [],
                "fingers": [],
                "weapons": []
                };
            }
            let slotclass = [];
            let slots = Object.keys(slotMax);

            for (let slot of slots) {
            for (let itemClass of itemsheet[item].class) {
                if (itemClass === slot) {
                slotclass.push(slot);
                }
            }
            }
            if (slotclass.length === 0) {
                return { result: "fail", message: `${item} does not fit any equipment slot` }
            }
            if (slotclass.length > 1) {
                return{ result: "fail", message: `${item} fits in multiple slots: ${slotclass.join()}`}
        }
            if (this.playersheet.equipment[slotclass[0]].length >= slotMax[slotclass[0]]) {
                return { result: "fail", message: `You cannot equip more than ${slotMax[slotclass[0]]} ${slotclass[0]} items` }

            }
            this.playersheet.equipment[slotclass[0]].push(item);
            this.playersheet.inv.items[item] -= 1;

            if (this.playersheet.inv.items[item] == 0) {
                delete this.playersheet.inv.items[item];
            }
            
        log(`${this.playersheet.name} has equipped ${item} in the ${slotclass[0]} slot `)
        this.save()
        return { result: "success", message: `Equipped ${item}` };

    }
    unequip(item) {
        if (!itemsheet[item]) {
            return { result: "fail", message: `${item} does not exist` }
        }
        function slotsearch(equipment, itemName) {
            const matchingSlots = [];

            for (const [slot, items] of Object.entries(equipment)) {
                if (Array.isArray(items) && items.includes(itemName)) {
                matchingSlots.push(slot);
                }
            }

            return matchingSlots;
            }
        
        let slot = slotsearch(this.playersheet.equipment, item);
        if (slot.length === 0) {
            return { result: "fail", message: `You do not have ${item} equipped` }
        }
        this.playersheet.equipment[slot[0]].splice(this.playersheet.equipment[slot[0]].indexOf(item), 1)
        
        ;

        if (!this.playersheet.inv.items[item]) {
            this.playersheet.inv.items[item] = 0;
        }
        this.playersheet.inv.items[item] += 1;
        
        log(`${this.playersheet.name} has unequipped ${item}`)
        this.save();
        return { result: "success", message: `Unequipped ${item}` };
    }
    addItem(item, amount = 1) {
        if(!itemsheet[item]) {
            return { result: 'fail', message: `${item} does not exist` };
        }
        if (!this.playersheet.inv) {
            this.playersheet.inv = {gp: 0, items: {}};
        }
        if (!this.playersheet.inv.items[item]) {
            this.playersheet.inv.items[item] = 0;
        }
        this.playersheet.inv.items[item] += amount;
        if (this.playersheet.inv.items[item] <= 0) {
            delete this.playersheet.inv.items[item];
        }
        log(`Added ${amount} ${item}(s) to ${this.name}'s inventory`)
        this.save();
        return { result: 'success', message: `Added ${amount} ${item}(s) to ${this.name}'s inventory` };
    }
    addGP(amount = 100){
        if (!this.playersheet.inv) {
            this.playersheet.inv = {};
        }
        if (!this.playersheet.inv.gp) {
            this.playersheet.inv.gp = 0;
        }
        this.playersheet.inv.gp += amount;
        log(`Added ${amount} gold to ${this.name}'s inventory`)
        this.save();
        return { result: 'success', message: `Added ${amount} gold to ${this.name}'s inventory` };
    }
    giveItem(user, item, amount = 1) {
        if (!this.playersheet.inv || !this.playersheet.inv.items[item]) {
            return { result: 'fail', message: `You do not have ${item} in your inventory` };
        }
        if (!user.playersheet.inv) {
            user.playersheet.inv = {gp: 0, items: {}};
        }
        if (!user.playersheet.inv.items[item]) {
            user.playersheet.inv.items[item] = 0;
        }
        user.playersheet.inv.items[item] += amount;
        this.playersheet.inv.items[item] -= amount;
        if (this.playersheet.inv.items[item] <= 0) {
            delete this.playersheet.inv.items[item];
        }
        log(`${this.name} gave ${amount} ${item}(s) to ${user.name}`)
        this.save();
        return { result: 'success', message: `Gave ${amount} ${item}(s) to ${user.name}` };
    }
    giveGP(user, amount = 100) {
        if (!this.playersheet.inv || !this.playersheet.inv.gp || this.playersheet.inv.gp < amount) {
            return { result: 'fail', message: `You do not have enough gold to give` };
        }
        if (!user.playersheet.inv) {
            user.playersheet.inv = {};
        }
        if (!user.playersheet.inv.gp) {
            user.playersheet.inv.gp = 0;
        }
        user.playersheet.inv.gp += amount;
        this.playersheet.inv.gp -= amount;

        log(`${this.name} gave ${amount} GP to ${user.name}`)
        this.save();
        return { result: 'success', message: `Gave ${amount} gold to ${user.name}` };
    }
    gainXP(amount = 100) {
        if (!this.playersheet.exp) {
            this.playersheet.exp = [0,100];
        }
        this.playersheet.exp[0] += amount;
        log(`${this.name} gained ${amount} XP`)
        this.save();
        this.levelCheck()
        return { result: 'success', message: `Gained ${amount} experience points` };
    }
    levelCheck(){
        levelRequirement = {
            1: 300,
            2: 600,
            3: 1800,
            4: 3800,
            5: 7500,
            6: 9000,
            7: 11000,
            8: 14000,
            9: 15000,
            10: 16000,
            11: 19000,
            12: 20000,
            13: 20000,
            14: 25000,
            15: 30000,
            16: 30000,
            17: 40000,
            18: 40000,
            19: 50000,

        }

        if (!this.playersheet.exp) {
            this.playersheet.exp = [0,levelRequirement[this.playersheet.level || 1]];
        }
        if (this.playersheet.level >= 20) {
            return {result:"fail", message: "Max level"}
        }
        if (this.playersheet.exp[0] >= this.playersheet.exp[1]) {
            this.playersheet.level = (this.playersheet.level || 1) + 1;
            this.playersheet.exp[0] -= this.playersheet.exp[1];
            this.playersheet.exp[1] = levelRequirement[this.playersheet.level] || 999999;
            log(`${this.name} has leveled up to ${this.playersheet.level}`)
            this.save() ;
        }

        return { result: 'fail', message: `No level up, current level is ${this.playersheet.level}`};
    }
    getInventory() {
        return this.playersheet.inv || {};
    }
    getEquipment() {
        return this.playersheet.equipment || {};
    }
    heal(amount){
        this.playersheet.HP[0] = (this.playersheet.HP[0] || 0) + amount;
        if (this.playersheet.HP[0] > (this.playersheet.HP[1])) {
            this.playersheet.HP[0] = this.playersheet.HP[1];
        }
        log(`${this.playersheet.name} has been healed for ${amount} bringing them to ${this.playersheet.HP[0]} of ${this.playersheet.HP[1]}`,"combat"  )
        this.save()
        return { result: 'success', message: `${this.playersheet.name} healed for ${amount} HP`};
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
                        + (Math.round(((playerdata2[this.playersheet.name]?.stats[2])-10)/2) || 0) ;
        return {
            result: 'success',
            message: `Initiative roll for ${this.playersheet.name}: ${initiative} (Rolls: ${rolls.join(', ')})`,
            initiative: initiative.toString()
        };
    }
    damage(amount, type){

        if (type == "pierce" || type == "slashing" || type == "bludging") {
        var typeMain = "physical";
    }
    else {
        var typeMain = "magical";
    }

        let percentdamage  = amount - (amount * (MODdata2[this.playersheet.name]?.[`ARMOD%`]/100 || 0))
        percentdamage = percentdamage - (percentdamage * (MODdata2[this.playersheet.name]?.[`${type}ARMOD%`]/100 || 0))
        percentdamage = percentdamage - (percentdamage * (MODdata2[this.playersheet.name]?.[`${typeMain}ARMOD%`]/100 || 0))
                        
        let totaldamage = Math.round(percentdamage) 
                        - (MODdata2[this.playersheet.name]?.[`${type}ARMOD`] || 0) 
                        - (MODdata2[this.playersheet.name]?.["ARMOD"] || 0)
                        - (MODdata2[this.playersheet.name]?.[`${typeMain}ARMOD`] || 0);
        if (totaldamage < 0) {
            totaldamage = 0;}

        this.playersheet.HP[0] = (this.playersheet.HP[0] || 0) - totaldamage;
        if (this.playersheet.HP[0] <= 0) {
            this.playersheet.HP[0] = 0;
            log(`${this.playersheet.name} took ${totaldamage} ${type} damage`, "combat")
            log(`${this.playersheet.name} has been defeated`)
            this.save()
            return { result: 'fail', message: `${this.playersheet.name} has been defeated!` };
        }
        log(`${this.playersheet.name} took ${totaldamage} ${type} damage bring them to ${this.playersheet.HP[0]} of ${this.playersheet.HP[1]}`, "combat")
        this.save();
        return { result: 'success', message: `${this.playersheet.name} took ${totaldamage} ${type} damage, remaining HP: ${this.playersheet.HP[0]}` };
    }
    attack(item, target) {
        if (!itemsheet[item]) {
            if(!unqiueitemsheet[item]) {
            return { result: 'fail', message: `${item} does not exist` }
            itemtype = "unqiue";
        }
        else{
            itemtype = "common";
        }
        }
        if (!this.playersheet.equipment || !this.playersheet.equipment.weapons || !this.playersheet.equipment.weapons.includes(item)) {
            return { result: 'fail', message: `${this.playersheet.name} does not have ${item} equipped` };
        }
        if (!target || !target.playersheet || !target.playersheet.HP) {
            return { result: 'fail', message: `Invalid target` };
        }
        let damage = itemsheet[item].damage;
        damageroll = damage.match(/^(\d+)?d(\d+)$/i);
        let type = itemsheet[item].damage[1];
        return target.damage(damage, type);
    }
}



class Effect {
    constructor(effectsheet) {
        this.effectsheet = effectsheet
    }

     static createAll(effectsheet) {
        return Object.entries(effectsheet).map(
            ([name, sheet]) => new Effect({ name, ...sheet })
        );
    }

    apply(player, time) {
        if (!player.playersheet.effects) {
            player.playersheet.effects = {};
        }
        if(!this.effectsheet.name) {
            return { result: fail, message: `${this} does not exist` };
        }
        player.playersheet.effects[this.effectsheet.name] = time || 1
        return { result: success, message: `Applied effect: ${this.effectsheet.name}` };
    }
    tick(player) {
        if (!player.playersheet.effects || !player.playersheet.effects[this.effectsheet.name]) {
            return { result: fail, message: `Effect ${this.effectsheet.name} is not applied to player` };
        }
        this.trigger(player)
        player.playersheet.effects[this.effectsheet.name] -= 1;
        if (player.playersheet.effects[this.effectsheet.name] <= 0) {
            delete player.playersheet.effects[this.effectsheet.name];
            return { result: success, message: `Effect ${this.effectsheet.name} has worn off` };
        }
        return { result: success, message: `Effect ${this.effectsheet.name} ticked down, remaining time: ${player.playersheet.effects[this.effectsheet.name]}` };
    }
    trigger(player){

    }
    onApply(player) {
       
    }

}

class item{
    constructor(itemsheet) {
        this.itemsheet = itemsheet;
    }
    static createAll(itemsheet) {
        return Object.entries(itemsheet).map(
            ([name, sheet]) => new item({ name, ...sheet })
        );
    }
    getDescription() {
        return this.itemsheet.description || "No description available";
    }
    save(){
        const allSheets = {};
        items.forEach(item => {
            allSheets[item.itemsheet.name] = item.itemsheet;
        });

        fs.writeFileSync("./Data/Items/items.json", JSON.stringify(allSheets, null, 2), "utf-8")

    }
    enchant(rune) {
        if (!runesheet[rune]) {
            return { result: 'fail', message: `${rune} does not exist` };
        }
        if (!this.itemsheet.runes) {
            this.itemsheet.runes = {};
        }
        if (this.itemsheet.runes[rune]) {
            return { result: 'fail', message: `${rune} is already applied to ${this.itemsheet.name}` };
        }
        this.itemsheet.runes[rune] = runesheet[rune];

        return { result: 'success', message: `Enchanted ${this.itemsheet.name} with ${rune}` };

    }


}



players = Player.createAll(playerdata2)
wantedPlayer = "Jesus"

BITCH = players.find(p => p.playersheet.name === `${wantedPlayer}`);

console.log(BITCH.heal(1000))

module.exports = Player;