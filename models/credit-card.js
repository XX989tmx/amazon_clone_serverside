const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
  cardNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pinNumber: { type: String, required: true },
  expirationMonth: { type: String, required: true },
  expirationYear: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("CreditCard", creditCardSchema);
