const db = require('quick.db');

module.exports = {
    config: {
        name: 'setxp',
        aliases: ['enablexp'],
        description: 'Enables Server XP Messages',
        usage: ' '
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

        try {
            let a = await db.fetch(`guildMessages_${message.guild.id}`)

            if (a) {
                return message.channel.send("**XP Messages Are Already Enabled In The Server!**")
            } else {
                db.set(`guildMessages_${message.guild.id}`, 1)

                message.channel.send("**XP Messages Are Enabled Successfully!**")
            }
            return;
        } catch (e) {
            console.log(e)
            return message.channel.send("**Something Went Wrong!**")
        }
    }
}