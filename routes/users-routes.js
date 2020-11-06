const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");

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

router.post("/login", usersControllers.login);

router.post("/addToCart/:userId/:productId", usersControllers.addToCart);

module.exports = router;
