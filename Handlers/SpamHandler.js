const Log = require("../Classes/Log");
const checkSimilarity = require("../Functions/checkSimilarity");
const wait = require("../Functions/wait");

module.exports = class SpamHandler {
  constructor(user, logHandler) {
    this.user = user;
    this.spamdb = user._db.db("data").collection("spam");
    this.logHandler = logHandler;
    this.checkAndCreate();
  }
  async checkAndCreate() {
    let lm = await this.spamdb.findOne({ id: this.user.id });
    if (!lm)
      await this.spamdb.insertOne({
        id: this.user.id,
        messages: [],
        strikes: 0,
        lastStrike: 0,
      });
    this.exists = true;
  }

  async messages() {
    if (!this.exists) await wait(300);
    let lm = await this.spamdb.findOne({ id: this.user.id });
    return lm.messages;
  }
  /**
   * Add a strike
   * @param {Number} amount [Defaults to 1]
   */
  async addStrike(amount = 1, message) {
    if (!this.exists) await wait(300);
    let strikes = await this.strikes();
    this.spamdb.updateOne(
      { id: this.user.id },
      {
        $set: {
          strikes: strikes + amount,
          lastStrike: new Date().getTime(),
          messages: [],
        },
      }
    );
    if (this.logHandler)
      this.logHandler.newLog(
        "strike",
        new Log("strike", {
          user: this.user.id,
          amount: strikes + amount,
          itemType: "strikes",
          messageLink:
            "https://discord.com/channels/" +
            message.guild.id +
            "/" +
            message.channel.id +
            "/" +
            message.id,
        })
      );
  }
  /**
   * Get number of strikes
   * @returns {Number} Number of strikes
   */
  async strikes() {
    if (!this.exists) await wait(300);
    let strikes = (await this.spamdb.findOne({ id: this.user.id })).strikes;
    return strikes;
  }
  /**
   * Get last strike time
   * @returns {Number} Last strike timestamp
   */
  async lastStrike() {
    if (!this.exists) await wait(300);
    let lastStrike = (await this.spamdb.findOne({ id: this.user.id }))
      .lastStrike;
    return lastStrike;
  }
  /**
   * Insert Message
   * @param {String} message
   */
  async insertMessage(message) {
    if (!this.exists) await wait(300);
    let msgs = await this.messages();
    if (msgs.length >= 5) msgs.shift();
    msgs.push({
      content: message.content,
      time: new Date().getTime(),
    });
    this.spamdb.updateOne(
      { id: this.user.id },
      {
        $set: {
          messages: msgs,
        },
      }
    );
  }
  /**
   * Check Spam
   * @returns {Boolean}
   */
  async checkSpam() {
    if (!this.exists) await wait(300);
    let msgs = await this.messages();
    let lastStrike = await this.lastStrike();
    if (msgs.length < 5) return false;
    let timeBetween = (msgs[msgs.length - 1].time - msgs[0].time) / 1000;
    if ((new Date().getTime() - lastStrike) / 1000 < 10) return false;
    else if (timeBetween <= 2) return true;
    else if (checkSimilarity(msgs[1].content, msgs[0].content) >= 0.5)
      return true;
    else {
      this.spamdb.updateOne(
        { id: this.user.id },
        {
          $set: {
            messages: [],
          },
        }
      );
    }
  }
};
