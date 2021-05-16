require("dotenv").config();

//console.log(process.env.BOT_TOKEN);

const { Client } = require("discord.js");
const client = new Client();

const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.username}`);

});

client.on("message",(message) => {
  if(message.author.bot)
    return;
  if(message.content === "hello"){
    message.reply("Hello there")
  }
  if(message.content.startsWith(PREFIX)){
    const [CMD_NAME,...arguments] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
    if(CMD_NAME === "start"){
      message.channel.send("Enter your state name in format '$state statename'")
      message.channel.send("Kerala Tamil Nadu Karnataka Telangana Maharashtra Gujarat")
    }else if(CMD_NAME === "state"){
      message.channel.send("Enter your district name in format '$district districtname'")
      message.channel.send("Trivandrum Thrissur Ernakulam Kozhikode Malapuram kasargod");
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN);
