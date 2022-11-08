const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");
const Log = require("../../Classes/Log.js");

module.exports = {
  name: "bitcoin upgrade",
  description: "Upgrade the bitcoin miner",
  usage: "{prefix}bitcoin upgrade",
  alias: [],
  async execute(command) {
    let upgradePrice = await command.user.bitcoin.getUpgradePrice();
    let running = await command.user.bitcoin.running();
    let redeemed = await command.user.bitcoin.redeemed();
    let balance = await command.user.cash.getBalance();
    let lvl = await command.user.bitcoin.getLevel();
    if (!redeemed && lvl != 0)
      return command.reply({
        embeds: [
          errorEmbed(
            "Make sure you have the required " +
              (upgradePrice === false ? "N/A" : upgradePrice.toLocaleString()) +
              " " +
              command.config.currency.rep +
              " to purchase this\n\nAlso make sure the miner is not running\n\nLastly make sure you have redeemed your earnings"
          ),
        ],
      });
    if (upgradePrice > balance || running || lvl >= 20)
      return command.reply({
        embeds: [
          errorEmbed(
            "Make sure you have the required " +
              (upgradePrice === false ? "N/A" : upgradePrice.toLocaleString()) +
              " " +
              command.config.currency.rep +
              " to purchase this\n\nAlso make sure the miner is not running\n\nLastly make sure you have redeemed your earnings"
          ),
        ],
      });
    let embed = new MessageEmbed();
    let newLevel = await command.user.bitcoin.addLevel();
    command.user.cash.subtract(upgradePrice);
    command.logHandler.newLog(
      "upgrade",
      new Log("upgrade", {
        user: command.user.id,
        amount: upgradePrice,
        itemType: "-cash",
        minerType: "bitcoin",
      })
    );
    embed.setTitle("Upgraded Miner");
    embed.setDescription(
      "New Miner Level: " +
        newLevel.toLocaleString() +
        " you spent " +
        upgradePrice.toLocaleString() +
        " " +
        command.config.currency.rep
    );
    embed.setColor("#00FF00");
    command.reply({ embeds: [embed] });
  },
};
