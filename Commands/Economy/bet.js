const Discord = require("discord.js");
const Log = require("../../Classes/Log");
const calculateTax = require("../../Functions/calculateTax.js");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "bet",
  alias: [],
  description: "Make a bet",
  usage: "{prefix}bet <amount>",
  async execute(command) {
    let old = await command.user.cash.getBalance();
    let amount = command.args[0]
      ? Number(command.args[0].replace(/,/g, ""))
      : Number(command.args[0]);
    if (
      !amount ||
      isNaN(Number(amount)) ||
      !Number.isInteger(amount) ||
      old < Number(amount) ||
      amount < 100 ||
      amount > 1000
    )
      return command.reply({
        embeds: [
          errorEmbed(
            "Please make sure the following syntax is followed `" +
              command.config.prefix +
              "bet <amount>`\n\n" +
              " Please also make sure the amount is a number **greater than 100** but **less than 1,000** and does **NOT** include decimals.\n\nLastly make sure you have enough " +
              command.config.currency.name +
              " to place this bet."
          ),
        ],
      });
    win = Math.floor(Math.random() * 8) + 0 < 3 ? true : false;
    tax = calculateTax(5, Number(amount));
    if (win === false) command.user.cash.subtract(Number(amount));
    else command.user.cash.add(Number(amount * 2) - tax);
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bet");
    embed.setDescription(
      win
        ? "You Won!! We doubled your bet and you gained **" +
            (amount - tax).toLocaleString() +
            " " +
            command.config.currency.name +
            "** (after tax)"
        : "You Lost. We took your **" +
            amount.toLocaleString() +
            " " +
            command.config.currency.name +
            "**"
    );
    embed.setColor(win ? "#00FF00" : "#FF0000");
    command.reply({ embeds: [embed] });
    command.logHandler.newLog(
      "bet",
      new Log("bet", {
        amount: Number(amount),
        itemType: "cash",
        tax: tax,
        win: win,
      })
    );
  },
};
