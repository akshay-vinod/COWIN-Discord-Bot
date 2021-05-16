require("dotenv").config();

//console.log(process.env.BOT_TOKEN);

const { Client } = require("discord.js");

const client = new Client();

client.on("ready", () => {
  console.log(`${client.user.username}`);
});
client.login(process.env.DISCORD_BOT_TOKEN);
