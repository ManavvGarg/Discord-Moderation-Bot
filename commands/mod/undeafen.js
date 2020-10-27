const { ownerID } = require("../../owner.json")

module.exports = {
    config: {
    
        name: "undeafen",
        description: "Undeafen a member in a voice channel",
        usage: "Undeafen <user>",
        aliases: ["undeaf"]
       
    },

    run: async(bot, message, args) => {
     if (!message.member.hasPermission("DEAFEN_MEMBERS") && !ownerID .includes(message.author.id)) return message.channel.send("**You Dont Have The Permissions To Ban Users! - [DEAFEN_MEMBERS]**");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase());

        if(!member) return message.channel.send("Unable to find the mentioned user in this guild.")

        let reason = args.slice(1).join(" ");
        if (!reason) reason = "No Reason Provided"


        try {
            member.voice.setDeaf(false, reason);
            message.channel.send("Success ✅ : Member Undeafened")
        } 
        
        catch (error) {
            console.log(error)
            message.channel.send("Oops! An unknow error occured. Please try again later.")
        }

    }
}