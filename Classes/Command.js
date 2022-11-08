const LogHandler = require("../Handlers/LogHandler.js");
const User = require("../Classes/User.js");
const defaultEmbed = require("../Functions/defaultEmbedData.js");

module.exports = class Command {
  /**
   * Command
   * @param {String} name
   * @param {Array} args
   * @param {Discord.Message} message
   * @param {DB} db
   * @param {JSON} config
   * @param {LogHandler} logHandler
   * @param {Object} commands
   * @param {Object} commandsSorted
   */
  constructor(name, args, message, db, config, logHandler, commands, commandsSorted) {
    this.user = new User(message.author, db, logHandler);
    this.commands = commands;
    this.commandsSorted = commandsSorted
    this.logHandler = logHandler;
    this.message = message;
    this.config = config;
    this.name = name;
    this.args = args;
    this.mentionedUsers = [];
    message.mentions.users.forEach((user) =>
      this.mentionedUsers.push(new User(user, db, logHandler))
    );
    this.db = db;
  }
  /**
   * Reply Function
   * @param {*} reply What to reply with
   */
  async reply(reply) {
    if (typeof reply === "object")
      if (reply.embeds)
        await reply.embeds.forEach((embed) => defaultEmbed(embed));
    this.message.reply(reply);
  }
};
