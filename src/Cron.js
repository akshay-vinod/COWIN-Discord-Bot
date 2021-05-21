const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./user");
//const { client } = require("./bot");
const { Client, DataResolver, MessageEmbed } = require("discord.js");
const { fetchSlots } = require("./state");

//for cron job

//grouping objects by multiple keys
const groupBy = (keys) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map((key) => obj[key]).join("_");
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

var task = cron.schedule(
  "00 59 * * * *", // "*/10 * * * * *"
  async () => {
    console.log("cron running");

    //console.log()
    //client.users.cache.get('775921390687354920').send('hai')
    //users = await findUsers()

    users = await User.find({ notify: true }).exec();

    if (!users.length) {
      return;
    }

    groupedUsers = await groupBy(["district_id", "date"])(users);

    Object.entries(groupedUsers).forEach(async (entry) => {
      const [key, values] = entry;
      const [district_id, date] = key.trim().split(/\_/);
      slot = await fetchSlots(district_id, date);

      //availableSlots = slot.sessions.filter((item) => item.available_capacity>0)

      youthSlots = slot.sessions.filter(
        (item) => item.min_age_limit <= 18 && item.available_capacity != 0
      );
      middleSlots = slot.sessions.filter(
        (item) => item.min_age_limit <= 45 && item.available_capacity != 0
      );
      elderlySlots = slot.sessions.filter(
        (item) => item.min_age_limit <= 60 && item.available_capacity != 0
      );
      values.forEach((value) => {
        //console.log(value.tag);
        //console.log(value.user_id);
        if (value.age >= 60) {
          //console.log("elderly:",elderlySlots)
          //send message
          slotMessage = "```\n\n";
          if (elderlySlots.length) {
            elderlySlots.map((items) => {
              slotMessage +=
                " " +
                items.name +
                " " +
                items.vaccine +
                " Available Capacity(" +
                items.available_capacity +
                ") \n";
            });
            slotMessage +=
              "```\n Book vaccine https://selfregistration.cowin.gov.in/";
            console.log(elderlySlots);
            const embed = new MessageEmbed()
              .setColor("#DAF7A6")
              .addField("Available Slots", `${slotMessage}`);
            client.users.cache.get(value.user_id).send(embed);
          }
          //var slotMessage = "";

          //console.log((embed))
          //message.channel.send( embed);
        } else if (value.age >= 45) {
          //console.log(middleSlots)
          /*slotMessage = "```\n\n";
          if (middleSlots.length) {
            middleSlots.map((items) => {
              slotMessage +=
                " " +
                items.name +
                " " +
                items.vaccine +
                " Available Capacity(" +
                items.available_capacity +
                ") \n";
            });
            slotMessage +=
              "```\n Book vaccine https://selfregistration.cowin.gov.in/";
            
            const embed = new MessageEmbed()
              .setColor("#DAF7A6")
              .addField("Available Slots", `${slotMessage}`);
            client.users.cache.get(value.user_id).send(embed);}*/
        } else if (value.age >= 18) {
          //console.log(youthSlots)
          /* slotMessage = "```\n\n";
          if (youthSlots.length) {
            youthSlots.map((items) => {
              slotMessage +=
                " " +
                items.name +
                " " +
                items.vaccine +
                " Available Capacity(" +
                items.available_capacity +
                ") \n";
            });
            slotMessage +=
              "```\n Book vaccine https://selfregistration.cowin.gov.in/";
            
            const embed = new MessageEmbed()
              .setColor("#DAF7A6")
              .addField("Available Slots", `${slotMessage}`);
            client.users.cache.get(value.user_id).send(embed);
          }*/
        }
      });
    });
  },
  {
    timezone: "Asia/Kolkata",
  }
);

module.exports = { task };
