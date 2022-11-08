const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
const Discord = require("discord.js");

function reportProductModal() {
  const modal = new Modal()
    .setCustomId("productReport")
    .setTitle("Delete a product");

  const item = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("item")
      .setLabel("The Item ID (Found in the url ?id={id})")
      .setStyle("SHORT")
      .setRequired(true)
  );

  modal.addComponents(item);
  return modal;
}

async function execute(db, LogHandler, interaction) {
  let item = await db
    .db("data")
    .collection("products")
    .findOne({
      id: Number(interaction.fields.components[0].components[0].value),
    });
  if (!item)
    return interaction.reply({ content: "Product not found", ephemeral: true });
  let client = new Discord.WebhookClient({
    url: "https://discord.com/api/webhooks/1006349637369737276/IRimrEIkPluRDTqbw_3SBIQEwouXrzcLluN_dMT8GoC6bx4rGUqZRx7iR9seFctmbXr2",
  });
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Product Report");
  embed.setDescription(
    `${item.name} (${item.id}) has been reported. View the product at https://sunsetmarket.heppcat.com/product?id=${item.id}`
  );
  client.send({ embeds: [embed] });
  return interaction.reply({
    content: "Product reported",
    ephemeral: true,
  });
}

module.exports = { reportProductModal, execute };
