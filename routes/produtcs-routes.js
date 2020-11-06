const express = require("express");
const expressValidator = require("express-validator");
const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/getAllProducts", productsControllers.getAllProducts);

router.get("/specificProduct/:product", function (req, res) {
  //:product = productName or productId
  const productName = req.params.product;
  let arr = [
    {
      id: "p1",
      name: "ヨシカワ ホットサンドメーカー",
      price: {
        price: 1473,
        currency: "JPY",
      },
      deliveryDate: "11/20 2020",
      brand: "ヨシカワ(Yoshikawa)",
      parentCategory: ["鍋・フライパン"],
      ancestorCategories: [
        "鍋・フライパン",
        "キッチン用品",
        "ホーム＆キッチン",
      ],
      categories: ["直火式ホットサンド・ワッフルメーカー"],
      stockQuantity: 16,
      isStock: true,
    },
    {
      id: "p2",
      name: "おいしい水",
      price: {
        price: 150,
        currency: "JPY",
      },
      deliveryDate: "11/20 2020",
      brand: "伊藤園",
      parentCategory: ["水、飲料"],
      ancestorCategories: ["水、飲料", "食品、日用品"],
      categories: ["ミネラルウォーター"],
      stockQuantity: 10,
      isStock: true,
    },
  ];

  const result = arr.filter((v) => {
    return v.name === productName;
  });

  res.json({ result });
});
router.get("/productIndex/:category", function (req, res) {
  const category = req.params.category;
  let arr = [
    {
      id: "p1",
      name: "ヨシカワ ホットサンドメーカー",
      price: {
        price: 1473,
        currency: "JPY",
      },
      deliveryDate: "11/20 2020",
      brand: "ヨシカワ(Yoshikawa)",
      parentCategory: ["鍋・フライパン"],
      ancestorCategories: [
        "鍋・フライパン",
        "キッチン用品",
        "ホーム＆キッチン",
      ],
      categories: ["直火式ホットサンド・ワッフルメーカー"],
      stockQuantity: 16,
      isStock: true,
    },
    {
      id: "p2",
      name: "おいしい水",
      price: {
        price: 150,
        currency: "JPY",
      },
      deliveryDate: "11/20 2020",
      brand: "伊藤園",
      parentCategory: ["水、飲料"],
      ancestorCategories: ["水、飲料", "食品、日用品"],
      categories: ["ミネラルウォーター"],
      stockQuantity: 10,
      isStock: true,
    },
  ];

  const result = arr.filter((v) => {
    return v.categories.includes(category);
  });

  res.json({ result });
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
