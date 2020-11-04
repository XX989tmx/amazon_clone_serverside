const express = require("express");
const router = express.Router();

router.post("/signup", function (req, res) {
  res.json({ res: "signup" });
});

router.get("/login", function (req, res) {
  res.json({ res: "login" });
});

module.exports = router;
