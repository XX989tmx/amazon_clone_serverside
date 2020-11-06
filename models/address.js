const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  name: { type: String, required: true },
  todoufuken: { type: String, required: true },
  addressInfo1: { type: String, required: true },
  addressInfo2: { type: String },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
});
module.exports = mongoose.model("Address", addressSchema);
