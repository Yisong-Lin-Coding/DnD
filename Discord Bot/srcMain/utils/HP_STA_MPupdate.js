
module.exports = (player) => {
    const fs = require('fs');
    let playerdata = fs.readFileSync("./Data/Player/playersheets.json", "utf-8");
    let playerdata2 = JSON.parse(playerdata);

    let classdata = fs.readFileSync("./Data/Player/classmods.json", "utf-8");
    let classdata2 = JSON.parse(classdata);

    let effectdata = fs.readFileSync("./Data/Player/playerMODS.json", "utf-8");
    let effectdata2 = JSON.parse(effectdata);

    let CON = playerdata2[player].stats[1] || 0
    let DEX = playerdata2[player].stats[2] || 0
    let WIS = playerdata2[player].stats[4] || 0

    let CONMOD = CON > 10 ? Math.floor((CON - 10) / 2) + effectdata2[player]["CONMOD"] : Math.ceil((CON - 10) / 2) + effectdata2[player]["CONMOD"] || 0;
    let DEXMOD = DEX > 10 ? Math.floor((DEX - 10) / 2) + effectdata2[player]["DEXMOD"]: Math.ceil((DEX - 10) / 2) + effectdata2[player]["DEXMOD"]|| 0; 
    let WISMOD = WIS > 10 ? Math.floor((WIS - 10) / 2) + effectdata2[player]["WISMOD"]: Math.ceil((WIS - 10) / 2) + effectdata2[player]["WISMOD"]|| 0;

    let CLASSHPMOD =classdata2[playerdata2[player]["class"]]["effects"]["hp"] || 0;
    let BASEHP = effectdata2[player]["BASEHPMOD"] || 0;
    let CLASSSTAMOD = classdata2[playerdata2[player]["class"]]["effects"]["sta"] || 0;
    let BASESTA = effectdata2[player]["BASESTAMOD"] || 0;
    let CLASSMPMOD = classdata2[playerdata2[player]["class"]]["effects"]["mp"] || 0;
    let BASEMP = effectdata2[player]["BASEMPMOD"] || 0;

    let HP = (1+ CONMOD) * ((CON+(playerdata2[player]["level"]/2)*CLASSHPMOD)+BASEHP);
    let STA = 2*(1 + DEXMOD) * ((DEX + (playerdata2[player]["level"] / 2) * CLASSSTAMOD) + BASESTA);
    let MP = (1 + WISMOD) * ((WIS + (playerdata2[player]["level"] / 2) * CLASSMPMOD) + BASEMP);

  

    if (playerdata2[player]["HP"][1] < 0) {
        playerdata2[player]["HP"][1] = 1; 
    }
    if (playerdata2[player]["STA"][1] < 0) {
        playerdata2[player]["STA"][1] = 1;
    }
    if (playerdata2[player]["MP"][1] < 0) {
        playerdata2[player]["MP"][1] = 1; 
    }

      playerdata2[player]["HP"][1] = Math.round(HP);
      playerdata2[player]["STA"][1] = Math.round(STA);
      playerdata2[player]["MP"][1] = Math.round(MP);

      fs.writeFileSync("./Data/Player/playersheets.json", JSON.stringify(playerdata2, null, 2), "utf-8");
}

