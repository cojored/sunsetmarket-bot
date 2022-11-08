const howThisWorksEmbed = require("../../Functions/howThisWorksEmbed");

module.exports = {
  name: "htw",
  description: "Send the how this works message",
  usage: "{prefix}htw",
  alias: ["howthisworks"],
  async execute(command) {
    command.message.channel.send({
      embeds: [howThisWorksEmbed(command.config)],
    });
  },
};
