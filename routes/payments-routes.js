const express = require("express");
const expressValidator = require("express-validator");
const paymentsControllers = require("../controllers/payments-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.post("/addNewCreditCard", paymentsControllers.addNewCreditCard);

router.patch(
  "/updateCreditCard/:creditCardId",
  paymentsControllers.updateCreditCard
);

router.delete(
  "/deleteCreditCard/:creditCardId",
  paymentsControllers.deleteCreditCard
);

module.exports = router;
