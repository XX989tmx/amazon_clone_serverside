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
  images: [{ imageName: { type: String }, imageUrl: { type: String } }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  stats: {
    reviewStats: {
      averageRate: { type: Number },
      totalCount: { type: Number },
    },
  },
});

module.exports = mongoose.model("Product", productSchema);
