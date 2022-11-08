const wait = require("../Functions/wait");

module.exports = class Bitcoin {
  /**
   * Bitcoin Miner
   * @param {String} userId
   * @param {DB} db
   * @param {LogHandler} logHandler,
   * @param {UserMessages} messages
   */
  constructor(userId, db, logHandler, messages) {
    this.userid = userId;
    this.btcdb = db.db("data").collection("bitcoin");
    this.logHandler = logHandler;
    this.messages = messages;
    this.exists = false;
    this.startAmount = 100;
    this.increaseAmount = 15.2;
    this.checkAndCreate();
  }
  async checkAndCreate() {
    let data = await this.btcdb.findOne({ id: this.userid });
    if (!data)
      await this.btcdb.insertOne({
        id: this.userid,
        level: 0,
        started: 0,
        stops: 0,
        messagesWhenStarted: 0,
        paidElectric: false,
        redeemed: false,
      });
    this.exists = true;
  }
  async getStatus() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    let messages = await this.messages.getAmount();
    data.messagesSinceStarted = messages - data.messagesWhenStarted;
    return data;
  }
  async hourlyEarnings() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    if (data.level === 0) return 0;
    return (
      this.startAmount +
      this.increaseAmount * this.startAmount * (data.level - 1)
    );
  }
  async earnings() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    if (data.started === 0) return 0;
    let date = new Date().getTime();
    if (data.stops > date)
      return (
        ((date + 7200000 - data.stops) / 3600000) *
        (this.startAmount +
          this.increaseAmount * this.startAmount * (data.level - 1))
      );
    else
      return (
        ((data.stops - data.started) / 3600000) *
        (this.startAmount +
          this.increaseAmount * this.startAmount * (data.level - 1))
      );
  }
  /**
   * Set Paid Electric
   * @param {Boolean} d
   */
  async setPaidElectric(d) {
    if (!this.exists) wait(300);
    this.btcdb.updateOne(
      { id: this.userid },
      {
        $set: {
          paidElectric: d,
        },
      }
    );
  }
  /**
   * Set Redeemed
   * @param {Boolean} d
   */
  async setRedeemed(d) {
    if (!this.exists) wait(300);
    this.btcdb.updateOne(
      { id: this.userid },
      {
        $set: {
          redeemed: d,
        },
      }
    );
  }
  /**
   * Set stop time
   * @param {Number} time
   */
  async setStopTime(time) {
    if (!this.exists) wait(300);
    this.btcdb.updateOne(
      { id: this.userid },
      {
        $set: {
          stops: time,
        },
      }
    );
  }
  async redeemed() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    return data.redeemed;
  }
  async running() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    let date = new Date().getTime();
    if (date < data.stops) return true;
    else return false;
  }
  async start() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    let date = new Date().getTime();
    let messages = await this.messages.getAmount();
    if (messages - data.messagesWhenStarted < 50 && data.started != 0)
      return false;
    if (date < data.stops || data.level === 0) return false;
    if (data.paidElectric === false && data.started != 0) return false;
    this.btcdb.updateOne(
      { id: this.userid },
      {
        $set: {
          started: date,
          stops: date + 7200000,
          messagesWhenStarted: messages,
          paidElectric: false,
          redeemed: false,
        },
      }
    );
    return true;
  }
  async getLevel() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    return data.level;
  }
  async getUpgradePrice() {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    data.level += 1;
    if (data.level === 1) return 100;
    if (data.level === 2) return 500;
    if (data.level < 10) return data.level * 500;
    if (data.level <= 20) return data.level * 1000;
    if (data.level > 20) return false;
  }
  /**
   * Add Level
   * @param {Number} amount [1]
   * @returns {Number} New Level
   */
  async addLevel(amount = 1) {
    if (!this.exists) wait(300);
    let data = await this.btcdb.findOne({ id: this.userid });
    this.btcdb.updateOne(
      { id: this.userid },
      { $set: { level: data.level + amount } }
    );
    return data.level + amount;
  }
};
