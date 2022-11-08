const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const config = require("./config.json");
const cmdhandler = require("./Handlers/CommandHandler.js");
const msghandler = require("./Handlers/MessageHandler.js");
const loghandler = require("./Handlers/LogHandler.js");
const customevents = require("./Classes/CustomEvents.js");
const DB = require("./Classes/DB.js");
const api = require("./api/api.js");
const createProductModal = require("./Functions/createProductModal");
const editProductModal = require("./Functions/editProductModal");
const deleteProductModal = require("./Functions/deleteProductModal");
const reportProductModal = require("./Functions/reportProductModal");
const defaultEmbedData = require("./Functions/defaultEmbedData");
const db = new DB(config).client;
const CustomEvents = new customevents();
const LogHandler = new loghandler(db, CustomEvents);
new api(3001, db, client, LogHandler);
const CommandHandler = new cmdhandler(
  config,
  client,
  "./Commands",
  db,
  LogHandler
);
const MessageHandler = new msghandler(CommandHandler, db);

client.on("ready", () => console.log("Ready!"));

client.on("messageCreate", (message) => {
  MessageHandler.handleMessage(message);
});

CustomEvents.on("newLog", (log) => {
  let client = new Discord.WebhookClient({
    url: "https://discord.com/api/webhooks/1006351909990453348/wBcBHB_U1SaYtXUknEx7Lvlr98rdBGiyuxk7oNE8m2fAe68XStsozbZw1gCd1IVC93zA",
  });
  const embed = new Discord.MessageEmbed();
  embed.setTitle("New Log");
  log.data["type"] = log.type;
  Object.keys(log.data).map((field) => {
    if (log.data[field].slient === true) return;
    embed.addField(`${field}`, `${log.data[field]}`);
  });
  client.send({ embeds: [embed] });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "cp") {
    interaction.showModal(createProductModal.createProductModal());
  }
  if (interaction.customId === "ep") {
    interaction.showModal(editProductModal.editProductModal());
  }
  if (interaction.customId === "dp") {
    interaction.showModal(deleteProductModal.deleteProductModal());
  }
  if (interaction.customId === "rp") {
    interaction.showModal(reportProductModal.reportProductModal());
  }
  if (interaction.customId === "pl") {
    let items = await db
      .db("data")
      .collection("products")
      .find({ "author.id": interaction.user.id })
      .toArray();
    let embed = new Discord.MessageEmbed();
    embed.setTitle("Your Products");
    embed.setDescription(
      items
        .map(
          (item) =>
            `Name: ${item.name} | ID: ${item.id} | Stock: ${item.item.length}`
        )
        .join("\n")
    );
    embed.setColor("#0000FF");
    defaultEmbedData(embed);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
  if (interaction.customId === "productCreate") {
    createProductModal.execute(db, LogHandler, interaction, config);
  }
  if (interaction.customId === "productEdit") {
    editProductModal.execute(db, LogHandler, interaction);
  }
  if (interaction.customId === "productDelete") {
    deleteProductModal.execute(db, LogHandler, interaction);
  }
  if (interaction.customId === "productReport") {
    reportProductModal.execute(db, LogHandler, interaction);
  }
});

client.login(config.dev ? config.token_dev : config.token);
