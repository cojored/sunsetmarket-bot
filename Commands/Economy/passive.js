const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");
const prettyMilliseconds = require("../../Functions/prettyMs");

module.exports = {
  name: "passive",
  alias: [],
  description: "Enter/Exit Passive mode",
  usage: "{prefix}passive <true/false>",
  async execute(command) {
    let passive = command.args[0];
    let passiveCooldown = await command.user.cooldowns.checkCooldown("passive");
    if (passive === "true" || passive === "false") {
      if (passiveCooldown.expired) {
        if (passive === "true") {
          command.user.setPassive(true);
          const embed = new MessageEmbed();
          embed.setTitle("Enabled Passive Mode");
          embed.setColor("#00FF00");
          command.reply({ embeds: [embed] });
        } else if (passive === "false") {
          const embed = new MessageEmbed();
          embed.setTitle("Disabled Passive Mode");
          embed.setDescription(
            "Please wait 5 hours before enabling passive mode again"
          );
          embed.setColor("#FFA500");
          command.reply({ embeds: [embed] });
          command.user.setPassive(false);
          command.user.cooldowns.setCooldown("passive", 18000000);
        }
      } else {
        command.reply({
          embeds: [
            errorEmbed(
              "There is a cooldown please wait " +
                prettyMilliseconds(
                  passiveCooldown.expires - new Date().getTime(),
                  {
                    verbose: true,
                    seconds: false,
                    justNow: false,
                  }
                )
            ),
          ],
        });
      }
    } else {
      let passive = await command.user.passive();
      const embed = new MessageEmbed();
      embed.setTitle("Passive Mode");
      embed.setDescription(
        "Passive mode is currently set to **" +
          (passive ? "enabled" : "disabled") +
          "**"
      );
      embed.setColor("#0000FF");
      command.reply({ embeds: [embed] });
    }
  },
};
