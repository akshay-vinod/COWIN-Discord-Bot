const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./user");
//const { client } = require("./bot");
const { Client, DataResolver } = require("discord.js");
//for cron job
const client = new Client();
var task = cron.schedule(
  "*/2 * * * *",
  () => {
    console.log("cron running");
    client.users.cache.get("775921390687354920").send("Blabla");
  },
  {
    timezone: "Asia/Kolkata",
  }
);

module.exports = { task };
