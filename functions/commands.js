const client = require('../server.js').client;
const Discord = require('discord.js');
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton} = Discord;

const settings = require('../storage/settings_.js')
const {prefix, colors, theme, commands, permissions, emojis,} = settings

module.exports = {
  checkCommand: async function (command) {
  
    command = command.toLowerCase();
    let args = command.trim().split(/ +/);
    let content = args[0].toLowerCase(); //message.content.toLowerCase();
  
    for (let i in commands) {
      if (content === prefix+commands[i].Command) {
        return commands[i];
      }
    }
    for (let i in commands) {
        for (let alias in commands[i].Alias) {
          if (content === prefix+commands[i].Alias[alias]) {
            return commands[i];
          }
        }
    }
  },
  isCommand: function (command, message) {
    command = command.toLowerCase();
    let args = message.content.trim().split(/ +/);
    let content = args[0].toLowerCase(); //message.content.toLowerCase();
  
    function getCommand() {
      for (let i in commands) {
        if (commands[i].Command === command) {
          for (let alias in commands[i].Alias) {
            if (content === prefix+commands[i].Alias[alias]) return commands[i]
          }
        }
      }
    }
    let cmd = commands.find(getCommand)
    return cmd || content === prefix+command
  },
  isMessage: function (command, message) {
    command = command.toLowerCase();
    let content = message.content.toLowerCase();
    let args = message.content.trim().split(/ +/);
    return args[0].toLowerCase() === command;
  },
};