const Discord = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "pay",
  alias: ["p"],
  description: "Pay someone",
  usage: "{prefix}pay <amount> <ping>",
  async execute(command) {
    let fromUser = command.user;
    let amount = command.args[0]
      ? command.args[0].replace(/,/g, "")
      : command.args[0];
    let toUser = command.mentionedUsers[0];
    data = await fromUser.cash.pay(amount, toUser);

    if (typeof data === "boolean")
      return command.reply({
        embeds: [
          errorEmbed(
            "Please make sure the following syntax is followed `" +
              command.config.prefix +
              "pay <amount> <user ping>`\n\n" +
              " Please also make sure the amount is a number **greater than 1** and does **NOT** include decimals.\n\nLastly make sure you have enough " +
              command.config.currency.name +
              " to pay this person"
          ),
        ],
      });
    const embed = new Discord.MessageEmbed();
    embed.setTitle(fromUser.username + " paid " + toUser.username);
    embed.setDescription(
      fromUser.username +
        " paid " +
        toUser.username +
        " **" +
        data.amount.toLocaleString() +
        " " +
        command.config.currency.rep +
        "** they also paid **" +
        data.tax.toLocaleString() +
        " " +
        command.config.currency.rep +
        "** in tax"
    );
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
