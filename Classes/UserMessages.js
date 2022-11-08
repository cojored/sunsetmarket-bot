const wait = require("../Functions/wait.js");
module.exports = class UserMessages {
  /**
   * User Message Functions
   * @param {String} userid
   * @param {DB} db
   */
  constructor(userid, db) {
    this.messageDB = db.db("data").collection("messages");
    this.userid = userid;
    this.checkAndCreate();
  }
  async checkAndCreate() {
    let messages = await this.messageDB.findOne({ id: this.userid });
    if (!messages)
      this.messageDB.insertOne({
        id: this.userid,
        messages: 0,
      });
    this.exist = true;
  }
  async getAmount() {
    if (!this.exist) await wait(100);
    let amount = (await this.messageDB.findOne({ id: this.userid })).messages;
    return amount;
  }
  /**
   * Add Messages
   * @param {Number} amount
   */
  async add(amount) {
    if (isNaN(Number(amount))) return false;
    let old = await this.getAmount();
    await this.messageDB.updateOne(
      { id: this.userid },
      { $set: { messages: old + amount } }
    );
    return true;
  }
};
