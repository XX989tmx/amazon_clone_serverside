const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ res: "this is product page" });
});

module.exports = router;
