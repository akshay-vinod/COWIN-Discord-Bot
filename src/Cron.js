const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./user");
//const { client } = require("./bot");
const { Client, DataResolver, MessageEmbed } = require("discord.js");
const { fetchSlots } = require("./state");
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

//for slicing available slots
const chunk = (arr, size) =>
  arr.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    []
  );
//for cron job
const embedMessage = (slotMessage, user_id, date,channel_id) => {
  var fieldTitle = `Available Slot  - 📅${date}`;
  var slotMessage1 = chunk(slotMessage.split("\n"), 10);
  //console.log(slotMessage1);
  slotMessage1.map(async(items, i) => {
    var slotMessage2 = "```";
    slotMessage2 += items.join("\n") + "```";
    var embed = new MessageEmbed()
    if (i === 1) {
      fieldTitle = "⏬";
    }
    embed.setColor("#DAF7A6")
    .addField(`${fieldTitle}`, `${slotMessage2}`)
    if (slotMessage1.length === i + 1) {
      slotMessage2 += "\nBook vaccine https://selfregistration.cowin.gov.in/";
      embed.addField("To stop update anytime enter" ,"`$unsubscribe`")
      .setFooter("Get Vaccinated.", "https://i.ibb.co/Wxsn61G/logo.png")
    }

    var userid = await (client.users.cache.get(user_id))
    if (!client.users.cache.get(user_id))
      console.log("can't find user in cache");
    userid.send(embed).catch(async() => {
      console.log("Cant DM to user")
      var userChannel = await client.channels.cache.find(channel => channel_id==channel.id)
      userChannel.send(embed).catch(()=>console.log("Can't send DM or channel msg to user"))
    })
  });
}

//grouping objects by multiple keys
const groupBy = (keys) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map((key) => obj[key]).join("_");
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

var hourlyTask = cron.schedule(
  "0 5 * * * *", //  "*/20 * * * * *"
  async () => {
    console.log("cron running");

    users = await User.find({ notify: true }).exec();

    if (!users.length) {
      return;
    }

    groupedUsers = await groupBy(["notify_district_id", "notify_date"])(users);

    Object.entries(groupedUsers).forEach((entry) => {
      const [key, values] = entry;
      values.forEach((value) => {
        if (value.daily_notify) {
          newDate = dayjs(value.notify_date, "DD-MM-YYYY")
            .add(1, "day")
            .format("DD-MM-YYYY");
          newKey = value.district_id + "_" + newDate;
          if (!groupedUsers[newKey]) groupedUsers[newKey] = [];
          groupedUsers[newKey].push(value);
        }
      });
    });

    //console.log(groupedUsers);

    Object.entries(groupedUsers).forEach(async (entry) => {
      const [key, values] = entry;
      const [district_id, date] = key.trim().split(/\_/);
      let slot = await fetchSlots(district_id, date);
      if (!slot || !slot.sessions.length) {
        return;
      }
      //availableSlots = slot.sessions.filter((item) => item.available_capacity>0)

      let youthSlots = slot.sessions.filter(
        (item) => item.min_age_limit <= 18 && item.available_capacity != 0
      );
      let middleSlots = slot.sessions.filter(
        (item) => item.min_age_limit <= 45 && item.available_capacity != 0
      );
      let elderlySlots = slot.sessions.filter(
        (item) => item.min_age_limit <= 60 && item.available_capacity != 0
      );
      values.forEach((value) => {
        if (value.notify_age >= 60) {
          var slotMessage = "";
          if (elderlySlots.length) {
            elderlySlots.map((items) => {
              var fee = "free"
          if(items.fee !="0") fee = `paid(Rs.${item.fee})`
          slotMessage +=" 🔸" +items.name +" ▶ " +items.vaccine +" ▶ "+fee+" ▶"+" Slots Available->" +items.available_capacity +"\n";
            });
            embedMessage(slotMessage, value.user_id, date,value.channel_id);
            //console.log(elderlySlots);
          }

        } else if (value.notify_age >= 45) {
          slotMessage = "";
          if (middleSlots.length) {
            middleSlots.map((items) => {
              var fee = "free"
          if(items.fee !="0") fee = `paid(Rs.${item.fee})`
          slotMessage +=" 🔸" +items.name +" ▶ " +items.vaccine +" ▶ "+fee+" ▶"+" Slots Available->" +items.available_capacity +"\n";
            });
            embedMessage(slotMessage, value.user_id, date,value.channel_id);
            //console.log(middleSlots);
          }
        } else if (value.notify_age >= 18) {
          slotMessage = "";
          if (youthSlots.length) {
            youthSlots.map((items) => {
              var fee = "free"
          if(items.fee !="0") fee = `paid(Rs.${item.fee})`
          slotMessage +=" 🔸" +items.name +" ▶ " +items.vaccine +" ▶ "+fee+" ▶"+" Slots Available->" +items.available_capacity +"\n";
            });
            embedMessage(slotMessage, value.user_id, date,value.channel_id);
            //console.log(youngSlots);
          }
        }
      });
    });
  },
  {
    timezone: "Asia/Kolkata",
  }
);

var dailyTask = cron.schedule(
  "0 1 0 * * *", // "*/50 * * * * *"
  async () => {
    console.log("Running every day at 00:01");

    users = await User.find({ notify: true }).exec();


    if (!users.length) {
      return;
    }

    users.map((item) => {
      if (item.daily_notify) {
        User.findOneAndUpdate(
          { tag: item.tag },
          {
            notify_date: dayjs(item.notify_date, "DD-MM-YYYY")
              .add(1, "day")
              .format("DD-MM-YYYY"),
          },
          (err, user) => {
            if (err) {
              console.log("Error updating date");
            }
          }
        );
      } else if (dayjs(item.notify_date, "DD-MM-YYYY").isBefore(dayjs())) {
        User.findOneAndUpdate(
          { tag: item.tag },
          { notify: false },
          (err, user) => {
            if (err) {
              console.log("Error updating notify");
            }
          }
        );
      }
    });
  },
  {
    timezone: "Asia/Kolkata",
  }
);

module.exports = { hourlyTask, dailyTask };
