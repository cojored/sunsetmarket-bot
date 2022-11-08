const { MessageEmbed } = require("discord.js");
const defaultEmbedData = require("./defaultEmbedData");

module.exports = function howThisWorksEmbed(config) {
  let embed = new MessageEmbed();
  embed.setTitle("How this works");
  embed.setColor("#0000FF");
  embed.setDescription(
    `This is a bot that allows you to buy and sell products. You can either buy someones products on our store site or you can sell your own products. To buy the products you need to earn our currency **${config.currency.name}** once you have enough ${config.currency.name} you can spend them on products (The sellers will get the money).\n\nYou can earn ${config.currency.name} in the following ways, Mining, Bitcoin Mining, Talking. You can find more information about the methods below.\n\n**Bitcoin Mining**\nYou can mine for ${config.currency.name} to start mining do \`${config.prefix}bitcoin start\`. Then to redeem for ${config.currency.name} you do \`${config.prefix}bitcoin stop\` to stop the miner then \`${config.prefix}bitcoin redeem\` to redeem for ${config.currency.name}. If you want to earn more ${config.currency.name} every hour you can upgrade the miner with \`${config.prefix}bitcoin upgrade\`.\n\n**Mining**\nMining works the same way as bitcoin mining just with physical materials.\n\n**Messages**\nEvery message that you send makes you between 1 and 5 ${config.currency.name}.\n\nFor more information on the different commands do \`${config.prefix}help\`\n\n**Purchasing Items**\nYou can purchase anything that is being sold on our website you can find the link using the \`${config.prefix}store\` command.\n\n**Selling Items**\nYou can sell items by first running the command \`${config.prefix}product create\`. Now click the create product button an fill in the fields. The fields are all required also just to note the image link must be https://`
  );
  defaultEmbedData(embed);
  return embed;
};
