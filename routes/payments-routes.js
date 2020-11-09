const express = require("express");
const { check } = require("express-validator");
const paymentsControllers = require("../controllers/payments-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get(
  "/getAllAmazonCreditPurchaseHistory/:userId",
  paymentsControllers.getAllAmazonCreditPurchaseHistory
);

router.use(checkAuth);

router.post(
  "/chargeAmazonCredit/:userId",
  paymentsControllers.chargeAmazonCredit
);

router.post(
  "/addNewCreditCard",
  [
    check("cardNumber")
      .isCreditCard()
      .isLength({ min: 16, max: 16 })
      .trim()
      .toInt(),
    check("firstName").not().isEmpty().isUppercase().trim(),
    check("lastName").not().isEmpty().isUppercase().trim(),
    check("pinNumber").isLength({ min: 3, max: 3 }).isNumeric().trim().toInt(),
    check("expirationMonth")
      .isLength({ min: 2, max: 2 })
      .isNumeric()
      .trim()
      .toInt(),
    check("expirationYear")
      .isLength({ min: 2, max: 2 })
      .isNumeric()
      .trim()
      .toInt(),
  ],
  paymentsControllers.addNewCreditCard
);

router.patch(
  "/updateCreditCard/:creditCardId",
  [
    check("cardNumber")
      .isCreditCard()
      .isLength({ min: 16, max: 16 })
      .trim()
      .toInt(),
    check("firstName").not().isEmpty().isUppercase().trim(),
    check("lastName").not().isEmpty().isUppercase().trim(),
    check("pinNumber").isLength({ min: 3, max: 3 }).isNumeric().trim().toInt(),
    check("expirationMonth")
      .isLength({ min: 2, max: 2 })
      .isNumeric()
      .trim()
      .toInt(),
    check("expirationYear")
      .isLength({ min: 2, max: 2 })
      .isNumeric()
      .trim()
      .toInt(),
  ],
  paymentsControllers.updateCreditCard
);

router.delete(
  "/deleteCreditCard/:creditCardId",
  paymentsControllers.deleteCreditCard
);

module.exports = router;
