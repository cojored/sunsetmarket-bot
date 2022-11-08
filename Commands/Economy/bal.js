const Discord = require("discord.js");

module.exports = {
  name: "bal",
  alias: ["balance", "b"],
  description: "Show a users balance",
  usage: "{prefix}bal <ping?>",
  async execute(command) {
    let user = command.mentionedUsers[0] || command.user;
    balance = await user.cash.getBalance();
    const embed = new Discord.MessageEmbed();
    embed.setTitle(user.username + "'s Balance");
    embed.addField(
      "Current " + command.config.currency.name,
      balance.toLocaleString() + " " + command.config.currency.rep,
      true
    );
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
