const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 12, max: 60 }),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 12, max: 60 }),
  ],
  usersControllers.login
);

router.use(checkAuth);

router.get(
  "/getLatestContentOfCart/:userId",
  usersControllers.getLatestContentOfCart
);

router.post(
  "/addToCart/:userId/:productId",
  [check("quantity").not().isEmpty().isNumeric().toInt()],
  usersControllers.addToCart
);

router.get("/clearCart/:userId", usersControllers.clearCart);

router.delete(
  "/removeItemFromCart/:userId/:itemId",
  usersControllers.removeItemFromCart
);

router.patch(
  "/changeQuantityOfItemInCart/:userId/:itemId",
  usersControllers.changeQuantityOfItemInCart
);

module.exports = router;
