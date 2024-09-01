//Glitch Project
const express = require("express");
const https = require("https");
const app = express();
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const moment = require("moment");
//Discord
const Discord = require("discord.js");
const {
  WebhookClient,
  Permissions,
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = Discord;

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
const token = process.env.SECRET;

async function startApp() {
  let promise = client.login(token);
  console.log("Starting...");
  promise.catch(function (error) {
    console.error("Discord bot login | " + error);
    process.exit(1);
  });
}
startApp();
//When bot is ready
client.on("ready", async () => {
  if (slashCmd.register) {
  let discordUrl = "https://discord.com/api/v10/applications/"+client.user.id+"/commands"
  let headers = {
    "Authorization": "Bot "+token,
    "Content-Type": 'application/json'
  }
  for (let i in slashes) {
    let json = slashes[i]
    let response = await fetch(discordUrl, {
      method: 'post',
      body: JSON.stringify(json),
      headers: headers
    });
    response = await response.json();
    //console.log(response)
  }
    for (let i in slashCmd.deleteSlashes) {
      let deleteUrl = "https://discord.com/api/v10/applications/"+client.user.id+"/commands/"+slashCmd.deleteSlashes[i]
      let deleteRes = await fetch(deleteUrl, {
        method: 'delete',
        headers: headers
      })
      //console.log(deleteRes)
    }
  }
  console.log("Successfully logged in to discord bot.");
  client.user.setPresence(shop.bot.status);
});

module.exports = {
  client: client,
  getPerms,
  noPerms,
};

let listener = app.listen(process.env.PORT, function () {
  console.log("Not that it matters but your app is listening on port " +listener.address().port);
});

//Settings
const settings = require("./storage/settings_.js");
const { prefix, shop, colors, theme, commands, permissions, emojis } = settings;
//Send Messages
const sendMsg = require("./functions/sendMessage.js");
const { safeSend, sendChannel, sendUser } = sendMsg;
//Functions
const get = require("./functions/get.js");
const { getNth, getChannel, getGuild, getUser, getMember, getRandom, getColor } = get;
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
//Links Handler
const linksHandler = require('./functions/linksHandler.js')
const { generateLinks, revokeLinks, fetchLinks} = linksHandler
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
let nitroCodes = [];
client.on("messageCreate", async (message) => {
  //
  if (message.channel.type === "DM" || message.author.bot) return;
  let checkerVersion = 'Checker version 2.8324sc'
  if (message.channel.id === shop.channels.checker) {
    let args = getArgs(message.content)
    if (args.length === 0) return;
    let addStocks = args[0].toLowerCase() === 'stocks' ? true : false
    let sortLinks = args[1]?.toLowerCase() === 'sort' && addStocks ? true : args[0]?.toLowerCase() === 'sort' ? true : false
    //if (shop.checkers.length > 0) return message.reply(emojis.warning+' Someone is currently scanning links.\nPlease use the checker one at a time to prevent rate limitation.')
    let codes = []
    let text = ''
    let msg = null
    for (let i in args) {
      if (args[i].toLowerCase().includes('discord.gift')) {
      let code = args[i].replace(/https:|discord.gift|\/|/g,'').replace(/ /g,'').replace(/\|/g,'')
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
          codes[i].expire = diffDuration ? Math.floor(diffDuration.asHours()) : null
          codes[i].emoji = res.uses === 0 ? emojis.check : res.expires_at ? emojis.x : emojis.warning
          codes[i].state = res.expires_at && res.uses === 0 ? 'Claimable' : res.expires_at ? 'Claimed' : 'Invalid'
          codes[i].user = res.user ? '`'+res.user.username+'#'+res.user.discriminator+'`' : "`Unknown User`"
          codes[i].state === 'Claimable' ? scanData.valid++ : codes[i].state === 'Claimed' ? scanData.claimed++ : scanData.invalid++
          let type = res.store_listing?.sku?.name
          let foundCode = nitroCodes.find(c => c.code === res.code)
          if (!foundCode) nitroCodes.push({code: res.code, type: type})
          foundCode ? type = foundCode.type : null
          codes[i].typeEmoji = type === 'Nitro' ? emojis.nboost : type === 'Nitro Basic' ? emojis.nbasic : type === 'Nitro Classic' ? emojis.nclassic : '❓' 
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
    .setColor(colors.none)
    let num = 0
    let stat = {
      put: { count: 0, string: ''},
      notput: { count: 0, string: ''}
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
          .setColor(colors.none)
          .setFooter({ text: checkerVersion})
        if (codes.length === num) embeds.push(embed);
      }
      embed.addFields({
        name: num+". ||https://discord.gift/"+codes[i].code+"||", 
        value: emoji+' **'+state+'**\n'+(!expire ? '`Expired`' : codes[i].typeEmoji+' Expires in `'+expire+' hours`')+expireUnix+'\n'+user+'\u200b',
        inline: true,
      })
      ////
      if (addStocks && codes[i].state === 'Claimable') {
        stat.put.count++
        stat.put.string += "\nhttps://discord.gift/"+codes[i].code
        let stocks = await getChannel(shop.channels.stocks)
        await stocks.send("https://discord.gift/"+codes[i].code)
      } else {
        stat.notput.count++
        stat.notput.string += "\nhttps://discord.gift/"+codes[i].code
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
        { name: 'Stocked Links', value: stat.put.count > 20 ? stat.put.count.toString() : stat.put.count >= 1 ? stat.put.string : 'None' },
        { name: 'Not Stocked', value: stat.notput.count > 20 ? stat.notput.count.toString() : stat.notput.count >= 1 ? stat.notput.string : 'None' },
      )
      newEmbed.setColor(stat.notput.count > 0 ? colors.red : colors.lime)
      message.channel.send({embeds: [newEmbed]})
    }
    shop.checkers = []
  }
  else if (isCommand('find',message)) { 
    if (!await getPerms(message.member,4)) return message.reply({content: emojis.warning+' Insufficient Permission'});
    let args = await requireArgs(message,1)
    if (!args) return;
    
    let drops = await getChannel(shop.channels.drops)
    await fetchKey(drops,args[1],message)
  }
  
  //
  if (message.content.startsWith('.codes')) {
    if (!await getPerms(message.member, 4)) return message.reply({ content: emojis.warning + ' Insufficient Permission' });
    let args = await getArgs(message.content)
    if (args.length < 2) return;
    let acc = process.env[args[1]]
    if (!acc) return message.reply(emojis.warning+" Invalid account keyword ` "+args[1]+" `.")
    
    await message.react(emojis.loading)
    let amount = Number(args[2])
    if (isNaN(amount)) amount = 1000//return message.reply(emojis.warning+" Invalid amount to generate ` "+args[2]+" `.")
    let codes = []
    for (let i in args) {
      if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
        let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g, '').replace(/ /g, '').replace(/[^\w\s]/gi, '').replace(/\\n|\|'|"/g, '')
        let found = codes.find(c => c === code)
        !found ? codes.push({ code: code, status: emojis.warning }) : null
        }
    }
    
    let data = await fetchLinks(codes,amount,acc)
    if (data.error) return message.reply(data.error)

    // Combine the message into one large string
    let messageContent = data.message;
    await safeSend(message.channel,messageContent)
  }
  else if (message.content.startsWith('.regen')) {
    if (!await getPerms(message.member, 4)) return message.reply({ content: emojis.warning + ' Insufficient Permission' });
    message.content = message.content.replace('.regen', '')
    let args = await getArgs(message.content)
    if (args.length === 0) return;
    let acc = process.env[args[0]]
    if (!acc) return message.reply(emojis.warning+" Invalid account keyword ` "+args[0]+" `.")
    let codes = []
    for (let i in args) {
      if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
        let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g, '').replace(/ /g, '').replace(/[^\w\s]/gi, '').replace(/\\n|\|'|"/g, '')
        let found = codes.find(c => c === code)
        !found ? codes.push({ code: code, status: emojis.warning }) : null
      }
    }
    if (codes.length == 0) return message.reply(emojis.warning + " No codes found.")
    
    try {
      let deleteMsg
      await message.channel.send(emojis.loading + " Revoking **" + codes.length + "** codes").then(msg => deleteMsg = msg)
      // Get billing
      let data = []
      let deletedString = ""
      let validatedCodes = []
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
            deletedString += "` ["+code+"] `\n"
            retry = false
            continue
          }
          // Retry if rate limited
          else if (codeStatus.retry_after) {
            console.log("Rate limited. Retrying in 3 seconds...")
            await sleep(3000);
            continue
          }
          // Push SKU details
          else if (!data.find(d => d.id == codeStatus.sku_id)) {
              data.push({ id: codeStatus.sku_id, subscription: codeStatus.subscription_plan_id })
          }
          validatedCodes.push(codes[i])
          retry = false
        }
        await sleep(1000) // Sleep for 1 second between each request to avoid rate limits
      }
      
      let revoked = await revokeLinks(validatedCodes,acc)
      if (revoked.error) return message.channel.send(revoked.error)
      await deleteMsg.delete();
      await safeSend(message.channel,revoked.message+"\n"+(codes.length == validatedCodes.length ? "** **" : "` ["+(codes.length-validatedCodes.length)+"] ` Invalid/Claimed Links\n"+deletedString+"\n** **"))
      // Handle empty data
      if (revoked.count == 0) return;
      if (data.length == 0) return message.channel.send("No stock keeping unit (SKU) was found.")
      await sleep(1000)
      
      // Generate codes
      let createMsg
      await message.channel.send(emojis.loading + "` [" + revoked.count + "] ` Generating New Codes").then(msg => createMsg = msg)
      let generated = await generateLinks(revoked.count,data,acc)
      if (generated.error) createMsg.reply(generated.error)
      await createMsg.delete()
      await safeSend(message.channel,generated.message)
      
    } catch (err) {
      message.channel.send(emojis.warning + " An unexpected error occured.\n```diff\n- " + err + "```")
    }
}
  else if (message.content.startsWith('.revoke')) {
    if (!await getPerms(message.member,4)) return message.reply({content: emojis.warning+' Insufficient Permission'});
    message.content = message.content.replace('.revoke','')
    let args = await getArgs(message.content)
    if (args.length === 0) return;
    let acc = process.env[args[0]]
    if (!acc) return message.reply(emojis.warning+" Invalid account keyword ` "+args[0]+" `.")
    
    let codes = []
    for (let i in args) {
      if (args[i].toLowerCase().includes('discord.gift') || args[i].toLowerCase().includes('discord.com/gifts')) {
      let code = args[i].replace(/https:|discord.com\/gifts|discord.gift|\/|/g,'').replace(/ /g,'').replace(/[^\w\s]/gi,'').replace(/\\n|\|'|"/g,'')
      let found = codes.find(c => c === code)
      !found ? codes.push({code: code, status: emojis.warning}) : null
      }
    }
    if (codes.length == 0) return message.reply(emojis.warning+" No codes found.")
    await message.react(emojis.loading)
    try {
      // Revoke links
      let revoked = await revokeLinks(codes,acc)
      if (revoked.error) return message.reply(revoked.error)
      await safeSend(message.channel,revoked.message)
      
    } catch (err) {
      message.reply(emojis.warning+" An unexpected error occured.\n```diff\n- "+err+"```")
    }
 }
  else if (message.content.startsWith('.generate')) {
    if (!await getPerms(message.member,4)) return message.reply({content: emojis.warning+' Insufficient Permission'});
    message.content = message.content.replace('.generate','')
    let args = await getArgs(message.content)
    if (args.length === 0) return;
    let acc = process.env[args[0]]
    if (!acc) return message.reply(emojis.warning+" Invalid account keyword ` "+args[0]+" `.")
    await message.react(emojis.loading)
    let amount = Number(args[1])
    // Generate links
    let data = await generateLinks(amount,null,acc)
    if (data.error) return message.reply(data.error)
    await safeSend(message.channel,data.message)
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
      await inter.reply({content: 'Fetching stocks.. '+emojis.loading, ephemeral: true})
      //
      let user = options.find(a => a.name === 'user')
      let quan = options.find(a => a.name === 'quantity')
      let mop = options.find(a => a.name === 'mop')
      let item = options.find(a => a.name === 'item')
      let ticket = options.find(a => a.name === 'ticket')
      
      //Send prompt
      try {
        //Get stocks
        let stocks = await getChannel(shop.channels.stocks)
        let links = ""
        let index = 0
        let msgs = []
        let gotDrop = false
        let messages = await stocks.messages.fetch({limit: quan.value}).then(async messages => {
          messages.forEach(async (gotMsg) => {
            index++
            links += "\n"+index+". "+gotMsg.content
            msgs.push(gotMsg) 
            gotDrop = true
          })
        })
        //Returns
        if (links === "") return inter.followUp({content: emojis.x+" No stocks left.", ephemeral: true})
        if (quan.value > index) return inter.followUp({content: emojis.warning+" Insufficient stocks. **"+index+"** "+(item ? item.value : 'nitro boost(s)')+" remaining.", ephemeral: true})
        yay = false
        tStocks = quan.value
        //delete messages
        console.log('Deleting '+msgs.length+' messages')
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
        //Send prompt
        let drops = await getChannel(shop.channels.drops)
        let dropMsg
        await drops.send({content: links}).then(msg => dropMsg = msg)
        //
        let row = new MessageActionRow().addComponents(
          new MessageButton().setCustomId("drop-"+dropMsg.id).setStyle('SECONDARY').setEmoji('📩').setLabel("Release"),
          new MessageButton().setCustomId("showDrop-"+dropMsg.id).setStyle('SECONDARY').setEmoji('📎'),
          new MessageButton().setCustomId("returnLinks-"+dropMsg.id).setStyle('SECONDARY').setEmoji('🔻')
        );
        let template = await getChannel(shop.channels.templates)
        let prompt = await template.messages.fetch(shop.promptMessage)
        inter.followUp({content: prompt.content.replace('{user}',user.user.toString()).replace('{quan}',quan.value).replace('{product}',item ? item.value : 'nitro boost(s)'), components: [row]})
        //Send auto queue
        let orders = await getChannel(shop.channels.orders)
        
        if (shop.autoQueue) {
        let msg = await template.messages.fetch(shop.qMessage)
        let content = msg.content
        content = content
          .replace('{user}','<@'+user.user.id+'>')
          .replace('{ticket}',ticket ? ticket.channel.toString() : inter.channel.toString()) //'#'+
          .replace('{quan}',quan.value.toString())
          .replace('{product}',(item ? item.value : 'nitro boost'))
          .replace('{mop}',mop ? mop.value : 'gcash')
        
          let embed = new MessageEmbed()
          .setDescription(content)
          .setColor('#86f4fa')
          await orders.send({content: shop.viaContent ? content : null, embeds: !shop.viaContent ? [embed] : null}).then(async msg => {
          await msg.react('<a:a_pinkcheck:1111569023285608478>')
        })
      }
        //
      } catch (err) {
        console.log(err)
        inter.followUp({content: emojis.warning+' Unexpected Error Occurred\n```diff\n- '+err+'```'})
      }
    }
    //Queue
    else if (cname === 'queue') {
      if (!await getPerms(inter.member,4)) return inter.reply({ content: emojis.warning+" Insufficient Permission"});
      let options = inter.options._hoistedOptions
      //
      let user = options.find(a => a.name === 'user')
      let item = options.find(a => a.name === 'item')
      let quan = options.find(a => a.name === 'quantity')
      let mop = options.find(a => a.name === 'mop')
      let ticket = options.find(a => a.name === 'ticket')
      //
      try {
        let orders = await getChannel(shop.channels.orders)
        let template = await getChannel(shop.channels.templates)
        let msg = await template.messages.fetch(shop.qMessage)
        let status = 'NOTED'
        let content = msg.content
        content = content
          .replace('{user}',user.user.toString())
          .replace('{ticket}',ticket.channel.toString())
          .replace('{quan}',quan.value.toString())
          .replace('{product}',item.value)
          .replace('{mop}',mop ? mop.value : 'gcash')
        
        let msgUrl
        let member = await getMember(user.user.id,inter.guild)
        await orders.send({content: content}).then(async msg => {
          await msg.react('<:c_pin:1090240927886483508>')
          msgUrl = msg.url
        })
        
        let linkRow = new MessageActionRow().addComponents(
          new MessageButton().setURL(msgUrl).setStyle('LINK').setLabel("view message"),
        );
        
        inter.reply({content: 'Queue was sent to '+orders.toString(), components: [linkRow]})
      } catch (err) {
        console.log(err)
        inter.reply({content: emojis.warning+' Unexpected Error Occurred\n```diff\n- '+err+'```'})
      }
    }
    //Stocks
    else if (cname === 'stocks') {
      //if (inter.channel.id !== '1047454193595732058' && !await getPerms(inter.member,4)) return inter.reply({content: 'This command only works in <#1047454193595732058>\nPlease head there to use the command.', ephemeral: true})
      
      let stocks = await getChannel(shop.channels.stocks)
      let stocks2 = await getChannel(shop.channels.otherStocks);
      let quan = 0;
      let strong = ''
      let stockHolder = [[],[],[],[],[],[],[],[],[],[]];
      let holderCount = 0
      let arrays = []
      
      let last_id;
      let mentionsCount = 0
      let limit = 500
      let msgSize = 0
      let totalMsg = 0
      
      while (true) {
      const options = { limit: 100 };
      if (last_id) {
        options.before = last_id;
      }
      
      let messages = await stocks.messages.fetch(options).then(async messages => {
      
      last_id = messages.last()?.id;
      totalMsg += messages.size
      msgSize = messages.size
        console.log(msgSize,'e')
        await messages.forEach(async (gotMsg) => {
          if (gotMsg.content.includes('discord.gift')) quan++
          strong += gotMsg.content+'\n'
        })
        console.log(quan,'thus')
      });
      //Return
      if (msgSize != 100) {
        let messages2 = await stocks2.messages.fetch({ limit: 100 })
      .then(async (messages) => {
        messages.forEach(async (gotMsg) => {
          arrays.push(gotMsg.content);
        });
      });
      console.log(quan,'this')
      stockHolder[0].push(new MessageButton().setCustomId('none').setStyle('SECONDARY').setLabel('Nitro Boost ('+quan+')').setEmoji(emojis.nboost))
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
    
      let comps = []
      for (let i in stockHolder) {
        if (stockHolder[i].length !== 0) {
          let row = new MessageActionRow();
          row.components = stockHolder[i];
          comps.push(row)
        }
      }
        await inter.reply({components: comps})
        break;
      }
    }
    }
  }
  else if (inter.isButton()) {
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
        //new MessageButton().setLabel('Vouch Here').setURL('https://discord.com/channels/1047454193159503904/1054724474659946606').setStyle('LINK').setEmoji('<:S_letter:1092606891240198154>')
        );
      let code = makeCode(10)
      let refCode = shop.refCode ? "Ref code: `"+code+"`\n" : ''
      await member.send({content: msg.content+"\n\n"+refCode+"||"+dropMsg.content+" ||", components: [copy]}).catch((err) => {
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
        inter.update({components: [row]})
        dropMsg.edit({content: (shop.refCode ? code+'\n' : '')+dropMsg.content, components: [row]})
      })
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
      
      let content = inter.message.content//.replace(msg.content,'').replace(/\||Ref code:/g,'')
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
  
  let channel = await getChannel(shop.channels.output)
  channel ? channel.send({embeds: [embed]}).catch(error => error) : null
});
