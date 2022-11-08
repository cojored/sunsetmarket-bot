const errorEmbed = require("../../Functions/errorEmbed.js");
const Discord = require("discord.js");
const Log = require("../../Classes/Log.js");
module.exports = {
  name: "bitcoin addlevel",
  alias: [],
  description: "Set a users bitcoin miner level",
  usage: "{prefix}bitcoin addlevel <level> <ping?>",
  async execute(command) {
    let perms = await command.user.hasPerms();
    let user = command.mentionedUsers[0] || command.user;
    let level = command.args[0];
    if (!perms)
      return command.reply({
        embeds: [errorEmbed("You do not have permission to use this command")],
      });
    if (isNaN(Number(level)))
      return command.reply({
        embeds: [
          errorEmbed(
            "`" +
              command.config.prefix +
              "bitcoin addlevel <level> <ping?>`\n\nLevel must be a number"
          ),
        ],
      });
    let current = await user.bitcoin.getLevel();
    command.logHandler.newLog(
      "add",
      new Log("add", {
        from: command.user.id,
        to: user.id,
        amount: Number(level),
        itemType: "level",
        minerType: "bitcoin",
      })
    );
    user.bitcoin.addLevel(Number(level));
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Added to " + user.username + "'s Bitcoin Miner Level");
    embed.setDescription(
      "The Users New Level: " +
        (Number(current) + Number(level)).toLocaleString()
    );
    embed.setColor("#00FF00");
    command.reply({ embeds: [embed] });
  },
};
