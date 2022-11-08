const errorEmbed = require("../../Functions/errorEmbed.js");
const Discord = require("discord.js");
const Log = require("../../Classes/Log.js");
module.exports = {
  name: "subtract",
  alias: ["sub"],
  description: "Subtract from a users balance",
  usage: "{prefix}subtract <amount> <ping?>",
  async execute(command) {
    let perms = await command.user.hasPerms();
    let amount = command.args[0]
      ? Number(command.args[0].replace(/,/g, ""))
      : Number(command.args[0]);
    let user = command.mentionedUsers[0] || command.user;
    if (!perms)
      return command.reply({
        embeds: [errorEmbed("You do not have permission to use this command")],
      });
    if (isNaN(Number(amount)))
      return command.reply({
        embeds: [
          errorEmbed(
            "`" +
              command.config.prefix +
              "subtract <amount> <ping?>`\n\nAmount must be a number"
          ),
        ],
      });
    user.cash.subtract(Number(amount));
    command.logHandler.newLog(
      "subtract",
      new Log("subtract", {
        from: command.user.id,
        to: user.id,
        amount: Number(amount),
        itemType: "-cash",
      })
    );
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Subtracted to " + user.username + "'s" + " Balance");
    embed.setDescription(
      "Subtracted **" +
        amount.toLocaleString() +
        " " +
        command.config.currency.rep +
        "** to " +
        user.username +
        "'s" +
        " balance"
    );
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
