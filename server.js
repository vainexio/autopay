//Glitch Project
const express = require("express");
const https = require("https");
const app = express();
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const moment = require("moment");
const { joinVoiceChannel } = require('@discordjs/voice');
const cc = 'KJ0UUFNHWBJSE-WE4GFT-W4VG'
//Discord
const Discord = require("discord.js");
const { WebhookClient, Permissions, Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, } = Discord;
const myIntents = new Intents();

myIntents.add(
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGES
);
const client = new Client({ intents: myIntents, partials: ["CHANNEL"] });

//Env
const mongooseToken = process.env.MONGOOSE;
const token = process.env.SECRET;
let listen

async function startApp() {
  console.log("Starting...");
  return
  if (client.user) return console.log("User already logged in.")
  if (cc !== process.env.CC) return console.error("Discord bot login | Invalid CC");
  let promise = client.login(token)
  promise?.catch(function (error) {
    console.error("Discord bot login | " + error);
    process.exit(1);
  });
}
startApp();

client.on("debug", async function (info) {
  let status = info.split(" ");
  if (status[2] === `429`) {
    console.log(`info -> ${info}`); // Debugger
    console.log(`Caught a 429 error!`);
    await sleep(60000)
  }
});

let embedSchema
let embedModel

let stickySchema
let stickyModel
//When bot is ready
client.on("ready", async () => {
  console.log(client.user.id)
  //
  if (shop.stayOnVc.enabled) {
    let channel = await getChannel(shop.stayOnVc.channel)
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });
  }
  //
  if (shop.database) {
    await mongoose.connect(mongooseToken);
    
    stickySchema = new mongoose.Schema({
      channelId: String,
      message: String,
    })
    
    embedSchema = new mongoose.Schema({
      id: String,
      title: String,
      description: String,
      color: String,
      thumbnail: String,
      image: String,
      footer: String,
      fields: [{
        name: String,
        value: String
      }]
    });
  
  embedModel = mongoose.model('EmbedModel_', embedSchema);
  stickyModel = mongoose.model("StickyModel_", stickySchema);
  }
  //
  if (slashCmd.register) {
    let discordUrl = "https://discord.com/api/v10/applications/"+client.user.id+"/commands"
    let headers = {
      "Authorization": "Bot "+token,
      "Content-Type": 'application/json'
    }
    for (let i in slashes) {
      let json = slashes[i]
      await sleep(1000)
      let response = await fetch(discordUrl, {
        method: 'post',
        body: JSON.stringify(json),
        headers: headers
      });
      console.log(json.name+' - '+response.status)
    }
    for (let i in slashCmd.deleteSlashes) {
      await sleep(2000)
      let deleteUrl = "https://discord.com/api/v10/applications/"+client.user.id+"/commands/"+slashCmd.deleteSlashes[i]
      let deleteRes = await fetch(deleteUrl, {
        method: 'delete',
        headers: headers
      })
      console.log('Delete - '+deleteRes.status)
      }
  }
  console.log("Successfully logged in to discord bot.");
  //
  let statusInterval = 0
  setInterval(async function() {
    client.user.setPresence(shop.bot.status[statusInterval]);
    statusInterval++
    statusInterval === shop.bot.status.length ? statusInterval = 0 : null
  },10000)
});

module.exports = { client: client, getPerms, noPerms };

let listener = app.listen(process.env.PORT, function () {
  console.log("Not that it matters but your app is listening on port ",listener.address());
});

//Send Messages
const sendMsg = require("./functions/sendMessage.js");
const { safeSend, sendChannel, sendUser } = sendMsg;
//Links Handler
const linksHandler = require('./functions/linksHandler.js')
const { generateLinks, revokeLinks, fetchLinks} = linksHandler
//Settings
const settings = require("./storage/settings_.js");
const { prefix, shop, colors, theme, commands, permissions, emojis } = settings;
//Functions
const get = require("./functions/get.js");
const { getTime, getNth, getChannel, getGuild, getUser, getMember, getRandom, getColor } = get;
//Command Handler
const cmdHandler = require("./functions/commands.js");
const { checkCommand, isCommand, isMessage, getTemplate } = cmdHandler;
//Others
const others = require("./functions/others.js");
const { makeCode, fetchKey, ghostPing, sleep, moderate, getPercentage, randomTable, scanString, requireArgs, getArgs } = others;
//Roles Handler
const roles = require("./functions/roles.js");
const { getRole, addRole, removeRole, hasRole } = roles;
//Slash Commands
const slashCmd = require("./storage/slashCommands.js");
const { slashes } = slashCmd;
/*
██████╗░███████╗██████╗░███╗░░░███╗░██████╗
██╔══██╗██╔════╝██╔══██╗████╗░████║██╔════╝
██████╔╝█████╗░░██████╔╝██╔████╔██║╚█████╗░
██╔═══╝░██╔══╝░░██╔══██╗██║╚██╔╝██║░╚═══██╗
██║░░░░░███████╗██║░░██║██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═════╝░*/
async function getPerms(member, level) {
  let highestPerms = null;
  let highestLevel = 0;
  let sortedPerms = await permissions.sort((a, b) => b.level - a.level);
  for (let i in sortedPerms) {
    if (permissions[i].id === member.id && permissions[i].level >= level) {
      highestLevel < permissions[i].level ? ((highestPerms = permissions[i]), (highestLevel = permissions[i].level)) : null;
    } else if ( member.user && member.roles.cache.some((role) => role.id === permissions[i].id) && permissions[i].level >= level) {
      highestLevel < permissions[i].level ? ((highestPerms = permissions[i]), (highestLevel = permissions[i].level)) : null;
    }
  }

  if (highestPerms) return highestPerms;
}
async function guildPerms(message, perms) {
  //console.log(Permissions.FLAGS)
  if (message.member.permissions.has(perms)) return true
  
  let embed = new MessageEmbed()
  .addFields({name: "Insufficient Permissions",value: "You don't have the required server permissions to use this command.\n\n`"+perms.toString().toUpperCase()+"`"})
  .setColor(colors.red);
  
  message.channel.send({ embeds: [embed] });
}
function noPerms(message) {
  let Embed = new MessageEmbed()
    .setColor(colors.red)
    .setDescription("You lack special permissions to use this command.");
  return Embed;
}

