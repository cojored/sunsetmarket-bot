module.exports = class Log {
  /**
   * Create a Log
   * @param {String} type Type of log
   * @param {Object} data
   * @param data.from [From]
   * @param data.to [To]
   * @param data.amount [Amount of the item]
   * @param data.itemType [The item type]
   * @param data.win [Win or Loss]
   * @param data.tax [Amount of tax applied]
   * @param data.failed [Failed]
   * @param data.user [User]
   * @param data.messageLink [Message Link]
   * @param data.minerType [Miner Type]
   * @param data.value [Value]
   * @param data.orderID [Order ID]
   * @param data.items [Items]
   * @param data.productID [Product ID]
   * @param data.productName [Product Name]
   * @param data.productDescription [Product Description]
   * @param data.productImage [Product Image]
   */
  constructor(type, data) {
    this.data = data;
    this.type = type;
  }
};
