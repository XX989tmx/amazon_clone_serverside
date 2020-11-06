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
  dateOrdered: { type: String },
  shipmentAddress: { type: mongoose.Types.ObjectId, ref: "Address" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Order", orderSchema);
