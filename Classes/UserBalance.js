const Log = require("./Log.js");
const calculateTax = require("../Functions/calculateTax.js");
const wait = require("../Functions/wait.js");
module.exports = class UserBalance {
  /**
   * User Balance Functions
   * @param {String} userid
   * @param {DB} db
   * @param {LogHandler} logHandler
   */
  constructor(userid, db, logHandler) {
    this.cashDB = db.db("data").collection("cash");
    this.userid = userid;
    this.logHandler = logHandler;
    this.checkAndCreate();
  }

  async checkAndCreate() {
    let bal = await this.cashDB.findOne({ id: this.userid });
    if (!bal)
      await this.cashDB.insertOne({
        id: this.userid,
        balance: 0,
      });
    this.exist = true;
  }

  /**
   * Get Balance
   * @returns {Number} Balance
   */
  async getBalance() {
    if (!this.exist) await wait(100);
    let balance = await this.cashDB.findOne({ id: this.userid });
    balance = balance.balance;
    return balance;
  }

  /**
   * Add to the balance
   * @param {Number} amount
   * @returns {Boolean} Success?
   */
  async add(amount) {
    let oldbalance = await this.getBalance();
    if (isNaN(Number(amount))) return false;
    await this.cashDB.updateOne(
      { id: this.userid },
      { $set: { balance: Number(Number(oldbalance + amount).toFixed(2)) } }
    );
    return true;
  }

  /**
   * Pay a user
   * @param {Number} amount
   * @param {String} toUserId User ID of the user you are paying
   * @returns {Boolean} Success?
   */
  async pay(amount, toUser) {
    let old = await this.getBalance();
    amount = Number(amount);
    if (
      isNaN(Number(amount)) ||
      Number(amount) < 1 ||
      this.userid === toUser.id ||
      !Number.isInteger(amount) ||
      old < Number(amount) ||
      !toUser
    )
      return false;
    let tax = calculateTax(5, amount);
    await this.subtract(amount + tax);
    await toUser.cash.add(amount);
    this.logHandler.newLog(
      "payment",
      new Log("payment", {
        from: this.userid,
        to: toUser.id,
        amount: amount,
        itemType: "cash",
        tax: tax,
      })
    );
    return { amount: amount, tax: tax };
  }

  /**
   * Subtracting from the balance
   * @param {Number} amount
   * @returns {Boolean} Success?
   */
  async subtract(amount) {
    let oldbalance = await this.getBalance();
    if (isNaN(Number(amount))) return false;
    await this.cashDB.updateOne(
      { id: this.userid },
      { $set: { balance: Number(Number(oldbalance - amount).toFixed(2)) } }
    );
    return true;
  }

  /**
   * Set the balance
   * @param {Number} amount
   * @param {Boolean} disabled Disabled Balance?
   * @returns {Boolean} Success?
   */
  async set(amount) {
    if (isNaN(Number(amount))) return false;
    await this.cashDB.updateOne(
      { id: this.userid },
      { $set: { balance: Number(Number(amount).toFixed(2)) } }
    );
    return true;
  }
};
