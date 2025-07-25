const fetch = require("node-fetch");
//Functions
const get = require("../functions/get.js");
const {
  getTime,
  chatAI2,
  getNth,
  getChannel,
  getGuild,
  getUser,
  getMember,
  getRandom,
  getColor,
} = get;

const Discord = require("discord.js");
const {
  MessageAttachment,
  ActivityType,
  WebhookClient,
  Permissions,
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = Discord;
const fetch = require("node-fetch");

// helper functions
function cutString(inputString) {
  // strip out any stray 'ω', cap at 20 chars (with '-' suffix if truncated)
  const clean = inputString.replace(/ω/g, "");
  return clean.length > 20 ? clean.slice(0, 19) + "-" : clean;
}

function formatNumber(number) {
  return number.toString().padStart(2, "0");
}

function crc16Ccitt(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc;
}

function generateQrCRC(qrData) {
  const idx = qrData.lastIndexOf("6304");
  if (idx === -1) {
    throw new Error("CRC tag '6304' not found in the QR data.");
  }
  const payload = qrData.substring(0, idx + 4);
  const crc = crc16Ccitt(payload);
  const crcHex = crc.toString(16).toUpperCase().padStart(4, "0");
  return payload + crcHex;
}

module.exports = {
  generateQr: async function (amount, name, plain) {
    // 1) normalize inputs
    const amt = Number(amount) || 0;
    const shortName = cutString(name);

    // 2) pick the right price tag (EMV: tag '54')
    const digitIndicator =
      amt >= 10000 ? "408" :
      amt >= 1000  ? "407" :
      amt >= 100   ? "406" :
      amt >= 10    ? "405" :
                     "404";

    // 3) always include the amount (even 0.00)
    const amountField = digitIndicator + amt.toFixed(2);

    // 4) build the QR payload strings
    const qrData1 =
      "00020101021227780012com.p2pqrpay0111PAPHPHM1XXX" +
      "02089996440304126394532635490515+63-945-32635495204601653036085" +
      amountField +
      "5802PH59" + formatNumber(shortName.length) + shortName +
      "6015Sto. Tomas City6304";

    const qrData2 =
      "00020101021227830012com.p2pqrpay0111GXCHPHM2XXX" +
      "02089996440303152170200000006560417DWQM4TK3JDO7SRDOU5204601653036085" +
      amountField +
      "5802PH59" + formatNumber(shortName.length) + shortName +
      "6011San Antonio610412346304";

    // 5) CRC‑encode
    const generatedQr = generateQrCRC(qrData1);

    // 6) choose design based on `plain` flag
    const dynamicDesign = {
      body: "circular", eye: "frame1", eyeBall: "ball0",
      erf1: ["fh"], erf2: [], erf3: ["fh", "fv"],
      brf1: [], brf2: [], brf3: [],
      bodyColor: "#382600", bgColor: "#FFFFFF",
      eye1Color: "#382600", eye2Color: "#382600", eye3Color: "#382600",
      eyeBall1Color: "#382600", eyeBall2Color: "#382600", eyeBall3Color: "#382600",
      gradientColor1: "", gradientColor2: "",
      gradientType: "linear", gradientOnEyes: "true",
      logo: "", logoMode: "default"
    };
    const plainDesign = {
      body: "square", eye: "frame2", eyeBall: "ball0",
      erf1: ["fv"], erf2: [], erf3: [],
      brf1: [], brf2: [], brf3: [],
      bodyColor: "#000000", bgColor: "#FFFFFF",
      eye1Color: "#000000", eye2Color: "#000000", eye3Color: "#000000",
      eyeBall1Color: "#000000", eyeBall2Color: "#000000", eyeBall3Color: "#000000",
      gradientColor1: "", gradientColor2: "",
      gradientType: "linear", gradientOnEyes: "true",
      logo: "https://cdn.glitch.global/ef5aba0e-2698-4d9a-9dfb-7c60e08418a2/pio.png",
      logoMode: "default"
    };
    const design = plain === true ? plainDesign : dynamicDesign;

    // 7) send to QR‑Monkey API
    const config = {
      data: generatedQr,
      config: design,
      size: 400,
      download: "imageUrl",
      file: "png",
    };
    const res = await fetch("https://api.qrcode-monkey.com/qr/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const qrJson = await res.json();
    const imageUrl = "https:" + qrJson.imageUrl;

    return { image: imageUrl, raw: generatedQr };
  },
};

