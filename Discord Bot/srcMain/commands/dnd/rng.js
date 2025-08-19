  const { MessageFlags } = require('discord.js');

module.exports = {
  name: 'roll',
  description: 'Roll any dice you want!',
  options: [
    {
      name: 'dice',
      description: 'The dice you want to roll (e.g., 1d20, 2d6)',
      type: 3, // ApplicationCommandOptionType.String
      required: true,
    },
  ],

  callback: (client, interaction) => {
    const diceInput = interaction.options.getString('dice');
    const match = diceInput.match(/^(\d+)?d(\d+)$/i);
  if (match) {
    var rng = (max) => {     
        return Math.floor(Math.random() * (max))+1
      }

    let num = 0
    let num1 = parseInt(match[1] || "1", 10)
    let num2 = parseInt(match[2],10)
     for (let i = 0; i < num1; i++) {
      
       num = num + rng(num2)
      }
      let num4 = `${num}`;
      let num3 = `${diceInput}`


    const embed = {
      color: 0x0099ff,
      title: 'Dice Roll Result',
      description: `You rolled **${num3}** and got **${num4}**!`,
      timestamp: new Date(),
      footer: {
        text: 'Dice Roll',
      }}

    interaction.reply({
      embeds: [embed],
  
    }); 

    }
    

else {
    interaction.reply({
      content: 'Invalid dice format! Use format like 1d20 or 2d6.',
      flags: MessageFlags.Ephemeral 
    });
    return;

  }},
};