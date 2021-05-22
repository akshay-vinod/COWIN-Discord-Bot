const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("./user");
//const { client } = require("./bot");
const { Client, DataResolver, MessageEmbed } = require("discord.js");
const { fetchSlots } = require("./state");
const user = require("./user");
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

//for cron job

//grouping objects by multiple keys
const groupBy = (keys) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map((key) => obj[key]).join("_");
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

var hourlyTask = cron.schedule(
  "00 59 * * * *", //"*/20 * * * * *"
  async () => {
    console.log("cron running");
    //date = await findData("Akshay Vinod#1878","date")
    //console.log(date)
    //console.log()
    //client.users.cache.get('775921390687354920').send('hai')
    //users = await findUsers()

    users = await User.find({ notify: true }).exec();

    if (!users.length) {
      return;
    }

    groupedUsers = await groupBy(["district_id", "notify_date"])(users);

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

    console.log(groupedUsers);

    Object.entries(groupedUsers).forEach(async (entry) => {
      const [key, values] = entry;
      const [district_id, date] = key.trim().split(/\_/);
      slot = await fetchSlots(district_id, date);
      if (!slot || !slot.sessions.length) {
        return;
      }
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
            //console.log(elderlySlots);
            const embed = new MessageEmbed()
              .setColor("#DAF7A6")
              .addField("Available Slots", `${slotMessage}`);
            //client.users.cache.get(value.user_id).send(embed);
          }
          //var slotMessage = "";

          //console.log((embed))
          //message.channel.send( embed);
        } else if (value.age >= 45) {
          //console.log(middleSlots)
          slotMessage = "```\n\n";
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
            client.users.cache.get(value.user_id).send(embed);
          }
        } else if (value.age >= 18) {
          //console.log(youthSlots)
          slotMessage = "```\n\n";
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
    console.log("Running every 30 seconds");

    users = await User.find({ notify: true }).exec();

    /*User.updateMany({notify:true, daily_notify: true},{"$set": {"notify_date": dayjs(notify_date,'DD-MM-YYYY').add(1,'day').format('DD-MM-YYYY')}},(err,res)=> {
    if(err){
      console.log(err)
    } else{
      console.log(res)
    }
  })*/

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
