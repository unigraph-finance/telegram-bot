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
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
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
const timeOfRebase = 1598148000000;
let timeLeft;

let stickyMessageId;
let stickyChatId;
const sticky = (timeLeft) => `Welcome to UniGraph
LATEST UPDATES
GRAPH rebase in ${timeLeft} (automatically updates)
More about the rebase https://twitter.com/UnigraphApp/status/1296658384222134273
Every holder of GRAPH will see their coins increase. No action necessary.

After extensive discussion with the friendly team at CoinMarketCap, UniGraph is now reinstated
https://coinmarketcap.com/currencies/unigraph/

You can now track UniGraph on Coinbase:
https://www.coinbase.com/price/unigraph

GRAPH Distribution
https://medium.com/@UniGraph/unigraph-tokens-distribution-d49a47411579

Useful Links:
Uniswap: https://uniswap.info/token/0x165440036ce972c5f8ebef667086707e48b2623e
CoinMarketCap: https://coinmarketcap.com/currencies/unigraph/
Proof of team token lock: https://etherscan.io/tx/0x79f181b1c5ef2c1de54be7965e97c979282a970de65f629e817f9c8594a88ac9
Proof of locked liquidity: https://etherscan.io/tx/0x97bb92b01f40b5d845043bfa79f0e532007fa8c7aa351f3ca6a78aa06655ab17
Official Website: https://unigraph.app/
Telegram: https://t.me/unigraphapp
Discord: https://discord.gg/5BQdpgE
Twitter: https://twitter.com/UnigraphApp/
Audit the smart contract: https://etherscan.io/address/0x165440036ce972c5f8ebef667086707e48b2623e#code

Further Reading:
What is UniGraph: https://unigraph.app/this
GRAPH Tokenomics: https://medium.com/@UniGraph/unigraphs-tokenomics-743c4a430a9c
GRAPH Token Distribution: https://medium.com/@UniGraph/unigraph-tokens-distribution-d49a47411579

Other Info:
TOTAL SUPPLY             ——- 100,000
CIRCULATING SUPPLY  ——- 19,223

Join our bot channel for trading activity in telegram 
`;

const updateSticky = () => {
  if (!stickyMessageId || !stickyChatId) return;

  console.log("new");
  timeLeft = timeOfRebase - Date.now();

  const hoursRest = timeLeft % hour;
  const hoursLeft = Math.floor(timeLeft / hour);
  const minutesLeft = Math.floor(hoursRest / minute);
  const timeCopy = `${hoursLeft} hours ${minutesLeft} minutes`;
  bot.editMessageText(sticky(timeCopy), {
    message_id: stickyMessageId,
    chat_id: stickyChatId,
  });
};

setInterval(updateSticky, minute);

bot.onText(/\/setSticky/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.from.id; //1332810714
  if (msg.from.id !== 1332810714) return;
  // send back the matched "whatever" to the chat
  const message = await bot.sendMessage(chatId, sticky(timeLeft), {
    parse_mode: "Markdown",
  });
  stickyMessageId = message.message_id;
  stickyChatId = message.chat.id;
  console.log(message);
  console.log(stickyChatId);

  console.log(stickyMessageId);
});

bot.onText(/\/marketcap/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const message = `*Current GRAPH marketcap* 
   ${
     cachedInfo.supply_without_decimals
   } GRAPH \\* $${cachedInfo.GRAPH_price_USD.toFixed(2)}  = $${
    cachedInfo.market_cap
  }`;
  console.log(cachedInfo);
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
