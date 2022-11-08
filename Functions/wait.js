module.exports = function wait(time) {
  return new Promise((r) => setTimeout(r, time));
};
