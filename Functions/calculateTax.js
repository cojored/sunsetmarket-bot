module.exports = function calculateTax(percent, amount) {
  let percentAsDecimal = percent / 100;
  let tax = Number((percentAsDecimal * amount).toFixed(2));
  return tax
};
