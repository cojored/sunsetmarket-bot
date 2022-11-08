const express = require("express");
const app = express();
const { MessageEmbed } = require("discord.js");
const User = require("../Classes/User.js");
const defaultEmbedData = require("../Functions/defaultEmbedData.js");
const currency = require("../config.json").currency;
const Log = require("../Classes/Log.js");
module.exports = class API {
  constructor(port, db, client, logHandler) {
    this.db = db;

    app.get("/currency", (req, res) => {
      res.json(currency);
    });

    app.get("/balance/:id", async function (req, res) {
      let id = req.params.id;
      let user = new User({ id: id }, db);
      let bal = await user.cash.getBalance();
      res.json({ id: id, balance: bal, currency: currency });
    });

    app.get("/products", async function (req, res) {
      let products = (
        await db.db("data").collection("products").find().toArray()
      ).map((x) => {
        delete x._id;
        x.stock = x.item.length;
        delete x.item;
        return x;
      });
      res.json(products);
    });

    app.get("/product/:id", async function (req, res) {
      let product = await db
        .db("data")
        .collection("products")
        .findOne({ id: Number(req.params.id) });
      if (!product) return res.json({ error: "Product not found" });
      delete product._id;
      product.stock = product.item.length;
      delete product.item;
      res.json(product);
    });

    app.get("/checkout", async function (req, res) {
      let products = JSON.parse(req.query.cart);
      let user = new User({ id: JSON.parse(req.query.user).id }, db);
      let uB = await user.cash.getBalance();
      let total = 0;
      let e;
      await Promise.all(
        products.map(async function (i) {
          let product = await db
            .db("data")
            .collection("products")
            .findOne({ id: Number(i.id) });
          if (product.author.id === user.id) {
            e = true;
            return res.status(500).send("USER CANNOT BUY OWN PRODUCT");
          } else {
            total += i.quantity * product.price;
          }
        })
      );
      if (uB < total) return res.status(500).send("USER BALANCE TO LOW");
      if (e) return;
      let pds = "";
      let pdsLOG = "";
      for (let p in products) {
        let product = await db
          .db("data")
          .collection("products")
          .findOne({ id: Number(products[p].id) });
        let creator = new User({ id: product.author.id }, db);
        user.cash.subtract(product.price * products[p].quantity);
        creator.cash.add(product.price * products[p].quantity);
        if (product.item.length < products[p].quantity)
          return res.status(500).send("STOCK TO LOW");
        for (let i = 0; i < products[p].quantity; i++) {
          pds += `${product.name} (${i + 1}): ${product.item.shift()}\n`;
        }
        for (let i = 0; i < products[p].quantity; i++) {
          pdsLOG += `Name: ${product.name} (${i + 1}) | ID: ${
            product.id
          } | Author ID: ${product.author.id}\n`;
        }
        db.db("data")
          .collection("products")
          .updateOne({ id: product.id }, { $set: { item: product.item } });
      }
      client.guilds.cache
        .get("1001853424096256040")
        .members.fetch(JSON.parse(req.query.user).id)
        .then((member) => {
          let e = new MessageEmbed();
          let orderID = Math.floor(Math.random() * 1000000000);
          logHandler.newLog(
            "order",
            new Log("order", {
              amount: "-" + total.toLocaleString(),
              itemType: "cash",
              user: member.user.id,
              orderID: orderID,
              items_silent: {
                silent: true,
                content: pds,
              },
              items: pdsLOG,
            })
          );
          e.setTitle("Order | ID: " + orderID);
          e.setDescription(`${pds}`);
          e.setColor("#0000FF");
          member.user
            .send({
              embeds: [defaultEmbedData(e)],
            })
            .then((a) => {
              res.status(200).send("OK");
            });
        });
    });

    app.listen(port, () => console.log(`API Running on port ${port}`));
  }
};