/*
░█████╗░██╗░░░░░██╗███████╗███╗░░██╗████████╗  ███╗░░░███╗███████╗░██████╗░██████╗░█████╗░░██████╗░███████╗
██╔══██╗██║░░░░░██║██╔════╝████╗░██║╚══██╔══╝  ████╗░████║██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝░██╔════╝
██║░░╚═╝██║░░░░░██║█████╗░░██╔██╗██║░░░██║░░░  ██╔████╔██║█████╗░░╚█████╗░╚█████╗░███████║██║░░██╗░█████╗░░
██║░░██╗██║░░░░░██║██╔══╝░░██║╚████║░░░██║░░░  ██║╚██╔╝██║██╔══╝░░░╚═══██╗░╚═══██╗██╔══██║██║░░╚██╗██╔══╝░░
╚█████╔╝███████╗██║███████╗██║░╚███║░░░██║░░░  ██║░╚═╝░██║███████╗██████╔╝██████╔╝██║░░██║╚██████╔╝███████╗
░╚════╝░╚══════╝╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░  ╚═╝░░░░░╚═╝╚══════╝╚═════╝░╚═════╝░╚═╝░░╚═╝░╚═════╝░╚══════╝*/
//ON CLIENT MESSAGE
let errors = 0;
let expCodes = [];
let nitroCodes = []
client.on("messageCreate", async (message) => {
  //
  if (message.author.bot) return;
  //Checker
  else if (message.content.toLowerCase().startsWith('.eval')) {
    let expression = message.content.toLowerCase().replace('.eval','')
    try {
      let total = eval(expression)
      message.reply(total.toString())
    } catch (err) {
      console.log(err)
    }
  }
  if (message.channel.type === "DM") return;
  //
  let checkerVersion = 'Checker version 2.9'
  if (message.channel?.name?.includes('nitro-checker')) {
    let args = getArgs(message.content)
    if (args.length === 0) return;
    let addStocks = args[0].toLowerCase() === 'stocks' && message.channel.type !== 'DM'  ? true : false
    let sortLinks = args[1]?.toLowerCase() === 'sort' && addStocks && message.channel.type !== 'DM'  ? true : args[0]?.toLowerCase() === 'sort' ? true : false
    if (shop.checkers.length > 0) return message.reply(emojis.warning+' Someone is currently scanning links.\nPlease use the checker one at a time to prevent rate limitation.')
    
    let codes = []
    let text = ''
    let msg = null
    for (let i in args) {
      if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
      let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g,'').replace(/ /g,'').replace(/[^\w\s]/gi,'').replace(/\\n|\|'|"/g,'')
      let found = codes.find(c => c.code === code)
      !found ? codes.push({code: code, expire: null, emoji: null, user: null, state: null}) : null
    }
    }
    if (codes.length === 0) return;
    
    let scanData = shop.checkers.find(c => c.id === message.author.id)
    if (!scanData) {
      let data = {
        id: message.author.id,
        valid: 0,
        claimed: 0,
        invalid: 0,
        total: 0,
      }
      shop.checkers.push(data)
      scanData = shop.checkers.find(c => c.id === message.author.id)
    }
    let row = new MessageActionRow().addComponents(
      new MessageButton().setEmoji("🛑").setLabel("Stop").setCustomId("breakChecker-").setStyle("SECONDARY"),
      new MessageButton().setEmoji("⌛").setLabel("Status").setCustomId("checkerStatus-"+scanData.id).setStyle("SECONDARY")
    );
    await message.channel.send({content: 'Fetching nitro codes ('+codes.length+') '+emojis.loading, components: [row]}).then(botMsg => msg = botMsg)
    
    for (let i in codes) {
      if (shop.breakChecker) break;
      let fetched = false
      let waitingTime = 0
      while (!fetched) {
        waitingTime > 0 ? await sleep(waitingTime) : null
        waitingTime = 0
        let eCode = expCodes.find(e => e.code === codes[i].code)
        let auth = {
          method: 'GET',
          headers: { 'Authorization': 'Bot '+token }
        }
        let res = eCode ? eCode : await fetch('https://discord.com/api/v10/entitlements/gift-codes/'+codes[i].code,auth)
        res = eCode ? eCode : await res.json()
        if (res.message && res.retry_after) {
          console.log('retry for '+codes[i].code)
          let ret = Math.ceil(res.retry_after)
          ret = ret.toString()+"000"
          waitingTime = Number(ret) < 300000 ? Number(ret) : 60000
        if (res.retry_after >= 600000) {
          fetched = true
          shop.breakChecker = true
          await message.channel.send('⚠️ The resource is currently being rate limited. Please try again in '+res.retry_after+' seconds')
          break;
        }
          }
        if (!res.retry_after) {
          fetched = true
          scanData.total++
          let e = res.expires_at ? moment(res.expires_at).diff(moment(new Date())) : null
          let diffDuration = e ? moment.duration(e) : null;
          let e2 = res.expires_at ? moment(res.expires_at).unix() : null;
          codes[i].expireUnix = e2 ? "\n<t:"+e2+":f>" : '';
          codes[i].rawExpire = e2
          codes[i].expire = diffDuration ? diffDuration.asHours().toFixed(1) : null
          codes[i].emoji = res.uses === 0 ? emojis.check : res.expires_at ? emojis.x : emojis.warning
          codes[i].state = res.expires_at && res.uses === 0 ? 'Claimable' : res.expires_at ? 'Claimed' : 'Invalid'
          codes[i].user = res.user ? '`'+res.user.username+'#'+res.user.discriminator+'`' : "`Unknown User`"
          codes[i].state === 'Claimable' ? scanData.valid++ : codes[i].state === 'Claimed' ? scanData.claimed++ : scanData.invalid++
          let type = res.store_listing?.sku?.name
          let foundCode = nitroCodes.find(c => c.code === res.code)
          if (!foundCode) nitroCodes.push({code: res.code, type: type})
          foundCode ? type = foundCode.type : null
          codes[i].typeEmoji = type === 'Nitro' ? emojis.nboost : type === 'Nitro Basic' ? emojis.nbasic : type === 'Nitro Classic' ? emojis.nclassic : '❓' 
          codes[i].type = type
          if ((!res.expires_at || res.uses >= 1) && !eCode) {
            let data = {
              code: codes[i].code,
              expires_at: res.expires_at,
              uses: res.uses,
              user: res.user,
            }
            expCodes.push(data)
          }
          break;
        }
      }
    }
    if (shop.breakChecker) {
      shop.breakChecker = false
      shop.checkers = []
      msg.edit({content: emojis.warning+" Interaction was interrupted\n**"+scanData.total+"** link(s) was scanned"})
      return;
    }
    sortLinks ? codes.sort((a, b) => (b.rawExpire - a.rawExpire)) : null
    let embeds = []
    let embed = new MessageEmbed()
    .setColor(colors.yellow)
    
    let num = 0
    let stat = {
      put: { boost: 0, basic: 0, boostString: '', basicString: '' },
      notput: { count: 0, string: '' }
    }
    for (let i in codes) {
      num++
      let data = codes[i]
      let emoji = data.emoji ? data.emoji : emojis.warning
      let type = data.type
      let state = data.state ? data.state : 'Unchecked'
      let user = data.user ? data.user : 'Unknown User'
      let expire = data.expire
      let expireUnix = data.expireUnix
      if (embed.fields.length <= 24) {
      embed = new MessageEmbed(embed)
        .setFooter({ text: checkerVersion})
        if (codes.length === num) embeds.push(embed);
        //
      }
      else {
        embeds.push(embed)
        embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setFooter({ text: checkerVersion})
        if (codes.length === num) embeds.push(embed);
      }
      embed.addFields({
        name: num+". ||discord.gift/"+codes[i].code+"||", 
        value: emoji+' **'+state+'**\n'+(!expire ? '`Expired`' : codes[i].typeEmoji+' Expires in `'+expire+' hours`')+expireUnix+'\n'+user+'\u200b',
        inline: true,
      })
      ////
      if (addStocks && codes[i].state === 'Claimable') {
        let stocks = null
        if (type === 'Nitro') {
          stat.put.boost++
          stat.put.boostString += "\ndiscord.gift/"+codes[i].code
          stocks = await getChannel(shop.channels.boostStocks)
        } 
        else {
          stat.put.basic++
          stat.put.basicString += "\ndiscord.gift/"+codes[i].code
          stocks = await getChannel(shop.channels.basicStocks)
        }
        await stocks.send('discord.gift/'+codes[i].code)
      } else {
        stat.notput.count++
        stat.notput.string += "\ndiscord.gift/"+codes[i].code
      }
    }
    msg.delete();
    console.log(embeds.length)
    let page = 0
    if (embeds.length > 0 ) {
      for (let i in embeds) {
        page++
        await message.channel.send({content: 'Page '+page+'/'+embeds.length, embeds: [embeds[i]]})
      }
    } 
    else {
      message.channel.send({embeds: [embed]})
    }
    if (addStocks) {
      let newEmbed = new MessageEmbed();
      newEmbed.addFields(
        { name: 'Stocked NBoost', value: stat.put.boost > 20 ? stat.put.boost.toString() : stat.put.boost >= 1 ? '|| '+stat.put.boostString.replace('\n','')+' ||' : 'None' },
        { name: 'Stocked NBasic', value: stat.put.basic > 20 ? stat.put.basic.toString() : stat.put.basic >= 1 ? '|| '+stat.put.basicString.replace('\n','')+' ||' : 'None' },
        { name: 'Not Stocked', value: stat.notput.count > 20 ? stat.notput.count.toString() : stat.notput.count >= 1 ? '|| '+stat.notput.string.replace('\n','')+' ||' : 'None' },
      )
      newEmbed.setColor(colors.yellow)
      message.channel.send({embeds: [newEmbed]})
    }
    shop.checkers = []
    !message.channel.type === 'DM' ? message.delete() : null
  }
  //
  else if (isCommand('sticky',message)) {
    if (!await getPerms(message.member,4)) return message.reply({content: emojis.warning+' Insufficient Permission'});
      let args = await requireArgs(message,1)
      let sticky = await stickyModel.findOne({channelId: message.channel.id})
      if (sticky) return message.reply(emojis.warning+" You can only set 1 sticky per channel.")
      let doc = new stickyModel(stickySchema)
      doc.channelId = message.channel.id
      doc.message = message.content.replace(args[0]+" ",'')
      await doc.save();
      await message.react(emojis.check)
  }
  else if (isCommand('unsticky',message)) {
    if (!await getPerms(message.member,4)) return message.reply({content: emojis.warning+' Insufficient Permission'});
    let sticky = await stickyModel.findOne({channelId: message.channel.id})
    if (sticky) {
      await stickyModel.deleteOne({channelId: message.channel.id})
      message.reply(emojis.check+" I removed the sticky on this channel.")
    } else {
      message.reply(emojis.x+" This channel has no sticky :c")
    }
  }
  //
  let ar = shop.ar.responders.find(r => message.content.toLowerCase().startsWith(r.trigger))
  if (ar) {
    if (ar.autoDelete) message.delete();
    let content = null
    let embeds = []
    let row = []
    let template = await getChannel(shop.channels.templates)
    if (ar.content.length > 0) {
      let msg = await template.messages.fetch(ar.content)
      content = msg.content
    }
    if (ar.embed) {
      let msg = await template.messages.fetch(ar.embed.id)
      let embed = new MessageEmbed()
      .setColor(ar.embed.color)
        .setDescription(msg.content)
      embeds = [embed]
    }
    if (ar.row) {
      row = [ar.row]
    }
    message.channel.send({content: content, embeds: embeds,components: row})
  }
  // Calcu cmd
  if ((message.content.toLowerCase().startsWith('calcu') && !message.content.toLowerCase().includes('process'))) {
    let expression = message.content.toLowerCase().replace('calcu','')
    if (/[a-zA-Z]/.test(expression)) {
      //
    } else {
      try {
        let total = eval(expression)
        message.reply(total.toString())
      } catch (err) { }
    }
  }
  
  //Sticky
  let sticky = stickyModel ? await stickyModel.findOne({channelId: message.channel.id}) : null
  if (sticky) {
    let messages = await message.channel.messages.fetch({ limit: 10 }).then(messages => {
      messages.forEach(async (gotMsg) => {
        console.log(gotMsg.content,sticky.message)
        if (gotMsg.author.id === client.user.id && gotMsg.content === sticky.message) {
          await gotMsg.delete();
          //
        }
      })
    });
    await message.channel.send({content: sticky.message})
  }
}); //END MESSAGE CREATE

