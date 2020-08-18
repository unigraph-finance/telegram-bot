require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const pollingTimeout = 30; // seconds
let lastFetch = 0;
let cachedInfo;
const parse_mode = `Markdown`;
const getCurrentInfo = async () => {
  const response = await fetch("https://unigraph.app/api/info");
  cachedInfo = await response.json();
};

setInterval(getCurrentInfo, pollingTimeout * 1000);
getCurrentInfo();
// Matches "/echo [whatever]"
bot.onText(/\/price/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  console.log(cachedInfo);

  // send back the matched "whatever" to the chat
  bot.sendMessage(
    chatId,
    `Current GRAPH price : $${cachedInfo.GRAPH_price_USD.toFixed(2)}`
  );
});
bot.onText(/\/marketcap/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const message = `*Current GRAPH marketcap* 
   ${
    cachedInfo.supply_without_decimals
  } GRAPH \\* $${cachedInfo.GRAPH_price_USD.toFixed(
    2
  )}  = $${cachedInfo.market_cap.toFixed(2)}`;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, "Received your message");
// });
