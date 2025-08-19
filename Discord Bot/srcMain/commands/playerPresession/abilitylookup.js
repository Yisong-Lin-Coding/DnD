   module.exports = {
       name: 'lookup',
         description: 'Looks up an ability in the database',
   
         callback: (client, interaction) => {
            const fs = require('fs');
            let itemdata = fs.readFileSync("./Data/Items/items.json", "utf-8");
            let itemdata2 = JSON.parse(itemdata);


            


         }
   }