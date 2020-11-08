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

router.delete(
  "/removeProductFromWishlist/:userId/:productId/:wishlistId",
  wishlistsControllers.removeProductFromWishlist
);

router.delete(
  "/deleteWishlist/:userId/:wishlistId",
  wishlistsControllers.deleteWishlist
);

router.get(
  "/getSpecificWishlist/:userId/:wishlistId",
  wishlistsControllers.getSpecificWishlist
);

module.exports = router;
