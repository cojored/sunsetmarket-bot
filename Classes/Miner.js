let wait = require("../Functions/wait.js");
module.exports = class Miner {
  /**
   * Bitcoin Miner
   * @param {String} userId
   * @param {DB} db
   * @param {LogHandler} logHandler
   */
  constructor(userId, db, logHandler) {
    this.userid = userId;
    this.minerdb = db.db("data").collection("miner");
    this.logHandler = logHandler;
    this.exists = false;
    this.increaseAmount = 5;
    this.sell = {
      silver: 10,
      gold: 20,
      diamond: 40,
    };
    this.startInventory = {
      silver: 25,
      gold: 10,
      diamond: 5,
    };
    this.startAmount = {
      silver: 35,
      gold: 15,
      diamond: 20,
    };
    this.startingPrices = {
      inventory: {
        silver: 1,
        gold: 2,
        diamond: 3,
      },
      equipment: {
        silver: 2,
        gold: 3,
        diamond: 4,
      },
    };
    this.checkAndCreate();
  }
  async checkAndCreate() {
    let data = await this.minerdb.findOne({ id: this.userid });
    if (!data)
      await this.minerdb.insertOne({
        id: this.userid,
        levels: {
          inventory: {
            silver: 1,
            gold: 1,
            diamond: 1,
          },
          equipment: {
            silver: 1,
            gold: 1,
            diamond: 1,
          },
        },
        started: 0,
        stops: 0,
        paidWorkers: false,
        soldMaterials: false,
      });
    this.exists = true;
  }
  async start() {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    let date = new Date().getTime();
    if (date < data.stops) return false;
    if (data.soldMaterials === false && data.started != 0) return false;
    if (data.paidWorkers === false && data.started != 0) return false;
    this.minerdb.updateOne(
      { id: this.userid },
      {
        $set: {
          started: date,
          stops: date + 10800000,
          paidWorkers: false,
          soldMaterials: false,
        },
      }
    );
    return true;
  }
  async getStatus() {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    return data;
  }
  async hourlyEarnings() {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    let earnings = {
      silver: 0,
      gold: 0,
      diamond: 0,
    };
    for (let mineral in earnings) {
      earnings[mineral] +=
        this.startAmount[mineral] +
        this.increaseAmount *
          this.startAmount[mineral] *
          (data.levels["equipment"][mineral] - 1);
    }
    return earnings;
  }
  async earnings() {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    if (data.started === 0)
      return {
        silver: 0,
        gold: 0,
        diamond: 0,
      };
    let date = new Date().getTime();
    let earnings = {
      silver: 0,
      gold: 0,
      diamond: 0,
    };
    if (data.stops > date) {
      for (let mineral in earnings) {
        let invspace = await this.getInventorySpace(mineral);
        let amnt =
          ((date + 10800000 - data.stops) / 3600000) *
            (this.startAmount[mineral] +
              this.increaseAmount * (data.levels["equipment"][mineral] - 1)) >
          invspace
            ? invspace
            : ((date + 10800000 - data.stops) / 3600000) *
              (this.startAmount[mineral] +
                this.increaseAmount *
                  this.startAmount[mineral] *
                  (data.levels["equipment"][mineral] - 1));
        earnings[mineral] += amnt;
      }
    } else {
      for (let mineral in earnings) {
        let invspace = await this.getInventorySpace(mineral);
        let amnt =
          ((data.stops - data.started) / 3600000) *
            (this.startAmount[mineral] +
              this.increaseAmount * (data.levels["equipment"][mineral] - 1)) >
          invspace
            ? invspace
            : ((data.stops - data.started) / 3600000) *
              (this.startAmount[mineral] +
                this.increaseAmount *
                  this.startAmount[mineral] *
                  (data.levels["equipment"][mineral] - 1));
        earnings[mineral] += amnt;
      }
    }
    return earnings;
  }
  /**
   * Set Paid Workers
   * @param {Boolean} d
   */
  async setPaidWorkers(d) {
    if (!this.exists) wait(300);
    this.minerdb.updateOne(
      { id: this.userid },
      {
        $set: {
          paidWorkers: d,
        },
      }
    );
  }
  /**
   * Set Sold Materials
   * @param {Boolean} d
   */
  async setSoldMaterials(d) {
    if (!this.exists) wait(300);
    this.minerdb.updateOne(
      { id: this.userid },
      {
        $set: {
          soldMaterials: d,
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
    this.minerdb.updateOne(
      { id: this.userid },
      {
        $set: {
          stops: time,
        },
      }
    );
  }
  async soldMaterials() {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    return data.soldMaterials;
  }
  async running() {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    let date = new Date().getTime();
    if (date < data.stops) return true;
    else return false;
  }
  /**
   * Get Level
   * @param {String} mineral [silver, gold, diamond]
   * @returns
   */
  async getInventorySpace(mineral) {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    return (
      this.startInventory[mineral] +
      this.increaseAmount *
        this.startInventory[mineral] *
        (data.levels["inventory"][mineral] - 1)
    );
  }
  /**
   * Get Upgrade Price
   * @param {String} mineral [silver, gold, diamond]
   * @param {Booleam} isInventory [Is inventory space upgrade?]
   * @returns {Number} Upgrade Price
   */
  async getUpgradePrice(mineral, isInventory = true) {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    let inventorySpace = await this.getInventorySpace(mineral);
    let equipmentEfficency =
      this.startAmount[mineral] * data.levels["equipment"][mineral];
    if (isInventory && inventorySpace >= 600) return false;
    if (!isInventory && equipmentEfficency >= 100) return false;
    let l = data.levels[isInventory ? "inventory" : "equipment"][mineral];
    let m = isInventory ? 1.5 : 2;
    return this.startAmount[mineral] * m * l;
  }
  /**
   * Add Level
   * @param {Number} amount [1]
   * @param {String} mineral [silver, gold, diamond]
   * @param {Booleam} isInventory [Is inventory space upgrade?]
   * @returns {Number} New Level
   */
  async addLevel(amount = 1, mineral, isInventory = true) {
    if (!this.exists) wait(300);
    let data = await this.minerdb.findOne({ id: this.userid });
    let levels = {
      inventory: {
        silver: data.levels.inventory.silver,
        gold: data.levels.inventory.gold,
        diamond: data.levels.inventory.diamond,
      },
      equipment: {
        silver: data.levels.equipment.silver,
        gold: data.levels.equipment.gold,
        diamond: data.levels.equipment.diamond,
      },
    };
    levels[isInventory ? "inventory" : "equipment"][mineral] += amount;
    this.minerdb.updateOne({ id: this.userid }, { $set: { levels } });
    return (
      this.startInventory[mineral] +
      this.increaseAmount *
        this.startInventory[mineral] *
        levels[isInventory ? "inventory" : "equipment"][mineral]
    );
  }
};
