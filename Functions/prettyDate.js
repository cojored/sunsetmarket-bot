const prettyMilliseconds = require("./prettyMs.js");

module.exports = function prettyDate(time) {
  let date = new Date(time).getTime();
  let current = new Date().getTime();
  if (date < current) {
    let ms = prettyMilliseconds(current - date, {
      verbose: true,
      compact: true,
      justNow: true,
    });
    return ms === "just now" ? ms : ms + " ago";
  } else {
    let ms = prettyMilliseconds(date - current, {
      verbose: true,
      seconds: false,
      justNow: true,
    });
    return ms === "just now" ? ms : "in " + ms;
  }
};
