const EventEmitter = require("events");
module.exports = class CustomEvents extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }
};
