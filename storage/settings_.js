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
  prefix: ";", //Prefix
  shop: {
    breakChecker: false,
    checkers: [],
    autoQueue: false,
    refCode: false,
    viaContent: true,
    channels: {
      checker: '',
      boostStocks: '',
      basicStocks: '',
      otherStocks: '',
      templates: '1270604387374334087',
      drops: '',
      orders: '1272480413755113522',
      reports: '',
      output: '',
    },
    dmMessage: '',
    qMessage: '1270604644497752115',
    rMessage: '',
    ar: {
      responders: [
        {
          trigger: '.39847324',
          content: '1270604575325552660',
          autoDelete: false,
          row: null,
        },
      ],
    },
    promptMessage: null,
    bot: {
      status: [
        {
          status: "idle", //online, idle, dnd
          activities: [
            { name: ".gg/NvA64ZMz7q", type: "Watching".toUpperCase(), //playing, watching, listening only
            }, ], 
        },
        {
          status: "idle", //online, idle, dnd
          activities: [
            { name: "#join us! active ・gaming ・non-toxic・socializing", type: "Watching".toUpperCase(), //playing, watching, listening only
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
      id: "",
      level: 4,
    },
    {
      id: "497918770187075595",
      level: 5,
    },
  ],
  colors: colors,
  theme: colors.none,
  emojis: {
    check: "✅",
    x: "❌",
    loading: "⌛",
    nboost: '<:boost:1248993578181726269>',
    nclasic: '<a:classic:1248921754097815572>',
    nbasic: '<:basic:1248921754097815572>',
    warning: '⚠️',
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
