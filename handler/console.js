module.exports = (bot, message) => {
    let prompt = process.openStdin()
    prompt.addListener("data", res => {
        let x = res.toString().trim().split(/ +/g)
            bot.channels.cache.get(message.channel.id).send(x.join(" "));
        });
    };