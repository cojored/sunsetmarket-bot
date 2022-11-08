module.exports = function (embed) {
  if (!embed.footer)
    embed.setFooter({
      text: "© Sunset Market  - 2022",
      iconURL:
        "https://cdn.discordapp.com/attachments/787065403091451965/1005631997835751434/426315.jpg",
    });
  return embed;
};
