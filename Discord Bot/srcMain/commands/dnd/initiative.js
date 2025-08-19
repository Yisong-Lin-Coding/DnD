module.exports = {
    name: 'initiative_calc',
    description: 'Calculates initiative for players based on their initiative mod and a random roll.',
    deleted: false,

    callback: (client, interaction) => {
    const fs = require('fs');

    function rng20(){
  var getRandomNumber = (max) => {
      return Math.floor(Math.random() * (max))+1}
    var rng20=getRandomNumber (20)
    return rng20}

let data = fs.readFileSync("./Data/Player/Initiative.json","utf-8")
let edata = JSON.parse(data)
    let numberofpeople = edata.length
    for (let i = 0; i < numberofpeople; i++) {
      let rng= rng20()
      if (rng== 20) { edata[i]["critical"] = 1}
        else if (rng == 1) {edata[i]["critical"] = -1}
       edata[i]["initiative"]  = rng +  edata[i]["initiative mod"]
      if (edata[i]["critical"] == 1) {
        edata[i]["initiative"] = edata[i]["initiative"] + 50
      }
        else if (edata[i]["critical"] == -1) {
        edata[i]["initiative"] = edata[i]["initiative"] - 50}}
 
    edata.sort((a,b) => b.initiative - a.initiative)

    for (let i = 0; i < numberofpeople; i++) {
        if (edata[i]["initiative"] < 0) {
            edata[i]["initiative"]= 0
        }
         else if (edata[i]["initiative"] > 20) {
            edata[i]["initiative"] = "Nat 20"
        }
       
    }

for (let i = 0; i < numberofpeople; i++) {
    edata[i]["critical"] = 0}


fs.writeFileSync("./Data/Player/Initiative.json", JSON.stringify(edata, null, 2), "utf-8",)

const embed = {
    color: 0x0099ff,
    title: 'Initiative Calculation Result',
    description: 'The initiative for each player has been calculated based on their initiative mod and a random roll.',
    fields: edata.map(player => ({
        name: player.name,
        value: `Initiative: ${player.initiative}`,
        inline: false
    })),
    timestamp: new Date(),
    footer: {
        text: 'Initiative Calculation',
    }
};

interaction.reply({
    embeds: [embed]
})

    }  
};
