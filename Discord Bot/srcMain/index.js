require('dotenv').config({path: "/Users/plant/My Documents/DND/Discord Bot/.env"});
const { Client, IntentsBitField, EmbedBuilder , MessageFlags, ButtonBuilder,ButtonStyle,ButtonInteraction,ButtonComponent,ActionRowBuilder} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});


eventHandler(client);

client.login(process.env.TOKEN);
