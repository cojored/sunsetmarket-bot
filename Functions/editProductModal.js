const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
const Log = require("../Classes/Log");

function editProductModal() {
  const modal = new Modal()
    .setCustomId("productEdit")
    .setTitle("Edit a product");

  const item = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("item")
      .setLabel("The Item ID (Found in the product list)")
      .setStyle("SHORT")
      .setRequired(true)
  );

  const field = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("field")
      .setLabel("The field to edit")
      .setPlaceholder("name, description, item, price, imageLink")
      .setStyle("SHORT")
      .setRequired(true)
  );

  const update = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("update")
      .setLabel("The Updated Field")
      .setStyle("PARAGRAPH")
      .setRequired(true)
  );

  modal.addComponents(item, field, update);
  return modal;
}

function typeCheck(item) {
  if (item.field === "price") if (isNaN(Number(item.value))) return false;
  if (item.field === "name") if (typeof item.value != "string") return false;
  if (item.field === "description")
    if (typeof item.value != "string") return false;
  if (item.field === "imageLink")
    if (!/((?:https\:\/\/)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i.test(item.value))
      return false;
  if (item.field === "item") if (typeof item.value != "string") return false;
  return true;
}

async function execute(db, LogHandler, interaction) {
  let item;
  let fields = interaction.fields.components.map((obj) => obj.components[0]);
  let e;
  let a = await Promise.all(
    fields.map(async (element) => {
      if (element.customId === "item") {
        item = await db
          .db("data")
          .collection("products")
          .findOne({
            id: Number(element.value),
            "author.id": interaction.user.id,
          });
        if (!e)
          if (!item) {
            e = true;
            return interaction.reply({
              content: "Item not found",
              ephemeral: true,
            });
          }
      } else if (element.customId === "field") {
        if (
          element.value !== "name" &&
          element.value !== "description" &&
          element.value !== "price" &&
          element.value !== "imageLink" &&
          element.value !== "item"
        )
          if (!e) {
            e = true;
            return interaction.reply({
              content: "Field not found",
              ephemeral: true,
            });
          }
      }
    })
  );
  if (e) return;
  if (
    typeCheck({
      value: fields.find((x) => x.customId === "update").value,
      field: fields.find((x) => x.customId === "field").value,
    })
  ) {
    let f = fields.find((x) => x.customId === "field").value;
    if (f === "price") {
      item[f] = Number(fields.find((x) => x.customId === "update").value);
    } else if (f === "item") {
      item[f] = item[f].concat(
        fields.find((x) => x.customId === "update").value.split("\n")
      );
    } else {
      item[f] = fields.find((x) => x.customId === "update").value;
    }
    await db
      .db("data")
      .collection("products")
      .updateOne(
        { id: Number(item.id), "author.id": interaction.user.id },
        { $set: item }
      );
    interaction.reply({
      content: "Product updated",
      ephemeral: true,
    });
    LogHandler.newLog(
      "productEdit",
      new Log("productEdit", {
        user: interaction.user.id,
        productID: item.id,
        fieldUpdated: f,
        newValue: f === "item" ? "Classified" : item[f],
      })
    );
  } else {
    interaction.reply({
      content: "Invalid input",
      ephemeral: true,
    });
  }
}

module.exports = { editProductModal, typeCheck, execute };
