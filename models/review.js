const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  rate: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  dateCreated: { type: Date, required: true },
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Review", reviewSchema);
