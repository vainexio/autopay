const Discord = require('discord.js');
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = Discord;

let colors = {
  red: "#ea3737",
  blue: "#1200ff",
  green: "#00ff04",
  yellow: "#fff4a1",
  orange: "#ff6300",
  purple: "#b200ff",
  pink: "#ff00d6",
  cyan: "#00feff",
  black: "#000000",
  white: "#ffffff",
  lime: "#7ebb82",
  none: "#2B2D31",
}

module.exports = {
  prefix: ".", //Prefix
  shop: {
    expected: [],
    orderStatus: new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId('orderStatus').setPlaceholder('Update Order Status').addOptions([
        {label: 'Noted',description: 'Change Order Status',value: 'noted', emoji: '<a:BunnyBook:1304407161673351221>'},
        {label: 'Processing',description: 'Change Order Status',value: 'processing', emoji: '<a:PinkLoading:1304377633479462983>'},
        {label: 'Completed',description: 'Change Order Status',value: 'completed', emoji: '<a:verifyedpink:1286730047025315880>'},
        {label: 'Cancelled',description: 'Change Order Status',value: 'cancelled', emoji: '<:no_pink:1304407329592180779>'},
      ]),
    ),
    breakChecker: false,
    checkers: [],
    autoQueue: false,
    refCode: false,
    viaContent: true,
    database: true,
    stayOnVc: {
      enabled: false,
      channel: "",
    },
    channels: {
      checker: '',
      boostStocks: '',
      basicStocks: '',
      otherStocks: '',
      templates: '1109020434810294344',
      drops: '',
      orders: '',
      reports: '',
      output: '',
    },
    dmMessage: '1294904355404775456',
    qMessage: '',
    rMessage: '',
    ar: {
      responders: [
        {
          trigger: '.39847324',
          content: '1152546156300218431',
          autoDelete: true,
          row: null,
        },
      ],
    },
    promptMessage: null,
    bot: {
      status: [
        {
          status: "online", //online, idle, dnd
          activities: [
            { name: "receipts", type: "Watching".toUpperCase(), //playing, watching, listening only
            }, ], 
        },
        {
          status: "online", //online, idle, dnd
          activities: [
            { name: "payments", type: "Watching".toUpperCase(), //playing, watching, listening only
            }, ], 
        },
      ]
    },
  },
  permissions: [
    {
      id: "",
      level: 4,
    },
    {
      id: "",
      level: 4,
    },
    {
      id: "1320659731110563961",
      level: 2,
    },
    {
      id: "497918770187075595",
      level: 5,
    },
  ],
  colors: colors,
  theme: colors.none,
  emojis: {
    check: '<a:CHECK:1138778694983356450>',
    x: '<a:Xmark:1138778760628424735>',
    loading: '<a:Loading:1138778730785943614>',
    nboost: '<:boost:1248993578181726269>',
    nclasic: '<a:classic:1248921754097815572>',
    nbasic: '<:basic:1248921754097815572>',
    warning: '<:S_warning:1108743925012902049>',
    online: '<:online_:1004014930959286342>',
    idle: '<:Idle_:1004014897417424938>',
    dnd: '<:dnd_:1004017480613773422>',
    offline: '<:offline_:1004015005282340916>',
    on: '<:on:1107664866484953178>',
    off: '<:off:1107664839372964010>',
  },
  commands: [
    //
    {
      Command: "help",
      Template: " [command]",
      Alias: [],
      Category: "Misc",
      Desc: "Description",
      ex: [],
      level: 4,
    },
    //
  ],
};
