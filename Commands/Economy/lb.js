const { MessageEmbed } = require("discord.js");
const defaultEmbedData = require("../../Functions/defaultEmbedData");

module.exports = {
  name: "lb",
  alias: ["leaderboard"],
  description: "Shows the points leaderboard",
  usage: "{prefix}lb",
  async execute(command) {
    let genEmbed = new MessageEmbed().setTitle("Generating....");
    defaultEmbedData(genEmbed);
    command.message.reply({ embeds: [genEmbed] }).then(async (m) => {
      const perms = await command.db
        .db("data")
        .collection("perms")
        .find({})
        .toArray();
      const top10 = (
        await (
          await command.db.db("data").collection("cash").find({}).toArray()
        ).filter((i) => !(perms.find((x) => x.id === i.id) != undefined))
      )
        .sort(function (a, b) {
          return b.balance.use - a.balance.use;
        })
        .splice(0, 5);
      const embed = new MessageEmbed();
      embed.setTitle(
        command.config.currency.name + " Leaderboard (Top 5 Users)"
      );
      let desc = "";
      await Promise.all(
        top10.map(async function (i) {
          desc += `<@${i.id}> **(${
            i.id
          })**: ${i.balance.use.toLocaleString()} ${
            command.config.currency.rep
          }\n\n`;
        })
      );
      embed.setDescription(desc);
      embed.setColor("#0000FF");
      defaultEmbedData(embed);
      m.edit({ embeds: [embed] });
    });
  },
};
