const { MessageEmbed } = require("discord.js");
const Log = require("../../Classes/Log");
const errorEmbed = require("../../Functions/errorEmbed");

function getThisEmbed(command) {
  return errorEmbed(
    "Please follow the format `" +
      command.config.prefix +
      "rob <ping>`\n\nTo rob you need to have **50 " +
      command.config.currency.name +
      "** and not be in passive mode\n\nFor someone to be robbed they need to have **100 " +
      command.config.currency.name +
      "** and not be in passive mode"
  );
}

module.exports = {
  name: "rob",
  alias: ["steal"],
  description: "Rob someone",
  usage: "{prefix}rob <ping>",
  async execute(command) {
    let bal = await command.user.cash.getBalance();
    let cooldown = await command.user.cooldowns.checkCooldown("rob");
    let passive = await command.user.passive();
    if (cooldown.expired === false)
      return command.reply({
        embeds: [
          errorEmbed(
            "You currently have a rob cooldown please try again <t:" +
              Math.round(Math.abs(cooldown.expires / 1000)) +
              ":R>"
          ),
        ],
      });
    if (
      !command.mentionedUsers[0] ||
      passive ||
      command.user.id ===
        (command.mentionedUsers[0] ? command.mentionedUsers[0].id : "0") ||
      bal < 50
    )
      return command.reply({ embeds: [getThisEmbed(command)] });
    let otherUserPassive = await command.mentionedUsers[0].passive();
    if (otherUserPassive)
      return command.reply({
        embeds: [errorEmbed("That user is in passive mode")],
      });
    let getRobCooldown =
      await command.mentionedUsers[0].cooldowns.checkCooldown("getRob");
    if (getRobCooldown.expired === false)
      return command.reply({
        embeds: [
          errorEmbed(
            "This user has been robbed from please try again <t:" +
              Math.round(Math.abs(getRobCooldown.expires / 1000)) +
              ":R>"
          ),
        ],
      });
    let otherUserBal = await command.mentionedUsers[0].cash.getBalance();
    if (otherUserBal < 100)
      return command.reply({ embeds: [getThisEmbed(command)] });
    success = Math.floor(Math.random() * 9) < 5 ? true : false;
    if (!success) {
      command.user.cash.subtract(50);
      command.mentionedUsers[0].cash.add(50);
      const embed = new MessageEmbed();
      embed.setTitle(
        "You failed at robbing " + command.mentionedUsers[0].username
      );
      embed.setDescription("You paid them 50 " + command.config.currency.rep);
      embed.setColor("#FF0000");
      command.reply({ embeds: [embed] });
      command.logHandler.newLog(
        "rob",
        new Log("rob", {
          from: command.user.id,
          to: command.mentionedUsers[0].id,
          amount: 50,
          itemType: "cash",
          failed: true,
        })
      );
      command.user.cooldowns.setCooldown("rob", 300000);
    } else {
      let amount = Math.floor(Math.random() * (250 - 50 + 1)) + 50;
      if (otherUserBal < 250)
        amount = Math.floor(Math.random() * (otherUserBal - 25 - 50 + 1)) + 50;
      command.mentionedUsers[0].cash.subtract(amount);
      command.user.cash.add(amount);
      const embed = new MessageEmbed();
      embed.setTitle("You robbed " + command.mentionedUsers[0].username);
      embed.setDescription(
        "You stole " +
          amount.toLocaleString() +
          " " +
          command.config.currency.rep
      );
      embed.setColor("#00FF00");
      command.reply({ embeds: [embed] });
      command.logHandler.newLog(
        "rob",
        new Log("rob", {
          from: command.user.id,
          to: command.mentionedUsers[0].id,
          amount: amount,
          itemType: "cash",
          failed: false,
        })
      );
      command.user.cooldowns.setCooldown("rob", 1800000);
      command.mentionedUsers[0].cooldowns.setCooldown("getRob", 3600000);
    }
  },
};
