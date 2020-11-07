const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number },
  deliveryDate: { type: Date, required: true },
  brand: { type: String, required: true },
  parentCategory: [{ type: String }],
  ancestorCategories: [{ type: String }],
  categories: [{ type: String }],
  stockQuantity: { type: Number },
  isStock: { type: Boolean },
  seller: { type: mongoose.Types.ObjectId, ref: "Seller" },
  userCart: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);
