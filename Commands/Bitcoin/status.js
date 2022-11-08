const { MessageEmbed } = require("discord.js");
const prettyDate = require("../../Functions/prettyDate");

module.exports = {
  name: "bitcoin status",
  description: "Get Status of Bitcoin Miner",
  usage: "{prefix}bitcoin status",
  alias: [],
  async execute(command) {
    let running = await command.user.bitcoin.running();
    let earnings = await command.user.bitcoin.earnings();
    let hourlyEarnings = await command.user.bitcoin.hourlyEarnings();
    let data = await command.user.bitcoin.getStatus();
    let embed = new MessageEmbed();
    embed.setTitle("Bitcoin Miner Status");
    embed.addField(
      "Started",
      data.started === 0 ? "`Never`" : `\`${prettyDate(data.started)}\``,
      true
    );
    embed.addField(
      running ? "Stops" : "Stopped",
      data.stops === 0 ? "`Never`" : `\`${prettyDate(data.stops)}\``,
      true
    );
    embed.addField("Running", running ? "Yes" : "No", true);
    embed.addField("** **", "** **");
    embed.addField(
      "Level",
      `${Number(data.level.toFixed(2)).toLocaleString()}`,
      true
    );
    embed.addField(
      "Earnings",
      `${Number(earnings.toFixed(2)).toLocaleString()} ${
        command.config.currency.rep
      }`,
      true
    );
    embed.addField(
      "Estimated Hourly Earnings",
      `${Number(hourlyEarnings.toFixed(2)).toLocaleString()} ${
        command.config.currency.rep
      }`,
      true
    );
    embed.addField("** **", "** **");
    embed.addField(
      "Messages Since Started",
      data.started === 0 ? "Never Started" : `${data.messagesSinceStarted}`,
      true
    );
    embed.addField(
      "Paid Electricity Bills",
      data.paidElectric ? "Yes" : "No",
      true
    );
    embed.addField("Redeemed", data.redeemed ? "Yes" : "No", true);
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
