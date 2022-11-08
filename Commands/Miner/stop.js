const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "miner stop",
  description: "Stop the miner",
  usage: "{prefix}miner stop",
  alias: [],
  async execute(command) {
    let running = await command.user.miner.running();
    if (running === false)
      return command.reply({
        embeds: [errorEmbed("Please make sure the miner is running")],
      });
    command.user.miner.setStopTime(new Date().getTime());
    let embed = new MessageEmbed();
    embed.setTitle("Stopped");
    embed.setColor("#FFA500");
    embed.setDescription(
      "Stopped the miner, you can check the miners status with `" +
        command.config.prefix +
        "miner status`"
    );
    command.reply({ embeds: [embed] });
  },
};
