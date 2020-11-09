const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const amazonCreditOrderSchema = new Schema({
  totalPrice: { type: Number, required: true },
  dateOrdered: { type: Date },
  paymentMethod: { type: String },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("AmazonCreditOrder", amazonCreditOrderSchema);
