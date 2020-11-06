const express = require("express");
const { check } = require("express-validator");
const paymentsControllers = require("../controllers/payments-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.post(
  "/addNewCreditCard",
  [
    check("cardNumber").isLength({ min: 16, max: 16 }),
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("pinNumber").isLength({ min: 3, max: 3 }),
    check("expirationMonth").isLength({ min: 2, max: 2 }),
    check("expirationYear").isLength({ min: 2, max: 2 }),
  ],
  paymentsControllers.addNewCreditCard
);

router.patch(
  "/updateCreditCard/:creditCardId",
  [
    check("cardNumber").isLength({ min: 16, max: 16 }),
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("pinNumber").isLength({ min: 3, max: 3 }),
    check("expirationMonth").isLength({ min: 2, max: 2 }),
    check("expirationYear").isLength({ min: 2, max: 2 }),
  ],
  paymentsControllers.updateCreditCard
);

router.delete(
  "/deleteCreditCard/:creditCardId",
  paymentsControllers.deleteCreditCard
);

module.exports = router;
