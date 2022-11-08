const errorEmbed = require("../../Functions/errorEmbed.js");
const Discord = require("discord.js");
const Log = require("../../Classes/Log.js");
module.exports = {
  name: "set",
  alias: [],
  description: "Set a users balance",
  usage: "{prefix}set <amount> <ping?>",
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
              "set <amount> <ping?>`\n\nAmount must be a number"
          ),
        ],
      });
    user.cash.set(Number(amount));
    command.logHandler.newLog(
      "set",
      new Log("set", {
        from: command.user.id,
        to: user.id,
        amount: Number(amount),
        itemType: "cash",
      })
    );
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Set " + user.username + "'s" + " Balance");
    embed.setDescription(
      "Set " +
        user.username +
        "'s" +
        " balance to " +
        amount.toLocaleString() +
        " " +
        command.config.currency.rep
    );
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
