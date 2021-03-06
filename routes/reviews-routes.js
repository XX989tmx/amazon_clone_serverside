const express = require("express");
const expressValidator = require("express-validator");
const reviewsControllers = require("../controllers/reviews-controllers");

const router = express.Router();

router.post(
  "/createNewReviewToProduct/:userId/:productId",
  reviewsControllers.CreateNewReviewToProduct
);

router.patch("/updateReview/:reviewId", reviewsControllers.updateReview);

router.delete(
  "/deleteReview/:userId/:reviewId/:productId",
  reviewsControllers.deleteReview
);

module.exports = router;
