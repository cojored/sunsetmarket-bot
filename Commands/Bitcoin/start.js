const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "bitcoin start",
  description: "Start the bitcoin miner",
  usage: "{prefix}bitcoin start",
  alias: [],
  async execute(command) {
    let started = await command.user.bitcoin.start();
    if (started === false)
      return command.reply({
        embeds: [
          errorEmbed(
            "Please make sure you have sent 50 messages since the last time you started the miner\n\nAlso make sure you have paid your electric bills\n\nLastly make sure you have purchased the bitcoin miner (to purchase the miner do `" +
              command.config.prefix +
              "bitcoin upgrade`)"
          ),
        ],
      });
    let embed = new MessageEmbed();
    embed.setTitle("Started");
    embed.setColor("#00FF00");
    embed.setDescription(
      "Started the bitcoin miner, you can check the miners status with `" +
        command.config.prefix +
        "bitcoin status`"
    );
    command.reply({ embeds: [embed] });
  },
};
