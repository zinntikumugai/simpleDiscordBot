process.on('unhandledRejection', console.dir);
const config = require('config');
const log4js = require('log4js');
const Discord = require('discord.js');
const client = new Discord.Client();
const Commands = new (require('./src/Module/Command.js'));

Commands.loader(process.cwd() + "/Command");

log4js.configure(config.get('log4js.configure'));
const logger = {
    system: log4js.getLogger('system'),
    access: log4js.getLogger('access'),
    error: log4js.getLogger('error')
}

const ifUser = (user, channel) => {
    if (config.get('Discord.masterUser').indexOf(user.id) !== -1)
        return true;
    else if (
        (config.get('Discord.availableChannelIds').indexOf(channel.id) !== -1)
        && (config.get('Discord.unavailableChannelIds').indexOf(channel.id) === -1)
    )
        return true;
    else
        return false
}

client.on('ready', () => {
    let data = {
        User_Tag: client.user.tag,
        User_ID: client.user.id,
        Discord_Prefix: config.get('Discord.reply.prefix'),
        Discord_Replay: config.get('Discord.reply.enableMention'),
        Discord_debug_noReply: config.get('Discord.debug.noReply'),
        Discord_debug_emulateReply: config.get('Discord.debug.emulateReply'),
        Discord_Commands: Commands.CommandList
    };
    let maxsize = 0;
    Object.keys(data).forEach(key => {
        if (maxsize < key.length)
            maxsize = key.length;
    });
    Object.keys(data).forEach(key => {
        logger.system.info(key + (' '.repeat(maxsize).slice(key.length)) + " : " + data[key]);
    });
});

client.on('message', message => {
    if (message.author.id === client.user.id)
        return;
    let args = "";
    let command = "";
    args = config.get('Discord.reply.prefix').length > 0 && message.content.search(config.get('Discord.reply.prefix')) == 0
        ? message.content.slice(config.get('Discord.reply.prefix').length).trim().split(/[　\s\n]/g)
        : (config.get('Discord.reply.enableMention') == true && message.content.search(client.user.id) >= 0)
            ? menubar.content.slice(client.user.id.length + 3).trim().split(/[　\s\n]/g)
            : null;
    if (args === null)
        return;
    command = JSON.parse(JSON.stringify(args)).shift().toLocaleLowerCase();

    message.react("🤚");
    if (!ifUser(message.author, message.channel)){
        message.react("🤔");
        return;
    }

    message.channel.startTyping();
    if (Commands.search(command) !== -1) {
        message.channel.stopTyping();
        message.react("👍");
        logger.system.info("[Command]: " + args);
        let res = Commands.do(message, command, args);
        if (res)
            message.channel.send(
                "<@" + message.author.id + "> \n" + res
            );
    }
});

client.login(config.get('Discord.token'));