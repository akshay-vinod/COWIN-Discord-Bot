require("dotenv").config();
const {fetchState,fetchDistricts,fetchSlots} = require("./state")


const { Client } = require("discord.js");
const client = new Client();

const PREFIX = "$";
//to store states
var stateData = []
var districtData =[]
var slotData = []


/*function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if ((myArray[i].state_name ).toUpperCase()=== (nameKey).toUpperCase()) {
            return myArray[i].state_id;
        }
    }
}*/
//var resultObject = search("string 1", array);

client.on("ready", async() => {
  const state = await fetchState();
  stateData = state.states
 
});

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
      
      const district = await fetchDistricts(result.state_id);
      var districtsMessage = ""
      districtData= district.districts
      districtData.map(items=>{
        districtsMessage+=" |`"+items.district_name+"`|"
      })
      message.channel.send(districtsMessage)
      message.channel.send("Enter your district name in format '$district districtname'")
    }
    else if (CMD_NAME === "district"){
        result = districtData.find(x => (x.district_name).toUpperCase() === arguments.toUpperCase());
        if(!result){
          message.channel.send("Invalid district name");
          return;
        }
        const slot = await fetchSlots(result.district_id);
        slotMessage = ""
        slotData = slot.sessions
        slotData.map((items)=>{
            slotMessage+=" `"+items.name+" "+items.vaccine+" ("+items.available_capacity+") `";
        })
        message.channel.send(slotMessage)

    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN);
