const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
  cardNumber: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pinNumber: { type: Number, required: true },
  expirationMonth: { type: Number, required: true },
  expirationYear: { type: Number, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("CreditCard", creditCardSchema);
