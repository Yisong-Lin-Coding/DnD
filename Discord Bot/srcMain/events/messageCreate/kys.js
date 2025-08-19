const kys = require('../../../../Data/kys.json');

module.exports = async (client, msg) =>{
  if (msg.author.bot) {
    return;
  }
  message = msg.content
  message = message.toLowerCase()
  if (
    message.includes("hi") ||
    message.includes("hello")

  ) {
    const kysrng = () => Math.floor(Math.random() * kys.length);
    msg.reply(kys[kysrng()]);
  }
  else {
    return; 
  }
};