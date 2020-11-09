const express = require("express");
const { check } = require("express-validator");
const expressValidator = require("express-validator");
const wishlistsControllers = require("../controllers/wishlists-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.post(
  "/createNewWishlist/:userId",
  wishlistsControllers.createNewWishlist
);

router.post(
  "/addProductToWishlist/:userId/:productId/:wishlistId",
  wishlistsControllers.addProductToWishlist
);

router.delete(
  "/removeProductFromWishlist/:userId/:wishlistId/:idOfItemInWishlist",
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
