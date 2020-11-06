const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
  cardNumber: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pinNumber: { type: Number, required: true },
  expirationDate: { type: String, required: true },
});

module.exports = mongoose.model("CreditCard", creditCardSchema);
