require("dotenv").config();

const mongoose = require("mongoose");

const {fetchState,fetchDistricts,fetchSlots} = require("./state")
const User = require("./user")

const { Client } = require("discord.js");
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

const createUser = (tag, stateid, districtname=null) => {
  const options = {
    new: true,
    upsert: true,
  }
  if(stateid){
    User.findOneAndUpdate({tag: tag},{state_id: stateid, district: ""}, options, (err,user) => {
      if(err || !user){
        console.log("DB error")
      }else{
        console.log(user)
      }
    })
  }else{
    User.findOneAndUpdate({tag: tag},{district: districtname},options, (err,user) => {
      if(err || !user){
        console.log("DB error here")
      }else{
        console.log(user)
      }
    })
  }
}

const findState = (tag) => {
  User.findOne({tag},(err,user) => {
    if(err || !user){
      console.log("User doesn't exist")
      return 0;
    }else {
      console.log("State id",user.state_id)
      return user.state_id 
    }
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
      createUser(message.author.tag,result.state_id);

      const district = await fetchDistricts(result.state_id);
      districtData= district.districts
      var districtsMessage = ""
      
      districtData.map(items=>{
        districtsMessage+=" |`"+items.district_name+"`|"
      })
      districtsMessage+="\nEnter your district name in format '$district districtname'"
      message.reply(districtsMessage)
    }
    else if (CMD_NAME === "district"){
      state_id = findState(message.author.tag)
      console.log(state_id)
      if(!state_id){
        message.reply("Enter your state first")
        return
      }
      const district = await fetchDistricts(state_id);
      districtData= district.districts
      
      createUser(message.author.tag,null,arguments)
      result = districtData.find(x => (x.district_name).toUpperCase() === arguments.toUpperCase());
        if(!result){
          message.reply("Invalid district name");
          return;
        }
        const slot = await fetchSlots(result.district_id);
        slotMessage = ""
        slotData = slot.sessions
        console.log(slotData)
        slotData.map((items)=>{
            slotMessage+=" |`"+items.name+" "+items.vaccine+" ("+items.available_capacity+") `|";
        })
        message.reply(slotMessage)
        message.reply("Enter age in format '$age your_age' to get update regarding available slot ")

    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN);
