const Review = require("../models/review");
const User = require("../models/user");
const Product = require("../models/product");
const {
  findProduct,
} = require("../functions/seller-controller-related-functions");
const {
  findProductById,
  updateReviewStatsOfProduct,
} = require("../functions/products-controller-related-functions");

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

  // let product;
  // try {
  //   product = await Product.findById(productId);
  // } catch (error) {
  //   console.log(error);
  //   return next(error);
  // }

  // if (!product) {
  //   const error = new Error("Error occurred. Product data was not found.");
  //   return next(error);
  // }
  const product = await findProductById(productId);

  const createdReview = new Review({
    rate: Number(rate),
    title: title,
    content: content,
    dateCreated: new Date(),
    product: productId,
    user: userId,
  });

  await createdReview.save();

  await user.reviews.push(createdReview);
  await user.save();

  await product.reviews.push(createdReview);
  await product.save();

  async function updateProductReview(productId) {
    const product = await findProductById(productId);
    const updated2Product = await updateReviewStatsOfProduct(product);
    return updated2Product;
  }
  const updated2Product = await updateProductReview(productId);

  res.status(200).json({ createdReview, user, updated2Product });
};

const updateReview = async (req, res, next) => {
  console.log(req);

  const reviewId = req.params.reviewId;

  const { rate, title, content } = req.body;

  let existingReview;
  try {
    existingReview = await Review.findById(reviewId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!existingReview) {
    const error = new Error("Error occurred. Review was not found.");
    return next(error);
  }

  // Authorization here

  existingReview.rate = Number(rate);
  existingReview.title = title;
  existingReview.content = content;

  try {
    await existingReview.save();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  res
    .status(200)
    .json({ existingReview, message: "successfully updated review." });
};

const deleteReview = async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const reviewId = req.params.reviewId;
  console.log(reviewId);

  let review;
  try {
    review = await Review.findById(reviewId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!user) {
    const error = new Error("Error occurred. user was not found.");
    return next(error);
  }

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!product) {
    const error = new Error("Error occurred. Product data was not found.");
    console.log(error);
    return next(error);
  }
  console.log(user.reviews);
  await user.reviews.pull(reviewId);
  await user.save();

  console.log(product.reviews);
  await product.reviews.pull(reviewId);
  await product.save();

  await review.remove();

  res.status(200).json({ user, message: "review was successfully removed." });
};

exports.CreateNewReviewToProduct = CreateNewReviewToProduct;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
