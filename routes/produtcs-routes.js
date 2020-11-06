const express = require("express");
const expressValidator = require("express-validator");
const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/getAllProducts", productsControllers.getAllProducts);

router.get(
  "/getSpecificProductById/:productId",
  productsControllers.getSpecificProductById
);

router.get(
  "/productIndex/:category",
  productsControllers.getProductIndexByCategory
);

router.get(
  "/getProductIndexByParentCategory/:parentCategory",
  productsControllers.getProductIndexByParentCategory
);

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
