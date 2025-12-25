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
function cutString(inputString) {
  if (inputString.length > 20) {
    return inputString.slice(0, 19) + '-';
  }
  return inputString.slice(0, 20);
}
function formatNumber(number) {
  return number.toString().padStart(2, '0');
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
  generateQr: async function (amount,name,plain,platform) {
    name = cutString(name.replace('ω',''))
    console.log(name)
    let digitIndicator =
      amount >= 10000 ? "5408"
      : amount >= 1000 ? "5407"
      : amount >= 100 ? "5406"
      : amount >= 10 ? "5405"
      : amount >= 1 ? "5404"
      : "Unknown";
    let initial = "01021" + (amount > 0 ? "2" : "1")
    let qrData
    let maya = "000201"+initial+"27780012com.p2pqrpay0111PAPHPHM1XXX02089996440304126394532635490515+63-945-3263549520460165303608"+(Number(amount) > 0 ? digitIndicator + Number(amount).toFixed(2) : "")+"5802PH59"+formatNumber(name.length)+name+"6015Sto. Tomas City6304"
    let gcash2 = "000201"+initial+"27830012com.p2pqrpay0111GXCHPHM2XXX02089996440303152170200000006560417DWQM4TK3JDO7SRDOU520460165303608"+(Number(amount) > 0 ? digitIndicator + Number(amount).toFixed(2) : "")+"5802PH59"+formatNumber(name.length)+name+"6011San Antonio610412346304";
    let gcash  = "000201"+initial+"27830012com.p2pqrpay0111GXCHPHM2XXX02089996440303152170200000006560417DWQM4TK3JDNWLLAJW520460165303608"+(Number(amount) > 0 ? digitIndicator + Number(amount).toFixed(2) : "")+"5802PH59"+formatNumber(name.length)+name+"6014Central Signal610412346304"
    platform == "gcash" ? qrData = gcash :
    platform == "maya" ? qrData = maya : null
    let generatedQr = generateQrCRC(qrData);
    let dynamicDesign = {"body":"circular","eye":"frame1","eyeBall":"ball0","erf1":["fh"],"erf2":[],"erf3":["fh","fv"],"brf1":[],"brf2":[],"brf3":[],"bodyColor":"#382600","bgColor":"#FFFFFF","eye1Color":"#382600","eye2Color":"#382600","eye3Color":"#382600","eyeBall1Color":"#382600","eyeBall2Color":"#382600","eyeBall3Color":"#382600","gradientColor1":"","gradientColor2":"","gradientType":"linear","gradientOnEyes":"true","logo":"","logoMode":"default"}
    let plainDesign = {"body":"square","eye":"frame2","eyeBall":"ball0","erf1":["fv"],"erf2":[],"erf3":[],"brf1":[],"brf2":[],"brf3":[],"bodyColor":"#000000","bgColor":"#FFFFFF","eye1Color":"#000000","eye2Color":"#000000","eye3Color":"#000000","eyeBall1Color":"#000000","eyeBall2Color":"#000000","eyeBall3Color":"#000000","gradientColor1":"","gradientColor2":"","gradientType":"linear","gradientOnEyes":"true","logo":"https://cdn.glitch.global/ef5aba0e-2698-4d9a-9dfb-7c60e08418a2/pio.png","logoMode":"default"}
    let design = plain == true ? plainDesign : dynamicDesign
    let config = {
      data: generatedQr,
      "config": design,
      "size": 400,
      "download":"imageUrl",
      "file":"png"
    };
    let data = {
      method: "POST",
      body: JSON.stringify(config),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let qrCode = await fetch("https://api.qrcode-monkey.com//qr/custom", data);
    qrCode = await qrCode.json();
    console.log(qrCode)
    let imageUrl = "https:" + qrCode.imageUrl;

    return { image: imageUrl, raw: generatedQr };
  },
};
