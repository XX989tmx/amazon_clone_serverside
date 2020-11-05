const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

router.post("/signup", function (req, res) {
  res.json({ res: "seller signup page" });
});

router.post("/login", function (req, res) {
  res.json({ res: "seller login page" });
});
module.exports = router;
