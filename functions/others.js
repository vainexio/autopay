const {getPerms, noPerms, client} = require('../server.js');
const Discord = require('discord.js');
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton} = Discord;

const settings = require('../storage/settings_.js')
const {shop, emojis, colors, theme, status} = settings

const cmdHandler = require('../functions/commands.js')
const {getTemplate} = cmdHandler

const get = require('../functions/get.js')
const {getRandom, getChannel} = get

module.exports = {
  makeCode: function (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  fetchKey: async function (channel, key, message) {
  
  let last_id;
  let foundKey = false
  let mentionsCount = 0
  let limit = 500
  let msgSize = 0
  let totalMsg = 0
  
  let embedMention = new MessageEmbed()
  .setDescription("No recent pings was found.")
  .setColor(colors.red)
  
  let msgBot
  await message.channel.send("Searching for keyword... "+emojis.loading).then((botMsg) => { msgBot = botMsg })
    
    while (true) {
      const options = { limit: 100 };
      if (last_id) {
        options.before = last_id;
      }
      
      let messages = await channel.messages.fetch(options).then(messages => {
      
      last_id = messages.last().id;
      totalMsg += messages.size
      msgSize = messages.size
        
        messages.forEach(async (gotMsg) => {
          if (gotMsg.content.toLowerCase().includes(key.toLowerCase()) && gotMsg.author.id === client.user.id) {
            mentionsCount += 1
            let row = new MessageActionRow().addComponents(
              new MessageButton().setLabel('Jump to Message').setURL(gotMsg.url).setStyle('LINK')
            );
            message.reply({content: emojis.check+' Keyword was found.', components: [row]})
            foundKey = true
          }
        })
      });
      //Return
      if (foundKey || await msgSize != 100) {
        msgBot.delete();
        if (!foundKey) message.channel.send(emojis.x+" No key was found `"+key+"`.")
        break;
      }
    }
  },
  sleep: async function (miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
  },
  getPercentage: function(value, totalValue) {
    value = Number(value)
    totalValue = Number(totalValue)
    let percentage = Math.round((value/totalValue)*100)
    return percentage;
  },
  randomTable: function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
},
  //Scan String For Key
  scanString: function (string,key) {
  string = string.toLowerCase()
  key = key.toLowerCase()
    if (string.includes(key)) {
      return true;
    }
  },
  //ARGS
  requireArgs: async function (message,count) {
    var args = message.content.trim().split(/\n| /);
    if (!args[count]) {
      let template = await getTemplate(args[0], await getPerms(message.member,0))
      return null;
    } else {
      return args;
    }
  },
  getArgs: function (content) {
    var args = content.trim().split(/\n| /);
    return args;
  },
  ghostPing: async function(id,ch) {
    let channel = await getChannel(ch)
    await channel.send('<@'+id+'>').then(msg => msg.delete())
  }
};