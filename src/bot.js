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
  //const state = await fetchState();
  //stateData = state.states
  stateData = [
    { state_id: 1, state_name: 'Andaman and Nicobar Islands' },
    { state_id: 2, state_name: 'Andhra Pradesh' },
    { state_id: 3, state_name: 'Arunachal Pradesh' },
    { state_id: 4, state_name: 'Assam' },
    { state_id: 5, state_name: 'Bihar' },
    { state_id: 6, state_name: 'Chandigarh' },
    { state_id: 7, state_name: 'Chhattisgarh' },
    { state_id: 8, state_name: 'Dadra and Nagar Haveli' },
    { state_id: 37, state_name: 'Daman and Diu' },
    { state_id: 9, state_name: 'Delhi' },
    { state_id: 10, state_name: 'Goa' },
    { state_id: 11, state_name: 'Gujarat' },
    { state_id: 12, state_name: 'Haryana' },
    { state_id: 13, state_name: 'Himachal Pradesh' },
    { state_id: 14, state_name: 'Jammu and Kashmir' },
    { state_id: 15, state_name: 'Jharkhand' },
    { state_id: 16, state_name: 'Karnataka' },
    { state_id: 17, state_name: 'Kerala' },
    { state_id: 18, state_name: 'Ladakh' },
    { state_id: 19, state_name: 'Lakshadweep' },
    { state_id: 20, state_name: 'Madhya Pradesh' },
    { state_id: 21, state_name: 'Maharashtra' },
    { state_id: 22, state_name: 'Manipur' },
    { state_id: 23, state_name: 'Meghalaya' },
    { state_id: 24, state_name: 'Mizoram' },
    { state_id: 25, state_name: 'Nagaland' },
    { state_id: 26, state_name: 'Odisha' },
    { state_id: 27, state_name: 'Puducherry' },
    { state_id: 28, state_name: 'Punjab' },
    { state_id: 29, state_name: 'Rajasthan' },
    { state_id: 30, state_name: 'Sikkim' },
    { state_id: 31, state_name: 'Tamil Nadu' },
    { state_id: 32, state_name: 'Telangana' },
    { state_id: 33, state_name: 'Tripura' },
    { state_id: 34, state_name: 'Uttar Pradesh' },
    { state_id: 35, state_name: 'Uttarakhand' },
    { state_id: 36, state_name: 'West Bengal' }
  ]
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
