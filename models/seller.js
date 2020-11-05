const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

sellerSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("Seller", sellerSchema);
