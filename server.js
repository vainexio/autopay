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

let phoneSchema
let phoneModel

let serverSchema
let serverModel

let listen

async function startApp() {
  console.log("Starting...");
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
    
    phoneSchema = new mongoose.Schema({
      userId: String,
      number: String,
    })
    
    serverSchema = new mongoose.Schema({
      id: String,
      username: String,
      password: String,
      logChannel: String,
      myGcash: {
        number: String,
        initials: String,
      }
    })
    
    phoneModel = mongoose.model("SloopiePhone", phoneSchema);
    serverModel = mongoose.model("SeverPhoneModel", serverSchema);
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
  if (message.channel.type === "DM") return;
  
  if (message.content.toLowerCase().startsWith('.gcash')) {
    let row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('autopay-'+message.guild.id).setStyle('SUCCESS').setLabel('Yes'),
    );
    await message.channel.send({content: "** **\n<:gcash:1273091410228150276> Would you like to auto pay with GCash?\n-# GCash may have delays. If the payment was not validated, please send the receipt instead.\n** **", components: [row]})
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
    else if (cname === 'register') {
      if (!await getPerms(inter.member,2)) return inter.reply({content: emojis.warning+" You are not on the whitelist"});
      let options = inter.options._hoistedOptions
      //
      let server_id = options.find(a => a.name === 'server_id')
      let username = options.find(a => a.name === 'username')
      let password = options.find(a => a.name === 'password')
      let gcash_num = options.find(a => a.name === 'gcash_num')
      let gcash_initials = options.find(a => a.name === 'gcash_initials')
      let log_channel_id = options.find(a => a.name === 'log_channel_id')
      
      let guild = await getGuild(server_id.value)
      
      if (!guild) return inter.reply({content: emojis.warning+' Cannot find guild. Make sure that the bot is on the server that you wish to register'})
      if (!await guildPerms(await getMember(inter.user.id,guild),["MANAGE_GUILD"])) return inter.reply({content: emojis.warning+' You must have the **MANAGE SERVER** permission in the server that you want to register'})
      
      let doc = await serverModel.findOne({id: guild.id})
      if (doc) return inter.reply({content: emojis.warning+' This guild was already registered'})
      
      let docAuthor = await serverModel.findOne({username: username.value})
      if (docAuthor) return inter.reply({content: emojis.warning+' A server with this username is already registered!'})
      
      let logChannel = await getChannel(log_channel_id.value)
      if (!logChannel) return inter.reply({content: emojis.warning+' Log channel ID was not found!'})
      
      let newDoc = new serverModel(serverSchema)
      newDoc.id = guild.id
      newDoc.username = username.value
      newDoc.password = password.value
      newDoc.logChannel = log_channel_id.value
      newDoc.myGcash.number = gcash_num.value
      newDoc.myGcash.initials = gcash_initials.value
      await newDoc.save()
      
      await inter.reply({content: emojis.on+" Your guild was registered"})
      
      let embed = new MessageEmbed()
      .addFields(
        {name: "Generated Key", value: "This key was generated for the first time. Make sure you save it."},
        {name: "Data", value: "Guild ID `"+guild.id+"`\nGuild Name `"+guild.name+"`"}
      )
      .setColor(theme)
      
      await inter.user.send({content: newDoc.key, embeds: [embed], ephemeral: true})
        .then(msg => inter.followUp({content: emojis.check+' Your access key has been sent via direct message'}))
        .catch(async err => {
        console.log(err)
        inter.followUp({content: emojis.warning+' Unable to send access key via direct message\n```diff\n-'+err+'```'})
        await guildModel.deleteOne({key: newDoc.key})
      })
    }
  }
  else if (inter.isButton() || inter.isSelectMenu()) {
    let id = inter.customId;
    if (id.startsWith('autopay-')) {
      let serverId = id.replace('autopay-','')
      
      let serverData = await serverModel.findOne({id: serverId})
      if (!serverData) return await inter.reply({content: emojis.warning+" No server data."})
      await inter.update({components: []})
      
      // Normalize number
      function normalizeMobileNumber(input) {
        let cleaned = input.replace(/\D/g, '');
        if (cleaned.startsWith('639')) cleaned = '0' + cleaned.slice(2);
        
        if (cleaned.length === 11 && cleaned.startsWith('09')) return cleaned
        else {
          throw new Error('Invalid mobile number format');
          return false
        }
      }
      
      // Create thread
      let thread = [ { question: "Type the phone number you're going to use in sending payment.\n-# Correct format: 09XXXXXXXXX", answer: '', }, ]
      const filter = m => m.author.id === inter.user.id;
      
      let row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('autopay-'+inter.user.id).setStyle('SECONDARY').setLabel('Retry'),
      );
      
      //Get response
      async function getResponse(data) {
        await inter.channel.send(data.question)
        let msg = await inter.channel.awaitMessages({ filter, max: 1,time: 900000 ,errors: ['time'] })
        
        msg = msg?.first()
        data.answer = msg.content
      }
      
      // Validate remembered phone
      let phone = await phoneModel.findOne({userId: inter.user.id})
      if (phone) {
        await inter.channel.send({content: emojis.check+" I remembered your SIM number. `"+phone.number+"`\n\nSay **OK** if you want to use this. If not, send your new phone number."})
        let msg = await inter.channel.awaitMessages({ filter, max: 1,time: 900000 ,errors: ['time'] })
        
        msg = msg?.first()
        if (msg.content.toLowerCase().includes('ok')) thread[0].answer = phone.number
        else thread[0].answer = msg.content
      }
      
      for (let i in thread) {
        let data = thread[i]
        if (data.answer == "") await getResponse(data)
      }
      
      let num = normalizeMobileNumber(thread[0].answer)
      
      if (!num) return inter.channel.send({content: emojis.warning+" Invalid phone number: `"+thread[0].answer+"`\nMake sure the format is correct.", components: [row]})
      
      // Create phone data
      if (!phone) {
        let phone = new phoneModel(phoneSchema)
        phone.userId = inter.user.id
        phone.number = num
        await phone.save()
      }
      // Update existing data
      else if (phone) {
        phone.number = num
        await phone.save()
      }
      // Insert shop data
      let foundShopData = shop.expected.find(i => i.channel == inter.channel.id)
      if (!foundShopData) shop.expected.push({channel: inter.channel.id, num: num, myGcash: serverData.myGcash.number})
      else if (foundShopData) foundShopData.num = num
      
      let templates = await getChannel(shop.channels.templates)
      let foundMsg = await templates.messages.fetch('1320650204046688257')
      
      foundMsg.content
      .replace('{myGcash}',serverData.myGcash.number)
      .replace('{initials}',serverData.myGcash.initials)
      .replace('{num}',num)
      
      await inter.channel.send(foundMsg.content)
    }
    else if (id.startsWith("reply-")) {
      let reply = id.replace("reply-", "");
      inter.reply({ content: "*" + reply + "*", ephemeral: true });
    } 
    else if (id.startsWith("none")) {
      inter.deferUpdate();
    }
  }
});

