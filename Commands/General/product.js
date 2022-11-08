const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "product",
  description: "Manage products",
  usage: "{prefix}product <reply?>",
  alias: [],
  async execute(command) {
    let reply = command.args[0] === "false" ? false : true;
    if (reply)
      command.message.reply({
        content: "Please use the buttons below to manage your product",
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("cp")
              .setLabel("Create Product")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("ep")
              .setLabel("Edit Product")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("dp")
              .setLabel("Delete Product")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("pl")
              .setLabel("Product List")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("rp")
              .setLabel("Report Product")
              .setStyle("DANGER")
          ),
        ],
      });
    else
      command.message.channel.send({
        content: "Please use the buttons below to manage your product",
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("cp")
              .setLabel("Create Product")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("ep")
              .setLabel("Edit Product")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("dp")
              .setLabel("Delete Product")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("pl")
              .setLabel("Product List")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("rp")
              .setLabel("Report Product")
              .setStyle("DANGER")
          ),
        ],
      });
  },
};
