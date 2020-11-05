const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: {
    price: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  deliveryDate: { type: String, required: true },
  brand: { type: String, required: true },
  parentCategory: [{ type: String }],
  ancestorCategories: [{ type: String }],
  categories: [{ type: String }],
  stockQuantity: { type: Number },
  isStock: { type: Boolean },
});

module.exports = mongoose.model("Product", productSchema);