let yay = true
let cStocks = 0
let tStocks = 0

client.on("interactionCreate", async (inter) => {
  if (inter.isCommand()) {
    let cname = inter.commandName
    //Nitro dropper
    if (cname === 'drop') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
      if (!yay) return inter.reply({content: emojis.warning+" The bot is currently busy deleting stocks ("+cStocks+"/"+tStocks+")", ephemeral: true})
      await inter.deferReply();
      //
      let user = options.find(a => a.name === 'user')
      let quan = options.find(a => a.name === 'quantity')
      let item = options.find(a => a.name === 'item')
      //Send prompt
      try {
        //Get stocks
        let stocks = item.value === 'nitro boost' ? await getChannel(shop.channels.boostStocks) : item.value === 'nitro basic' ? await getChannel(shop.channels.basicStocks) : null
        let links = ""
        let index = ""
        let msgs = []
        let messages = await stocks.messages.fetch({limit: quan.value}).then(async messages => {
          await messages.forEach(async (gotMsg) => {
            index++
            links += "\n"+index+". "+gotMsg.content
            msgs.push(gotMsg)
          })
        })
        //Returns
        if (links === "") return inter.editReply({content: emojis.x+" No stocks left.", ephemeral: true})
        if (quan.value > index) return inter.editReply({content: emojis.warning+" Insufficient stocks. **"+index+"** "+item.value+'(s)'+" remaining.", ephemeral: true})
        yay = false
        tStocks = quan.value
        //delete messages
        for (let i in msgs) {
          await msgs[i].delete().then(msg => {
            ++cStocks
            console.log(cStocks)
            if (cStocks == tStocks) {
              cStocks = 0
              yay = true
            }
          });
        }
        await addRole(await getMember(user.user.id,inter.guild),["Buyer","Pending"],inter.guild)
        //Send prompt
        let drops = await getChannel(shop.channels.drops)
        let dropMsg
        await drops.send({content: links}).then(msg => dropMsg = msg)
        //
        let row = new MessageActionRow().addComponents(
          new MessageButton().setCustomId("drop-"+dropMsg.id).setStyle('SECONDARY').setEmoji('📩').setLabel("Drop"),
          new MessageButton().setCustomId("showDrop-"+dropMsg.id).setStyle('SECONDARY').setEmoji('📋'),
        );
        await inter.editReply({content: "<@"+user.user.id+"> Sending **"+quan.value+"** "+item.value+"(s)\n• Make sure to open your DMs.\n• The message may appear as **direct or request** message.", components: [row]})
        //
      } catch (err) {
        console.log(err)
        await inter.editReply({content: emojis.warning+' Unexpected Error Occurred\n```diff\n- '+err+'```'})
      }
    }
    //Queue
    else if (cname === 'queue') {
      if (!await getPerms(inter.member,4)) return inter.reply({ content: emojis.warning+" Insufficient Permission"});
      let options = inter.options._hoistedOptions
      //
      let user = options.find(a => a.name === 'user')
      let product = options.find(a => a.name === 'item')
      let quan = options.find(a => a.name === 'quantity')
      let mop = options.find(a => a.name === 'mop')
      //let price = options.find(a => a.name === 'price')
      //
      inter.deferReply();
      try {
        let orders = await getChannel(shop.channels.orders)
        let template = await getChannel(shop.channels.templates)
        let msg = await template.messages.fetch(shop.qMessage)
        let status = 'PENDING'
        let content = msg.content
        content = content
          .replace('{user}','<@'+user.user.id+'>')
          .replace('{quan}',quan.value.toString())
          .replace('{product}',product.value)
          .replace('{mop}',mop ? mop.value : 'gcash')
          .replace('{ticket}',inter.channel.toString()+' ('+inter.channel.name+')')
          .replace('{status}',status)
          .replace('{stamp}','<t:'+getTime(new Date().getTime())+':R>')
        
        let row = JSON.parse(JSON.stringify(shop.orderStatus));
        let msgUrl
        let member = await getMember(user.user.id,inter.guild)
        
        await orders.send({content: content, components: [row]}).then(msg => msgUrl = msg.url)
        
        let linkRow = new MessageActionRow().addComponents(
          new MessageButton().setURL(msgUrl).setStyle('LINK').setEmoji('<a:PinkLoading:1304377633479462983>').setLabel("view order"),
        );
        
        await inter.editReply({content: 'you order was placed ( '+orders.toString()+' )', components: [linkRow]})
      } catch (err) {
        console.log(err)
        await inter.editReply({content: emojis.warning+' Unexpected Error Occurred\n```diff\n- '+err+'```'})
      }
    }
    //Stocks
    else if (cname === 'stocks') {
      let stockTemplates = await getChannel(shop.channels.otherStocks);
      let strong = ''
      let stockHolder = [[],[],[],[],[],[],[],[],[],[]];
      let holderCount = 0
      let arrays = []
      
      let msgSize = 0
      let totalMsg = 0
      
      let data = {
        nitroBoost: 0,
        nitroBasic: 0,
        completed: 0,
        f: {
          last_id: null,
          msgSize: 0,
          totalMsg: 0,
        }
      }
      
      await inter.deferReply()
      
      while (true) {
        const options = { limit: 100 };
        if (data.f.last_id) options.before = data.f.last_id;
        
        //
        let stocks = null
        if (data.completed === 0) stocks = await getChannel(shop.channels.boostStocks)
        else stocks = await getChannel(shop.channels.basicStocks)
        //Put to storage
        await stocks.messages.fetch(options).then(async messages => {
          data.f.last_id = messages.last()?.id;
          totalMsg += messages.size
          msgSize = messages.size
          await messages.forEach(async (gotMsg) => {
            console.log(gotMsg.content+' - '+data.completed)
            data.completed === 0 ? data.nitroBoost++ : data.nitroBasic++
            strong += gotMsg.content+'\n'
          })
        });
        
        if (msgSize != 100) {
          if (data.completed === 0) data.completed++
          else {
            await stockTemplates.messages.fetch({ limit: 100 })
              .then(async (messages) => {
              messages.forEach(async (gotMsg) => { arrays.push(gotMsg.content) }); 
            });
            stockHolder[0].push(new MessageButton().setCustomId('none').setStyle('SECONDARY').setLabel('Nitro Boost ('+data.nitroBoost+')').setEmoji(emojis.nboost))
            stockHolder[0].push(new MessageButton().setCustomId('none2').setStyle('SECONDARY').setLabel('Nitro Basic ('+data.nitroBasic+')').setEmoji(emojis.nbasic))
            //Loop
            for (let i in arrays) {
              let msg = arrays[i];
              if (arrays.length > 0) {
                let args = await getArgs(msg);
                let text = args[0].includes(':') ? args.slice(1).join(" ") : msg
                let emoji = args[0].includes(':') ? args[0] : null
                if (stockHolder[holderCount].length === 5) holderCount++
                stockHolder[holderCount].push(new MessageButton().setCustomId("none"+getRandom(1,10000)).setStyle("SECONDARY").setLabel(text).setEmoji(args[0].includes(':') ? args[0] : null));
              }
            }
            //Handle display
            let comps = []
            for (let i in stockHolder) {
              if (stockHolder[i].length !== 0) {
                let row = new MessageActionRow();
                row.components = stockHolder[i];
                comps.push(row)
              }
            }
            console.log(strong)
            await inter.editReply({components: comps})
            break;
          }
        }
      }
    }
    //
    else if (cname === 'calculate') {
      let options = inter.options._hoistedOptions
      //
      let input = options.find(a => a.name === 'input')
      
      if (/[a-zA-Z]/.test(input.value) && !input.value.toLowerCase().includes('process')) {
      await inter.reply({content: emojis.warning+" Invalid math equation"})
      } else {
        try {
          let total = eval(input.value)
          await inter.reply({content: total.toString()})
        } catch (err) { }
      }
    }
    //
    else if (cname === 'embed') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
      let embedId = options.find(a => a.name === 'id')
      let title = options.find(a => a.name === 'title')
      let description = options.find(a => a.name === 'description')
      let color = options.find(a => a.name === 'color')
      
      let thumbnail = options.find(a => a.name === 'thumbnail')
      let image = options.find(a => a.name === 'image')
      let footer = options.find(a => a.name === 'footer')
      
      const embedData = await embedModel.findOne({id: embedId.value.toLowerCase()});
      if (embedData) return inter.reply({content: emojis.warning+" This ID is already in use!", ephemeral: true})
      let embed = new MessageEmbed()
      .setDescription(description.value)
      
      if (color) embed.setColor(color.value);
      else embed.setColor(colors.none);
      
      if (title) embed.setTitle(title.value);
      if (thumbnail) embed.setThumbnail(thumbnail.value);
      if (image) embed.setImage(image.value);
      if (footer) embed.setFooter(footer.value);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('edit_title')
                    .setLabel('Edit Title')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('edit_description')
                    .setLabel('Edit Description')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('edit_color')
                    .setLabel('Edit Color')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('edit_thumbnail')
                    .setLabel('Edit Thumbnail')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('edit_image')
                    .setLabel('Edit Image')
                    .setStyle('SECONDARY')
            );

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('edit_footer')
                    .setLabel('Edit Footer')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('add_field')
                    .setLabel('Add Field')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('save_embed')
                    .setLabel('Save Embed')
                    .setStyle('SUCCESS')
            );
      
      await inter.reply({content: emojis.loading+" Generating embed", ephemeral: true})
      let msg
      await inter.channel.send({ embeds: [embed], components: [row, row2] }).then(message => { msg = message});
      const filter = i => i.user.id === inter.user.id;
      const collector = inter.channel.createMessageComponentCollector({ filter, time: 900000 });
      
      collector.on('collect', async i => {
        if (i.customId === 'save_embed') {  
          console.log(embed)
          let newEmbed = new embedModel({
                id: embedId.value.toLowerCase(),
                title: embed.title ? embed.title : null,
                description: embed.description,
                color: embed.color ? embed.color.toString(16).padStart(6, '0') : null,
                thumbnail: embed.thumbnail ? embed.thumbnail.url : null,
                image: embed.image ? embed.image.url : null,
                footer: embed.footer ? embed.footer.text : null,
                fields: embed.fields
              });
          await newEmbed.save();
          await i.message.edit({ content: emojis.check+" Embed saved.\nYou can display this embed by running `/display_embed id:"+embedId.value+"`", components: [] });
          collector.stop();
          return;
        }
        msg = i.message
        const editEmbed = async (property, value) => {
                switch (property) {
                    case 'title':
                        embed.setTitle(value);
                        break;
                    case 'description':
                        embed.setDescription(value);
                        break;
                    case 'color':
                        embed.setColor(value);
                        break;
                    case 'thumbnail':
                        embed.setThumbnail(value);
                        break;
                    case 'image':
                        embed.setImage(value);
                        break;
                    case 'footer':
                        embed.setFooter(value);
                        break;
                }
                await i.message.edit({ embeds: [embed] });
              
            };
        
        if (i.customId.startsWith('edit_')) {
          const property = i.customId.split('_')[1];
          await i.reply({ content: `Please provide a new ${property}:`, ephemeral: true });

          const messageFilter = response => response.author.id === inter.user.id;
          const collected = await inter.channel.awaitMessages({ filter: messageFilter, max: 1, time: 30000 });
            
          if (collected.size > 0) {
            const newValue = collected.first().content;
            await editEmbed(property, newValue);
            await collected.first().delete()
          } else {
            await i.followUp({ content: 'You did not provide a new value in time.', ephemeral: true });
          }
        } else if (i.customId === 'add_field') {
          await i.reply({ content: 'Please provide the field name and value separated by a comma (e.g., "Name, Value"):', ephemeral: true });

          const messageFilter = response => response.author.id === inter.user.id;
          const collected = await inter.channel.awaitMessages({ filter: messageFilter, max: 1, time: 30000 });
              
          if (collected.size > 0) {
            const fieldValue = collected.first().content.split(',');
            if (fieldValue.length === 2) {
              embed.addField(fieldValue[0].trim(), fieldValue[1].trim());
              await i.message.edit({ embeds: [embed] });
              await collected.first().delete()
            } else {
              await i.followUp({ content: 'Invalid format. Please provide the field name and value separated by a comma.', ephemeral: true });
            }
          } else {
            await i.followUp({ content: 'You did not provide a field in time.', ephemeral: true });
          }
        }
      });

        collector.on('end', async collected => {
          let row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId("yay").setStyle('SECONDARY').setLabel("Interaction ended").setDisabled(true),
          );
          await msg.edit({ components: [row] })
          console.log(`Collected ${collected.size} interactions.`);
        });
    }
    else if (cname === 'display_embed') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
        const embedId = options.find(a => a.name === 'id')
        const embedData = await embedModel.findOne({id: embedId.value.toLowerCase()});

        if (embedData) {
          let embed = new MessageEmbed()
          .setDescription(embedData.description)
          console.log(embedData.color)
          if (embedData.color) embed.setColor(embedData.color);
          else embed.setColor(colors.none);
          
          if (embedData.title) embed.setTitle(embedData.title);
          if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail);
          if (embedData.image) embed.setImage(embedData.image);
          if (embedData.footer) embed.setFooter(embedData.footer);
          if (embedData.fields && embedData.fields.length > 0) {
            embedData.fields.forEach(field => embed.addField(field.name, field.value));
          }
          await inter.reply({ content: emojis.loading+" Sending embed...", ephemeral: true });
          await inter.channel.send({ embeds: [embed] });
        } else {
          await inter.reply({ content: 'Embed not found.', ephemeral: true });
        }
    }
    else if (cname === 'delete_embed') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
        const embedId = options.find(a => a.name === 'id')
        const embedData = await embedModel.findOne({id: embedId.value.toLowerCase()});

        if (embedData) {
          await embedModel.deleteOne({id: embedId.value})
          await inter.reply({content: emojis.check+" I deleted a saved embed with the ID: `"+embedId.value+"`"})
        } else {
          await inter.reply({ content: 'Embed not found.', ephemeral: true });
        }
    }
    else if (cname === 'show_embeds') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
        const embedData = await embedModel.find()
        
        if (embedData) {
          let list = ""
          let count = 0
          for (let i in embedData) {
            let doc = embedData[i]
            count++
            list += count+'. '+doc.id+'\n'
          }
          
          let embed = new MessageEmbed()
          .addFields(
            {name: "Saved Embed IDs", value: list},
            {name: "Configuration", value: "> `/display_embed [ID]` to display an embed\n> `/delete_embed [ID]` to remove an embed"}
          )
          .setColor(theme)
          
          await inter.reply({embeds: [embed]})
        } else {
          await inter.reply({ content: 'No embed found.', ephemeral: true });
        }
    }
    //// regen
    if (cname === 'regen') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
      let account = options.find(a => a.name === 'account')
      let links = options.find(a => a.name === 'links')
      let args = await getArgs(links.value)
      await inter.deferReply();
      let codes = []
      for (let i in args) {
        if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
          let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g, '').replace(/ /g, '').replace(/[^\w\s]/gi, '').replace(/\\n|\|'|"/g, '')
          let found = codes.find(c => c === code)
          !found ? codes.push({ code: code, status: emojis.warning }) : null
          }
      }
      
      if (codes.length == 0) return inter.editReply(emojis.warning + " No codes found.")
      
      try {
        let deleteMsg
        await inter.editReply("-# "+emojis.loading + " Validating **" + codes.length + "** codes")
        // Get billing
        let data = []
        let invalidString = ""
        let invalidCount = 0
        let otherAccString = ""
        let otherAccCount = 0
        let validatedCodes = []
        let otherAcc = []
        let revokedCount = 0
        let links = [
          { name: "nitro", codes: [], billings: [] },
          { name: "nitro-basic", codes: [], billings: [] }
        ]
        // Validate codes
        for (let i in codes) {
          let code = codes[i].code
          let retry = true;

          while (retry) {
            // Check if link is claimed
            let codeStatus = await fetch('https://discord.com/api/v10/entitlements/gift-codes/' + code, { method: 'GET', headers: { 'authorization': 'Bot '+process.env.SECRET, 'Content-Type': 'application/json' } })
            codeStatus = await codeStatus.json();
            // Return if claimed
            if ((!codeStatus.retry_after && codeStatus.uses == 1) || (codeStatus.message == 'Unknown Gift Code')) {
              invalidString += "` ["+code+"] `\n"
              invalidCount++
              retry = false
              continue
            }
            // Retry if rate limited
            else if (codeStatus.retry_after) {
              console.log('retry for '+codes[i].code)
              let ret = Math.ceil(codeStatus.retry_after)
              ret = ret.toString()+"000"
              let waitingTime = Number(ret) < 300000 ? Number(ret) : 60000
              await sleep(waitingTime)
              continue
            }
            // If link is on other account
            else if (codeStatus.user.username.toLowerCase().replace(/\./g,'') !== account.value) {
              otherAccCount++
              let foundAcc = otherAcc.find(d => d.name == codeStatus.user.username)
              if (foundAcc) {
                foundAcc.string += otherAccCount+". discord.gift/"+code+"\n"
              } else {
                otherAcc.push({name: codeStatus.user.username,string: "\n`"+codeStatus.user.username+"`\n"+otherAccCount+". discord.gift/"+code+"\n"}) 
              }
              retry = false
              continue
            }
            
            let slug = codeStatus.store_listing.sku.slug
            let storage = links.find(l => l.name == slug)
            if (!storage) return inter.channel.send(emojis.warning+" Invalid storage: "+slug)
            storage.codes.push(codes[i])
            //
            if (!storage.billings.find(d => d.id == codeStatus.sku_id)) {
              storage.billings.push({ id: codeStatus.sku_id, subscription: codeStatus.subscription_plan_id })
            }
            validatedCodes.push(codes[i])
            retry = false
          }
          //await sleep(1000) // Sleep for 1 second between each request to avoid rate limits
        }
        // Revoke links
        for (let i in links) {
          let storage = links[i]
          if (storage.codes.length > 0) {
            let revokeMsg
            await inter.channel.send(emojis.loading+" Revoking **"+storage.codes.length+"** "+storage.name+" giftcodes.").then(msg => revokeMsg = msg)
          
            let revoked = await revokeLinks(storage.codes,account.value)
            if (revoked.error) return inter.channel.send(revoked.error)
            revokedCount += revoked.count
            await revokeMsg.delete();
            await safeSend(inter.channel,revoked.message+"\n"+(codes.length == validatedCodes.length ? "" : "` ["+(invalidCount)+"] ` Invalid/Claimed Links\n"+invalidString+"** **"))
            
            if (revokedCount == 0) return;
            // Create links
            let createMsg
            await inter.channel.send(emojis.loading + "` [" + revoked.count + "] ` Generating New Codes ("+storage.name+")").then(msg => createMsg = msg)
            let generated = await generateLinks({ amount: revoked.count, sku: storage.billings, account: account.value, type: storage.name})
          
            if (generated.error) return createMsg.reply(generated.error)
            await createMsg.delete()
            await safeSend(inter.channel,generated.message)
          }
        }
      
        if (revokedCount == 0) {
          await safeSend(inter.channel,"` ["+(invalidCount)+"] ` Invalid/Claimed Links\n"+invalidString+"** **")
        }
        // Links in other accounts
        if (otherAccCount > 0) {
          let string = ""
          for (let i in otherAcc) {
            string += otherAcc[i].string
          }
          await safeSend(inter.channel,"` ["+otherAccCount+"] ` Links in other account\n"+string)
        }
      } catch (err) {
        console.log(err)
        inter.channel.send(emojis.warning + " An unexpected error occured.\n```diff\n- " + err + "```")
      }
    }
    // revoke
    else if (cname === 'revoke') {
      if (inter.user.id == "497918770187075595") {}
      else if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
      let account = options.find(a => a.name === 'account')
      let links = options.find(a => a.name === 'links')
      let args = await getArgs(links.value)
      await inter.deferReply();
      let codes = []
      for (let i in args) {
        if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
          let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g, '').replace(/ /g, '').replace(/[^\w\s]/gi, '').replace(/\\n|\|'|"/g, '')
          let found = codes.find(c => c === code)
          !found ? codes.push({ code: code, status: emojis.warning }) : null
          }
      }
      
      if (codes.length == 0) return inter.editReply(emojis.warning + " No codes found.")
      
      try {
        let deleteMsg
        await inter.editReply("-# "+emojis.loading + " Validating **" + codes.length + "** codes")
        // Get billing
        let data = []
        let invalidString = ""
        let invalidCount = 0
        let otherAccString = ""
        let otherAccCount = 0
        let validatedCodes = []
        let otherAcc = []
        let revokedCount = 0
        let links = [
          { name: "nitro", codes: [], billings: [] },
          { name: "nitro-yearly", codes: [], billings: [] },
          { name: "nitro-basic", codes: [], billings: [] }
        ]
        // Validate codes
        for (let i in codes) {
          let code = codes[i].code
          let retry = true;

          while (retry) {
            // Check if link is claimed
            let codeStatus = await fetch('https://discord.com/api/v10/entitlements/gift-codes/' + code, { method: 'GET', headers: { 'authorization': 'Bot '+process.env.SECRET, 'Content-Type': 'application/json' } })
            codeStatus = await codeStatus.json();
            // Return if claimed
            if ((!codeStatus.retry_after && codeStatus.uses == 1) || (codeStatus.message == 'Unknown Gift Code')) {
              invalidString += "` ["+code+"] `\n"
              invalidCount++
              retry = false
              continue
            }
            // Retry if rate limited
            else if (codeStatus.retry_after) {
              console.log('retry for '+codes[i].code)
              let ret = Math.ceil(codeStatus.retry_after)
              ret = ret.toString()+"000"
              let waitingTime = Number(ret) < 300000 ? Number(ret) : 60000
              await sleep(waitingTime)
              continue
            }
            // If link is on other account
            else if (codeStatus.user.username.toLowerCase().replace(/\./g,'') !== account.value) {
              otherAccCount++
              let foundAcc = otherAcc.find(d => d.name == codeStatus.user.username)
              if (foundAcc) {
                foundAcc.string += otherAccCount+". discord.gift/"+code+"\n"
              } else {
                otherAcc.push({name: codeStatus.user.username,string: "\n`"+codeStatus.user.username+"`\n"+otherAccCount+". discord.gift/"+code+"\n"}) 
              }
              retry = false
              continue
            }
            
            let slug = codeStatus.store_listing.sku.slug
            let storage = links.find(l => l.name == slug)
            if (!storage) return inter.channel.send(emojis.warning+" Invalid storage: "+slug)
            storage.codes.push(codes[i])
            //
            if (!storage.billings.find(d => d.id == codeStatus.sku_id)) {
              storage.billings.push({ id: codeStatus.sku_id, subscription: codeStatus.subscription_plan_id })
            }
            validatedCodes.push(codes[i])
            retry = false
          }
        }
        // Revoke links
        for (let i in links) {
          let storage = links[i]
          if (storage.codes.length > 0) {
            let revokeMsg
            await inter.channel.send(emojis.loading+" Revoking **"+storage.codes.length+"** "+storage.name+" giftcodes.").then(msg => revokeMsg = msg)
          
            let revoked = await revokeLinks(storage.codes,account.value)
            if (revoked.error) return inter.channel.send(revoked.error)
            revokedCount += revoked.count
            await revokeMsg.delete();
            await safeSend(inter.channel,revoked.message+"\n"+(codes.length == validatedCodes.length ? "" : "` ["+(invalidCount)+"] ` Invalid/Claimed Links\n"+invalidString+"** **"))
            
            if (revokedCount == 0) return;
          }
        }
      
        if (revokedCount == 0) {
          await safeSend(inter.channel,"` ["+(invalidCount)+"] ` Invalid/Claimed Links\n"+invalidString+"** **")
        }
        // Links in other accounts
        if (otherAccCount > 0) {
          let string = ""
          for (let i in otherAcc) {
            string += otherAcc[i].string
          }
          await safeSend(inter.channel,"` ["+otherAccCount+"] ` Links in other account\n"+string)
        }
      } catch (err) {
        console.log(err)
        inter.channel.send(emojis.warning + " An unexpected error occured.\n```diff\n- " + err + "```")
      }
    }
    else if (cname === 'generate') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
      let account = options.find(a => a.name === 'account')
      let amount = options.find(a => a.name === 'amount')
      let type = options.find(a => a.name === 'type')
      await inter.reply({content: "-# "+emojis.loading+" Generating **"+amount.value+"** "+type.value+"(s)"})
      
      let data = await generateLinks({ amount: amount.value, sku: null, account: account.value, type: type.value})
      if (data.error) return inter.channel.send(data.error)
      await safeSend(inter.channel,data.message)
    }
    else if (cname === 'codes') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission'});
      let options = inter.options._hoistedOptions
      let account = options.find(a => a.name === 'account')
      let limit = options.find(a => a.name === 'limit')
      let exclude = options.find(a => a.name === 'exclude')
      let type = options.find(a => a.name === 'type')
      if (!limit) limit = { value: "all" }
      await inter.reply({content: "-# "+emojis.loading+" Getting **"+limit.value+"** claimable "+(type ? type.value+"(s)" : "gift")+" codes in "+account.value})
      
      let excludeCodes = []
      if (exclude) {
        let args = await getArgs(exclude.value)
        for (let i in args) {
          if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
            let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g, '').replace(/ /g, '').replace(/[^\w\s]/gi, '').replace(/\\n|\|'|"/g, '')
            let found = excludeCodes.find(c => c === code)
            !found ? excludeCodes.push({ code: code, status: emojis.warning }) : null
          }
        }
      }
      let data = await fetchLinks({ limit: limit && limit.value == "all" ? 1000 : limit.value, exclude: excludeCodes, account: account.value, type: !type ? "all" : type.value})
      if (data.error) return inter.channel.send(data.error)
      await safeSend(inter.channel,data.message)
    }
  }
  else if (inter.isButton() || inter.isSelectMenu()) {
    let id = inter.customId;
    if (id.startsWith('drop-')) {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission', ephemeral: true});
      let msgId = id.replace('drop-','')
      let drops = await getChannel(shop.channels.drops)
      let dropMsg = await drops.messages.fetch(msgId)
      let member = inter.message.mentions.members.first()
      if (!member) return inter.reply(emojis.x+" Invalid User")
      let template = await getChannel(shop.channels.templates)
      
      let msg = await template.messages.fetch(shop.dmMessage)
      let error = false;
      let copy = new MessageActionRow().addComponents(
          new MessageButton().setCustomId('copyLinks').setStyle('SECONDARY').setLabel('Copy Links')//.setEmoji("<:ting:1105094214544523314>"),
        );
      let code = makeCode(10)
      let refCode = shop.refCode ? "Ref code: `"+code+"`\n" : ''
      let content = msg.content.replace('{server_name}',inter.guild.name).replace('{links}',refCode+'||'+dropMsg.content+" ||")
      let embed = new MessageEmbed()
      .setDescription(content)
      .setColor('#ffb9ca')
      .setImage('https://media.discordapp.net/attachments/1106611226525585582/1107544991766691903/Untitled702_20210830023853.png')
      
      await member.send({content: msg.content.replace('{server_name}',inter.guild.name)+"\n\n"+refCode+"||"+dropMsg.content+" ||", components: [copy]}).catch((err) => {
        error = true
        console.log(err)
        inter.reply({content: emojis.x+" Failed to process delivery.\n\n```diff\n- "+err+"```", ephemeral: true})})
        .then(async (msg) => {
        if (error) return;
        let row = new MessageActionRow().addComponents(
          new MessageButton().setCustomId('sent').setStyle('SUCCESS').setLabel('Sent to '+member.user.tag).setDisabled(true),
        );
        if (shop.refCode) {
          row = new MessageActionRow(row).addComponents(
          new MessageButton().setCustomId('code').setStyle('SECONDARY').setLabel(code).setDisabled(true),
          )
        }
        await inter.update({components: [row]})
        dropMsg.edit({content: (shop.refCode ? code+'\n' : '')+dropMsg.content, components: [row]})
      })
    }
    else if (id === 'orderStatus') {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission', ephemeral: true});
      
      let stat = ['noted','processing','completed','cancelled']
      let found = stat.find(s => s === inter.values[0])
      if (!found) return inter.reply({content: emojis.warning+' Invalid order status: `'+inter.values[0]+'`', ephemeral: true})
      //if (inter)
      let args = await getArgs(inter.message.content)
      let a = args[args.length-3]
      let b = args[args.length-1]
      let content = inter.message.content.replace(/PENDING|NOTED|PROCESSING|COMPLETED|CANCELLED/g,found.toUpperCase()).replace(b,'<t:'+getTime(new Date().getTime())+':R>')
      
      let row = JSON.parse(JSON.stringify(shop.orderStatus));
      found === 'completed' || found === 'cancelled' ? row.components[0].disabled = true : null
      
      await inter.update({content: content, components: [row]})
    }
    else if (id.startsWith('returnLinks-')) {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission', ephemeral: true});
      let msgId = id.replace('returnLinks-','')
      
      await inter.reply({content: 'Returning links. Please wait..\n'+emojis.warning+' Please do not drop/add any stocks while the links are being returned. ', ephemeral: true})
      await inter.message.edit({components: []})
      let drops = await getChannel(shop.channels.drops)
      let dropMsg = await drops.messages.fetch(msgId)
      
      let content = dropMsg.content
      let stocks = await getChannel(shop.channels.stocks)
      let args = await getArgs(content)
      let returned = 0
      let msgReturn = false
      
      dropMsg.edit({content: 'Returned\n'+content, components: []})
      
      for (let i = args.length - 1; i >= 0; i--) {
        if (args[i].includes('https://discord.gift/')) {
          await stocks.send(args[i])
          returned++
        }
      }
      if (returned === 0) {
        msgReturn = true
        await stocks.send(content)
      }
      inter.update({components: []})
      msgReturn ? inter.message.reply({content: emojis.check+' Returned the whole message to stocks.'}) : inter.message.reply({content: emojis.check+' Returned '+returned+' links to stocks.'})
    }
    else if (id.startsWith('showDrop-')) {
      if (!await getPerms(inter.member,4)) return inter.reply({content: emojis.warning+' Insufficient Permission', ephemeral: true});
      let msgId = id.replace('showDrop-','')
      let drops = await getChannel(shop.channels.drops)
      let dropMsg = await drops.messages.fetch(msgId)
      
      let content = dropMsg.content
      inter.reply({content: content, ephemeral: true})
    }
    else if (id.startsWith("reply-")) {
      let reply = id.replace("reply-", "");
      inter.reply({ content: "*" + reply + "*", ephemeral: true });
    } 
    else if (id.startsWith("none")) {
      inter.deferUpdate();
    }
    else if (id.startsWith('copyLinks')) {
      
      let content = inter.message.content
      let args = await getArgs(content)
      let count = 0
      let string = ''
      for (let i in args) {
        if (args[i].includes('discord.gift')) {
          count++;
          string += count+'. '+args[i]+'\n'
        }
      }
      if (count === 0) inter.reply({content: emojis.x+' No links found.', ephemeral: true})
      else inter.reply({content: string, ephemeral: true}) 
    }
    else if (id.startsWith('breakChecker-')) {
      let user = id.replace('breakChecker-','')
      shop.breakChecker = true
      inter.reply({content: emojis.loading+" Stopping... Please wait", ephemeral: true})
      inter.message.edit({components: []})
    }
    else if (id.startsWith('checkerStatus-')) {
      let userId = id.replace('checkerStatus-','')
      let data = shop.checkers.find(c => c.id == userId)
      if (data) {
        let embed = new MessageEmbed()
        .setColor(colors.none)
        .addFields({
          name: 'Checker Status',
          value: 'Total Checked: **'+data.total+'**\nClaimable: **'+data.valid+'**\nClaimed: **'+data.claimed+'**\nInvalid: **'+data.invalid+'**'
        })
        inter.reply({embeds: [embed], ephemeral: true})
      } else {
        inter.reply({content: 'No data was found'})
      }
    }
  }
});
process.on('unhandledRejection', async error => {
  ++errors
  console.log(error);
  let caller_line = error.stack.split("\n");
  let index = await caller_line.find(b => b.includes('/app'))
  let embed = new MessageEmbed()
  .addFields(
    {name: 'Caller Line', value: '```'+(index ? index : 'Unknown')+'```', inline: true},
    {name: 'Error Code', value: '```css\n[ '+error.code+' ]```', inline: true},
    {name: 'Error', value: '```diff\n- '+(error.stack >= 1024 ? error.stack.slice(0, 1023) : error.stack)+'```'},
  )
  .setColor(colors.red)
  
  try {
    let channel = await getChannel(shop.channels.output)
    channel ? channel.send({embeds: [embed]}).catch(error => error) : null
  } catch (err) {
    console.log(err)
  }
});

let ready = true;
const interval = setInterval(async function() {
  //Get time
  let date = new Date().toLocaleString("en-US", { timeZone: 'Asia/Shanghai' });
  let today = new Date(date);
  let hours = (today.getHours() % 12) || 12;
  let state = today.getHours() >= 12 ? 'PM' : 'AM';
  let day = today.getDay();
  let time = hours +":"+today.getMinutes()+state;
  //Get info
  if (ready) {
    ready = false
    if (!ready) {
      setTimeout(function() {
        ready = true;
      },60000)
    }
    let template = await getChannel(shop.channels.templates)
    let guild = await getGuild(shop.guild)
    let channel = await getChannel('1')
        
    if (time === '30:0PM') {
      let msg = await template.messages.fetch("1131863357083881522")
      channel.send({content: msg.content})
    }
  }
},5000)