const errorEmbed = require("../../Functions/errorEmbed.js");
const Discord = require("discord.js");
const Log = require("../../Classes/Log.js")
module.exports = {
  name: "setperms",
  alias: ["sp"],
  description: "Add or remove a users perms",
  usage: "{prefix}setperms <true/false> <ping>",
  async execute(command) {
    let perms = await command.user.hasPerms();
    if (!perms)
      return command.reply({
        embeds: [errorEmbed("You do not have permission to use this command")],
      });
    if (!command.args[0] || !command.mentionedUsers[0])
      return command.reply({
        embeds: [
          errorEmbed(
            "Please follow the format `" +
              command.config.prefix +
              "setperms <true/false> <ping>`"
          ),
        ],
      });
    let setperms = command.args[0] === "true" ? true : false;
    let user = command.mentionedUsers[0];
    user.setPerms(setperms);
    command.logHandler.newLog(
      "set",
      new Log("set", {
        from: command.user.id,
        to: user.id,
        value: true,
        itemType: "perms",
      })
    );
    const embed = new Discord.MessageEmbed();
    embed.setColor("#0000FF");
    embed.setTitle(
      (setperms ? "Gave " : "Removed ") +
        user.username +
        (setperms ? "" : "'s") +
        " perms"
    );
    command.reply({ embeds: [embed] });
  },
};
