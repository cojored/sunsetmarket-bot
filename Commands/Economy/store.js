const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "store",
  alias: ["shop"],
  description: "View the store",
  usage: "{prefix}store",
  async execute(command) {
    const embed = new MessageEmbed();
    embed.setTitle("Store");
    embed.setDescription("Please view our store at https://sunsetmarket.heppcat.com");
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
