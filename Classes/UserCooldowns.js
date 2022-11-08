const wait = require("../Functions/wait");

module.exports = class UserCooldowns {
  /**
   * User Cooldown Functions
   * @param {String} userid
   * @param {DB} db
   */
  constructor(userid, db) {
    this.cooldownsdb = db.db("cooldowns");
    this.cooldowns = {};
    this.cooldowns.rob = this.cooldownsdb.collection("rob");
    this.cooldowns.getRob = this.cooldownsdb.collection("getRob");
    this.cooldowns.passive = this.cooldownsdb.collection("passive");
    this.userid = userid;
    this.checkAndCreate();
  }
  async checkAndCreate() {
    let robCooldown = await this.cooldowns.rob.findOne({ id: this.userid });
    let getRobCooldown = await this.cooldowns.getRob.findOne({
      id: this.userid,
    });
    let passiveCooldown = await this.cooldowns.passive.findOne({
      id: this.userid,
    });
    if (!robCooldown)
      await this.cooldowns.rob.insertOne({ id: this.userid, expires: 0 });
    if (!getRobCooldown)
      await this.cooldowns.getRob.insertOne({ id: this.userid, expires: 0 });
    if (!passiveCooldown)
      await this.cooldowns.passive.insertOne({
        id: this.userid,
        expires: 0,
      });
    this.exists = true;
  }
  /**
   * Set a cooldown
   * @param {String} type [rob, getRob, passive]
   * @param {Number} expires Cooldown length in ms
   */
  async setCooldown(type, length) {
    if (!this.exists) await wait(100);
    if (!this.cooldowns[type]) return false;
    if (!length) return false;
    if (isNaN(Number(length))) return false;
    this.cooldowns[type].updateOne(
      { id: this.userid },
      { $set: { expires: new Date().getTime() + length } }
    );
    return true;
  }
  /**
   * Check a cooldown
   * @param {String} type [rob, getRob, passive]
   */
  async checkCooldown(type) {
    if (!this.exists) await wait(100);
    if (!this.cooldowns[type]) return false;
    let expires = (await this.cooldowns[type].findOne({ id: this.userid }))
      .expires;
    let date = new Date().getTime();
    let res = { expired: false, expires: expires };
    if (date >= expires) res.expired = true;
    return res;
  }
};
