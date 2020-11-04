const express = require("express");
const router = express.Router();

router.get("/all", function (req, res) {
  res.json({ res: "all product page" });
});

router.get("/specificProduct/:product", function (req, res) {
  res.json({ res: "specific page" });
});
router.get("/productIndex/:category", function (req, res) {
  res.json({ res: " product index page" });
});

router.post("/createNewProduct", function (req, res) {
  res.json({ res: "add new product page" });
});

router.get("/newlyAddedRankingTop50/:category", function (req, res) {
  res.json({ res: "newlyAddedRankingTop50 " });
});

router.get("/bestsellerRankingTop50/:category", function (req, res) {
  res.json({ res: "bestsellerRankingTop50" });
});

router.get("/wishlistRankingTop50/:category", function (req, res) {
  res.json({ res: "wishlistRankingTop50" });
});

router.get("/bargain/:category", function (req, res) {
  res.json({ res: "bargain campaign products" });
});

module.exports = router;
