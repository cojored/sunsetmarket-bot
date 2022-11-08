const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "bitcoin stop",
  description: "Stop the bitcoin miner",
  usage: "{prefix}bitcoin stop",
  alias: [],
  async execute(command) {
    let running = await command.user.bitcoin.running();
    if (running === false)
      return command.reply({
        embeds: [errorEmbed("Please make sure the bitcoin miner is running")],
      });
    command.user.bitcoin.setStopTime(new Date().getTime());
    let embed = new MessageEmbed();
    embed.setTitle("Stopped");
    embed.setColor("#FFA500");
    embed.setDescription(
      "Stopped the bitcoin miner, you can check the miners status with `" +
        command.config.prefix +
        "bitcoin status`"
    );
    command.reply({ embeds: [embed] });
  },
};
