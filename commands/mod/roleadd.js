const { MessageEmbed } = require("discord.js");
const { ownerID } = require("../../owner.json")
module.exports = {
  config: {
    name: "roleadd",
    description: "Add a role to a member",
    usage: "m/roleadd <member mention/id> <role mention/role id>",
    aliases: ['role add', 'radd']
  },
  run: async (client, message, args) => {

    if(!message.member.hasPermission(["MANAGE_ROLES"]) && !ownerID.includes(message.author.id)) return message.channel.send("You dont have permission to perform this command!")

    let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!rMember) return message.channel.send("Please provide a user to add a role too.")
    
    let role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first()
    
    if(!role) return message.channel.send("Please provide a role to add to said user.") 
    

    if(!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.channel.send("I don't have permission to perform this command. Please give me Manage Roles Permission!")

    if(rMember.roles.cache.has(role.id)) {
        
      return message.channel.send(`${rMember.displayName}, already has the role!`)
    
    } else {
        
      await rMember.roles.add(role.id).catch(e => console.log(e.message))
      
      message.channel.send(`${rMember.displayName} has been added to **${role.name}**`)
    
    }

  },
};