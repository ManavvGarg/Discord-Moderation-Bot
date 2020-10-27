var Discord = require('discord.js')
const fs = require("fs")
const { PREFIX } = require("../../config")
const db = require('quick.db')
const { stripIndents } = require("common-tags");

module.exports = {
config: {
    name: "help",
    description: "Help Menu",
    usage: "1) m/help \n2) m/help [module name]\n3) m/help [command (name or alias)]",
    example: "1) m/help\n2) m/help utility\n3) m/help ban",
    aliases: ['h']
},
run: async (bot, message, args) => {
    let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };

if(message.content.toLowerCase() === `${prefix}help`){
    var log = new Discord.MessageEmbed()
    .setTitle("**Help Menu: Main**")
    .setColor(`#d9d9d9`)
    .addField(`**👑Moderation**`, `[ \`${prefix}help mod\` ]`, true)
    .addField(`**⚙️Utility**`, `[ \`${prefix}help utility\` ]`, true)

message.channel.send(log);
} 
else if(args[0].toLowerCase() === "mod") {
    var commandArray = "1) Ban \n2) Kick\n3) Whois\n4) Unban\n5) Warn\n6) Mute\n7) Purge\n8) Slowmode \n9) Nick \n10) Roleinfo"
    var commandA2 = "11) Rolememberinfo\n12) Setmodlog\n13) Disablemodlog\n14) Lock (Lock the channel)\n15) Unlock (Unlock the channel)\n16) Lockdown (Fully Lock the whole server. [FOR EMRGENCIES ONLY]) \n17) Hackban\\forceban <id>"
    
    pageN1 = "**\n💠Commands: **\n`\`\`js\n" + commandArray + "\`\`\`";
    pageN2 = "**\n💠Commands: **\n`\`\`js\n" + commandA2 + "\`\`\`";
    
    let pages = [pageN1, pageN2]
    let page = 1 

    var embed = new Discord.MessageEmbed()
        .setTitle('**Help Menu: [Moderation]👑**')
        .setColor("#d9d9d9") // Set the color
        .setFooter(`Page ${page} of ${pages.length}`, bot.user.displayAvatarURL())
        .setDescription(pages[page-1])

        message.channel.send({embed}).then(msg => {
            msg.react('⬅').then( r => {
            msg.react('➡')
            
            // Filters
            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id
            
            const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000})
            const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000})
            
            backwards.on('collect', (r, u) => {
                if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                page--
                embed.setDescription(pages[page-1])
                embed.setFooter(`Page ${page} of ${pages.length}`, bot.user.displayAvatarURL())
                msg.edit(embed)
                r.users.remove(r.users.cache.filter(u => u === message.author).first())
            })
            
            forwards.on('collect', (r, u) => {
                if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                page++
                embed.setDescription(pages[page-1])
                embed.setFooter(`Page ${page} of ${pages.length}`, bot.user.displayAvatarURL())
                msg.edit(embed)
                r.users.remove(r.users.cache.filter(u => u === message.author).first())
            })
            
            
            })
            })
}

else if(args[0].toLowerCase() === "util") {
    var embed = new Discord.MessageEmbed()
    .setTitle('**Help Menu: [Utility]**')
    .setColor("#d9d9d9") // Set the color
    .setDescription("```js" + `1) Prefix [${prefix}help prefix for more info]\n 2) Help [${prefix}help for more info]` + "```")
}

else {
    const embed = new Discord.MessageEmbed()
    .setColor("#d9d9d9")
    .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
    .setThumbnail(bot.user.displayAvatarURL())

    let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
    if (!command) return message.channel.send(embed.setTitle("**Invalid Command!**").setDescription(`**Do \`${prefix}help\` For the List Of the Commands!**`))
    command = command.config

    embed.setDescription(stripIndents`
    ** Command -** [    \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`   ]\n
    ** Description -** [    \`${command.description || "No Description provided."}\`   ]\n
    ** Usage -** [   \`${command.usage ? `\`${command.usage}\`` : "No Usage"}\`   ]\n
    ** Examples -** [   \`${command.example ? `\`${command.example}\`` : "No Examples Found"}\`   ]\n
    ** Aliases -** [   \`${command.aliases ? command.aliases.join(" , ") : "None."}\`   ]`)
    embed.setFooter(message.guild.name, message.guild.iconURL())

    return message.channel.send(embed)
}

    

}

}