const { MessageEmbed } = require("discord.js");
const User = require("../Classes/User.js");
const defaultEmbedData = require("../Functions/defaultEmbedData.js");
const SpamHandler = require("./SpamHandler.js");
const Log = require("../Classes/Log.js");
const howThisWorksEmbed = require("../Functions/howThisWorksEmbed.js");

module.exports = class MessageHandler {
  constructor(CommandHandler, db) {
    this.CommandHandler = CommandHandler;
    this.config = this.CommandHandler.config;
    this.logHandler = this.CommandHandler.logHandler;
    this.db = db;
  }
  /**
   * Handle a message
   * @param {Discord.Message} msg
   */
  handleMessage(msg) {
    if (msg.author.bot) return;
    let user = new User(msg.author, this.db);
    this.checkNotification(user, msg);
    if (this.CommandHandler.isCommand(msg)) {
      this.CommandHandler.execute(this.CommandHandler.getCommand(msg));
    } else {
      if (msg.channel.id === "964922792430686318") return;
      this.trackMessage(user);
      this.handlePoints(user);
      //this.handleSpam(user, msg);
    }
  }
  async checkNotification(user, msg) {
    let g = await user.gotNotification();
    if (g === false) {
      let embed = howThisWorksEmbed(this.config);
      user.setGotNotification(true);
      user.user
        .send({ embeds: [embed] })
        .then((i) => {
          msg.reply(
            "Welcome to the server! I have sent you a DM that explains everything you need to know."
          );
        })
        .catch((e) => {
          msg.reply(
            `Welcome to the server! I was not able to dm you to learn how the bot works do \`${this.config.prefix}help\` and select the **How this works** button.`
          );
        });
    }
  }
  trackMessage(user) {
    user.messages.add(1);
  }
  handlePoints(user) {
    let userBalance = user.cash;
    let earning = Number((Math.random() * 5 + 1).toFixed(2));
    userBalance.add(earning);
  }
  async handleSpam(user, msg) {
    let spamHandler = new SpamHandler(user, this.logHandler);
    let subAmount = 100;
    spamHandler.insertMessage(msg);
    let isSpam = await spamHandler.checkSpam();
    if (!isSpam) return;
    await spamHandler.addStrike(1, msg);
    let takeEmbed = new MessageEmbed();
    takeEmbed.setTitle("Detected Spam");
    let strikes = await spamHandler.strikes();
    if (strikes >= 1)
      user.cash.subtract(
        subAmount *
          ((strikes - 1 === 0 ? 1 : strikes - 1) >= 5
            ? 5
            : strikes - 1 === 0
            ? 1
            : strikes - 1)
      );
    takeEmbed.setDescription(
      "We took " +
        subAmount *
          ((strikes - 1 === 0 ? 1 : strikes - 1) >= 5
            ? 5
            : strikes - 1 === 0
            ? 1
            : strikes - 1) +
        " " +
        this.config.currency.rep +
        "\n\nTo appeal this do `" +
        this.config.prefix +
        "appeal`"
    );
    takeEmbed.setColor("#FF0000");
    defaultEmbedData(takeEmbed);
    this.logHandler.newLog(
      "penalty",
      new Log("penalty", {
        user: user.id,
        amount:
          subAmount *
          ((strikes - 1 === 0 ? 1 : strikes - 1) >= 5
            ? 5
            : strikes - 1 === 0
            ? 1
            : strikes - 1),
        itemType: "cash",
        messageLink:
          "https://discord.com/channels/" +
          msg.guild.id +
          "/" +
          msg.channel.id +
          "/" +
          msg.id,
      })
    );
    if (strikes >= 1) return msg.reply({ embeds: [takeEmbed] });
    let warnEmbed = new MessageEmbed();
    warnEmbed.setTitle("Detected Spam");
    warnEmbed.setDescription(
      "We detected that you are spamming, this is a warning your next strike will result in a penalty.\n\nTo appeal this do `" +
        this.config.prefix +
        "appeal`"
    );
    warnEmbed.setColor("#FFA500");
    defaultEmbedData(warnEmbed);
    msg.reply({ embeds: [warnEmbed] });
  }
};
