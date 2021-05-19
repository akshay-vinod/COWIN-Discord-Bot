require("dotenv").config();

const mongoose = require("mongoose");

const {fetchState,fetchDistricts,fetchSlots} = require("./state")
const User = require("./user")

const { Client, DataResolver } = require("discord.js");
const { findOneAndUpdate } = require("./user");
const client = new Client();

const PREFIX = "$";
//to store states
var stateData = []
var districtData =[]
var slotData = []

//Database connection
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false})
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

mongoose.connection.on('error', err => console.log(err));

/*function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if ((myArray[i].state_name ).toUpperCase()=== (nameKey).toUpperCase()) {
            return myArray[i].state_id;
        }
    }
}*/
//var resultObject = search("string 1", array);

client.on("ready", () => {
 // const state = await fetchState();
 
 (async() => {
  const state = await fetchState();
  stateData = state.states
  //console.log(stateData)
})();
});

const createUser = (tag, stateid, districtid) => {
  const options = {
    new: true,
    upsert: true,
  }
  if(stateid){
    User.findOneAndUpdate({tag: tag},{state_id: stateid, district_id: ""}, options, (err,user) => {
      if(err || !user){
        console.log("DB error while adding state name")
      }else{
        console.log(user)
      }
    })
  }else{
    User.findOneAndUpdate({tag: tag},{district_id: districtid},options, (err,user) => {
      if(err || !user){
        console.log("DB error while adding district")
      }else{
        console.log(user)
      }
    })
  }
}
const addDate = (tag, date) => {
  formattedDate = new Date(date)
  User.findOneAndUpdate({tag},{date},{new: true},(err,user) => {
    if(err){
      console.log("DB error while adding date")
    }
    else{
      console.log(user)
    }
  })
}
const findData = (tag , field) => {
  return new Promise((resolve,reject)=>{
    User.findOne({tag},(err,user) => {
      if(err || !user){
        //console.log("User doesn't exist")
        resolve(0);
      }else {
        //console.log("State id",user.state_id)
        if(field === "state")
          resolve(user.state_id) 
        else if(field === "district"){
          console.log(user.district_id)
          resolve(user.district_id)
        }
        else{
          console.log(user.date)
          resolve(user.date)
        }
      }
    })
    ,(error)=> reject(error);
  })
}

client.on("message",async(message) => {
  if(message.author.bot)
    return;
  if(message.content === "hello"){
    message.reply("Hello there")
  }
  if(message.content.startsWith(PREFIX)){
    const [CMD_NAME,arguments] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s(.+)?/,2);
    if(CMD_NAME === "start"){
        stateData.map(items=>{
            message.channel.send(items.state_name)
        })
      
      message.channel.send("Enter your state name in format '$state statename'")
      
    }
    else if(CMD_NAME === "state"){
      //resultObject = search(arguments, stateData);
      result = stateData.find(({state_name}) => state_name.toUpperCase() === arguments.toUpperCase());
      if(!result){
        message.channel.send(`Invalid state name.Please try again.`)
        return
      }
      createUser(message.author.tag,result.state_id,null);

      const district = await fetchDistricts(result.state_id);
      districtData= district.districts
      var districtsMessage = ""
      
      districtData.map(items=>{
        districtsMessage+=" |`"+items.district_name+"`|"
      })
      districtsMessage+="\nEnter your district name in format '$district districtname'"
      message.reply(districtsMessage)
    }
    else if(CMD_NAME === "district"){
      state_id = await findData(message.author.tag ,"state")
      if(!state_id){
        message.reply("Enter your state first")
        return
      }
      const district = await fetchDistricts(state_id);
      districtData= district.districts
      result = districtData.find(x => (x.district_name).toUpperCase() === arguments.toUpperCase());
      if(!result){
        message.reply("Invalid district name");
        return;
      }
      console.log(result.district_id)
      createUser(message.author.tag,false,result.district_id)
      message.reply(`Enter your date in format '$date 09-03-2021'`);
    }
    else if(CMD_NAME === "date") {
      district_id = await findData(message.author.tag,"district")
      console.log(arguments)
      if(!district_id){
        message.reply("Enter your district first")
        return
      }
      addDate(message.author.tag,arguments)
      message.reply("Enter age in format '$age your_age'")
    }
    else if(CMD_NAME === "age"){
      district_id = await findData(message.author.tag,"district")
      date = await findData(message.author.tag,"date")
      if(!date){
        message.reply("Enter your preferred date first")
        return
      }
      const slot = await fetchSlots(district_id,date);
      slotMessage = ""
      console.log(slot.sessions)
      slotData = slot.sessions.filter((item) => item.min_age_limit<=arguments)

      if(slotData.length){
        slotData.map((items)=>{
          slotMessage+=" |`"+items.name+" "+items.vaccine+" ("+items.available_capacity+") `|";
        })
        slotMessage += "\n Book vaccine https://selfregistration.cowin.gov.in/"
      }
      else{
        slotMessage = "No slot available"
      } 
      slotMessage += "\nEnter $notify dd-mm-yyyy to get slot availability notifications for a particular date"  
      message.reply(slotMessage) 
    }else if(CMD_NAME === "notify"){
      addDate(message.author.tag,arguments);
      User.findOneAndUpdate({tag: message.author.tag},{notify: true});
      message.reply("We'll notify you every hour :raised_hands: \nEnter $unsubscribe anytime to stop updates")
    }else if(CMD_NAME === "unsubscribe"){
      User.findOneAndUpdate({tag: message.author.tag},{notify:false});
      message.reply("Unsubscribed :thumbsup:")
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN);
