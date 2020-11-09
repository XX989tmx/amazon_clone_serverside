const Review = require("../models/review");
const User = require("../models/user");
const Product = require("../models/product");

const CreateNewReviewToProduct = async (req, res, next) => {
  console.log(req);

  const userId = req.params.userId;
  const productId = req.params.productId;

  const { rate, title, content } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!user) {
    const error = new Error("Error occurred. user id is not matched.");
    return next(error);
  }

  // Authorization here

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!product) {
    const error = new Error("Error occurred. Product data was not found.");
    return next(error);
  }

  const createdReview = new Review({
    rate: Number(rate),
    title: title,
    content: content,
    dateCreated: new Date(),
    product: productId,
    userId: userId,
  });

  await createdReview.save();

  await user.reviews.push(createdReview);
  await user.save();

  await product.reviews.push(createdReview);
  await product.save();

  res.status(200).json({ createdReview, user, product });
};

exports.CreateNewReviewToProduct = CreateNewReviewToProduct;
