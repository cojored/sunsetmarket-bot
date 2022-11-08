module.exports = class LogHandler {
  constructor(db, CustomEvents) {
    this.logdb = db.db("data").collection("logs");
    this.CustomEvents = CustomEvents;
  }
  newLog(type, log) {
    this.logdb.insertOne(log);
    this.CustomEvents.emit("newLog", log);
  }
  async getLog(filter) {
    let log = await this.logdb
      .find(filter)
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    return log[0];
  }
};
