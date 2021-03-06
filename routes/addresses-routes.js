const express = require("express");
const { check } = require("express-validator");
const addressControllers = require("../controllers/address-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/getAllAddresses/:userId", addressControllers.getAllAddress);

router.post(
  "/createAddress/:userId",
  [
    check("zipCode").not().isEmpty().isPostalCode("JP").trim(),
    check("country").not().isEmpty().trim(),
    check("name").not().isEmpty().trim(),
    check("todoufuken").not().isEmpty().isLength({ max: 60 }).trim(),
    check("addressInfo1").not().isEmpty().isLength({ max: 60 }).trim(),
    check("addressInfo2").not().isEmpty().isLength({ max: 60 }).trim(),
    check("phoneNumber")
      .not()
      .isEmpty()
      .isLength({ max: 30 })
      .isNumeric()
      .isMobilePhone("ja-JP")
      .trim(),
    check("email").not().isEmpty().normalizeEmail().isEmail().trim(),
    check("company").trim(),
  ],
  addressControllers.createAddress
);
router.patch(
  "/updateAddress/:addressId",
  [
    check("zipCode").not().isEmpty().isPostalCode("JP").trim(),
    check("country").not().isEmpty().trim(),
    check("name").not().isEmpty().trim(),
    check("todoufuken").not().isEmpty().isLength({ max: 60 }).trim(),
    check("addressInfo1").not().isEmpty().isLength({ max: 60 }).trim(),
    check("addressInfo2").not().isEmpty().isLength({ max: 60 }).trim(),
    check("phoneNumber")
      .not()
      .isEmpty()
      .isLength({ max: 30 })
      .isNumeric()
      .isMobilePhone("ja-JP")
      .trim(),
    check("email").not().isEmpty().normalizeEmail().isEmail().trim(),
    check("company").trim(),
  ],
  addressControllers.updateAddress
);
router.delete(
  "/deleteAddress/:userId/:addressId",
  addressControllers.deleteAddress
);

router.get(
  "/setDefaultAddress/:userId/:addressId",
  addressControllers.setDefaultAddress
);

module.exports = router;
