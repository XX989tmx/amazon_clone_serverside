const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    },
  ],
  totalPrice: { type: Number },
  totalCount: { type: Number },
  dateOrdered: { type: Date },
  shipmentAddress: { type: mongoose.Types.ObjectId, ref: "Address" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  nameOfPaymentMethod: { type: String },
  usedAmazonPoint: { type: Number },
  usedAmazonCredit: { type: Number },
  addedAmazonPoint: { type: Number },
  isAmazonCreditUsed: { type: Boolean },
  isAmazonPointUsed: { type: Boolean },
  totalDiscountAmount: { type: Number },
  totalPriceBeforeDiscount: { type: Number },
});

module.exports = mongoose.model("Order", orderSchema);
