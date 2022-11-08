const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "miner start",
  description: "Start the miner",
  usage: "{prefix}miner start",
  alias: [],
  async execute(command) {
    let started = await command.user.miner.start();
    if (started === false)
      return command.reply({
        embeds: [
          errorEmbed(
            "Please make sure you have sold your materials and paid your workers."
          ),
        ],
      });
    let embed = new MessageEmbed();
    embed.setTitle("Started");
    embed.setColor("#00FF00");
    embed.setDescription(
      "Started the miner, you can check the miners status with `" +
        command.config.prefix +
        "miner status`"
    );
    command.reply({ embeds: [embed] });
  },
};