app.get('/gcash', async function (req, res) {
  
  let text = req.query.text.length > 0 ? req.query.text : req.query.bigtext
  let username = req.query.user?.toLowerCase()
  let password = req.query.pass
  if (!username || !password) return res.status(404).send({error: "Insufficient credentials."})
  
  let serverData = await serverModel.findOne({username: username})
  if (!serverData) return res.status(404).send({error: "No server data found with username: "+username})
  
  if (serverData.password !== password) {
    console.log("Invalid password")
    console.log(req.query)
    return res.status(404).send({error: 'Invalid password'})
  }
  
  if (!text) return res.status(404).send({error: 'Invalid Message'})
  let args = await getArgs(text)
  let firstIndex = args.indexOf('from')
  let lastIndex = args.length
  
  let data = {
    body: text,
    sender: args.slice(firstIndex+1,lastIndex).join(' '),
    senderNumber: args[lastIndex-1].replace('.',''),
    amount: Number(args[4]),
  }
  
  if (data.body.startsWith('You have received')) {
    res.status(200).send({success: 'Transaction Received'})
    console.log('Data: '+username,data)
    
    //Send log
    let embed = new MessageEmbed()
    .addFields(
      {
        name: 'Amount Sent',
        value: '```diff\n+ ₱ '+data.amount+'```',
        inline: true,
      },
      {
        name: 'Sender',
        value: '||```ini\n[ '+data.sender+' ]```||',
        inline: true,
      },
    )
    .setFooter({text: "Thank you for using auto pay!"})
    .setColor(colors.none)
    
    for (let i in shop.expected) {
      let transac = shop.expected[i]
      let cd = await getChannel(transac.channel)
      if (!cd) shop.expected.splice(i,1)
    }
    
    console.log(shop.expected)
    
    for (let i in shop.expected) {
      
      let transac = shop.expected[i]
      
      if (transac.num == data.senderNumber) {
        let cd = await getChannel(transac.channel)
        if (!cd) return shop.expected.splice(i,1)
        await cd.send({content: emojis.check+" Payment received *!*", embeds: [embed]})
        shop.expected.splice(i,1)
        return;
      }
    }
    let logChannel = await getChannel(serverData.logChannel)
    await logChannel.send({content: ''+emojis.check+' New Transaction ('+data.senderNumber+')', embeds: [embed]})
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