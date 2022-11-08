const { MessageEmbed } = require("discord.js");
const Log = require("../../Classes/Log");
const calculateTax = require("../../Functions/calculateTax");
const errorEmbed = require("../../Functions/errorEmbed");

module.exports = {
  name: "bitcoin cashout",
  description: "Get Bitcoin Miner Profits",
  usage: "{prefix}bitcoin cashout",
  alias: ["bitcoin redeem"],
  async execute(command) {
    let earnings = await command.user.bitcoin.earnings();
    let redeemed = await command.user.bitcoin.redeemed();
    let tax = calculateTax(15, earnings);
    let running = await command.user.bitcoin.running();
    if (running || earnings <= 0 || redeemed)
      return command.reply({
        embeds: [
          errorEmbed(
            "Please make sure the miner is not running and that you have actually earned something.\n\nAlso make sure you have not already redeemed your earnings."
          ),
        ],
      });
    let embed = new MessageEmbed();
    embed.setTitle("Redeemed");
    embed.setColor("#00FF00");
    embed.setDescription(
      `You gained **${Number((earnings - tax).toFixed(2)).toLocaleString()} ${
        command.config.currency.rep
      }** after the ${tax.toLocaleString()} ${
        command.config.currency.rep
      } in electric costs`
    );
    command.user.cash.add(Number((earnings - tax).toFixed(2)));
    command.user.bitcoin.setPaidElectric(true);
    command.user.bitcoin.setRedeemed(true);
    command.logHandler.newLog(
      "cashout",
      new Log("cashout", {
        user: command.user.id,
        amount: earnings,
        tax: tax,
        itemType: "cash",
        minerType: "bitcoin",
      })
    );
    command.reply({ embeds: [embed] });
  },
};
