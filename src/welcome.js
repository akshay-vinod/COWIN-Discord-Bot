module.exports = (client) => {
    client.on('guildMemberAdd',async(member) => {
        const channels = member.guild.channels
        const message = `Hi <@${member.id}>, I'm here to give you information and updates about vaccine slot availability.But first,you have to tell me your age and preferred vaccination location. Begin by entering your state in the format $state statename`

        await channels.cache.find(channel => channel.name === "general" && channel.type === "text").send(message)
    
    })
}