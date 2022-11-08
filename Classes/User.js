const UserBalance = require("./UserBalance.js");
const Bitcoin = require("./Bitcoin.js");
const UserMessages = require("./UserMessages.js");
const UserCooldowns = require("./UserCooldowns.js");
const Miner = require("./Miner.js");
module.exports = class User {
  /**
   * User
   * @param {Discord.User} user
   * @param {LogHandler} logHandler
   */
  constructor(user, db, logHandler) {
    this.id = user.id;
    this.username = user.username;
    this.tag = user.tag;
    this.user = user;
    this._db = db;
    this.cash = new UserBalance(user.id, db, logHandler);
    this.cooldowns = new UserCooldowns(user.id, db);
    this.messages = new UserMessages(user.id, db);
    this.bitcoin = new Bitcoin(user.id, db, logHandler, this.messages);
    this.miner = new Miner(this.user.id, db, logHandler);
  }
  async gotNotification() {
    let gotNotification = await this._db
      .db("data")
      .collection("notifications")
      .findOne({ id: this.id });
    if (!gotNotification || gotNotification.got === false) return false;
    else return true;
  }
  async setGotNotification(d) {
    let gotNotification = await this._db
      .db("data")
      .collection("notifications")
      .findOne({ id: this.id });
    if (!gotNotification)
      this._db
        .db("data")
        .collection("notifications")
        .insertOne({ id: this.id, got: d });
    else
      this._db
        .db("data")
        .collection("notifications")
        .updateOne({ id: this.id }, { $set: { got: d } });
  }
  async passive() {
    let passive = await this._db
      .db("data")
      .collection("passive")
      .findOne({ id: this.id });
    if (!passive || passive.passive === false) return false;
    else return true;
  }
  async setPassive(p) {
    let pdb = this._db.db("data").collection("passive");
    let passive = await pdb.findOne({ id: this.id });
    if (!passive) pdb.insertOne({ id: this.id, passive: p });
    else pdb.updateOne({ id: this.id }, { $set: { passive: p } });
  }
  async hasPerms() {
    let perms = await this._db
      .db("data")
      .collection("perms")
      .findOne({ id: this.id });
    if (!perms || perms.perms === false) return false;
    else return true;
  }
  async setPerms(p) {
    let pdb = this._db.db("data").collection("perms");
    let perms = await pdb.findOne({ id: this.id });
    if (!perms) pdb.insertOne({ id: this.id, perms: p });
    else pdb.updateOne({ id: this.id }, { $set: { perms: p } });
  }
};
