const fs = require('fs');
const path = './Data/Player/playersheets.json';

let previousData = JSON.parse(fs.readFileSync(path, 'utf-8'));

fs.watch(path, () => {
  clearTimeout(global.hpCheckTimeout);
  global.hpCheckTimeout = setTimeout(() => {
    const newData = JSON.parse(fs.readFileSync(path, 'utf-8'));

    for (const name in newData) {
      const oldHP = previousData[name]?.HP?.[0];
      const newHP = newData[name]?.HP?.[0];

      if (oldHP !== undefined && newHP !== undefined && oldHP !== newHP) {
        previousData = newData;
        console.log(`${name} ${oldHP} -> ${newHP}`)
        return{
            result:"hp",
            user:name,
            amount:[newHP-oldHP,oldHP, newHP],
            message:`${name} changed HP from ${oldHP} -> ${newHP}`
            };
            
      }
    }

    previousData = newData;
  }, 100);
});

console.log("🩺 Watching player HP changes...");