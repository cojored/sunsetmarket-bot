const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
const Log = require("../Classes/Log");

function deleteProductModal() {
  const modal = new Modal()
    .setCustomId("productDelete")
    .setTitle("Delete a product");

  const item = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("item")
      .setLabel("The Item ID (Found in the product list)")
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
      "author.id": interaction.user.id,
    });
  if (!item)
    return interaction.reply({ content: "Product not found", ephemeral: true });
  await db
    .db("data")
    .collection("products")
    .deleteOne({
      id: Number(interaction.fields.components[0].components[0].value),
      "author.id": interaction.user.id,
    });
  LogHandler.newLog(
    "productDelete",
    new Log("productDelete", {
      user: interaction.user.id,
      productID: interaction.fields.components[0].components[0].value,
    })
  );
  return interaction.reply({
    content: "Product deleted",
    ephemeral: true,
  });
}

module.exports = { deleteProductModal, execute };
