const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
const Log = require("../Classes/Log.js");

function createProductModal() {
  const modal = new Modal()
    .setCustomId("productCreate")
    .setTitle("Create a product");

  const name = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("name")
      .setLabel("Product Name")
      .setPlaceholder("This is the name of my product")
      .setStyle("SHORT")
      .setMaxLength(32)
      .setRequired(true)
  );

  const item = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("item")
      .setLabel("The item (ONE PER LINE)")
      .setPlaceholder(
        "The item that will be sent to the user (it will be removed from the list after it is sold)"
      )
      .setStyle("PARAGRAPH")
      .setRequired(true)
  );

  const description = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("description")
      .setLabel("Product Description")
      .setPlaceholder("This is a long description of my product")
      .setStyle("PARAGRAPH")
      .setMaxLength(150)
      .setRequired(true)
  );

  const imageLink = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("imageLink")
      .setLabel("Link For Product Image")
      .setStyle("SHORT")
      .setPlaceholder("https://image.com/image.png")
      .setRequired(true)
  );

  const price = new MessageActionRow().addComponents(
    new TextInputComponent()
      .setCustomId("price")
      .setLabel("Product Price (Numbers Only)")
      .setStyle("SHORT")
      .setPlaceholder("500")
      .setRequired(true)
  );

  modal.addComponents(name, price, description, imageLink, item);
  return modal;
}

function typeCheck(int) {
  return int.map((obj) => {
    obj = obj.components[0];
    if (obj.customId === "price") if (isNaN(Number(obj.value))) return false;
    if (obj.customId === "name") if (typeof obj.value != "string") return false;
    if (obj.customId === "description")
      if (typeof obj.value != "string") return false;
    if (obj.customId === "imageLink")
      if (!/((?:https\:\/\/)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i.test(obj.value))
        return false;
    return true;
  });
}

async function execute(db, LogHandler, interaction, config) {
  if (
    !typeCheck(interaction.fields.components).every(
      (element) => element === true
    )
  ) {
    interaction.reply({
      content:
        "Please verify that you entered the correct information into the fields",
      ephemeral: true,
    });
  } else {
    interaction.reply({ content: "Product created!", ephemeral: true });
    let currentProducts = await db
      .db("data")
      .collection("products")
      .find({ "author.id": interaction.user.id })
      .toArray();
    if (currentProducts.length >= config.maxProducts)
      return interaction.reply({
        content: "You have the max amount of products!",
        ephemeral: true,
      });
    let product = {};
    await Promise.all(
      interaction.fields.components.map(
        (obj) => (product[obj.components[0].customId] = obj.components[0].value)
      )
    );
    product.price = parseInt(product.price);
    let lastProduct = await db
      .db("data")
      .collection("products")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    lastProduct = lastProduct[0]?.id ?? 0;
    product.id = lastProduct + 1;
    product.author = { id: interaction.user.id };
    product.item = product.item.split("\n");
    LogHandler.newLog(
      "productCreate",
      new Log("productCreate", {
        user: interaction.user.id,
        productID: product.id,
        amount: product.price.toLocaleString(),
        itemType: "cash",
        items: { silent: true, content: [product.item] },
        productName: product.name,
        productDescription: product.description,
        productImage: product.imageLink,
      })
    );
    db.db("data").collection("products").insertOne(product);
  }
}

module.exports = { createProductModal, typeCheck, execute };
