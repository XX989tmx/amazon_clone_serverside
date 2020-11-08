const express = require("express");
const expressValidator = require("express-validator");
const wishlistsControllers = require("../controllers/wishlists-controllers");

const router = express.Router();

router.post(
  "/createNewWishlist/:userId",
  wishlistsControllers.createNewWishlist
);

router.post(
  "/addProductToWishlist/:userId/:productId/:wishlistId",
  wishlistsControllers.addProductToWishlist
);

module.exports = router;
