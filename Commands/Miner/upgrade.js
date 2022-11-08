const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../../Functions/errorEmbed");
const Log = require("../../Classes/Log.js");

module.exports = {
  name: "miner upgrade",
  description: "Upgrade the miner",
  usage:
    "{prefix}miner upgrade <item[silver,gold,diamond]> <upgrade inventory space? [true/false]]>",
  alias: [],
  async execute(command) {
    let running = await command.user.miner.running();
    let soldMaterials = await command.user.miner.soldMaterials();
    let balance = await command.user.cash.getBalance();
    let item = command.args[0];
    let items = ["silver", "gold", "diamond"];
    if (!item || !command.args[1])
      return command.reply({
        embeds: [
          errorEmbed(
            "Please follow the format\n`" +
              command.config.prefix +
              "miner upgrade <item[silver,gold,diamond]> <upgrade inventory space? [true/false]>`"
          ),
        ],
      });
    let inventory = command.args[1].toLowerCase() === "true" ? true : false;
    item = item.toLowerCase();
    if (!item || !items.includes(item))
      return command.reply({
        embeds: [
          errorEmbed(
            "Please follow the format\n`" +
              command.config.prefix +
              "miner upgrade <item[silver,gold,diamond]> <upgrade inventory space? [true/false]>`"
          ),
        ],
      });
    let upgradePrice = await command.user.miner.getUpgradePrice(
      item,
      inventory
    );
    if (
      upgradePrice > balance ||
      running ||
      !soldMaterials ||
      typeof upgradePrice === "boolean"
    )
      return command.reply({
        embeds: [
          errorEmbed(
            "Make sure you have the required " +
              (upgradePrice === false ? "N/A" : upgradePrice.toLocaleString()) +
              " " +
              command.config.currency.rep +
              " to purchase this\n\nAlso make sure the miner is not running\n\nLastly make sure you have sold your materials\n\nIf you fit all the other requierments you have hit the max upgrade level"
          ),
        ],
      });
    let embed = new MessageEmbed();
    await command.user.miner.addLevel(1, item, inventory);
    command.user.cash.subtract(upgradePrice);
    command.logHandler.newLog(
      "upgrade",
      new Log("upgrade", {
        user: command.user.id,
        amount: upgradePrice,
        itemType: "-cash",
        minerType: "physical",
      })
    );
    embed.setTitle(
      "Upgraded " +
        item +
        (inventory ? " inventory space" : " mining equipment")
    );
    embed.setDescription(
      "You spent " +
        upgradePrice.toLocaleString() +
        " " +
        command.config.currency.rep
    );
    embed.setColor("#00FF00");
    command.reply({ embeds: [embed] });
  },
};
