const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const Command = require("../Classes/Command.js");
module.exports = class CommandHandler {
  constructor(config, client, commandFolder, db, logHandler) {
    this.config = config;
    let prefix = config.prefix;
    if (config.dev) prefix = config.prefix_dev;
    this.prefix = prefix;
    this.prefixes = [];
    this.client = client;
    this.db = db;
    this.commands = {};
    this.commandsSorted = {};
    this.logHandler = logHandler;
    this.commandFolder = commandFolder;
    this.loadCommands();
  }
  loadCommands() {
    this.commands = {};
    this.commandsSorted = {};
    this.prefixes = [];
    let folders = fs.readdirSync(__dirname + "/../" + this.commandFolder);
    for (let folder in folders) {
      this.commandsSorted[folders[folder]] = [];
      let files = fs.readdirSync(
        __dirname + "/../" + this.commandFolder + "/" + folders[folder]
      );
      for (let f in files) {
        let file = files[f];
        if (file.endsWith(".js")) {
          let f = require(__dirname +
            "/../" +
            this.commandFolder +
            "/" +
            folders[folder] +
            "/" +
            file);
          let name = f.name;
          if (f.prefix) this.prefixes.push(name);
          else {
            for (let alias in f.alias) {
              let a = f;
              a["isAlias"] = true;
              this.commands[f.alias[alias]] = a;
            }
            f["isAlias"] = false;
            this.commandsSorted[folders[folder]].push(f);
            this.commands[name] = f;
          }
        }
      }
    }
  }
  isCommand(message) {
    let msg = message.content;
    if (msg.toLowerCase().startsWith(this.prefix)) {
      const args = msg.slice(this.prefix.length).trim().split(/ +/);
      let command = args.shift().toLowerCase();
      if (this.prefixes.includes(command))
        if (args.length < 1) {
          message.reply(
            "This is a command prefix not a command, `" +
              this.config.prefix +
              "help`"
          );
          return false;
        } else command += " " + args.shift().toLowerCase();
      if (!this.commands[command]) return false;
      return true;
    } else {
      return false;
    }
  }
  getCommand(message) {
    let msg = message.content;
    const args = msg.slice(this.prefix.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();
    if (this.prefixes.includes(command))
      command += " " + args.shift().toLowerCase();

    return new Command(
      command,
      args,
      message,
      this.db,
      this.config,
      this.logHandler,
      this.commands,
      this.commandsSorted
    );
  }
  execute(command) {
    try {
      this.commands[command.name].execute(command);
    } catch (error) {
      let embed = new MessageEmbed();
      embed.setColor("#FF0000");
      embed.setTitle("Error");
      embed.setDescription(
        `\`${error}\`\n\nPlease report this to <@694644198531661844>`
      );
      command.reply({ embeds: [embed] });
    }
  }
};
