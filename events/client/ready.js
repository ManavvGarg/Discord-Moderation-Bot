const { PREFIX, LAVA_HOST, LAVA_PASSWORD, LAVA_PORT, spCID, spCS  } = require('../../config');
var DanBotHosting = require("danbot-hosting");
const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");
const { MessageEmbed } = require("discord.js")
const venom = require("venom-bot")

module.exports = async bot => {
    console.log(`${bot.user.username} is available now!`)
    var activities = [ `${bot.guilds.cache.size} servers`, `${bot.users.cache.size} users!` ], i = 0;
    setInterval(() => bot.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }),5000)
    
    const API = new DanBotHosting.Client("danbot-nhcybe", bot);
  //=================================== MUSIC STUFF =============================================

  const nodes = [
    {
      host: LAVA_HOST,
      password: LAVA_PASSWORD,
      port: LAVA_PORT,
    }
  ];
  
  const clientID = spCID;
  const clientSecret = spCS;

  bot.manager = new Manager({
    nodes,
    plugins: [ new Spotify({ clientID, clientSecret }) ],
    autoPlay: true,
    secure: false,
    send: (id, payload) => {
      const guild = bot.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  });

  bot.manager.init(bot.user.id);
  console.log(`Logged in as ${bot.user.tag}`);
  
  bot.manager.on("nodeConnect", node => {
      console.log(`Node "${node.options.identifier}" connected.`)
  })
  
  bot.manager.on("nodeError", (node, error) => {
      console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
  })
  
  bot.on("raw", d => bot.manager.updateVoiceState(d));

  bot.manager.on("trackStart", (player, track) => {
    const channel = bot.channels.cache.get(player.textChannel);
    let min = Math.floor((track.duration/1000/60) << 0), sec = Math.floor((track.duration/1000) % 60);
    let sec2;
      if(sec < 10) {
          sec2 = `0${sec}`
      }
      else {
          sec2 = sec
      }
    let np = new MessageEmbed()
    .setColor("#d9d9d9")
    .setDescription(`**Now playing:** \n\`${track.title}\`\nRquested by [ ${track.requester} ]\nDuration: [ \`${min}:${sec2}\` ]`)
    channel.send(np).then(m => m.delete({ timeout: track.duration }));
  });
  
  // Emitted the player queue ends
  bot.manager.on("queueEnd", player => {
    const channel = bot.channels.cache.get(player.textChannel);
    channel.send("Queue has ended. Bye! :wave: ");
    player.destroy();
  });

  bot.manager.on("socketClosed", player => {
    player.destroy();
  })

  //============================= Server Stat Posting ===========================================
  
    // Start posting
    let initalPost = await API.autopost();
   
    if (initalPost) {
      console.error(initalPost); // console the error
  
  }
  
  //============================== Whatsapp =====================================================


  venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });
    
};