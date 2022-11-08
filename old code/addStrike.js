const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../Functions/errorEmbed.js");
const SpamHandler = require("../Handlers/SpamHandler.js");
module.exports = {
  name: "addstrike",
  alias: [],
  description: "Add a strike",
  usage: "{prefix}addstrike <amount> <ping>",
  async execute(command) {
    let perms = await command.user.hasPerms();
    let user = command.mentionedUsers[0];
    let amount = Number(command.args[0]);
    if (!perms)
      return command.reply({
        embeds: [errorEmbed("You do not have permission to use this command")],
      });
    if (!user || isNaN(amount))
      return command.reply({
        embeds: [
          errorEmbed(
            "Follow the syntax `" +
              command.config.prefix +
              "removeStrke <amount> <ping>`"
          ),
        ],
      });
    let s = new SpamHandler(user);
    let strikes = await s.strikes();
    s.addStrike(amount);
    const embed = new MessageEmbed();
    embed.setTitle("Strike Added");
    embed.setDescription(
      "Added a strike to " +
        user.username +
        " they now have " +
        (strikes + amount).toLocaleString() +
        " strikes"
    );
    embed.setColor("#00FF00");
    command.reply({ embeds: [embed] });
  },
};
