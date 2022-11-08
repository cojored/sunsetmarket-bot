const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
  name: "appeal",
  alias: [],
  description: "Make an appeal against a strike",
  usage: "{prefix}appeal",
  async execute(command) {
    let lastPenalty = await command.logHandler.getLog({
      type: "penalty",
      "data.user": command.user.id,
    });
    const replyEmbed = new MessageEmbed();
    replyEmbed.setTitle("Appealed");
    replyEmbed.setColor("#00FF00");
    replyEmbed.setDescription(
      "We created your appeal this can take up to 24 hours to be proccessed"
    );
    command.reply({ embeds: [replyEmbed] });
    let client = new WebhookClient({
      url: "https://discord.com/api/webhooks/981308163666088026/Jro95CKlqDCbXp4GLJLxIWs_S1skvFgohMlQz8Xw2rP8fByj69aRFpMRlPqFIQvuYSA6",
    });
    const embed = new MessageEmbed();
    embed.setTitle("New Appeal");
    embed.addField("Message Link", lastPenalty.data.messageLink);
    embed.addField(
      "Amount",
      lastPenalty.data.amount.toLocaleString() +
        " " +
        command.config.currency.rep +
        " (this will be either positive or negative idk why its different, it is the amount it took)"
    );
    let pings = "<@694644198531661844> <@823995542353739807>";
    client.send({ content: pings, embeds: [embed] });
  },
};
