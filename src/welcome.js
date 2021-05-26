module.exports = (client,MessageEmbed) => {
    client.on('guildMemberAdd',async(member) => {
        const channels = member.guild.channels
        const message = ``
        const embed = new MessageEmbed()
        .setColor('#DAF7A6')
        .setTitle("VaccineKaro")
        .setDescription(`Hey <@${member.id}>:wave: I am VaccineKaro, I can check Covid vaccination slot availability in your area and alert you when a slot becomes available.`)
        .addField("You can either DM me or put your query in the channel","[Add me to your server](https://discord.com/oauth2/authorize?client_id=843357961086435339&scope=bot)")
        .addField("To get started,Enter","`$state statename`")
        .setThumbnail("https://i.ibb.co/Wxsn61G/logo.png")
        .setFooter("Get Vaccinated.", "https://i.ibb.co/Wxsn61G/logo.png")
        channels.cache.find(channel => channel.name === "general" && channel.type === "text").send(embed)
            .catch(() => console.log("Couldn't send welcome message in ",member.guild))
    
    })
}