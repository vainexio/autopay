const client = require('../server.js').client;
const Discord = require('discord.js');
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton} = Discord;

const settings = require('../storage/settings_.js')
const colors = settings.colors

module.exports = {
  getTime: function(stamp) {
    return Math.floor(new Date(stamp).getTime()/1000.0);
  },
  getNth: function (value) {
    value = value.toString()

    let end = value[value.length-1]
    let mid = value[value.length-2]
    let nth = mid !== '1' ? end === '1' ? 'st' : end === '2' ? 'nd' : end === '3' ? 'rd' : 'th' : 'th'
    
    return value+nth
  },
  getChannel: async function (id) {
  id = id ? id.replace(/<|#|>/g,'') : 0
  let channel = !isNaN(id) ? await client.channels.cache.get(id) : null
  return channel;
},
  //Get Guild
  getGuild: async function (id) {
  let guild = await client.guilds.cache.get(id);
  return guild;
},
  //Get Users
  getUser: async function (id) {
  id = id ? id.replace(/<|@|>/g,'') : 0
  let user = !isNaN(id) ? await client.users.fetch(id).catch(error => console.log('Unknown User: '+id)) : null
  return user;
},
  //Get members
  getMember: async function (id, guild) {
  id = id ? id.replace(/<|@|>/g,'') : 0
  let user = !isNaN(id) ? await guild.members.cache.get(id) : null
  return user;
},
  //Get random
  getRandom: function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
},
  //Get color
  getColor: async function getColor(string) {
  let color = colors[string.toLowerCase()]
  if (color) return color;
},
};