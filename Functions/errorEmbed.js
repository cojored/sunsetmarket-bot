const Discord = require("discord.js");

module.exports = function errorEmbed(message){
    const errorEmbed = new Discord.MessageEmbed();
    errorEmbed.setTitle("Something went wrong");
    errorEmbed.setColor("#FF0000");
    errorEmbed.setDescription(message);
    return errorEmbed
}