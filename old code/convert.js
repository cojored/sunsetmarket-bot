const { MessageEmbed } = require("discord.js");
const errorEmbed = require("../Functions/errorEmbed");

module.exports = {
  name: "convert",
  alias: [],
  description: "Convert Currencys",
  usage:
    "{prefix}convert <amount> <what unit are you converting from [usd, robux, tc$]>",
  async execute(command) {
    let amount = Number(command.args[0]);
    let type = command.args[1]
      ? command.args[1].toLowerCase()
      : command.args[1];
    let types = ["usd", "robux", "tc$"];
    if (isNaN(amount) || !types.includes(type))
      return command.reply({
        embeds: [
          errorEmbed(
            "Please follow the format `" +
              command.config.prefix +
              "convert <amount> <what unit are you converting from [usd, robux, tc$]>`"
          ),
        ],
      });
    let currencys = {
      usd: 0,
      robux: 0,
      tc$: 0,
    };
    switch (type.toLowerCase()) {
      case "usd":
        currencys["usd"] = amount;
        currencys["tc$"] = currencys["usd"] * command.config.conversion;
        currencys["robux"] = currencys["usd"] / 0.0125;
        break;
      case "robux":
        currencys["usd"] = amount * 0.0125;
        currencys["tc$"] = currencys["usd"] * command.config.conversion;
        currencys["robux"] = currencys["usd"] / 0.0125;
        break;
      case "c$":
        currencys["usd"] = amount / command.config.conversion;
        currencys["tc$"] = currencys["usd"] * command.config.conversion;
        currencys["robux"] = currencys["usd"] / 0.0125;
        break;
    }
    let embed = new MessageEmbed();
    embed.setTitle("Currency Conversion");
    embed.setDescription(
      `**United States Dollars:** $${currencys[
        "usd"
      ].toLocaleString()}\n\n**Robux:** ${currencys[
        "robux"
      ].toLocaleString()}\n\n**Cat Coins:** ${currencys[
        "tc$"
      ].toLocaleString()} TC$`
    );
    embed.setColor("#0000FF");
    command.reply({ embeds: [embed] });
  },
};
