const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");
const defaultEmbedData = require("../../Functions/defaultEmbedData.js");
const howThisWorksEmbed = require("../../Functions/howThisWorksEmbed.js");

function capitalizeFirstLetter(string) {
  return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
}

function getDisabledButtons(folders, perms) {
  btns = [];
  btns2 = [];
  buttons = new MessageActionRow();
  buttons2 = new MessageActionRow();
  btns.push(
    new MessageButton()
      .setCustomId("General")
      .setLabel("General")
      .setStyle("SECONDARY")
      .setDisabled(true)
  );
  folders.forEach((f) => {
    if (f != "General")
      if (f === "Owner" && perms)
        btns2.push(
          new MessageButton()
            .setCustomId(f)
            .setLabel(f)
            .setStyle("SECONDARY")
            .setDisabled(true)
        );
      else if (f != "Owner")
        btns.push(
          new MessageButton()
            .setCustomId(f)
            .setLabel(f)
            .setStyle("SECONDARY")
            .setDisabled(true)
        );
  });
  buttons.addComponents(btns);
  buttons2.addComponents(btns2);
  return buttons2.components.length > 0 ? [buttons, buttons2] : [buttons];
}

module.exports = {
  name: "help",
  alias: [],
  description: "Get help with a command",
  usage: "{prefix}help <command?>",
  async execute(command) {
    const embed = new MessageEmbed();
    let data = command.commands[command.args.join(" ").toLowerCase()];
    if (data) {
      embed.setTitle("Command Help");
      embed.setColor("#0000FF");
      embed.setDescription(
        "Name: " +
          capitalizeFirstLetter(data.name) +
          "\nDescription: " +
          data.description +
          "\nUsage: `" +
          data.usage.replace(/{prefix}/g, command.config.prefix) +
          "`\nAliases: " +
          (data.alias.length === 0 ? "None" : data.alias.join(", "))
      );
      command.reply({ embeds: [embed] });
    } else {
      embed.setTitle("Help");
      embed.setDescription("Please choose a command section");
      embed.setColor("#0000FF");
      let perms = await command.user.hasPerms();
      let buttons = new MessageActionRow();
      let buttons2 = new MessageActionRow();
      let folders = fs.readdirSync(__dirname + "/../");
      folders.push("How this Works");
      let btns = [];
      let btns2 = [];
      let edit = false;
      btns.push(
        new MessageButton()
          .setCustomId("General")
          .setLabel("General")
          .setStyle("SECONDARY")
      );
      folders.forEach((f) => {
        if (f != "General")
          if (f === "Owner" && perms)
            btns2.push(
              new MessageButton()
                .setCustomId(f)
                .setLabel(f)
                .setStyle("SECONDARY")
            );
          else if (f != "Owner")
            btns.push(
              new MessageButton()
                .setCustomId(f)
                .setLabel(f)
                .setStyle("SECONDARY")
            );
      });
      buttons.addComponents(btns);
      buttons2.addComponents(btns2);
      defaultEmbedData(embed);
      command.message
        .reply({
          embeds: [embed],
          components:
            buttons2.components.length > 0 ? [buttons, buttons2] : [buttons],
        })
        .then((m) => {
          let filter = (i) =>
            i.user.id === command.user.id && i.message.id === m.id;
          let collector =
            command.message.channel.createMessageComponentCollector({
              filter,
              time: 15000,
            });
          collector.on("collect", async function (i) {
            if (i.customId === "How this Works") {
              m.edit({
                embeds: [howThisWorksEmbed(command.config)],
                components: getDisabledButtons(folders, perms),
              });
              i.deferUpdate();
              edit = true;
            } else {
              cmds = command.commandsSorted[i.customId];
              dataEmbed = new MessageEmbed();
              dataEmbed.setColor("#0000FF");
              dataEmbed.setTitle(i.customId + " Help");
              cmds.forEach((cmd) => {
                dataEmbed.addField(
                  capitalizeFirstLetter(cmd.name),
                  `Description: ${
                    cmd.description
                  }\nUsage: \`${cmd.usage.replace(
                    /{prefix}/g,
                    command.config.prefix
                  )}\``
                );
              });
              m.edit({
                embeds: [dataEmbed],
                components: getDisabledButtons(folders, perms),
              });
              i.deferUpdate();
              edit = true;
            }
          });
          collector.on("end", () => {
            if (edit) return;
            m.edit({
              embeds: [embed],
              components: getDisabledButtons(folders, perms),
            });
          });
        });
    }
  },
};
