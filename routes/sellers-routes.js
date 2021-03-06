const express = require("express");
const { check } = require("express-validator");
const multer = require("multer");
const fileUpload = require("../middleware/file-upload");
const checkAuthSellerId = require("../middleware/check-auth-seller-id");

const upload = multer({ dest: "uploads/images" });
const sellersControllers = require("../controllers/sellers-controllers");

const router = express.Router();

router.get(
  "/getAllProductOfThisSeller/:sellerId",
  sellersControllers.getAllProductOfThisSeller
);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 12, max: 60 }),
  ],
  sellersControllers.signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 12, max: 60 }),
  ],
  sellersControllers.login
);

router.use(checkAuthSellerId);

router.post(
  "/createProduct/:sellerId",
  fileUpload.array("images", 10),
  [
    check("name").not().isEmpty().isLength({ max: 60 }).trim(),
    check("price")
      .not()
      .isEmpty()
      .isNumeric()
      .isCurrency()
      .isLength({ max: 60 })
      .trim()
      .toInt(),
    check("deliveryDate").not().isEmpty().isDate().isLength({ max: 60 }).trim(),
    check("brand").not().isEmpty().isLength({ max: 60 }).trim(),
    check("parentCategory")
      .not()
      .isEmpty()
      .isLength({ max: 30 })

      .trim(),
    check("ancestorCategories")
      .not()
      .isEmpty()
      .isLength({ max: 30 })

      .trim(),
    check("categories").not().isEmpty().isLength({ max: 30 }).trim(),
    check("stockQuantity")
      .not()
      .isEmpty()
      .isNumeric()
      .isLength({ max: 60 })
      .trim()
      .toInt(),
    check("isStock").not().isEmpty().isBoolean().trim().toBoolean(),
  ],
  sellersControllers.createProduct
);

router.patch(
  "/updateProduct/:productId",
  fileUpload.array("images", 10),
  [
    check("name").not().isEmpty().isLength({ max: 60 }).trim(),
    check("price")
      .not()
      .isEmpty()
      .isNumeric()
      .isCurrency()
      .isLength({ max: 60 })
      .trim()
      .toInt(),
    check("deliveryDate").not().isEmpty().isDate().isLength({ max: 60 }).trim(),
    check("brand").not().isEmpty().isLength({ max: 60 }).trim(),
    check("parentCategory").not().isEmpty().isLength({ max: 30 }).trim(),
    check("ancestorCategories").not().isEmpty().isLength({ max: 30 }).trim(),
    check("categories").not().isEmpty().isLength({ max: 30 }).trim(),
    check("stockQuantity")
      .not()
      .isEmpty()
      .isNumeric()
      .isLength({ max: 60 })
      .trim()
      .toInt(),
    check("isStock").not().isEmpty().isBoolean().trim().toBoolean(),
  ],
  sellersControllers.updateProduct
);

router.delete(
  "/deleteProduct/:sellerId/:productId",
  sellersControllers.deleteProduct
);
module.exports = router;
