const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  cart: {
    items: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    totalPrice: { type: Number },
    totalCount: { type: Number },
  },
  addresses: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
  orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
  paymentMethod: {
    creditCards: [{ type: mongoose.Types.ObjectId, ref: "CreditCard" }],
  },
  wallet: {
    amazonPoint: { type: Number },
    amazonCredit: { type: Number },
  },
  wishlists: [
    {
      name: { type: String },
      wishlist: [
        {
          productId: { type: mongoose.Types.ObjectId, ref: "Product" },
          dateAdded: { type: Date },
        },
      ],
      dateCreated: { type: Date },
    },
  ],
  amazonCreditOrders: [
    { type: mongoose.Types.ObjectId, ref: "AmazonCreditOrder" },
  ],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  purchaseFrequency: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "Product" },
      frequency: { type: Number },
      purchasedDate: [{ type: Date }],
    },
  ],
  lastLoggedIn: [{ type: Date }],
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", userSchema);
