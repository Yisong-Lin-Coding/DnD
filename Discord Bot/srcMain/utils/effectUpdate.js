const fs = require('fs')

module.exports = () => {
        let playerdata = fs.readFileSync("./Data/Player/playersheets.json","utf-8")
        let playerdata2 = JSON.parse(playerdata)
        let playerstat = fs.readFileSync("./Data/Player/playerstats.json","utf-8")
        let platerstat2 = JSON.parse(playerstat)
        let effects = fs.readFileSync("./Data/effects.json")
        let effects2 = JSON.parse(effects)

        let result = {};
const collectDeepEffects = (obj, depth = 0) => {
  

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    if (value && typeof value === "object" && Object.keys(value).length > 0) {
      // Recurse deeper, increasing depth
      const nested = collectDeepEffects(value, depth + 1);

      // Only merge effects if we're past depth 1 (i.e. skip depth 0 and 1)
      if (depth >= 1) {
        result = { ...result, ...nested };
      }
    } else {
      if (depth >= 2) {
        result[key] = value;
      }
    }
  });
  return result;
};


console.log(collectDeepEffects(effects2))
}