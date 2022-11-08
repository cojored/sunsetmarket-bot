const { MessageEmbed } = require("discord.js");
const prettyDate = require("../../Functions/prettyDate");

function capitalizeFirstLetter(string) {
  return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
}

module.exports = {
  name: "miner status",
  description: "Get Status of The Miner",
  usage: "{prefix}miner status",
  alias: [],
  async execute(command) {
    let running = await command.user.miner.running();
    let earnings = await command.user.miner.earnings();
    let hourlyEarnings = await command.user.miner.hourlyEarnings();
    let silver = await command.user.miner.getInventorySpace("silver");
    let gold = await command.user.miner.getInventorySpace("gold");
    let diamond = await command.user.miner.getInventorySpace("diamond");
    let hourEarn = "";
    await Promise.all(
      Object.keys(hourlyEarnings).map((i) => {
        hourEarn +=
          capitalizeFirstLetter(i) +
          ": " +
          Number(hourlyEarnings[i].toFixed(2)).toLocaleString() +
          "\n";
      })
    );
    let heC = Number(
      Object.values(hourlyEarnings)
        .reduce(function (a, b) {
          return a + b;
        }, 0)
        .toFixed(2)
    );
    let earn = "";
    await Promise.all(
      Object.keys(earnings).map((i) => {
        earn +=
          capitalizeFirstLetter(i) +
          ": " +
          Number(earnings[i].toFixed(2)).toLocaleString() +
          "\n";
      })
    );
    let eC = Number(
      Object.values(earnings)
        .reduce(function (a, b) {
          return a + b;
        }, 0)
        .toFixed(2)
    );
    let data = await command.user.miner.getStatus();
    let embed = new MessageEmbed();
    embed.setTitle("Miner Status");
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
      "Inventory Space",
      `Silver: ${silver.toLocaleString()}\nGold: ${gold.toLocaleString()}\nDiamond: ${diamond.toLocaleString()}`,
      true
    );
    embed.addField(
      "Earnings",
      `${earn}Worth: **${eC.toLocaleString()} ${command.config.currency.rep}**`,
      true
    );
    embed.addField(
      "Estimated Hourly Earnings",
      `${hourEarn}Worth: **${heC.toLocaleString()} ${
        command.config.currency.rep
      }**`,
      true
    );
    embed.addField("** **", "** **");
    embed.addField("Paid Workers", data.paidWorkers ? "Yes" : "No", true);
    embed.addField("Sold Materials", data.soldMaterials ? "Yes" : "No", true);
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
