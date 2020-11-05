const express = require("express");
const { check } = require("express-validator");
const sellersControllers = require("../controllers/sellers-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 12, max: 60 }),
  ],
  sellersControllers.signup
);

router.post("/login", sellersControllers.login);
module.exports = router;
