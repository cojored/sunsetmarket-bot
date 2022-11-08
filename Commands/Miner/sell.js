const { MessageEmbed } = require("discord.js");
const calculateTax = require("../../Functions/calculateTax");
const errorEmbed = require("../../Functions/errorEmbed");
const Log = require("../../Classes/Log.js");

module.exports = {
  name: "miner sell",
  description: "Sell Materials",
  usage: "{prefix}miner sell",
  alias: [],
  async execute(command) {
    let earnings = await command.user.miner.earnings();
    let e = Number(
      Object.values(earnings)
        .reduce(function (a, b) {
          return a + b;
        }, 0)
        .toFixed(2)
    );
    let soldMaterials = await command.user.miner.soldMaterials();
    let tax = calculateTax(15, e);
    let running = await command.user.miner.running();
    if (running || e <= 0 || soldMaterials)
      return command.reply({
        embeds: [
          errorEmbed(
            "Please make sure the miner is not running and that you have actually mined something.\n\nAlso make sure you have not already sold your materials."
          ),
        ],
      });
    let embed = new MessageEmbed();
    embed.setTitle("Sold");
    embed.setColor("#00FF00");
    embed.setDescription(
      `You gained **${Number((e - tax).toFixed(2)).toLocaleString()} ${
        command.config.currency.rep
      }** after the ${tax.toLocaleString()} ${
        command.config.currency.rep
      } in worker payments`
    );
    command.user.cash.add(Number((e - tax).toFixed(2)));
    command.logHandler.newLog(
      "cashout",
      new Log("cashout", {
        user: command.user.id,
        amount: e,
        tax: tax,
        itemType: "cash",
        minerType: "physical",
      })
    );
    command.user.miner.setPaidWorkers(true);
    command.user.miner.setSoldMaterials(true);
    command.reply({ embeds: [embed] });
  },
};
